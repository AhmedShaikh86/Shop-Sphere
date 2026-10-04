<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PendingPayment = 'pending_payment';
    case Paid = 'paid';
    case Processing = 'processing';
    case Packed = 'packed';
    case Shipped = 'shipped';
    case OutForDelivery = 'out_for_delivery';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';
    case Refunded = 'refunded';

    /**
     * The statuses that are allowed to follow the current one.
     * Keeping this on the enum means invalid transitions are rejected
     * in one place instead of scattered checks across controllers.
     *
     * @return list<self>
     */
    public function allowedNextStatuses(): array
    {
        return match ($this) {
            self::PendingPayment => [self::Paid, self::Cancelled],
            self::Paid => [self::Processing, self::Cancelled, self::Refunded],
            self::Processing => [self::Packed, self::Cancelled],
            self::Packed => [self::Shipped],
            self::Shipped => [self::OutForDelivery],
            self::OutForDelivery => [self::Delivered],
            self::Delivered => [self::Refunded],
            self::Cancelled, self::Refunded => [],
        };
    }

    public function canTransitionTo(self $next): bool
    {
        return in_array($next, $this->allowedNextStatuses(), true);
    }

    /**
     * Statuses that represent a completed sale for revenue/analytics purposes
     * (payment succeeded and the order was not cancelled or refunded).
     *
     * @return list<self>
     */
    public static function countedForRevenue(): array
    {
        return [self::Paid, self::Processing, self::Packed, self::Shipped, self::OutForDelivery, self::Delivered];
    }
}
