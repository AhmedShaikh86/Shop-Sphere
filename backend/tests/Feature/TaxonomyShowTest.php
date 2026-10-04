<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Collection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * The public "show" routes are always looked up by slug (for readable
 * URLs like /category/women), not by numeric id — regression coverage
 * for a bug where these routes bound by id only, so every slug lookup
 * 404'd and the frontend silently fell back to a generic title.
 */
class TaxonomyShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_category_can_be_fetched_by_slug(): void
    {
        $category = Category::factory()->create(['slug' => 'women']);

        $response = $this->getJson('/api/v1/categories/women');

        $response->assertOk();
        $response->assertJsonPath('data.id', $category->id);
    }

    public function test_a_brand_can_be_fetched_by_slug(): void
    {
        $brand = Brand::factory()->create(['slug' => 'atelier-north']);

        $response = $this->getJson('/api/v1/brands/atelier-north');

        $response->assertOk();
        $response->assertJsonPath('data.id', $brand->id);
    }

    public function test_a_collection_can_be_fetched_by_slug(): void
    {
        $collection = Collection::factory()->create(['slug' => 'workwear']);

        $response = $this->getJson('/api/v1/collections/workwear');

        $response->assertOk();
        $response->assertJsonPath('data.id', $collection->id);
    }
}
