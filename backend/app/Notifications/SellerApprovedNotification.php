<?php

namespace App\Notifications;

use App\Models\Store;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SellerApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Store $store) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your ShopSphere store has been approved')
            ->greeting("Congratulations, {$notifiable->name}!")
            ->line("Your store \"{$this->store->name}\" has been approved and can now publish products.")
            ->action('Go to Seller Dashboard', config('app.frontend_url').'/seller/dashboard');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Store approved',
            'message' => "\"{$this->store->name}\" has been approved.",
            'store_id' => $this->store->id,
        ];
    }
}
