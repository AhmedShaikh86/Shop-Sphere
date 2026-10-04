<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Responses\ApiResponse;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(CategoryResource::collection(Category::orderBy('name')->get()));
    }

    public function show(Category $category): JsonResponse
    {
        return ApiResponse::success(new CategoryResource($category));
    }
}
