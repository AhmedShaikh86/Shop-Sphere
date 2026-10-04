<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Exceptions\InvalidOrderTransitionException;
use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderStatusUpdatedNotification;
use Illuminate\Support\Facades\DB;

/**
 * The only place order status changes happen, so the allowed-transition
 * rules and stock release live in one spot instead of being re-checked
 * in every controller that touches an order.
 */
class OrderService
{
    public function __construct(
        private readonly InventoryService $inventory,
        private readonly ActivityLogger $activityLogger,
    ) {}

    public function transitionTo(Order $order, OrderStatus $newStatus, ?User $actor = null): Order
    {
        $currentStatus = $order->status;

        if (! $currentStatus->canTransitionTo($newStatus)) {
            throw new InvalidOrderTransitionException(
                "Cannot move order from \"{$currentStatus->value}\" to \"{$newStatus->value}\"."
            );
        }

        return DB::transaction(function () use ($order, $newStatus, $currentStatus, $actor) {
            if (in_array($newStatus, [OrderStatus::Cancelled, OrderStatus::Refunded], true)) {
                $this->releaseInventoryFor($order);
            }

            $order->update(['status' => $newStatus]);

            $this->activityLogger->log(
                $actor,
                'order.status_updated',
                $order,
                "Order {$order->order_number} moved from {$currentStatus->value} to {$newStatus->value}.",
            );

            // Deferred until commit — see CheckoutService::placeOrder for why.
            DB::afterCommit(fn () => $order->user->notify(new OrderStatusUpdatedNotification($order, $currentStatus)));

            return $order->fresh();
        });
    }

    private function releaseInventoryFor(Order $order): void
    {
        foreach ($order->items as $item) {
            $variant = $item->productVariant()->lockForUpdate()->first();

            if ($variant) {
                $variant->increment('stock_quantity', $item->quantity);
            }
        }
    }
}
