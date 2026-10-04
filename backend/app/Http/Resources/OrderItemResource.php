<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_name' => $this->product_name,
            'variant_label' => $this->variant_label,
            'unit_price' => $this->unit_price,
            'quantity' => $this->quantity,
            'total' => $this->total,
            'store_id' => $this->store_id,
            'store_name' => $this->whenLoaded('store', fn () => $this->store->name),
        ];
    }
}
