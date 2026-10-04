<?php

namespace App\Services\Payments;

use App\Models\Order;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\StripeClient;

/**
 * Real Stripe integration used automatically once STRIPE_SECRET is set.
 * Charges are created as PaymentIntents; webhooks (see StripeWebhookController)
 * are the source of truth for final status, since a frontend "success" flag
 * can never be trusted on its own.
 */
class StripePaymentGateway implements PaymentGateway
{
    private StripeClient $client;

    public function __construct(string $secretKey)
    {
        $this->client = new StripeClient($secretKey);
    }

    public function name(): string
    {
        return 'stripe';
    }

    public function charge(Order $order, array $paymentDetails): PaymentResult
    {
        try {
            /** @var PaymentIntent $intent */
            $intent = $this->client->paymentIntents->create([
                'amount' => (int) round($order->total * 100),
                'currency' => 'usd',
                'payment_method' => $paymentDetails['payment_method_id'] ?? null,
                'confirm' => true,
                'automatic_payment_methods' => ['enabled' => true, 'allow_redirects' => 'never'],
                'metadata' => ['order_number' => $order->order_number],
            ]);

            return new PaymentResult(
                succeeded: $intent->status === 'succeeded',
                transactionId: $intent->id,
                failureReason: $intent->status === 'succeeded' ? null : $intent->status,
            );
        } catch (ApiErrorException $exception) {
            return new PaymentResult(
                succeeded: false,
                transactionId: $exception->getStripeCode() ?? 'stripe_error',
                failureReason: $exception->getMessage(),
            );
        }
    }
}
