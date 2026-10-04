<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed order matters: taxonomy and sellers must exist before products,
     * customers and addresses before orders, and orders before reviews.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            CategorySeeder::class,
            BrandSeeder::class,
            CollectionSeeder::class,
            SellerSeeder::class,
            ProductSeeder::class,
            CustomerSeeder::class,
            CouponSeeder::class,
            OrderSeeder::class,
            ReviewSeeder::class,
            ActivityLogSeeder::class,
        ]);
    }
}
