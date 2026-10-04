<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->key,
            'url' => $this->url,
            'photo_credit_name' => $this->photo_credit_name,
            'photo_credit_url' => $this->photo_credit_url,
        ];
    }
}
