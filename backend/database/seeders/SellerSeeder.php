<?php

namespace Database\Seeders;

use App\Enums\StoreStatus;
use App\Enums\UserRole;
use App\Models\Cart;
use App\Models\Store;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SellerSeeder extends Seeder
{
    /** @var array<int, array{name: string, email: string, store: string, description: string}> */
    public static array $sellers = [
        [
            'name' => 'Nora Whitfield',
            'email' => 'seller.atelier@shopsphere.test',
            'store' => 'Atelier North',
            'description' => 'The ShopSphere house label — considered essentials made to last seasons, not weeks.',
        ],
        [
            'name' => 'Marcus Webb',
            'email' => 'seller.meridian@shopsphere.test',
            'store' => 'Meridian',
            'description' => 'Tailoring-led ready-to-wear with a quiet, architectural point of view.',
        ],
        [
            'name' => 'Ines Duarte',
            'email' => 'seller.forma@shopsphere.test',
            'store' => 'Forma',
            'description' => 'Footwear and leather goods built around clean lines and durable materials.',
        ],
        [
            'name' => 'Camille Reyes',
            'email' => 'seller.elan@shopsphere.test',
            'store' => 'Élan Studio',
            'description' => 'Small-batch occasionwear designed for the moments that call for more.',
        ],
        [
            'name' => 'Julian Ashford',
            'email' => 'seller.northline@shopsphere.test',
            'store' => 'Northline',
            'description' => 'Weekend-ready basics in natural fibers, designed to soften with wear.',
        ],
    ];

    public function run(): void
    {
        foreach (self::$sellers as $index => $seller) {
            $user = User::create([
                'name' => $seller['name'],
                'email' => $seller['email'],
                'password' => Hash::make('password'),
                'role' => UserRole::Seller,
                'email_verified_at' => now(),
            ]);

            Cart::create(['user_id' => $user->id]);
            Wishlist::create(['user_id' => $user->id]);

            Store::create([
                'user_id' => $user->id,
                'name' => $seller['store'],
                'slug' => Str::slug($seller['store']),
                'description' => $seller['description'],
                'logo_url' => "https://picsum.photos/seed/store-logo-{$index}/200/200",
                'banner_url' => "https://picsum.photos/seed/store-banner-{$index}/1200/400",
                'status' => StoreStatus::Approved,
            ]);
        }
    }
}
