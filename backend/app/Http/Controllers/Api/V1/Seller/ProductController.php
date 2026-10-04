<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Enums\ProductStatus;
use App\Enums\StoreStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\StoreProductRequest;
use App\Http\Requests\Seller\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Http\Responses\ApiResponse;
use App\Models\Product;
use App\Models\Store;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private readonly ProductService $productService) {}

    public function index(Request $request): JsonResponse
    {
        $products = $request->user()->store->products()
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->with(['brand', 'category', 'images', 'variants'])
            ->latest()
            ->paginate(15);

        return ApiResponse::success([
            'items' => ProductResource::collection($products->items()),
            'meta' => ['current_page' => $products->currentPage(), 'last_page' => $products->lastPage(), 'total' => $products->total()],
        ]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $this->abortIfStoreSuspended($request->user()->store);

        $product = $this->productService->create($request->user()->store, $request->validated());

        return ApiResponse::success(new ProductResource($product), 'Product created as a draft.', 201);
    }

    public function show(Request $request, Product $product): JsonResponse
    {
        $this->authorize('manage', $product);

        return ApiResponse::success(new ProductResource($product->load(['brand', 'category', 'collection', 'images', 'variants'])));
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $this->authorize('manage', $product);

        $product = $this->productService->update($product, $request->validated());

        return ApiResponse::success(new ProductResource($product), 'Product updated.');
    }

    public function submitForReview(Request $request, Product $product): JsonResponse
    {
        $this->authorize('manage', $product);
        $this->abortIfStoreSuspended($product->store);

        abort_unless(
            in_array($product->status, [ProductStatus::Draft, ProductStatus::Archived], true),
            422,
            'Only draft or archived products can be submitted for review.'
        );

        $product->update(['status' => ProductStatus::PendingReview]);

        return ApiResponse::success(new ProductResource($product), 'Product submitted for admin review.');
    }

    public function archive(Request $request, Product $product): JsonResponse
    {
        $this->authorize('manage', $product);

        $product->update(['status' => ProductStatus::Archived]);

        return ApiResponse::success(new ProductResource($product), 'Product archived.');
    }

    /**
     * A suspended store can still edit/archive what it already has, but
     * can't create new products or send more out for approval — otherwise
     * "suspend" would have no real effect on a bad-acting seller.
     */
    private function abortIfStoreSuspended(Store $store): void
    {
        abort_if(
            $store->status === StoreStatus::Suspended,
            403,
            'Your store is suspended. Contact support to resolve this before adding or publishing products.'
        );
    }
}
