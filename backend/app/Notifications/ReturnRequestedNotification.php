<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ReturnRequestedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Order $order, private readonly string $reason) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Return requested',
            'message' => "A return was requested for order {$this->order->order_number}: {$this->reason}",
            'order_id' => $this->order->id,
        ];
    }
}
