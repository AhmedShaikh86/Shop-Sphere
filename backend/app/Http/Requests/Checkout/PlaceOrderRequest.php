<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipping_address_id' => ['required', 'integer', 'exists:addresses,id'],
            'billing_address_id' => ['sometimes', 'nullable', 'integer', 'exists:addresses,id'],
            'coupon_code' => ['sometimes', 'nullable', 'string'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:500'],
            'payment' => ['required', 'array'],
            'payment.card_number' => ['sometimes', 'string'],
            'payment.payment_method_id' => ['sometimes', 'string'],
        ];
    }
}
