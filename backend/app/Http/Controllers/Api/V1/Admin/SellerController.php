<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\StoreStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Http\Responses\ApiResponse;
use App\Models\Store;
use App\Notifications\SellerApprovedNotification;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    public function __construct(private readonly ActivityLogger $activityLogger) {}

    public function index(Request $request): JsonResponse
    {
        $stores = Store::query()
            ->with('user')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->withCount('products')
            ->latest()
            ->paginate(20);

        return ApiResponse::success([
            'items' => StoreResource::collection($stores->items()),
            'meta' => ['current_page' => $stores->currentPage(), 'last_page' => $stores->lastPage(), 'total' => $stores->total()],
        ]);
    }

    public function approve(Request $request, Store $store): JsonResponse
    {
        $store->update(['status' => StoreStatus::Approved]);
        $this->activityLogger->log($request->user(), 'store.approved', $store, "Store \"{$store->name}\" approved.");
        $store->user->notify(new SellerApprovedNotification($store));

        return ApiResponse::success(new StoreResource($store), 'Store approved.');
    }

    public function suspend(Request $request, Store $store): JsonResponse
    {
        $store->update(['status' => StoreStatus::Suspended]);
        $this->activityLogger->log($request->user(), 'store.suspended', $store, "Store \"{$store->name}\" suspended.");

        return ApiResponse::success(new StoreResource($store), 'Store suspended.');
    }
}
