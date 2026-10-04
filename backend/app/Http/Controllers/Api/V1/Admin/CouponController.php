<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CouponRequest;
use App\Http\Resources\CouponResource;
use App\Http\Responses\ApiResponse;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;

class CouponController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(CouponResource::collection(Coupon::whereNull('store_id')->latest()->get()));
    }

    public function store(CouponRequest $request): JsonResponse
    {
        $coupon = Coupon::create([...$request->validated(), 'store_id' => null]);

        return ApiResponse::success(new CouponResource($coupon), 'Coupon created.', 201);
    }

    public function update(CouponRequest $request, Coupon $coupon): JsonResponse
    {
        // This section manages platform-wide coupons only — a seller's own
        // coupon (store_id set) must be edited from their own dashboard,
        // not by guessing its id here.
        abort_if($coupon->store_id !== null, 404, 'This coupon belongs to a seller and cannot be managed here.');

        $coupon->update($request->validated());

        return ApiResponse::success(new CouponResource($coupon->fresh()), 'Coupon updated.');
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        abort_if($coupon->store_id !== null, 404, 'This coupon belongs to a seller and cannot be managed here.');

        $coupon->delete();

        return ApiResponse::success(null, 'Coupon deleted.');
    }
}
