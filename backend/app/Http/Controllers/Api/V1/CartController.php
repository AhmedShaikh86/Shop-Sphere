<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartItemResource;
use App\Http\Responses\ApiResponse;
use App\Models\ProductVariant;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private readonly CartService $cartService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->respondWithCart($this->cartService->getCart($request->user()));
    }

    public function store(AddCartItemRequest $request): JsonResponse
    {
        $variant = ProductVariant::findOrFail($request->validated('product_variant_id'));
        $cart = $this->cartService->addItem($request->user(), $variant, $request->validated('quantity'));

        return $this->respondWithCart($cart, 'Added to cart.');
    }

    public function update(UpdateCartItemRequest $request, int $cartItem): JsonResponse
    {
        $cart = $this->cartService->updateItemQuantity($request->user(), $cartItem, $request->validated('quantity'));

        return $this->respondWithCart($cart, 'Cart updated.');
    }

    public function destroy(Request $request, int $cartItem): JsonResponse
    {
        $cart = $this->cartService->removeItem($request->user(), $cartItem);

        return $this->respondWithCart($cart, 'Item removed from cart.');
    }

    private function respondWithCart($cart, ?string $message = null): JsonResponse
    {
        $cart->load(['items.productVariant.product.images']);

        $subtotal = $cart->items->sum(fn ($item) => $item->productVariant->price * $item->quantity);

        return ApiResponse::success([
            'items' => CartItemResource::collection($cart->items),
            'subtotal' => round($subtotal, 2),
        ], $message);
    }
}
