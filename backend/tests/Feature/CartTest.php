<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_add_an_item_to_their_cart(): void
    {
        $user = User::factory()->create();
        Cart::create(['user_id' => $user->id]);
        $variant = ProductVariant::factory()->create(['stock_quantity' => 10]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/cart', [
            'product_variant_id' => $variant->id,
            'quantity' => 2,
        ]);

        $response->assertOk();
        $this->assertCount(1, $response->json('data.items'));
        $this->assertEquals(2, $response->json('data.items.0.quantity'));
    }

    public function test_a_user_cannot_add_more_than_available_stock(): void
    {
        $user = User::factory()->create();
        Cart::create(['user_id' => $user->id]);
        $variant = ProductVariant::factory()->create(['stock_quantity' => 2]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/cart', [
            'product_variant_id' => $variant->id,
            'quantity' => 5,
        ]);

        $response->assertStatus(422);
    }

    public function test_a_user_can_update_cart_item_quantity(): void
    {
        $user = User::factory()->create();
        $cart = Cart::create(['user_id' => $user->id]);
        $variant = ProductVariant::factory()->create(['stock_quantity' => 10]);
        $item = $cart->items()->create(['product_variant_id' => $variant->id, 'quantity' => 1]);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/v1/cart/{$item->id}", ['quantity' => 3]);

        $response->assertOk();
        $this->assertEquals(3, $response->json('data.items.0.quantity'));
    }

    public function test_a_user_can_remove_a_cart_item(): void
    {
        $user = User::factory()->create();
        $cart = Cart::create(['user_id' => $user->id]);
        $variant = ProductVariant::factory()->create();
        $item = $cart->items()->create(['product_variant_id' => $variant->id, 'quantity' => 1]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson("/api/v1/cart/{$item->id}");

        $response->assertOk();
        $this->assertCount(0, $response->json('data.items'));
    }
}
