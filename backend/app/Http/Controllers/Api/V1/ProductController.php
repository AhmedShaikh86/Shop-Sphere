<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductIndexRequest;
use App\Http\Resources\ProductCardResource;
use App\Http\Resources\ProductResource;
use App\Http\Responses\ApiResponse;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(ProductIndexRequest $request): JsonResponse
    {
        $filters = $request->validated();

        $products = Product::query()
            ->published()
            ->filter($filters)
            ->sort($filters['sort'] ?? null)
            ->with(['brand', 'images', 'variants'])
            ->paginate($filters['per_page'] ?? 24);

        return ApiResponse::success([
            'items' => ProductCardResource::collection($products->items()),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::query()
            ->published()
            ->with(['store', 'category', 'brand', 'collection', 'variants', 'images'])
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Product::query()
            ->published()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['brand', 'images', 'variants'])
            ->limit(8)
            ->get();

        return ApiResponse::success([
            'product' => new ProductResource($product),
            'related_products' => ProductCardResource::collection($related),
        ]);
    }

    public function newArrivals(): JsonResponse
    {
        $products = Product::query()->published()->sort('newest')->with(['brand', 'images', 'variants'])->limit(12)->get();

        return ApiResponse::success(ProductCardResource::collection($products));
    }

    public function bestSellers(): JsonResponse
    {
        // "Best selling" is approximated by rating volume until real sales
        // aggregation is worth the extra query cost for the homepage.
        $products = Product::query()->published()->orderByDesc('rating_count')->with(['brand', 'images', 'variants'])->limit(12)->get();

        return ApiResponse::success(ProductCardResource::collection($products));
    }

    public function onSale(): JsonResponse
    {
        $products = Product::query()->published()->filter(['on_sale' => true])->with(['brand', 'images', 'variants'])->paginate(24);

        return ApiResponse::success(ProductCardResource::collection($products->items()));
    }
}
