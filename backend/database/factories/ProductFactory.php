<?php

namespace Database\Factories;

use App\Enums\ProductGender;
use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'store_id' => Store::factory(),
            'category_id' => Category::factory(),
            'brand_id' => null,
            'collection_id' => null,
            'name' => ucfirst($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 100000),
            'description' => fake()->paragraph(),
            'material' => 'Cotton',
            'fit' => 'Regular',
            'pattern' => 'Solid',
            'season' => 'All Season',
            'care_instructions' => 'Machine wash cold.',
            'sustainability_info' => null,
            'gender' => ProductGender::Unisex,
            'status' => ProductStatus::Published,
            'base_price' => fake()->randomFloat(2, 20, 300),
            'compare_at_price' => null,
            'rating_average' => 0,
            'rating_count' => 0,
            'is_featured' => false,
            'published_at' => now(),
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => ProductStatus::Draft, 'published_at' => null]);
    }

    public function pendingReview(): static
    {
        return $this->state(['status' => ProductStatus::PendingReview, 'published_at' => null]);
    }
}
