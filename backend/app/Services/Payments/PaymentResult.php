<?php

namespace App\Services\Payments;

/**
 * The result a payment gateway hands back to CheckoutService.
 * Keeping this the same shape for every gateway is what lets
 * CheckoutService stay gateway-agnostic.
 */
class PaymentResult
{
    public function __construct(
        public readonly bool $succeeded,
        public readonly string $transactionId,
        public readonly ?string $failureReason = null,
    ) {}
}
