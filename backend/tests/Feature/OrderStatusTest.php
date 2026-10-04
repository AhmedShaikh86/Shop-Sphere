<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Address;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStatusTest extends TestCase
{
    use RefreshDatabase;

    private function createOrder(OrderStatus $status): Order
    {
        $user = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $user->id]);
        $variant = ProductVariant::factory()->create();

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'SS-TEST-'.uniqid(),
            'status' => $status,
            'subtotal' => 50,
            'total' => 50,
            'shipping_address_id' => $address->id,
        ]);

        $order->items()->create([
            'store_id' => $variant->product->store_id,
            'product_variant_id' => $variant->id,
            'product_name' => $variant->product->name,
            'unit_price' => $variant->price,
            'quantity' => 1,
            'total' => $variant->price,
        ]);

        return $order;
    }

    public function test_an_invalid_status_transition_is_rejected_with_a_clean_error(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $order = $this->createOrder(OrderStatus::Processing);

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/v1/admin/orders/{$order->id}/status", [
            'status' => 'delivered',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('success', false);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => OrderStatus::Processing->value]);
    }

    public function test_a_valid_status_transition_succeeds(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $order = $this->createOrder(OrderStatus::Processing);

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/v1/admin/orders/{$order->id}/status", [
            'status' => 'packed',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => OrderStatus::Packed->value]);
    }

    public function test_cancelling_a_paid_order_releases_its_reserved_stock(): void
    {
        $order = $this->createOrder(OrderStatus::Paid);
        $variant = $order->items->first()->productVariant;
        $variant->update(['stock_quantity' => 3]);

        $response = $this->actingAs($order->user, 'sanctum')->postJson("/api/v1/orders/{$order->id}/cancel");

        $response->assertOk();
        $this->assertEquals(4, $variant->fresh()->stock_quantity);
    }
}
