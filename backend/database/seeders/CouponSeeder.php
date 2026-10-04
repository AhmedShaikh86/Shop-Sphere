<?php

namespace Database\Seeders;

use App\Enums\CouponType;
use App\Models\Coupon;
use App\Models\Store;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        Coupon::create([
            'store_id' => null,
            'code' => 'WELCOME10',
            'type' => CouponType::Percentage,
            'value' => 10,
            'min_order_amount' => 50,
            'max_uses' => null,
            'max_uses_per_user' => 1,
            'is_active' => true,
        ]);

        Coupon::create([
            'store_id' => null,
            'code' => 'SHIP20',
            'type' => CouponType::Fixed,
            'value' => 20,
            'min_order_amount' => 150,
            'max_uses' => 500,
            'max_uses_per_user' => 2,
            'is_active' => true,
        ]);

        $atelierNorth = Store::where('name', 'Atelier North')->first();

        if ($atelierNorth) {
            Coupon::create([
                'store_id' => $atelierNorth->id,
                'code' => 'ATELIER15',
                'type' => CouponType::Percentage,
                'value' => 15,
                'min_order_amount' => 100,
                'max_uses_per_user' => 1,
                'is_active' => true,
            ]);
        }
    }
}
