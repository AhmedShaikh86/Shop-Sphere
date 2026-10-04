<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;

class ActivityLogController extends Controller
{
    public function index(): JsonResponse
    {
        $logs = ActivityLog::with('user')->latest()->paginate(30);

        return ApiResponse::success([
            'items' => ActivityLogResource::collection($logs->items()),
            'meta' => ['current_page' => $logs->currentPage(), 'last_page' => $logs->lastPage()],
        ]);
    }
}
