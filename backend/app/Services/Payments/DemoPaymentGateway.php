<?php

namespace App\Services\Payments;

use App\Models\Order;
use Illuminate\Support\Str;

/**
 * A clearly-labeled local/demo stand-in for a real payment provider.
 * Used automatically whenever STRIPE_SECRET is not configured, so the
 * app stays fully testable without real payment credentials. It never
 * pretends to be a production gateway: the transaction id is prefixed
 * "demo_" so it can never be confused with a real Stripe charge id.
 */
class DemoPaymentGateway implements PaymentGateway
{
    public function name(): string
    {
        return 'demo';
    }

    public function charge(Order $order, array $paymentDetails): PaymentResult
    {
        // A card number ending in 0002 simulates a declined card, so the
        // failure path can be exercised without any real payment provider.
        $cardNumber = $paymentDetails['card_number'] ?? '';

        if (str_ends_with($cardNumber, '0002')) {
            return new PaymentResult(
                succeeded: false,
                transactionId: 'demo_'.Str::uuid(),
                failureReason: 'The card was declined.',
            );
        }

        return new PaymentResult(
            succeeded: true,
            transactionId: 'demo_'.Str::uuid(),
        );
    }
}
