<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
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
        $orders = Order::query()
            ->with('user')
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(20);

        return ApiResponse::success([
            'items' => OrderResource::collection($orders->items()),
            'meta' => ['current_page' => $orders->currentPage(), 'last_page' => $orders->lastPage(), 'total' => $orders->total()],
        ]);
    }

    public function show(Order $order): JsonResponse
    {
        return ApiResponse::success(new OrderResource($order->load(['items', 'payment', 'shippingAddress', 'billingAddress', 'user'])));
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate(['status' => ['required', 'in:processing,packed,shipped,out_for_delivery,delivered,cancelled,refunded']]);

        $order = $this->orderService->transitionTo($order, OrderStatus::from($request->string('status')->value()), $request->user());

        return ApiResponse::success(new OrderResource($order), 'Order status updated.');
    }
}
