<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()->notifications()->paginate(15);

        return ApiResponse::success([
            'items' => NotificationResource::collection($notifications->items()),
            'unread_count' => $request->user()->unreadNotifications()->count(),
            'meta' => ['current_page' => $notifications->currentPage(), 'last_page' => $notifications->lastPage()],
        ]);
    }

    public function markAsRead(Request $request, string $notification): JsonResponse
    {
        $request->user()->notifications()->where('id', $notification)->first()?->markAsRead();

        return ApiResponse::success(null, 'Notification marked as read.');
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return ApiResponse::success(null, 'All notifications marked as read.');
    }
}
