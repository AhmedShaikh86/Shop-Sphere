<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'material' => $this->material,
            'fit' => $this->fit,
            'pattern' => $this->pattern,
            'season' => $this->season,
            'care_instructions' => $this->care_instructions,
            'sustainability_info' => $this->sustainability_info,
            'gender' => $this->gender,
            'status' => $this->status,
            'base_price' => $this->base_price,
            'compare_at_price' => $this->compare_at_price,
            'is_on_sale' => $this->isOnSale(),
            'rating_average' => $this->rating_average,
            'rating_count' => $this->rating_count,
            'is_featured' => $this->is_featured,
            'store' => new StoreResource($this->whenLoaded('store')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'collection' => new CollectionResource($this->whenLoaded('collection')),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at,
        ];
    }
}
