<?php

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customers_cannot_access_seller_routes(): void
    {
        $customer = User::factory()->create(['role' => UserRole::Customer]);

        $response = $this->actingAs($customer, 'sanctum')->getJson('/api/v1/seller/dashboard');

        $response->assertStatus(403);
    }

    public function test_customers_cannot_access_admin_routes(): void
    {
        $customer = User::factory()->create(['role' => UserRole::Customer]);

        $response = $this->actingAs($customer, 'sanctum')->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_sellers_cannot_access_admin_routes(): void
    {
        $seller = User::factory()->create(['role' => UserRole::Seller]);

        $response = $this->actingAs($seller, 'sanctum')->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_admins_can_access_admin_routes(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/admin/dashboard');

        $response->assertOk();
    }
}
