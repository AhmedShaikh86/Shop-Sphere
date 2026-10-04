<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'avatar_url' => $this->avatar_url,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            // Only populated where the controller loads these via
            // withCount(); null everywhere else.
            'orders_count' => $this->orders_count,
            'orders_from_store_count' => $this->orders_from_store_count,
        ];
    }
}
