<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Exceptions\EmptyCartException;
use App\Exceptions\InvalidCouponException;
use App\Exceptions\PaymentFailedException;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Models\User;
use App\Notifications\OrderConfirmedNotification;
use App\Services\Payments\PaymentGateway;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Orchestrates placing an order: locks and reserves stock, applies and
 * validates the coupon, charges the payment gateway, and only commits
 * inventory once the charge has actually succeeded. Everything happens
 * inside one transaction so a failure at any step leaves no partial state.
 */
class CheckoutService
{
    public function __construct(
        private readonly InventoryService $inventory,
        private readonly CouponService $coupons,
        private readonly PaymentGateway $paymentGateway,
        private readonly ActivityLogger $activityLogger,
    ) {}

    public function placeOrder(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            $cart = $user->cart()->with('items')->first();

            if (! $cart || $cart->items->isEmpty()) {
                throw new EmptyCartException;
            }

            $lockedVariants = $this->lockAndReserveVariants($cart->items);
            $subtotal = $this->calculateSubtotal($cart->items, $lockedVariants);

            $coupon = $this->resolveCoupon($data['coupon_code'] ?? null, $user, $subtotal, $lockedVariants);
            $discount = $coupon ? $this->coupons->calculateDiscount($coupon, $subtotal) : 0.0;

            $shipping = $subtotal >= config('shop.free_shipping_threshold')
                ? 0.0
                : (float) config('shop.shipping_flat_rate');

            $tax = round(($subtotal - $discount) * (float) config('shop.tax_rate'), 2);
            $total = round($subtotal - $discount + $shipping + $tax, 2);

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'SS'.now()->format('ymd').Str::upper(Str::random(6)),
                'status' => OrderStatus::PendingPayment,
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'shipping_amount' => $shipping,
                'tax_amount' => $tax,
                'total' => $total,
                'coupon_id' => $coupon?->id,
                'shipping_address_id' => $data['shipping_address_id'],
                'billing_address_id' => $data['billing_address_id'] ?? $data['shipping_address_id'],
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($cart->items as $item) {
                $variant = $lockedVariants[$item->product_variant_id];
                $product = $variant->product;

                $order->items()->create([
                    'store_id' => $product->store_id,
                    'product_variant_id' => $variant->id,
                    'product_name' => $product->name,
                    'variant_label' => $this->variantLabel($variant),
                    'unit_price' => $variant->price,
                    'quantity' => $item->quantity,
                    'total' => round($variant->price * $item->quantity, 2),
                ]);
            }

            $result = $this->paymentGateway->charge($order, $data['payment'] ?? []);

            Payment::create([
                'order_id' => $order->id,
                'provider' => $this->paymentGateway->name(),
                'status' => $result->succeeded ? PaymentStatus::Succeeded : PaymentStatus::Failed,
                'amount' => $total,
                'transaction_id' => $result->transactionId,
                'paid_at' => $result->succeeded ? now() : null,
            ]);

            if (! $result->succeeded) {
                throw new PaymentFailedException($result->failureReason ?? 'The payment could not be processed.');
            }

            foreach ($cart->items as $item) {
                $this->inventory->commit($lockedVariants[$item->product_variant_id], $item->quantity);
            }

            $order->update(['status' => OrderStatus::Paid]);

            if ($coupon) {
                $coupon->usages()->create(['user_id' => $user->id, 'order_id' => $order->id]);
                $coupon->increment('used_count');
            }

            $cart->items()->delete();

            $this->activityLogger->log($user, 'order.placed', $order, "Order {$order->order_number} placed.");

            // Deferred until the transaction actually commits: if
            // QUEUE_CONNECTION=sync, notify() runs immediately, and a mail
            // failure must never roll back an order that was already paid.
            DB::afterCommit(fn () => $user->notify(new OrderConfirmedNotification($order)));

            return $order->load(['items', 'payment', 'shippingAddress', 'billingAddress']);
        });
    }

    /**
     * @param  Collection<int, CartItem>  $cartItems
     * @return array<int, ProductVariant> keyed by product_variant_id, locked for the duration of the transaction
     */
    private function lockAndReserveVariants($cartItems): array
    {
        $variants = [];

        foreach ($cartItems as $item) {
            $variant = ProductVariant::with('product')->lockForUpdate()->findOrFail($item->product_variant_id);
            $this->inventory->reserve($variant, $item->quantity);
            $variants[$item->product_variant_id] = $variant;
        }

        return $variants;
    }

    private function calculateSubtotal($cartItems, array $lockedVariants): float
    {
        $subtotal = 0.0;

        foreach ($cartItems as $item) {
            $subtotal += $lockedVariants[$item->product_variant_id]->price * $item->quantity;
        }

        return round($subtotal, 2);
    }

    /**
     * @param  array<int, ProductVariant>  $lockedVariants
     */
    private function resolveCoupon(?string $code, User $user, float $subtotal, array $lockedVariants): ?Coupon
    {
        if (! $code) {
            return null;
        }

        // Locked for the rest of this transaction so two simultaneous
        // checkouts can't both read the same used_count and both slip
        // past a max_uses limit before either increment lands.
        $coupon = Coupon::where('code', $code)->lockForUpdate()->first();

        if (! $coupon) {
            throw new InvalidCouponException('This coupon code does not exist.');
        }

        if ($coupon->store_id) {
            $cartHasStoreItem = collect($lockedVariants)->contains(
                fn (ProductVariant $variant) => $variant->product->store_id === $coupon->store_id
            );

            if (! $cartHasStoreItem) {
                throw new InvalidCouponException('This coupon does not apply to any items in your cart.');
            }
        }

        $this->coupons->validate($coupon, $user, $subtotal);

        return $coupon;
    }

    private function variantLabel(ProductVariant $variant): ?string
    {
        $parts = array_filter([
            $variant->size ? "Size: {$variant->size}" : null,
            $variant->color ? "Color: {$variant->color}" : null,
        ]);

        return $parts ? implode(', ', $parts) : null;
    }
}
