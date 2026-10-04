<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            ['name' => 'Atelier North', 'description' => 'The ShopSphere house label: considered essentials made to last seasons, not weeks.'],
            ['name' => 'Meridian', 'description' => 'Tailoring-led ready-to-wear with a quiet, architectural point of view.'],
            ['name' => 'Forma', 'description' => 'Footwear and leather goods built around clean lines and durable materials.'],
            ['name' => 'Élan Studio', 'description' => 'Small-batch occasionwear designed for the moments that call for more.'],
            ['name' => 'Northline', 'description' => 'Weekend-ready basics in natural fibers, designed to soften with wear.'],
        ];

        foreach ($brands as $index => $brand) {
            Brand::create([
                'name' => $brand['name'],
                'slug' => Str::slug($brand['name']),
                'description' => $brand['description'],
                'logo_url' => "https://picsum.photos/seed/brand-{$index}/200/200",
            ]);
        }
    }
}
