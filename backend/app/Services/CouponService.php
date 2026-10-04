<?php

namespace App\Services;

use App\Enums\CouponType;
use App\Exceptions\InvalidCouponException;
use App\Models\Coupon;
use App\Models\User;
use Carbon\Carbon;

class CouponService
{
    /**
     * Validate a coupon against the current user and cart subtotal.
     * Always re-checked server-side at checkout, never trusted from the client.
     */
    public function validate(Coupon $coupon, User $user, float $subtotal): void
    {
        if (! $coupon->is_active) {
            throw new InvalidCouponException('This coupon is no longer active.');
        }

        if ($coupon->starts_at && Carbon::now()->lt($coupon->starts_at)) {
            throw new InvalidCouponException('This coupon is not active yet.');
        }

        if ($coupon->expires_at && Carbon::now()->gt($coupon->expires_at)) {
            throw new InvalidCouponException('This coupon has expired.');
        }

        if ($coupon->min_order_amount && $subtotal < $coupon->min_order_amount) {
            throw new InvalidCouponException("A minimum order of \${$coupon->min_order_amount} is required for this coupon.");
        }

        if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) {
            throw new InvalidCouponException('This coupon has reached its usage limit.');
        }

        if ($coupon->max_uses_per_user) {
            $userUsageCount = $coupon->usages()->where('user_id', $user->id)->count();

            if ($userUsageCount >= $coupon->max_uses_per_user) {
                throw new InvalidCouponException('You have already used this coupon the maximum number of times.');
            }
        }
    }

    public function calculateDiscount(Coupon $coupon, float $subtotal): float
    {
        $discount = $coupon->type === CouponType::Percentage
            ? $subtotal * ((float) $coupon->value / 100)
            : (float) $coupon->value;

        return round(min($discount, $subtotal), 2);
    }
}
