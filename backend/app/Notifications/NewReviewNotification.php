<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewReviewNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Review $review) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $product = $this->review->product;

        return [
            'title' => 'New product review',
            'message' => "\"{$product->name}\" received a {$this->review->rating}-star review.",
            'product_id' => $product->id,
        ];
    }
}
