<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductVariantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'size' => fake()->randomElement(['S', 'M', 'L']),
            'color' => fake()->randomElement(['Black', 'White', 'Navy']),
            'sku' => Str::upper(Str::random(10)),
            'price' => fake()->randomFloat(2, 20, 300),
            'compare_at_price' => null,
            'stock_quantity' => 10,
            'reserved_quantity' => 0,
            'weight' => 1.0,
            'image_url' => 'https://picsum.photos/seed/'.Str::random(8).'/800/1000',
        ];
    }

    public function outOfStock(): static
    {
        return $this->state(['stock_quantity' => 0]);
    }
}
