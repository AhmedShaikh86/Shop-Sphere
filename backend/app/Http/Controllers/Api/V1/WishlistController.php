<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WishlistItemResource;
use App\Http\Responses\ApiResponse;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $wishlist = $request->user()->wishlist()->firstOrCreate([]);
        $items = $wishlist->items()->with(['product.brand', 'product.images', 'product.variants'])->get();

        return ApiResponse::success(WishlistItemResource::collection($items));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['product_id' => ['required', 'integer', 'exists:products,id']]);

        $wishlist = $request->user()->wishlist()->firstOrCreate([]);
        $item = $wishlist->items()->firstOrCreate(['product_id' => $request->integer('product_id')]);

        return ApiResponse::success(new WishlistItemResource($item->load('product.brand', 'product.images', 'product.variants')), 'Added to wishlist.', 201);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        $wishlist = $request->user()->wishlist()->firstOrCreate([]);
        $wishlist->items()->where('product_id', $product->id)->delete();

        return ApiResponse::success(null, 'Removed from wishlist.');
    }
}
