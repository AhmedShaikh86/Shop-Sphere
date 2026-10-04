<?php

namespace App\Http\Controllers\Api\V1\Webhooks;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

/**
 * Stripe is the source of truth for payment status: a checkout response
 * can be lost or the browser closed before the frontend hears the result,
 * so this webhook is what actually confirms or reverses a Payment record.
 */
class StripeWebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $webhookSecret = config('services.stripe.webhook_secret');

        if (! $webhookSecret) {
            return response()->json(['success' => false, 'message' => 'Stripe webhooks are not configured.'], 501);
        }

        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature'),
                $webhookSecret,
            );
        } catch (SignatureVerificationException) {
            return response()->json(['success' => false, 'message' => 'Invalid webhook signature.'], 400);
        }

        $paymentIntent = $event->data->object;
        $payment = Payment::where('transaction_id', $paymentIntent->id ?? null)->first();

        if (! $payment) {
            Log::info('Stripe webhook received for unknown payment intent.', ['event' => $event->type]);

            return response()->json(['success' => true]);
        }

        match ($event->type) {
            'payment_intent.succeeded' => $payment->update(['status' => PaymentStatus::Succeeded, 'paid_at' => now()]),
            'payment_intent.payment_failed' => $payment->update(['status' => PaymentStatus::Failed]),
            default => null,
        };

        return response()->json(['success' => true]);
    }
}
