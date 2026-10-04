<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Women', 'description' => 'Considered separates and statement pieces for every day and beyond.'],
            ['name' => 'Men', 'description' => 'Tailored essentials built on quality fabrics and a clean silhouette.'],
            ['name' => 'Shoes', 'description' => 'Footwear that carries a look from the studio to the street.'],
            ['name' => 'Bags', 'description' => 'Structured leather and canvas carries for work, travel and everything after.'],
            ['name' => 'Accessories', 'description' => 'The finishing details — jewelry, scarves, belts and eyewear.'],
        ];

        foreach ($categories as $index => $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'image_url' => "https://picsum.photos/seed/category-{$index}/900/600",
            ]);
        }
    }
}
