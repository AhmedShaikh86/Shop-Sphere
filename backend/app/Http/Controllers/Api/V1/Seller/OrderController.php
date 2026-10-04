<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Http\Responses\ApiResponse;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    public function index(Request $request): JsonResponse
    {
        $storeId = $request->user()->store->id;

        $orders = Order::whereHas('items', fn ($q) => $q->where('store_id', $storeId))
            ->with(['items' => fn ($q) => $q->where('store_id', $storeId)])
            ->latest()
            ->paginate(15);

        return ApiResponse::success([
            'items' => OrderResource::collection($orders->items()),
            'meta' => ['current_page' => $orders->currentPage(), 'last_page' => $orders->lastPage(), 'total' => $orders->total()],
        ]);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        $this->authorize('view', $order);

        return ApiResponse::success(new OrderResource(
            $order->load(['items', 'payment', 'shippingAddress'])
        ));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $this->authorize('view', $order);

        $order = $this->orderService->transitionTo($order, OrderStatus::from($request->validated('status')), $request->user());

        return ApiResponse::success(new OrderResource($order), 'Order status updated.');
    }
}
