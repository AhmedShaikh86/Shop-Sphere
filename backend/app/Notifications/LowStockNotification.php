<?php

namespace App\Notifications;

use App\Models\ProductVariant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly ProductVariant $variant) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $product = $this->variant->product;

        return [
            'title' => 'Low stock alert',
            'message' => "\"{$product->name}\" ({$this->variant->sku}) has only {$this->variant->available_quantity} left.",
            'product_id' => $product->id,
        ];
    }
}
