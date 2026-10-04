<?php

namespace Database\Seeders;

use App\Enums\ProductStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    private const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

    private const SHOE_SIZES = ['7', '8', '9', '10', '11'];

    /**
     * Each row: [category, name, material, fit, colors, price, gender, collection]
     * Prices are in USD. Collection is nullable — not every piece belongs to one.
     */
    private const CATALOG = [
        // Women
        ['Women', 'Silk Wrap Midi Dress', '100% mulberry silk', 'Relaxed', ['Ivory', 'Rust'], 228, 'women', 'Evening Edit'],
        ['Women', 'Tailored Wool Blazer', 'Virgin wool blend', 'Structured', ['Charcoal', 'Camel'], 265, 'women', 'New Season'],
        ['Women', 'Linen Button-Down Shirt', '100% European linen', 'Relaxed', ['White', 'Sand'], 118, 'women', 'Essentials'],
        ['Women', 'High-Rise Straight Jeans', 'Organic cotton denim', 'Straight', ['Indigo', 'Black'], 148, 'women', 'Essentials'],
        ['Women', 'Cashmere Turtleneck Sweater', '100% cashmere', 'Relaxed', ['Camel', 'Ivory', 'Charcoal'], 265, 'women', 'New Season'],
        ['Women', 'Pleated Satin Skirt', 'Recycled satin', 'A-line', ['Champagne', 'Black'], 138, 'women', 'Evening Edit'],
        ['Women', 'Oversized Trench Coat', 'Cotton gabardine', 'Oversized', ['Camel', 'Black'], 328, 'women', 'New Season'],
        ['Women', 'Ribbed Knit Bodysuit', 'Cotton-elastane rib', 'Fitted', ['Black', 'Ivory'], 68, 'women', 'Essentials'],
        ['Women', 'Wide-Leg Tailored Trousers', 'Wool blend', 'Wide leg', ['Charcoal', 'Sand'], 168, 'women', 'Workwear'],
        ['Women', 'Belted Shirt Dress', 'Cotton poplin', 'Relaxed', ['White', 'Navy'], 158, 'women', 'Weekend'],
        ['Women', 'Quilted Puffer Jacket', 'Recycled nylon', 'Regular', ['Black', 'Olive'], 218, 'women', 'Weekend'],
        ['Women', 'Draped Cowl-Neck Top', 'Modal jersey', 'Relaxed', ['Blush', 'Black'], 78, 'women', null],

        // Men
        ['Men', 'Merino Wool Crewneck Sweater', '100% merino wool', 'Regular', ['Navy', 'Charcoal', 'Olive'], 148, 'men', 'Essentials'],
        ['Men', 'Slim-Fit Oxford Shirt', '100% cotton oxford', 'Slim', ['White', 'Sky Blue'], 98, 'men', 'Workwear'],
        ['Men', 'Tailored Chino Trousers', 'Cotton twill', 'Tailored', ['Sand', 'Navy', 'Olive'], 118, 'men', 'Workwear'],
        ['Men', 'Cotton Twill Overshirt', 'Brushed cotton twill', 'Regular', ['Olive', 'Rust'], 128, 'men', 'Weekend'],
        ['Men', 'Structured Bomber Jacket', 'Cotton-nylon blend', 'Regular', ['Black', 'Navy'], 218, 'men', 'New Season'],
        ['Men', 'Selvedge Denim Jeans', 'Japanese selvedge denim', 'Straight', ['Indigo', 'Black'], 168, 'men', 'Essentials'],
        ['Men', 'Linen Blend Blazer', 'Linen-cotton blend', 'Tailored', ['Sand', 'Navy'], 248, 'men', 'New Season'],
        ['Men', 'Textured Knit Polo', 'Cotton pique', 'Regular', ['Navy', 'White', 'Olive'], 88, 'men', 'Weekend'],
        ['Men', 'Relaxed Fit Cargo Pants', 'Cotton ripstop', 'Relaxed', ['Olive', 'Charcoal'], 128, 'men', 'Weekend'],
        ['Men', 'Wool Overcoat', 'Wool-cashmere blend', 'Tailored', ['Charcoal', 'Camel'], 348, 'men', 'New Season'],

        // Shoes
        ['Shoes', 'Leather Chelsea Boots', 'Full-grain leather', 'Regular', ['Black', 'Chestnut'], 228, 'unisex', 'Essentials'],
        ['Shoes', 'Minimalist Leather Sneakers', 'Nappa leather', 'Regular', ['White', 'Black'], 168, 'unisex', 'Essentials'],
        ['Shoes', 'Suede Loafers', 'Suede leather', 'Regular', ['Camel', 'Navy'], 188, 'unisex', null],
        ['Shoes', 'Pointed Toe Heeled Mules', 'Leather', 'Regular', ['Black', 'Rust'], 198, 'women', 'Evening Edit'],
        ['Shoes', 'Classic White Court Sneakers', 'Leather upper', 'Regular', ['White'], 138, 'unisex', 'Weekend'],
        ['Shoes', 'Block Heel Ankle Boots', 'Suede leather', 'Regular', ['Black', 'Camel'], 218, 'women', 'New Season'],
        ['Shoes', 'Woven Leather Sandals', 'Woven leather', 'Regular', ['Tan', 'Black'], 128, 'unisex', 'Weekend'],
        ['Shoes', 'Canvas Low-Top Sneakers', 'Cotton canvas', 'Regular', ['White', 'Navy'], 88, 'unisex', 'Weekend'],

        // Bags
        ['Bags', 'Structured Leather Tote', 'Full-grain leather', 'Regular', ['Black', 'Camel'], 268, 'unisex', 'Essentials'],
        ['Bags', 'Quilted Crossbody Bag', 'Quilted leather', 'Regular', ['Black', 'Blush'], 198, 'women', 'Evening Edit'],
        ['Bags', 'Woven Leather Belt Bag', 'Woven leather', 'Regular', ['Tan', 'Black'], 148, 'unisex', 'Weekend'],
        ['Bags', 'Minimalist Card Holder Wallet', 'Vegetable-tanned leather', 'Regular', ['Black', 'Camel'], 68, 'unisex', 'Essentials'],
        ['Bags', 'Soft Leather Hobo Bag', 'Pebbled leather', 'Regular', ['Camel', 'Charcoal'], 228, 'women', null],
        ['Bags', 'Canvas Weekender Duffel', 'Waxed canvas', 'Regular', ['Olive', 'Navy'], 178, 'unisex', 'Weekend'],

        // Accessories
        ['Accessories', 'Fine Chain Layered Necklace', '14k gold-plated brass', 'Adjustable', ['Gold'], 78, 'women', null],
        ['Accessories', 'Leather Wrap Bracelet', 'Leather and brass', 'Adjustable', ['Black', 'Tan'], 48, 'unisex', null],
        ['Accessories', 'Wool Blend Scarf', 'Wool-cashmere blend', 'One size', ['Camel', 'Charcoal'], 88, 'unisex', 'New Season'],
        ['Accessories', 'Polarized Aviator Sunglasses', 'Acetate and metal', 'One size', ['Black', 'Tortoise'], 128, 'unisex', 'Weekend'],
        ['Accessories', 'Structured Wide-Brim Hat', 'Wool felt', 'One size', ['Camel', 'Black'], 98, 'women', 'New Season'],
        ['Accessories', 'Leather Woven Belt', 'Woven leather', 'Adjustable', ['Black', 'Tan'], 68, 'unisex', 'Essentials'],
        ['Accessories', 'Silk Hair Scarf', '100% silk', 'One size', ['Ivory', 'Rust'], 48, 'women', 'Evening Edit'],
        ['Accessories', 'Gold-Tone Hoop Earrings', 'Gold-plated brass', 'One size', ['Gold'], 58, 'women', null],
    ];

    public function run(): void
    {
        $categories = Category::pluck('id', 'name');
        $collections = Collection::pluck('id', 'name');

        // Each store sells under its own brand name (see SellerSeeder), and a
        // store owns every product it lists, so the two are looked up together.
        $stores = Store::with('user')->get()->keyBy('name');
        $brands = Brand::pluck('id', 'name');

        foreach (self::CATALOG as $index => [$categoryName, $name, $material, $fit, $colors, $price, $gender, $collectionName]) {
            $store = $stores->values()[$index % $stores->count()];
            $slug = Str::slug($name).'-'.($index + 1);
            $sizes = $categoryName === 'Shoes' ? self::SHOE_SIZES : (in_array($categoryName, ['Bags', 'Accessories']) ? [null] : self::CLOTHING_SIZES);

            $product = Product::create([
                'store_id' => $store->id,
                'category_id' => $categories[$categoryName],
                'brand_id' => $brands[$store->name] ?? null,
                'collection_id' => $collectionName ? ($collections[$collectionName] ?? null) : null,
                'name' => $name,
                'slug' => $slug,
                'description' => "The {$name} from {$store->name} — cut from {$material} for a considered, {$fit} silhouette that moves easily from day into evening.",
                'material' => $material,
                'fit' => $fit,
                'pattern' => 'Solid',
                'season' => 'All Season',
                'care_instructions' => 'Follow the care label. Store on a padded hanger or folded away from direct sunlight.',
                'sustainability_info' => 'Produced in small batches to reduce excess inventory and waste.',
                'gender' => $gender,
                'status' => ProductStatus::Published,
                'base_price' => $price,
                'compare_at_price' => $index % 5 === 0 ? round($price * 1.25, 2) : null,
                'is_featured' => $index % 6 === 0,
                'published_at' => now()->subDays(random_int(1, 60)),
                'rating_average' => 0,
                'rating_count' => 0,
            ]);

            $skuPrefix = Str::upper(Str::substr(Str::slug($name), 0, 3));

            foreach ($colors as $colorIndex => $color) {
                foreach ($sizes as $size) {
                    $product->variants()->create([
                        'size' => $size,
                        'color' => $color,
                        'sku' => "{$skuPrefix}-{$product->id}-{$colorIndex}-".Str::upper($size ?? 'OS'),
                        'price' => $price,
                        'compare_at_price' => $product->compare_at_price,
                        'stock_quantity' => random_int(0, 40),
                        'reserved_quantity' => 0,
                        'weight' => round(random_int(2, 20) / 10, 2),
                        'image_url' => "https://picsum.photos/seed/{$slug}-{$colorIndex}/800/1000",
                    ]);
                }
            }

            foreach (range(0, 2) as $imageIndex) {
                $product->images()->create([
                    'url' => "https://picsum.photos/seed/{$slug}-gallery-{$imageIndex}/900/1125",
                    'alt_text' => $name,
                    'sort_order' => $imageIndex,
                ]);
            }
        }
    }
}
