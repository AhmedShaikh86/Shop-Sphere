<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use App\Http\Responses\ApiResponse;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;

class BrandController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(BrandResource::collection(Brand::orderBy('name')->get()));
    }

    public function show(Brand $brand): JsonResponse
    {
        return ApiResponse::success(new BrandResource($brand));
    }
}
