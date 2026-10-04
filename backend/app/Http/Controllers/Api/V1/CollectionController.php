<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CollectionResource;
use App\Http\Responses\ApiResponse;
use App\Models\Collection as ProductCollection;
use Illuminate\Http\JsonResponse;

class CollectionController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(CollectionResource::collection(ProductCollection::orderBy('name')->get()));
    }

    public function show(ProductCollection $collection): JsonResponse
    {
        return ApiResponse::success(new CollectionResource($collection));
    }
}
