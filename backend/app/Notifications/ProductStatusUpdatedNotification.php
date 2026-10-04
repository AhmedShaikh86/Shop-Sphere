<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ProductStatusUpdatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Product $product) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Product status updated',
            'message' => "\"{$this->product->name}\" is now {$this->product->status->value}.",
            'product_id' => $this->product->id,
        ];
    }
}
