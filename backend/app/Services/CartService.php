<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Models\Cart;
use App\Models\ProductVariant;
use App\Models\User;

class CartService
{
    public function getCart(User $user): Cart
    {
        return $user->cart()->firstOrCreate([]);
    }

    public function addItem(User $user, ProductVariant $variant, int $quantity): Cart
    {
        $cart = $this->getCart($user);
        $existingItem = $cart->items()->where('product_variant_id', $variant->id)->first();
        $newQuantity = ($existingItem?->quantity ?? 0) + $quantity;

        if ($variant->available_quantity < $newQuantity) {
            throw new InsufficientStockException($variant->product->name);
        }

        $cart->items()->updateOrCreate(
            ['product_variant_id' => $variant->id],
            ['quantity' => $newQuantity],
        );

        return $cart->fresh();
    }

    public function updateItemQuantity(User $user, int $cartItemId, int $quantity): Cart
    {
        $cart = $this->getCart($user);
        $item = $cart->items()->findOrFail($cartItemId);

        if ($item->productVariant->available_quantity < $quantity) {
            throw new InsufficientStockException($item->productVariant->product->name);
        }

        $item->update(['quantity' => $quantity]);

        return $cart->fresh();
    }

    public function removeItem(User $user, int $cartItemId): Cart
    {
        $cart = $this->getCart($user);
        $cart->items()->where('id', $cartItemId)->delete();

        return $cart->fresh();
    }

    public function clear(Cart $cart): void
    {
        $cart->items()->delete();
    }
}
