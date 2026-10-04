<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->where('role', UserRole::Customer)
            ->when($request->query('search'), fn ($q, $search) => $q->where(
                fn ($sub) => $sub->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")
            ))
            ->withCount('orders')
            ->latest()
            ->paginate(20);

        return ApiResponse::success([
            'items' => UserResource::collection($users->items()),
            'meta' => ['current_page' => $users->currentPage(), 'last_page' => $users->lastPage(), 'total' => $users->total()],
        ]);
    }

    public function show(User $user): JsonResponse
    {
        return ApiResponse::success(new UserResource($user->load('orders')));
    }
}
