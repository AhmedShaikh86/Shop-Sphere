<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Http\Responses\ApiResponse;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        $reviews = Review::with(['user', 'product'])->latest()->paginate(20);

        return ApiResponse::success([
            'items' => ReviewResource::collection($reviews->items()),
            'meta' => ['current_page' => $reviews->currentPage(), 'last_page' => $reviews->lastPage()],
        ]);
    }

    public function destroy(Review $review): JsonResponse
    {
        $product = $review->product;
        $review->delete();

        $product->update([
            'rating_average' => round($product->reviews()->avg('rating') ?? 0, 2),
            'rating_count' => $product->reviews()->count(),
        ]);

        return ApiResponse::success(null, 'Review removed.');
    }
}
