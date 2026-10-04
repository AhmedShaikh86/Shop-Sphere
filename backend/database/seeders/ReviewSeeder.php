<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    private const COMMENTS = [
        5 => ['Exactly as pictured and the fit is perfect.', 'Fast becoming a wardrobe staple. Excellent quality.', 'The fabric feels genuinely premium. Worth every dollar.'],
        4 => ['Really happy with this — runs slightly big but still great.', 'Great piece, the color is a touch different from the photos.', 'Solid quality, would buy again.'],
        3 => ['Good, but not quite what I expected for the price.', 'Fit is a little off for me but the material is nice.'],
    ];

    public function run(): void
    {
        $deliveredItems = OrderItem::whereHas('order', fn ($q) => $q->where('status', OrderStatus::Delivered))
            ->with(['order.user', 'productVariant.product'])
            ->get()
            ->unique(fn (OrderItem $item) => $item->order->user_id.'-'.$item->productVariant->product_id);

        $affectedProductIds = [];

        foreach ($deliveredItems as $item) {
            // Not every delivered purchase gets reviewed — roughly 7 in 10 do.
            if (random_int(1, 10) > 7) {
                continue;
            }

            $rating = random_int(3, 5);
            $product = $item->productVariant->product;

            Review::create([
                'product_id' => $product->id,
                'user_id' => $item->order->user_id,
                'order_item_id' => $item->id,
                'rating' => $rating,
                'title' => null,
                'body' => self::COMMENTS[$rating][array_rand(self::COMMENTS[$rating])],
                'is_verified_purchase' => true,
            ]);

            $affectedProductIds[$product->id] = true;
        }

        foreach (array_keys($affectedProductIds) as $productId) {
            $product = Product::find($productId);
            $product->update([
                'rating_average' => round($product->reviews()->avg('rating') ?? 0, 2),
                'rating_count' => $product->reviews()->count(),
            ]);
        }
    }
}
