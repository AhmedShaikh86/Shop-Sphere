<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class CouponTest extends TestCase
{
    use RefreshDatabase;

    private function checkout(User $user, string $couponCode): TestResponse
    {
        $cart = Cart::create(['user_id' => $user->id]);
        $variant = ProductVariant::factory()->create(['price' => 100, 'stock_quantity' => 10]);
        $cart->items()->create(['product_variant_id' => $variant->id, 'quantity' => 1]);
        $address = Address::factory()->create(['user_id' => $user->id]);

        return $this->actingAs($user, 'sanctum')->postJson('/api/v1/checkout', [
            'shipping_address_id' => $address->id,
            'coupon_code' => $couponCode,
            'payment' => ['card_number' => '4242424242424242'],
        ]);
    }

    public function test_an_inactive_coupon_is_rejected(): void
    {
        Coupon::factory()->create(['code' => 'OFF', 'is_active' => false]);
        $user = User::factory()->create();

        $response = $this->checkout($user, 'OFF');

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'This coupon is no longer active.');
    }

    public function test_an_expired_coupon_is_rejected(): void
    {
        Coupon::factory()->create(['code' => 'EXPIRED', 'expires_at' => now()->subDay()]);
        $user = User::factory()->create();

        $response = $this->checkout($user, 'EXPIRED');

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'This coupon has expired.');
    }

    public function test_a_coupon_below_the_minimum_order_amount_is_rejected(): void
    {
        Coupon::factory()->create(['code' => 'BIGORDER', 'min_order_amount' => 500]);
        $user = User::factory()->create();

        $response = $this->checkout($user, 'BIGORDER');

        $response->assertStatus(422);
    }

    public function test_a_coupon_at_its_usage_limit_is_rejected(): void
    {
        $coupon = Coupon::factory()->create(['code' => 'LIMITED', 'max_uses' => 1, 'used_count' => 1]);
        $user = User::factory()->create();

        $response = $this->checkout($user, 'LIMITED');

        $response->assertStatus(422);
    }

    public function test_a_user_cannot_reuse_a_coupon_past_their_personal_limit(): void
    {
        $user = User::factory()->create();
        $coupon = Coupon::factory()->create(['code' => 'ONCE', 'max_uses_per_user' => 1]);
        CouponUsage::create(['coupon_id' => $coupon->id, 'user_id' => $user->id, 'order_id' => $this->fakeOrder($user)->id]);

        $response = $this->checkout($user, 'ONCE');

        $response->assertStatus(422);
    }

    public function test_a_nonexistent_coupon_code_is_rejected(): void
    {
        $user = User::factory()->create();

        $response = $this->checkout($user, 'DOES-NOT-EXIST');

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'This coupon code does not exist.');
    }

    private function fakeOrder(User $user): Order
    {
        $address = Address::factory()->create(['user_id' => $user->id]);

        return Order::create([
            'user_id' => $user->id,
            'order_number' => 'SS-TEST-'.uniqid(),
            'status' => 'paid',
            'subtotal' => 10,
            'total' => 10,
            'shipping_address_id' => $address->id,
        ]);
    }
}
