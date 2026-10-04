<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SellerIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_sellers_product_list_only_shows_their_own_products(): void
    {
        $sellerA = User::factory()->create(['role' => UserRole::Seller]);
        $storeA = Store::factory()->create(['user_id' => $sellerA->id]);
        Product::factory()->create(['store_id' => $storeA->id, 'name' => 'Seller A Product']);

        $sellerB = User::factory()->create(['role' => UserRole::Seller]);
        $storeB = Store::factory()->create(['user_id' => $sellerB->id]);
        Product::factory()->create(['store_id' => $storeB->id, 'name' => 'Seller B Product']);

        $response = $this->actingAs($sellerA, 'sanctum')->getJson('/api/v1/seller/products');

        $names = collect($response->json('data.items'))->pluck('name');
        $this->assertTrue($names->contains('Seller A Product'));
        $this->assertFalse($names->contains('Seller B Product'));
    }

    public function test_a_seller_cannot_view_another_sellers_product_directly(): void
    {
        $sellerA = User::factory()->create(['role' => UserRole::Seller]);
        Store::factory()->create(['user_id' => $sellerA->id]);

        $sellerB = User::factory()->create(['role' => UserRole::Seller]);
        $storeB = Store::factory()->create(['user_id' => $sellerB->id]);
        $product = Product::factory()->create(['store_id' => $storeB->id]);

        $response = $this->actingAs($sellerA, 'sanctum')->getJson("/api/v1/seller/products/{$product->id}");

        $response->assertStatus(403);
    }

    public function test_a_sellers_coupon_list_only_shows_their_own_coupons(): void
    {
        $sellerA = User::factory()->create(['role' => UserRole::Seller]);
        $storeA = Store::factory()->create(['user_id' => $sellerA->id]);
        Coupon::factory()->create(['store_id' => $storeA->id, 'code' => 'SELLERA']);

        $sellerB = User::factory()->create(['role' => UserRole::Seller]);
        $storeB = Store::factory()->create(['user_id' => $sellerB->id]);
        Coupon::factory()->create(['store_id' => $storeB->id, 'code' => 'SELLERB']);

        $response = $this->actingAs($sellerA, 'sanctum')->getJson('/api/v1/seller/coupons');

        $codes = collect($response->json('data'))->pluck('code');
        $this->assertTrue($codes->contains('SELLERA'));
        $this->assertFalse($codes->contains('SELLERB'));
    }

    public function test_a_seller_cannot_delete_another_sellers_coupon(): void
    {
        $sellerA = User::factory()->create(['role' => UserRole::Seller]);
        Store::factory()->create(['user_id' => $sellerA->id]);

        $sellerB = User::factory()->create(['role' => UserRole::Seller]);
        $storeB = Store::factory()->create(['user_id' => $sellerB->id]);
        $coupon = Coupon::factory()->create(['store_id' => $storeB->id]);

        $response = $this->actingAs($sellerA, 'sanctum')->deleteJson("/api/v1/seller/coupons/{$coupon->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('coupons', ['id' => $coupon->id]);
    }

    public function test_an_admin_cannot_manage_a_sellers_coupon_through_the_admin_endpoint(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $store = Store::factory()->create();
        $coupon = Coupon::factory()->create(['store_id' => $store->id, 'code' => 'SELLERCOUPON', 'value' => 10]);

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/v1/admin/coupons/{$coupon->id}", [
            'code' => 'SELLERCOUPON',
            'type' => 'percentage',
            'value' => 99,
        ]);

        $response->assertStatus(404);
        $this->assertDatabaseHas('coupons', ['id' => $coupon->id, 'value' => 10]);
    }
}
