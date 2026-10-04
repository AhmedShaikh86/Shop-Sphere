<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'title' => $this->title,
            'body' => $this->body,
            'images' => $this->images,
            'is_verified_purchase' => $this->is_verified_purchase,
            'user_name' => $this->whenLoaded('user', fn () => $this->user->name),
            'product_name' => $this->whenLoaded('product', fn () => $this->product->name),
            'product_slug' => $this->whenLoaded('product', fn () => $this->product->slug),
            'created_at' => $this->created_at,
        ];
    }
}
