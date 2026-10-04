<?php

namespace Tests\Feature;

use App\Enums\ProductStatus;
use App\Enums\StoreStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_product_listing_only_shows_published_products(): void
    {
        Product::factory()->create(['status' => ProductStatus::Published, 'name' => 'Published Product']);
        Product::factory()->draft()->create(['name' => 'Draft Product']);

        $response = $this->getJson('/api/v1/products');

        $response->assertOk();
        $names = collect($response->json('data.items'))->pluck('name');
        $this->assertTrue($names->contains('Published Product'));
        $this->assertFalse($names->contains('Draft Product'));
    }

    public function test_a_seller_can_create_a_product_as_a_draft(): void
    {
        $seller = User::factory()->create(['role' => UserRole::Seller]);
        $store = Store::factory()->create(['user_id' => $seller->id]);
        $category = Category::factory()->create();

        $response = $this->actingAs($seller, 'sanctum')->postJson('/api/v1/seller/products', [
            'category_id' => $category->id,
            'name' => 'Test Jacket',
            'description' => 'A well made jacket for testing.',
            'gender' => 'unisex',
            'base_price' => 199.99,
            'variants' => [
                ['sku' => 'JCK-TEST-1', 'price' => 199.99, 'stock_quantity' => 5],
            ],
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.status', 'draft');
        $this->assertDatabaseHas('products', ['name' => 'Test Jacket', 'store_id' => $store->id]);
    }

    public function test_a_seller_cannot_edit_another_sellers_product(): void
    {
        $sellerA = User::factory()->create(['role' => UserRole::Seller]);
        Store::factory()->create(['user_id' => $sellerA->id]);

        $sellerB = User::factory()->create(['role' => UserRole::Seller]);
        $storeB = Store::factory()->create(['user_id' => $sellerB->id]);
        $product = Product::factory()->create(['store_id' => $storeB->id]);

        $response = $this->actingAs($sellerA, 'sanctum')->putJson("/api/v1/seller/products/{$product->id}", [
            'name' => 'Hijacked Name',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_approve_a_product_pending_review(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $product = Product::factory()->pendingReview()->create();

        $response = $this->actingAs($admin, 'sanctum')->postJson("/api/v1/admin/products/{$product->id}/approve");

        $response->assertOk();
        $response->assertJsonPath('data.status', 'published');
        $this->assertDatabaseHas('products', ['id' => $product->id, 'status' => 'published']);
    }

    public function test_a_draft_product_cannot_be_approved_directly(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $product = Product::factory()->draft()->create();

        $response = $this->actingAs($admin, 'sanctum')->postJson("/api/v1/admin/products/{$product->id}/approve");

        $response->assertStatus(422);
    }

    public function test_a_missing_product_returns_a_clean_404_response(): void
    {
        $response = $this->getJson('/api/v1/products/this-slug-does-not-exist');

        $response->assertStatus(404);
        $response->assertExactJson([
            'success' => false,
            'message' => 'The requested resource was not found.',
        ]);
    }

    public function test_a_suspended_sellers_products_disappear_from_public_listings(): void
    {
        $suspendedStore = Store::factory()->create(['status' => StoreStatus::Suspended]);
        Product::factory()->create(['store_id' => $suspendedStore->id, 'name' => 'Suspended Seller Product']);
        Product::factory()->create(['name' => 'Active Seller Product']);

        $response = $this->getJson('/api/v1/products');

        $names = collect($response->json('data.items'))->pluck('name');
        $this->assertFalse($names->contains('Suspended Seller Product'));
        $this->assertTrue($names->contains('Active Seller Product'));
    }

    public function test_a_suspended_seller_cannot_create_a_new_product(): void
    {
        $seller = User::factory()->create(['role' => UserRole::Seller]);
        Store::factory()->create(['user_id' => $seller->id, 'status' => StoreStatus::Suspended]);
        $category = Category::factory()->create();

        $response = $this->actingAs($seller, 'sanctum')->postJson('/api/v1/seller/products', [
            'category_id' => $category->id,
            'name' => 'New Product',
            'description' => 'Should be blocked.',
            'gender' => 'unisex',
            'base_price' => 50,
            'variants' => [['sku' => 'BLOCKED-1', 'price' => 50, 'stock_quantity' => 1]],
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('products', ['name' => 'New Product']);
    }

    public function test_a_suspended_seller_cannot_submit_a_product_for_review(): void
    {
        $seller = User::factory()->create(['role' => UserRole::Seller]);
        $store = Store::factory()->create(['user_id' => $seller->id, 'status' => StoreStatus::Suspended]);
        $product = Product::factory()->draft()->create(['store_id' => $store->id]);

        $response = $this->actingAs($seller, 'sanctum')->postJson("/api/v1/seller/products/{$product->id}/submit-for-review");

        $response->assertStatus(403);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'status' => ProductStatus::Draft->value]);
    }

    public function test_product_filter_by_category_works(): void
    {
        $category = Category::factory()->create();
        $otherCategory = Category::factory()->create();

        Product::factory()->create(['category_id' => $category->id, 'name' => 'In Category']);
        Product::factory()->create(['category_id' => $otherCategory->id, 'name' => 'Not In Category']);

        $response = $this->getJson('/api/v1/products?category_slug='.$category->slug);

        $names = collect($response->json('data.items'))->pluck('name');
        $this->assertTrue($names->contains('In Category'));
        $this->assertFalse($names->contains('Not In Category'));
    }
}
