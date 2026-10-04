<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@shopsphere.test')->first();

        foreach (Store::all() as $store) {
            ActivityLog::create([
                'user_id' => $admin?->id,
                'action' => 'store.approved',
                'subject_type' => Store::class,
                'subject_id' => $store->id,
                'description' => "Store \"{$store->name}\" approved.",
                'created_at' => $store->created_at,
                'updated_at' => $store->created_at,
            ]);
        }

        foreach (Product::inRandomOrder()->limit(10)->get() as $product) {
            ActivityLog::create([
                'user_id' => $admin?->id,
                'action' => 'product.approved',
                'subject_type' => Product::class,
                'subject_id' => $product->id,
                'description' => "Product \"{$product->name}\" approved and published.",
                'created_at' => $product->published_at,
                'updated_at' => $product->published_at,
            ]);
        }
    }
}
