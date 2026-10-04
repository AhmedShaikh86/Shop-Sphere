<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BrandRequest;
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

    public function store(BrandRequest $request): JsonResponse
    {
        $brand = Brand::create($request->validated());

        return ApiResponse::success(new BrandResource($brand), 'Brand created.', 201);
    }

    public function update(BrandRequest $request, Brand $brand): JsonResponse
    {
        $brand->update($request->validated());

        return ApiResponse::success(new BrandResource($brand->fresh()), 'Brand updated.');
    }

    public function destroy(Brand $brand): JsonResponse
    {
        abort_if($brand->products()->exists(), 422, 'Cannot delete a brand that still has products.');

        $brand->delete();

        return ApiResponse::success(null, 'Brand deleted.');
    }
}
