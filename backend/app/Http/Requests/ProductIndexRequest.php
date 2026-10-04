<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'keyword' => ['sometimes', 'string', 'max:255'],
            'category_slug' => ['sometimes', 'string'],
            'brand_slug' => ['sometimes', 'string'],
            'collection_slug' => ['sometimes', 'string'],
            'gender' => ['sometimes', 'in:women,men,unisex'],
            'min_price' => ['sometimes', 'numeric', 'min:0'],
            'max_price' => ['sometimes', 'numeric', 'min:0'],
            'min_rating' => ['sometimes', 'numeric', 'min:0', 'max:5'],
            'on_sale' => ['sometimes', 'boolean'],
            'size' => ['sometimes', 'string'],
            'color' => ['sometimes', 'string'],
            'in_stock' => ['sometimes', 'boolean'],
            'sort' => ['sometimes', 'in:newest,price_asc,price_desc,rating'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:60'],
        ];
    }
}
