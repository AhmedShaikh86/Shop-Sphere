<?php

namespace Database\Factories;

use App\Enums\CouponType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CouponFactory extends Factory
{
    public function definition(): array
    {
        return [
            'store_id' => null,
            'code' => Str::upper(Str::random(8)),
            'type' => CouponType::Percentage,
            'value' => 10,
            'min_order_amount' => null,
            'max_uses' => null,
            'max_uses_per_user' => null,
            'used_count' => 0,
            'starts_at' => null,
            'expires_at' => null,
            'is_active' => true,
        ];
    }
}
