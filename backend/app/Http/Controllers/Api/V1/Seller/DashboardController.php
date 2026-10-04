<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Analytics\SellerAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private readonly SellerAnalyticsService $analytics) {}

    public function index(Request $request): JsonResponse
    {
        return ApiResponse::success($this->analytics->overview($request->user()->store));
    }
}
