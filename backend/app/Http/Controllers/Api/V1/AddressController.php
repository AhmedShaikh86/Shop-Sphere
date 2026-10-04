<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\AddressRequest;
use App\Http\Resources\AddressResource;
use App\Http\Responses\ApiResponse;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()->addresses()->orderByDesc('is_default')->get();

        return ApiResponse::success(AddressResource::collection($addresses));
    }

    public function store(AddressRequest $request): JsonResponse
    {
        $address = DB::transaction(function () use ($request) {
            $data = $request->validated();

            if ($data['is_default'] ?? false) {
                $request->user()->addresses()->update(['is_default' => false]);
            }

            return $request->user()->addresses()->create($data);
        });

        return ApiResponse::success(new AddressResource($address), 'Address added successfully.', 201);
    }

    public function update(AddressRequest $request, Address $address): JsonResponse
    {
        abort_if($address->user_id !== $request->user()->id, 403, 'This address does not belong to you.');

        $data = $request->validated();

        DB::transaction(function () use ($request, $address, $data) {
            if ($data['is_default'] ?? false) {
                $request->user()->addresses()->update(['is_default' => false]);
            }

            $address->update($data);
        });

        return ApiResponse::success(new AddressResource($address->fresh()), 'Address updated successfully.');
    }

    public function destroy(Request $request, Address $address): JsonResponse
    {
        abort_if($address->user_id !== $request->user()->id, 403, 'This address does not belong to you.');

        $address->delete();

        return ApiResponse::success(null, 'Address removed successfully.');
    }
}
