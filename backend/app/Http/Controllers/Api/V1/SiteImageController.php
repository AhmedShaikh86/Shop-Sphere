<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteImageResource;
use App\Http\Responses\ApiResponse;
use App\Models\SiteImage;
use Illuminate\Http\JsonResponse;

class SiteImageController extends Controller
{
    /**
     * Returns homepage-only image slots (hero, editorial section, ...) keyed
     * by placement id, e.g. { "hero": { "url": ..., "photo_credit_name": ... } }.
     * Empty/missing keys mean that placement has no cached photo yet — the
     * frontend falls back to a local gradient rather than erroring.
     */
    public function index(): JsonResponse
    {
        $images = SiteImage::all()
            ->mapWithKeys(fn (SiteImage $image) => [$image->key => new SiteImageResource($image)]);

        // json_encode() can't tell an empty associative array from an empty
        // list, so it always renders `[]` — casting to stdClass forces `{}`
        // here, keeping the response shape ({key: image}) consistent
        // whether or not any placements have been synced yet.
        return ApiResponse::success($images->isEmpty() ? new \stdClass : $images);
    }
}
