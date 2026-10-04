<?php

namespace App\Services;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Centralizes product create/update so the seller controller stays thin
 * and slug generation + variant/image syncing isn't duplicated.
 */
class ProductService
{
    public function create(Store $store, array $data): Product
    {
        return DB::transaction(function () use ($store, $data) {
            $product = Product::create([
                ...collect($data)->except(['variants', 'images'])->all(),
                'store_id' => $store->id,
                'slug' => $this->uniqueSlug($data['name']),
                'status' => ProductStatus::Draft,
            ]);

            $this->syncVariants($product, $data['variants'] ?? []);
            $this->syncImages($product, $data['images'] ?? []);

            return $product->fresh(['variants', 'images']);
        });
    }

    public function update(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            $product->update(collect($data)->except(['variants', 'images'])->all());

            if (array_key_exists('variants', $data)) {
                $this->syncVariants($product, $data['variants']);
            }

            if (array_key_exists('images', $data)) {
                $this->syncImages($product, $data['images']);
            }

            return $product->fresh(['variants', 'images']);
        });
    }

    private function syncVariants(Product $product, array $variants): void
    {
        $keptVariantIds = [];

        foreach ($variants as $variantData) {
            $variant = $product->variants()->updateOrCreate(
                ['id' => $variantData['id'] ?? null],
                collect($variantData)->except('id')->all(),
            );

            $keptVariantIds[] = $variant->id;
        }

        if ($keptVariantIds !== []) {
            $product->variants()->whereNotIn('id', $keptVariantIds)->delete();
        }
    }

    private function syncImages(Product $product, array $images): void
    {
        $product->images()->delete();

        foreach ($images as $index => $imageData) {
            $product->images()->create([
                'url' => $imageData['url'],
                'alt_text' => $imageData['alt_text'] ?? $product->name,
                'sort_order' => $index,
            ]);
        }
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$base}-".++$suffix;
        }

        return $slug;
    }
}
