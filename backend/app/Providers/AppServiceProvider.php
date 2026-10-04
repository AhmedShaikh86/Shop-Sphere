<?php

namespace App\Providers;

use App\Listeners\SendWelcomeNotification;
use App\Services\Payments\DemoPaymentGateway;
use App\Services\Payments\PaymentGateway;
use App\Services\Payments\StripePaymentGateway;
use Illuminate\Auth\Events\Registered;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Stripe is used automatically once a secret key is configured;
        // otherwise every checkout falls back to the local demo gateway
        // so the app is fully testable without real payment credentials.
        $this->app->bind(PaymentGateway::class, function () {
            $secretKey = config('services.stripe.secret');

            return $secretKey
                ? new StripePaymentGateway($secretKey)
                : new DemoPaymentGateway;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(Registered::class, SendWelcomeNotification::class);

        // Generous enough for normal browsing/dashboard use, but stops
        // scripted abuse of the API. Keyed by user when authenticated so
        // one busy customer can't throttle everyone sharing an IP.
        RateLimiter::for('api', function ($request) {
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
        });

        // Tighter limit on login/register/password-reset to slow down
        // credential stuffing and brute-force attempts.
        RateLimiter::for('auth', function ($request) {
            return Limit::perMinute(10)->by($request->ip());
        });
    }
}
