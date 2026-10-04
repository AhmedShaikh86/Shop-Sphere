<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\CouponRequest;
use App\Http\Resources\CouponResource;
use App\Http\Responses\ApiResponse;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $coupons = Coupon::where('store_id', $request->user()->store->id)->latest()->get();

        return ApiResponse::success(CouponResource::collection($coupons));
    }

    public function store(CouponRequest $request): JsonResponse
    {
        $coupon = Coupon::create([...$request->validated(), 'store_id' => $request->user()->store->id]);

        return ApiResponse::success(new CouponResource($coupon), 'Coupon created.', 201);
    }

    public function update(CouponRequest $request, Coupon $coupon): JsonResponse
    {
        abort_if($coupon->store_id !== $request->user()->store->id, 403, 'This coupon does not belong to your store.');

        $coupon->update($request->validated());

        return ApiResponse::success(new CouponResource($coupon->fresh()), 'Coupon updated.');
    }

    public function destroy(Request $request, Coupon $coupon): JsonResponse
    {
        abort_if($coupon->store_id !== $request->user()->store->id, 403, 'This coupon does not belong to your store.');

        $coupon->delete();

        return ApiResponse::success(null, 'Coupon deleted.');
    }
}
