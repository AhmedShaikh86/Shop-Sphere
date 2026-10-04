<?php

namespace App\Notifications;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusUpdatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Order $order, private readonly OrderStatus $previousStatus) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $statusLabel = str($this->order->status->value)->replace('_', ' ')->title();

        return (new MailMessage)
            ->subject("Order {$this->order->order_number} — {$statusLabel}")
            ->greeting("Hi {$notifiable->name},")
            ->line("Your order {$this->order->order_number} is now: {$statusLabel}.")
            ->action('View Order', config('app.frontend_url').'/account/orders/'.$this->order->id);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Order status updated',
            'message' => "Order {$this->order->order_number} is now {$this->order->status->value}.",
            'order_id' => $this->order->id,
        ];
    }
}
