<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Cart;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Ava Sinclair',
            'email' => 'admin@shopsphere.test',
            'password' => Hash::make('password'),
            'role' => UserRole::Admin,
            'email_verified_at' => now(),
        ]);

        Cart::create(['user_id' => $admin->id]);
        Wishlist::create(['user_id' => $admin->id]);
    }
}
