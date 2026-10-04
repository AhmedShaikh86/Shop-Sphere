<?php

namespace App\Http\Controllers\Api\V1\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\UpdateStoreRequest;
use App\Http\Resources\StoreResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return ApiResponse::success(new StoreResource($request->user()->store));
    }

    public function update(UpdateStoreRequest $request): JsonResponse
    {
        $store = $request->user()->store;
        $this->authorize('manage', $store);

        $store->update($request->validated());

        return ApiResponse::success(new StoreResource($store->fresh()), 'Store profile updated.');
    }
}
