<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Collection;
use App\Models\SiteImage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PlacementImageSyncTest extends TestCase
{
    use RefreshDatabase;

    private function fakeUnsplashResponse(): array
    {
        return [
            'results' => [
                [
                    'urls' => ['regular' => 'https://images.unsplash.com/photo-test?w=1200'],
                    'user' => ['name' => 'Jane Doe', 'links' => ['html' => 'https://unsplash.com/@janedoe']],
                    'links' => ['download_location' => 'https://api.unsplash.com/photos/test/download'],
                ],
            ],
        ];
    }

    public function test_the_sync_command_does_nothing_without_an_access_key(): void
    {
        config(['services.unsplash.access_key' => null]);
        $category = Category::factory()->create(['slug' => 'women', 'image_url' => 'https://picsum.photos/seed/original/600/400']);

        $this->artisan('images:sync-placements')->assertSuccessful();

        $this->assertEquals('https://picsum.photos/seed/original/600/400', $category->fresh()->image_url);
        $this->assertDatabaseCount('site_images', 0);
    }

    public function test_the_sync_command_resolves_and_caches_photos_when_configured(): void
    {
        config(['services.unsplash.access_key' => 'fake-test-key']);
        Http::fake(['api.unsplash.com/*' => Http::response($this->fakeUnsplashResponse(), 200)]);

        Category::factory()->create(['slug' => 'women']);
        Collection::factory()->create(['slug' => 'new-season']);

        $this->artisan('images:sync-placements')->assertSuccessful();

        $category = Category::where('slug', 'women')->first();
        $this->assertEquals('https://images.unsplash.com/photo-test?w=1200', $category->image_url);
        $this->assertEquals('Jane Doe', $category->photo_credit_name);
        $this->assertStringContainsString('unsplash.com/@janedoe', $category->photo_credit_url);

        $collection = Collection::where('slug', 'new-season')->first();
        $this->assertEquals('https://images.unsplash.com/photo-test?w=1200', $collection->banner_url);

        $heroImage = SiteImage::where('key', 'hero')->first();
        $this->assertNotNull($heroImage);
        $this->assertEquals('Jane Doe', $heroImage->photo_credit_name);

        // One download-tracking ping per resolved photo (11 placements).
        Http::assertSentCount(22);
    }

    public function test_the_sync_command_skips_a_placement_gracefully_when_unsplash_has_no_results(): void
    {
        config(['services.unsplash.access_key' => 'fake-test-key']);
        Http::fake(['api.unsplash.com/*' => Http::response(['results' => []], 200)]);

        Category::factory()->create(['slug' => 'women', 'image_url' => 'https://picsum.photos/seed/original/600/400']);

        $this->artisan('images:sync-placements')->assertSuccessful();

        $this->assertEquals('https://picsum.photos/seed/original/600/400', Category::where('slug', 'women')->first()->image_url);
    }

    public function test_manually_updating_a_category_image_clears_any_stale_photo_credit(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = Category::factory()->create([
            'photo_credit_name' => 'Old Photographer',
            'photo_credit_url' => 'https://unsplash.com/@old',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/v1/admin/categories/{$category->id}", [
            'name' => $category->name,
            'image_url' => 'https://example.com/my-own-photo.jpg',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.photo_credit_name', null);
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'image_url' => 'https://example.com/my-own-photo.jpg',
            'photo_credit_name' => null,
        ]);
    }

    public function test_site_images_endpoint_returns_an_object_even_when_empty(): void
    {
        $response = $this->getJson('/api/v1/site-images');

        $response->assertOk();
        // Decoding with assoc=false keeps {} and [] distinguishable, unlike
        // Laravel's ->json() helper (which decodes both as a PHP []).
        $decoded = json_decode($response->getContent());
        $this->assertIsObject($decoded->data, 'Expected "data" to serialize as a JSON object ({}), not an array ([]).');
    }
}
