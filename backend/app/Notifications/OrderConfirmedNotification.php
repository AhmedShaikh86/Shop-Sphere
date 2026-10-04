<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderConfirmedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Order Confirmed — {$this->order->order_number}")
            ->greeting("Thanks for your order, {$notifiable->name}!")
            ->line("We've received your order {$this->order->order_number} and it's now being processed.")
            ->line("Order total: \${$this->order->total}")
            ->action('View Order', config('app.frontend_url').'/account/orders/'.$this->order->id);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Order confirmed',
            'message' => "Your order {$this->order->order_number} has been placed.",
            'order_id' => $this->order->id,
        ];
    }
}
