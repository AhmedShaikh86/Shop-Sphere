<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Http\Responses\ApiResponse;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Notifications\NewReviewNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function featured(): JsonResponse
    {
        $reviews = Review::query()
            ->where('rating', '>=', 4)
            ->whereNotNull('body')
            ->with(['user', 'product'])
            ->latest()
            ->limit(6)
            ->get();

        return ApiResponse::success(ReviewResource::collection($reviews));
    }

    public function index(Product $product): JsonResponse
    {
        $reviews = $product->reviews()->with('user')->latest()->paginate(10);

        return ApiResponse::success([
            'items' => ReviewResource::collection($reviews->items()),
            'meta' => ['current_page' => $reviews->currentPage(), 'last_page' => $reviews->lastPage(), 'total' => $reviews->total()],
        ]);
    }

    public function store(ReviewRequest $request, Product $product): JsonResponse
    {
        $verifiedOrderItem = OrderItem::whereHas('order', fn ($query) => $query
            ->where('user_id', $request->user()->id)
            ->where('status', OrderStatus::Delivered))
            ->where('product_variant_id', function ($query) use ($product) {
                $query->select('id')->from('product_variants')->where('product_id', $product->id);
            })
            ->first();

        $review = Review::updateOrCreate(
            ['product_id' => $product->id, 'user_id' => $request->user()->id],
            [
                ...$request->validated(),
                'order_item_id' => $verifiedOrderItem?->id,
                'is_verified_purchase' => (bool) $verifiedOrderItem,
            ],
        );

        $this->refreshProductRating($product);
        $product->store->user->notify(new NewReviewNotification($review));

        return ApiResponse::success(new ReviewResource($review->load('user')), 'Review submitted.', 201);
    }

    public function destroy(Request $request, Review $review): JsonResponse
    {
        $this->authorize('manage', $review);

        $product = $review->product;
        $review->delete();
        $this->refreshProductRating($product);

        return ApiResponse::success(null, 'Review deleted.');
    }

    private function refreshProductRating(Product $product): void
    {
        $product->update([
            'rating_average' => round($product->reviews()->avg('rating') ?? 0, 2),
            'rating_count' => $product->reviews()->count(),
        ]);
    }
}
