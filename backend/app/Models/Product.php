<?php

namespace App\Models;

use App\Enums\ProductGender;
use App\Enums\ProductStatus;
use App\Enums\StoreStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'store_id', 'category_id', 'brand_id', 'collection_id',
    'name', 'slug', 'description', 'material', 'fit', 'pattern', 'season',
    'care_instructions', 'sustainability_info', 'gender', 'status',
    'base_price', 'compare_at_price', 'is_featured', 'published_at',
])]
class Product extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'gender' => ProductGender::class,
            'status' => ProductStatus::class,
            'base_price' => 'decimal:2',
            'compare_at_price' => 'decimal:2',
            'rating_average' => 'decimal:2',
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function isOnSale(): bool
    {
        return $this->compare_at_price !== null && $this->compare_at_price > $this->base_price;
    }

    /**
     * What the public storefront (listings, search, product page) is
     * allowed to show: published, and from a store that's still in good
     * standing — a suspended seller's catalog disappears from the site
     * immediately, not just from their own dashboard.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('status', ProductStatus::Published)
            ->whereHas('store', fn (Builder $sub) => $sub->where('status', StoreStatus::Approved));
    }

    /**
     * Apply the discovery filters shared by the shop, category, brand,
     * collection, and search pages so the query logic lives in one place.
     *
     * @param  array<string, mixed>  $filters
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['keyword'] ?? null, fn (Builder $q, string $keyword) => $q->where(
                fn (Builder $sub) => $sub->where('name', 'like', "%{$keyword}%")->orWhere('description', 'like', "%{$keyword}%")
            ))
            ->when($filters['category_slug'] ?? null, fn (Builder $q, string $slug) => $q->whereHas(
                'category', fn (Builder $sub) => $sub->where('slug', $slug)
            ))
            ->when($filters['brand_slug'] ?? null, fn (Builder $q, string $slug) => $q->whereHas(
                'brand', fn (Builder $sub) => $sub->where('slug', $slug)
            ))
            ->when($filters['collection_slug'] ?? null, fn (Builder $q, string $slug) => $q->whereHas(
                'collection', fn (Builder $sub) => $sub->where('slug', $slug)
            ))
            ->when($filters['gender'] ?? null, fn (Builder $q, string $gender) => $q->where('gender', $gender))
            ->when($filters['min_price'] ?? null, fn (Builder $q, $min) => $q->where('base_price', '>=', $min))
            ->when($filters['max_price'] ?? null, fn (Builder $q, $max) => $q->where('base_price', '<=', $max))
            ->when($filters['min_rating'] ?? null, fn (Builder $q, $min) => $q->where('rating_average', '>=', $min))
            ->when($filters['on_sale'] ?? null, fn (Builder $q) => $q->whereColumn('compare_at_price', '>', 'base_price'))
            ->when($filters['size'] ?? null, fn (Builder $q, string $size) => $q->whereHas(
                'variants', fn (Builder $sub) => $sub->where('size', $size)
            ))
            ->when($filters['color'] ?? null, fn (Builder $q, string $color) => $q->whereHas(
                'variants', fn (Builder $sub) => $sub->where('color', $color)
            ))
            ->when($filters['in_stock'] ?? null, fn (Builder $q) => $q->whereHas(
                'variants', fn (Builder $sub) => $sub->whereColumn('stock_quantity', '>', 'reserved_quantity')
            ));
    }

    public function scopeSort(Builder $query, ?string $sort): Builder
    {
        return match ($sort) {
            'price_asc' => $query->orderBy('base_price', 'asc'),
            'price_desc' => $query->orderBy('base_price', 'desc'),
            'rating' => $query->orderByDesc('rating_average'),
            'newest' => $query->orderByDesc('published_at'),
            default => $query->orderByDesc('published_at'),
        };
    }
}
