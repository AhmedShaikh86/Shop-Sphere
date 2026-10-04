<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Http\Responses\ApiResponse;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $storeId = $request->user()->store->id;

        $reviews = Review::whereHas('product', fn ($q) => $q->where('store_id', $storeId))
            ->with(['user', 'product'])
            ->latest()
            ->paginate(15);

        return ApiResponse::success([
            'items' => ReviewResource::collection($reviews->items()),
            'meta' => ['current_page' => $reviews->currentPage(), 'last_page' => $reviews->lastPage()],
        ]);
    }
}
