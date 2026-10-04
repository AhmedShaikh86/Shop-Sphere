<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Historical orders are inserted directly (skipping CheckoutService/the
     * payment gateway) so seeding stays fast and reproducible, while still
     * decrementing stock the same way a real purchase would.
     */
    public function run(): void
    {
        $customers = User::where('role', UserRole::Customer)->with('addresses')->get();
        $statusCycle = [
            OrderStatus::Delivered, OrderStatus::Delivered, OrderStatus::Delivered,
            OrderStatus::Shipped, OrderStatus::Processing, OrderStatus::Paid, OrderStatus::Cancelled,
        ];

        $cycleIndex = 0;

        foreach ($customers as $customer) {
            $orderCount = random_int(1, 3);
            $address = $customer->addresses->first();

            if (! $address) {
                continue;
            }

            for ($i = 0; $i < $orderCount; $i++) {
                $status = $statusCycle[$cycleIndex % count($statusCycle)];
                $cycleIndex++;

                $variants = ProductVariant::inRandomOrder()->limit(random_int(1, 3))->get();
                $createdAt = now()->subDays(random_int(1, 55));

                $subtotal = 0;
                $items = [];

                foreach ($variants as $variant) {
                    $quantity = random_int(1, 2);
                    $lineTotal = round($variant->price * $quantity, 2);
                    $subtotal += $lineTotal;

                    $items[] = [
                        'store_id' => $variant->product->store_id,
                        'product_variant_id' => $variant->id,
                        'product_name' => $variant->product->name,
                        'variant_label' => trim("{$variant->size} {$variant->color}"),
                        'unit_price' => $variant->price,
                        'quantity' => $quantity,
                        'total' => $lineTotal,
                    ];

                    if ($status !== OrderStatus::Cancelled) {
                        $variant->decrement('stock_quantity', min($quantity, $variant->stock_quantity));
                    }
                }

                if ($items === []) {
                    continue;
                }

                $shipping = $subtotal >= config('shop.free_shipping_threshold') ? 0 : (float) config('shop.shipping_flat_rate');
                $tax = round($subtotal * (float) config('shop.tax_rate'), 2);
                $total = round($subtotal + $shipping + $tax, 2);

                $order = $customer->orders()->create([
                    'order_number' => 'SS'.$createdAt->format('ymd').Str::upper(Str::random(6)),
                    'status' => $status,
                    'subtotal' => round($subtotal, 2),
                    'discount_amount' => 0,
                    'shipping_amount' => $shipping,
                    'tax_amount' => $tax,
                    'total' => $total,
                    'shipping_address_id' => $address->id,
                    'billing_address_id' => $address->id,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

                foreach ($items as $item) {
                    $order->items()->create($item);
                }

                Payment::create([
                    'order_id' => $order->id,
                    'provider' => 'demo',
                    'status' => $status === OrderStatus::Cancelled ? PaymentStatus::Refunded : PaymentStatus::Succeeded,
                    'amount' => $total,
                    'transaction_id' => 'demo_'.Str::uuid(),
                    'paid_at' => $createdAt,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }
        }
    }
}
