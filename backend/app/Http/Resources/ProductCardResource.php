<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A compact shape for grid/listing views (the ProductCard component).
 * Keeps listing endpoints cheap by avoiding the full variant/image payload
 * that ProductResource returns for the single-product page.
 */
class ProductCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $images = $this->images->sortBy('sort_order')->values();
        $colors = $this->variants->pluck('color')->filter()->unique()->values();
        $firstInStockVariant = $this->variants->first(fn ($variant) => $variant->available_quantity > 0);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'brand' => $this->brand?->name,
            'price' => $this->base_price,
            'compare_at_price' => $this->compare_at_price,
            'is_on_sale' => $this->isOnSale(),
            'rating_average' => $this->rating_average,
            'rating_count' => $this->rating_count,
            'primary_image' => $images->first()?->url,
            'hover_image' => $images->get(1)?->url,
            'colors' => $colors,
            'in_stock' => (bool) $firstInStockVariant,
            // Lets the ProductCard "Quick Add" button add a variant straight
            // from the grid only when every variant shares one price/size
            // (e.g. one-size accessories); anything else sends the shopper
            // to the product page to choose size/color first.
            'default_variant_id' => $this->variants->count() === 1 ? $this->variants->first()->id : null,
        ];
    }
}
