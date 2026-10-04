<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Collection;
use App\Models\SiteImage;
use App\Services\UnsplashService;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;

/**
 * Resolves each named image placement (homepage hero, category banners,
 * collection banners, editorial section) to a real Unsplash photo and
 * caches the result in the database, one request per placement.
 *
 * This is deliberately a one-off sync command rather than a live API call
 * per page view: Unsplash's free tier is rate-limited to 50 requests/hour,
 * and these placements rarely change, so resolving them once (locally, or
 * again after a redeploy) and reading from the database on every request
 * is both faster and well within limits.
 *
 * Safe to run without an Unsplash key configured — it just does nothing,
 * leaving whatever image_url/banner_url is already in the database (the
 * seeded Picsum placeholder, or nothing at all) untouched.
 */
class SyncPlacementImages extends Command
{
    protected $signature = 'images:sync-placements';

    protected $description = 'Resolve homepage/category/collection image placements to real Unsplash photos';

    /**
     * id => [model class, lookup column + value, image column, search query].
     * Matches the placement list used to design ShopSphere's editorial imagery.
     */
    private const PLACEMENTS = [
        'hero' => [
            'query' => 'premium fashion editorial model neutral studio',
        ],
        'editorial' => [
            'query' => 'fashion studio creative team editorial',
        ],
        'women-category' => [
            'model' => Category::class,
            'slug' => 'women',
            'column' => 'image_url',
            'query' => "elegant women's fashion editorial neutral background",
        ],
        'men-category' => [
            'model' => Category::class,
            'slug' => 'men',
            'column' => 'image_url',
            'query' => "premium men's fashion editorial neutral background",
        ],
        'shoes-category' => [
            'model' => Category::class,
            'slug' => 'shoes',
            'column' => 'image_url',
            'query' => 'luxury shoes fashion editorial',
        ],
        'bags-category' => [
            'model' => Category::class,
            'slug' => 'bags',
            'column' => 'image_url',
            'query' => 'designer handbag fashion editorial',
        ],
        'accessories-category' => [
            'model' => Category::class,
            'slug' => 'accessories',
            'column' => 'image_url',
            'query' => 'minimal fashion accessories editorial',
        ],
        'collection-new-season' => [
            'model' => Collection::class,
            'slug' => 'new-season',
            'column' => 'banner_url',
            'query' => 'modern fashion collection editorial',
        ],
        'collection-evening' => [
            'model' => Collection::class,
            'slug' => 'evening-edit',
            'column' => 'banner_url',
            'query' => 'elegant evening fashion editorial',
        ],
        'collection-weekend' => [
            'model' => Collection::class,
            'slug' => 'weekend',
            'column' => 'banner_url',
            'query' => 'casual premium fashion editorial',
        ],
        'collection-workwear' => [
            'model' => Collection::class,
            'slug' => 'workwear',
            'column' => 'banner_url',
            'query' => 'modern workwear fashion editorial',
        ],
    ];

    public function handle(UnsplashService $unsplash): int
    {
        if (! $unsplash->isConfigured()) {
            $this->warn('UNSPLASH_ACCESS_KEY is not set — nothing to sync. Existing images are left as-is.');

            return self::SUCCESS;
        }

        foreach (self::PLACEMENTS as $id => $placement) {
            $this->line("Resolving \"{$id}\"...");

            $photo = $unsplash->search($placement['query']);

            if (! $photo) {
                $this->warn("  Skipped — no Unsplash result for \"{$placement['query']}\".");

                continue;
            }

            $this->applyToTarget($id, $placement, $photo);
            $unsplash->trackDownload($photo['download_location']);

            $this->info("  Set to a photo by {$photo['photo_credit_name']}.");
        }

        return self::SUCCESS;
    }

    private function applyToTarget(string $id, array $placement, array $photo): void
    {
        $attributes = [
            'photo_credit_name' => $photo['photo_credit_name'],
            'photo_credit_url' => $photo['photo_credit_url'],
        ];

        if (! isset($placement['model'])) {
            SiteImage::updateOrCreate(['key' => $id], [...$attributes, 'url' => $photo['url']]);

            return;
        }

        /** @var class-string<Model> $modelClass */
        $modelClass = $placement['model'];
        $record = $modelClass::where('slug', $placement['slug'])->first();

        if (! $record) {
            $this->warn("  No {$modelClass} found with slug \"{$placement['slug']}\" — skipping.");

            return;
        }

        $record->update([...$attributes, $placement['column'] => $photo['url']]);
    }
}
