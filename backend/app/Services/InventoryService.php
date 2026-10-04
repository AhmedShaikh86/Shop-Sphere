<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Models\ProductVariant;

/**
 * All stock changes go through here so reservation, release, and
 * fulfillment always agree on what "available" means.
 */
class InventoryService
{
    /**
     * Hold stock for an order being placed. Call within a DB transaction
     * with the variant row locked (lockForUpdate) by the caller.
     */
    public function reserve(ProductVariant $variant, int $quantity): void
    {
        if ($variant->available_quantity < $quantity) {
            throw new InsufficientStockException($variant->product->name);
        }

        $variant->increment('reserved_quantity', $quantity);
    }

    /**
     * Release a hold without touching physical stock, e.g. when an order
     * is cancelled before it ships.
     */
    public function release(ProductVariant $variant, int $quantity): void
    {
        $variant->decrement('reserved_quantity', min($quantity, $variant->reserved_quantity));
    }

    /**
     * Convert a reservation into a permanent stock reduction once payment
     * succeeds: the units are gone for good, and the hold is cleared.
     */
    public function commit(ProductVariant $variant, int $quantity): void
    {
        $variant->decrement('stock_quantity', min($quantity, $variant->stock_quantity));
        $variant->decrement('reserved_quantity', min($quantity, $variant->reserved_quantity));
    }
}
