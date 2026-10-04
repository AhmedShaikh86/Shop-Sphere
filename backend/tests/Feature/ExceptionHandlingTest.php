<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Address;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Plain abort($code, $message) calls (used throughout the controllers for
 * simple ownership/state checks) are converted into a Symfony HttpException
 * that bypasses every render() callback except the ones registered for its
 * exact type in bootstrap/app.php. Regression coverage for a bug where only
 * ValidationException/AuthenticationException/AuthorizationException/404s
 * had a handler, so every other abort() (403s, 422s from abort_if elsewhere
 * in the app) fell through to Laravel's default renderer and leaked a full
 * debug stack trace instead of the API's usual { success, message } shape.
 */
class ExceptionHandlingTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_plain_403_abort_renders_the_apis_normal_json_envelope(): void
    {
        $owner = User::factory()->create();
        $someoneElse = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($someoneElse, 'sanctum')->deleteJson("/api/v1/addresses/{$address->id}");

        $response->assertStatus(403);
        $response->assertExactJson([
            'success' => false,
            'message' => 'This address does not belong to you.',
        ]);
    }

    public function test_a_plain_422_abort_renders_the_apis_normal_json_envelope(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $product = Product::factory()->draft()->create();

        $response = $this->actingAs($admin, 'sanctum')->postJson("/api/v1/admin/products/{$product->id}/approve");

        $response->assertStatus(422);
        $response->assertExactJson([
            'success' => false,
            'message' => 'Only products pending review can be approved.',
        ]);
    }
}
