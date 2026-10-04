<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CollectionRequest;
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

    public function store(CollectionRequest $request): JsonResponse
    {
        $collection = ProductCollection::create($request->validated());

        return ApiResponse::success(new CollectionResource($collection), 'Collection created.', 201);
    }

    public function update(CollectionRequest $request, ProductCollection $collection): JsonResponse
    {
        $data = $request->validated();

        // A manually-set banner has no known attribution, so any credit
        // left over from a previous `images:sync-placements` run would be
        // wrong to keep showing.
        if (array_key_exists('banner_url', $data)) {
            $data['photo_credit_name'] = null;
            $data['photo_credit_url'] = null;
        }

        $collection->update($data);

        return ApiResponse::success(new CollectionResource($collection->fresh()), 'Collection updated.');
    }

    public function destroy(ProductCollection $collection): JsonResponse
    {
        abort_if($collection->products()->exists(), 422, 'Cannot delete a collection that still has products.');

        $collection->delete();

        return ApiResponse::success(null, 'Collection deleted.');
    }
}
