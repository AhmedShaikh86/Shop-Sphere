<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'brand_id' => ['sometimes', 'nullable', 'integer', 'exists:brands,id'],
            'collection_id' => ['sometimes', 'nullable', 'integer', 'exists:collections,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'material' => ['sometimes', 'nullable', 'string', 'max:255'],
            'fit' => ['sometimes', 'nullable', 'string', 'max:255'],
            'pattern' => ['sometimes', 'nullable', 'string', 'max:255'],
            'season' => ['sometimes', 'nullable', 'string', 'max:255'],
            'care_instructions' => ['sometimes', 'nullable', 'string'],
            'sustainability_info' => ['sometimes', 'nullable', 'string'],
            'gender' => ['required', 'in:women,men,unisex'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'compare_at_price' => ['sometimes', 'nullable', 'numeric', 'min:0'],

            'variants' => ['required', 'array', 'min:1'],
            'variants.*.size' => ['sometimes', 'nullable', 'string', 'max:50'],
            'variants.*.color' => ['sometimes', 'nullable', 'string', 'max:50'],
            'variants.*.sku' => ['required', 'string', 'max:100', 'distinct', 'unique:product_variants,sku'],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.compare_at_price' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'variants.*.stock_quantity' => ['required', 'integer', 'min:0'],
            'variants.*.weight' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'variants.*.image_url' => ['sometimes', 'nullable', 'string', 'max:2048'],

            'images' => ['sometimes', 'array'],
            'images.*.url' => ['required_with:images', 'string', 'max:2048'],
            'images.*.alt_text' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
