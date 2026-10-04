<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Responses\ApiResponse;
use App\Models\Order;
use App\Models\User;
use App\Notifications\ReturnRequestedNotification;
use App\Services\ActivityLogger;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderService $orderService,
        private readonly ActivityLogger $activityLogger,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()->with(['items'])->latest()->paginate(10);

        return ApiResponse::success([
            'items' => OrderResource::collection($orders->items()),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        $this->authorize('view', $order);

        return ApiResponse::success(new OrderResource(
            $order->load(['items', 'payment', 'shippingAddress', 'billingAddress'])
        ));
    }

    public function cancel(Request $request, Order $order): JsonResponse
    {
        $this->authorize('view', $order);
        abort_if($order->user_id !== $request->user()->id, 403, 'You can only cancel your own orders.');

        $order = $this->orderService->transitionTo($order, OrderStatus::Cancelled, $request->user());

        return ApiResponse::success(new OrderResource($order), 'Order cancelled.');
    }

    /**
     * Logs a return request against a delivered order and alerts admins.
     * This is intentionally lightweight architecture (no RMA workflow or
     * automatic refund) rather than a full returns management system.
     */
    public function requestReturn(Request $request, Order $order): JsonResponse
    {
        abort_if($order->user_id !== $request->user()->id, 403, 'You can only request a return for your own orders.');
        abort_unless($order->status === OrderStatus::Delivered, 422, 'Only delivered orders are eligible for a return.');

        $data = $request->validate(['reason' => ['required', 'string', 'max:500']]);

        $this->activityLogger->log(
            $request->user(),
            'order.return_requested',
            $order,
            "Return requested for order {$order->order_number}: {$data['reason']}",
        );

        User::where('role', UserRole::Admin)->get()
            ->each(fn ($admin) => $admin->notify(new ReturnRequestedNotification($order, $data['reason'])));

        return ApiResponse::success(null, 'Your return request has been submitted. Our team will follow up by email.');
    }
}
