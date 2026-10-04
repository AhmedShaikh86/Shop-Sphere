<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    private function userWithCartItem(int $stock = 10, int $quantity = 2): array
    {
        $user = User::factory()->create();
        $cart = Cart::create(['user_id' => $user->id]);
        $variant = ProductVariant::factory()->create(['price' => 50, 'stock_quantity' => $stock]);
        $cart->items()->create(['product_variant_id' => $variant->id, 'quantity' => $quantity]);
        $address = Address::factory()->create(['user_id' => $user->id]);

        return [$user, $variant, $address];
    }

    public function test_placing_an_order_creates_the_order_and_commits_inventory(): void
    {
        [$user, $variant, $address] = $this->userWithCartItem(stock: 10, quantity: 2);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/checkout', [
            'shipping_address_id' => $address->id,
            'payment' => ['card_number' => '4242424242424242'],
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.status', 'paid');

        $this->assertDatabaseHas('orders', ['user_id' => $user->id, 'status' => 'paid']);
        $variant->refresh();
        $this->assertEquals(8, $variant->stock_quantity);
        $this->assertEquals(0, $variant->reserved_quantity);

        // The cart is emptied once the order is placed.
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_a_declined_payment_rolls_back_the_entire_order(): void
    {
        [$user, $variant, $address] = $this->userWithCartItem(stock: 10, quantity: 2);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/checkout', [
            'shipping_address_id' => $address->id,
            // The demo gateway declines any card ending in 0002.
            'payment' => ['card_number' => '4000000000000002'],
        ]);

        $response->assertStatus(402);
        $this->assertDatabaseCount('orders', 0);

        $variant->refresh();
        $this->assertEquals(10, $variant->stock_quantity);
        $this->assertEquals(0, $variant->reserved_quantity);
        $this->assertDatabaseCount('cart_items', 1);
    }

    public function test_checkout_fails_when_requested_quantity_exceeds_stock(): void
    {
        [$user, $variant, $address] = $this->userWithCartItem(stock: 1, quantity: 1);

        // Someone else buys the last unit between add-to-cart and checkout.
        $variant->update(['stock_quantity' => 0]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/checkout', [
            'shipping_address_id' => $address->id,
            'payment' => ['card_number' => '4242424242424242'],
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_a_valid_coupon_reduces_the_order_total(): void
    {
        [$user, $variant, $address] = $this->userWithCartItem(stock: 10, quantity: 2);
        $coupon = Coupon::factory()->create(['code' => 'SAVE10', 'value' => 10]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/checkout', [
            'shipping_address_id' => $address->id,
            'coupon_code' => 'SAVE10',
            'payment' => ['card_number' => '4242424242424242'],
        ]);

        $response->assertCreated();
        // Subtotal is 100 (2 x 50), 10% off = 10 discount.
        $response->assertJsonPath('data.discount_amount', '10.00');
        $this->assertDatabaseHas('coupon_usages', ['coupon_id' => $coupon->id, 'user_id' => $user->id]);
    }

    public function test_checkout_fails_with_an_empty_cart(): void
    {
        $user = User::factory()->create();
        Cart::create(['user_id' => $user->id]);
        $address = Address::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/checkout', [
            'shipping_address_id' => $address->id,
            'payment' => ['card_number' => '4242424242424242'],
        ]);

        $response->assertStatus(422);
    }
}
