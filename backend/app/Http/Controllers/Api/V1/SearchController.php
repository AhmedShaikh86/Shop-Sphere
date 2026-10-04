<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductCardResource;
use App\Http\Responses\ApiResponse;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $keyword = trim((string) $request->query('q', ''));

        if ($keyword === '') {
            return ApiResponse::success(['products' => [], 'categories' => [], 'brands' => []]);
        }

        $products = Product::query()
            ->published()
            ->filter(['keyword' => $keyword])
            ->with(['brand', 'images', 'variants'])
            ->limit(8)
            ->get();

        $categories = Category::where('name', 'like', "%{$keyword}%")->limit(5)->get();
        $brands = Brand::where('name', 'like', "%{$keyword}%")->limit(5)->get();

        return ApiResponse::success([
            'products' => ProductCardResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'brands' => BrandResource::collection($brands),
        ]);
    }
}
