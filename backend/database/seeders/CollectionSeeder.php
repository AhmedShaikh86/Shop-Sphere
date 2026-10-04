<?php

namespace Database\Seeders;

use App\Models\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CollectionSeeder extends Seeder
{
    public function run(): void
    {
        $collections = [
            ['name' => 'New Season', 'description' => 'The latest arrivals, fresh off the rail.', 'featured' => true],
            ['name' => 'Essentials', 'description' => 'The foundational pieces every wardrobe is built on.', 'featured' => true],
            ['name' => 'Evening Edit', 'description' => 'Considered dressing for dinners, openings and everything after dark.', 'featured' => false],
            ['name' => 'Weekend', 'description' => 'Relaxed silhouettes and easy layers for time off the clock.', 'featured' => true],
            ['name' => 'Workwear', 'description' => 'Tailored pieces built for the office and everything after it.', 'featured' => false],
            ['name' => 'Limited Edition', 'description' => 'Small-batch pieces, once they sell out they do not return.', 'featured' => false],
        ];

        foreach ($collections as $index => $collection) {
            Collection::create([
                'name' => $collection['name'],
                'slug' => Str::slug($collection['name']),
                'description' => $collection['description'],
                'banner_url' => "https://picsum.photos/seed/collection-{$index}/1200/600",
                'is_featured' => $collection['featured'],
            ]);
        }
    }
}
