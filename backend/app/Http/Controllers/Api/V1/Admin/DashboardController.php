<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\Analytics\AdminAnalyticsService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(private readonly AdminAnalyticsService $analytics) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success($this->analytics->overview());
    }
}
