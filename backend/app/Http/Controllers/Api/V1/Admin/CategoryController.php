<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
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

    public function store(CategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return ApiResponse::success(new CategoryResource($category), 'Category created.', 201);
    }

    public function update(CategoryRequest $request, Category $category): JsonResponse
    {
        $data = $request->validated();

        // A manually-set image has no known attribution, so any credit
        // left over from a previous `images:sync-placements` run would be
        // wrong to keep showing.
        if (array_key_exists('image_url', $data)) {
            $data['photo_credit_name'] = null;
            $data['photo_credit_url'] = null;
        }

        $category->update($data);

        return ApiResponse::success(new CategoryResource($category->fresh()), 'Category updated.');
    }

    public function destroy(Category $category): JsonResponse
    {
        abort_if($category->products()->exists(), 422, 'Cannot delete a category that still has products.');

        $category->delete();

        return ApiResponse::success(null, 'Category deleted.');
    }
}
