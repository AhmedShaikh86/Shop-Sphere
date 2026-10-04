<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'banner_url' => $this->banner_url,
            'is_featured' => $this->is_featured,
            'photo_credit_name' => $this->photo_credit_name,
            'photo_credit_url' => $this->photo_credit_url,
        ];
    }
}
