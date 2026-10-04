<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

/**
 * Local disk storage for product/store images, used automatically when no
 * Cloudinary/S3 credentials are configured (see README "Image setup").
 */
class ImageUploadController extends Controller
{
    public function store(UploadImageRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('uploads', $filename, 'public');

        return ApiResponse::success([
            'url' => asset('storage/'.$path),
        ], 'Image uploaded.', 201);
    }
}
