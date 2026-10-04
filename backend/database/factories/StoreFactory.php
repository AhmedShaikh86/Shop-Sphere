<?php

namespace Database\Factories;

use App\Enums\StoreStatus;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class StoreFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'user_id' => User::factory()->state(['role' => UserRole::Seller]),
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 100000),
            'description' => fake()->sentence(),
            'logo_url' => 'https://picsum.photos/seed/'.Str::random(8).'/200/200',
            'banner_url' => 'https://picsum.photos/seed/'.Str::random(8).'/1200/400',
            'status' => StoreStatus::Approved,
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => StoreStatus::Pending]);
    }
}
