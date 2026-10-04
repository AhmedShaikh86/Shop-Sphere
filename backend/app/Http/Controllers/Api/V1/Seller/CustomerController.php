<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Customers who have bought from this seller's store — never other sellers' buyers.
     */
    public function index(Request $request): JsonResponse
    {
        $storeId = $request->user()->store->id;

        $customers = User::query()
            ->whereHas('orders.items', fn ($q) => $q->where('store_id', $storeId))
            ->withCount(['orders as orders_from_store_count' => fn ($q) => $q->whereHas(
                'items', fn ($sub) => $sub->where('store_id', $storeId)
            )])
            ->paginate(20);

        return ApiResponse::success([
            'items' => UserResource::collection($customers->items()),
            'meta' => ['current_page' => $customers->currentPage(), 'last_page' => $customers->lastPage()],
        ]);
    }
}
