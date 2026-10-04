<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\ProductStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Responses\ApiResponse;
use App\Models\Product;
use App\Notifications\ProductStatusUpdatedNotification;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private readonly ActivityLogger $activityLogger) {}

    public function index(Request $request): JsonResponse
    {
        $products = Product::query()
            ->with(['store', 'category', 'brand', 'images'])
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20);

        return ApiResponse::success([
            'items' => ProductResource::collection($products->items()),
            'meta' => ['current_page' => $products->currentPage(), 'last_page' => $products->lastPage(), 'total' => $products->total()],
        ]);
    }

    public function approve(Request $request, Product $product): JsonResponse
    {
        abort_unless($product->status === ProductStatus::PendingReview, 422, 'Only products pending review can be approved.');

        $product->update(['status' => ProductStatus::Published, 'published_at' => now()]);
        $this->activityLogger->log($request->user(), 'product.approved', $product, "Product \"{$product->name}\" approved.");
        $product->store->user->notify(new ProductStatusUpdatedNotification($product));

        return ApiResponse::success(new ProductResource($product), 'Product approved and published.');
    }

    public function reject(Request $request, Product $product): JsonResponse
    {
        abort_unless($product->status === ProductStatus::PendingReview, 422, 'Only products pending review can be rejected.');

        $product->update(['status' => ProductStatus::Archived]);
        $this->activityLogger->log($request->user(), 'product.rejected', $product, "Product \"{$product->name}\" rejected.");
        $product->store->user->notify(new ProductStatusUpdatedNotification($product));

        return ApiResponse::success(new ProductResource($product), 'Product rejected and archived.');
    }
}
