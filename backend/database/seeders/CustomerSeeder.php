<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Address;
use App\Models\Cart;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    /** @var array<int, array{name: string, email: string, city: string, state: string, country: string}> */
    public static array $customers = [
        ['name' => 'Olivia Bennett', 'email' => 'olivia.bennett@example.com', 'city' => 'Austin', 'state' => 'TX', 'country' => 'United States'],
        ['name' => 'Ethan Cole', 'email' => 'ethan.cole@example.com', 'city' => 'Denver', 'state' => 'CO', 'country' => 'United States'],
        ['name' => 'Sophia Marsh', 'email' => 'sophia.marsh@example.com', 'city' => 'Portland', 'state' => 'OR', 'country' => 'United States'],
        ['name' => 'Liam Foster', 'email' => 'liam.foster@example.com', 'city' => 'Chicago', 'state' => 'IL', 'country' => 'United States'],
        ['name' => 'Grace Halloway', 'email' => 'grace.halloway@example.com', 'city' => 'Brooklyn', 'state' => 'NY', 'country' => 'United States'],
        ['name' => 'Noah Ferreira', 'email' => 'noah.ferreira@example.com', 'city' => 'Miami', 'state' => 'FL', 'country' => 'United States'],
        ['name' => 'Isla Chambers', 'email' => 'isla.chambers@example.com', 'city' => 'Seattle', 'state' => 'WA', 'country' => 'United States'],
        ['name' => 'Mason Reid', 'email' => 'mason.reid@example.com', 'city' => 'Nashville', 'state' => 'TN', 'country' => 'United States'],
        ['name' => 'Ruby Ashworth', 'email' => 'ruby.ashworth@example.com', 'city' => 'Boston', 'state' => 'MA', 'country' => 'United States'],
        ['name' => 'Leo Whitman', 'email' => 'leo.whitman@example.com', 'city' => 'San Diego', 'state' => 'CA', 'country' => 'United States'],
    ];

    public function run(): void
    {
        foreach (self::$customers as $customer) {
            $user = User::create([
                'name' => $customer['name'],
                'email' => $customer['email'],
                'password' => Hash::make('password'),
                'role' => UserRole::Customer,
                'email_verified_at' => now(),
                'phone' => '+1'.random_int(2000000000, 9999999999),
            ]);

            Cart::create(['user_id' => $user->id]);
            Wishlist::create(['user_id' => $user->id]);

            Address::create([
                'user_id' => $user->id,
                'label' => 'Home',
                'recipient_name' => $customer['name'],
                'phone' => $user->phone,
                'line1' => random_int(100, 999).' Maple Street',
                'city' => $customer['city'],
                'state' => $customer['state'],
                'postal_code' => (string) random_int(10000, 99999),
                'country' => $customer['country'],
                'is_default' => true,
            ]);
        }
    }
}
