<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to ShopSphere')
            ->greeting("Hello {$notifiable->name},")
            ->line('Welcome to ShopSphere — style, curated for you.')
            ->action('Start Shopping', config('app.frontend_url'))
            ->line('We are glad to have you with us.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Welcome to ShopSphere',
            'message' => 'Your account was created successfully.',
        ];
    }
}
