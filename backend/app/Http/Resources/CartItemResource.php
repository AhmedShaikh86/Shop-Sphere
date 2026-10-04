<?php

namespace App\Http\Resources;

use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var ProductVariant $variant */
        $variant = $this->productVariant;
        $product = $variant->product;

        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'variant' => new ProductVariantResource($variant),
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image_url' => $product->images->first()?->url,
            ],
            'line_total' => round($variant->price * $this->quantity, 2),
        ];
    }
}
