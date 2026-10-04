<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\PlaceOrderRequest;
use App\Http\Requests\Checkout\ValidateCouponRequest;
use App\Http\Resources\CouponResource;
use App\Http\Resources\OrderResource;
use App\Http\Responses\ApiResponse;
use App\Models\Coupon;
use App\Services\CheckoutService;
use App\Services\CouponService;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CheckoutService $checkoutService,
        private readonly CouponService $couponService,
    ) {}

    public function placeOrder(PlaceOrderRequest $request): JsonResponse
    {
        $order = $this->checkoutService->placeOrder($request->user(), $request->validated());

        return ApiResponse::success(new OrderResource($order), 'Order placed successfully.', 201);
    }

    public function validateCoupon(ValidateCouponRequest $request): JsonResponse
    {
        $coupon = Coupon::where('code', $request->validated('code'))->first();

        if (! $coupon) {
            return ApiResponse::error('This coupon code does not exist.', 422);
        }

        $this->couponService->validate($coupon, $request->user(), (float) $request->validated('subtotal'));
        $discount = $this->couponService->calculateDiscount($coupon, (float) $request->validated('subtotal'));

        return ApiResponse::success([
            'coupon' => new CouponResource($coupon),
            'discount_amount' => $discount,
        ], 'Coupon applied.');
    }
}
