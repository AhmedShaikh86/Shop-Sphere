<?php

namespace Tests\Feature;

use App\Enums\StoreStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPermissionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admins_can_create_categories(): void
    {
        $customer = User::factory()->create(['role' => UserRole::Customer]);

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/admin/categories', [
            'name' => 'New Category',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('categories', ['name' => 'New Category']);
    }

    public function test_an_admin_can_create_a_category(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/categories', [
            'name' => 'Outerwear',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('categories', ['name' => 'Outerwear', 'slug' => 'outerwear']);
    }

    public function test_a_category_with_products_cannot_be_deleted(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $category = Category::factory()->create();
        Product::factory()->create(['category_id' => $category->id]);

        $response = $this->actingAs($admin, 'sanctum')->deleteJson("/api/v1/admin/categories/{$category->id}");

        $response->assertStatus(422);
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_an_admin_can_approve_a_pending_seller(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $store = Store::factory()->pending()->create();

        $response = $this->actingAs($admin, 'sanctum')->postJson("/api/v1/admin/sellers/{$store->id}/approve");

        $response->assertOk();
        $this->assertDatabaseHas('stores', ['id' => $store->id, 'status' => StoreStatus::Approved->value]);
    }

    public function test_a_seller_cannot_approve_stores(): void
    {
        $seller = User::factory()->create(['role' => UserRole::Seller]);
        $store = Store::factory()->pending()->create();

        $response = $this->actingAs($seller, 'sanctum')->postJson("/api/v1/admin/sellers/{$store->id}/approve");

        $response->assertStatus(403);
    }
}
