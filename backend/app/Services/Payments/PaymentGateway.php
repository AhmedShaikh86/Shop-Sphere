<?php

namespace App\Services\Payments;

use App\Models\Order;

interface PaymentGateway
{
    public function name(): string;

    /**
     * Charge the order's total. Implementations must never report success
     * without the underlying provider actually confirming the charge.
     */
    public function charge(Order $order, array $paymentDetails): PaymentResult;
}
