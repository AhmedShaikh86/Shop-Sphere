<?php

namespace App\Http\Requests\Seller;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'logo_url' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'banner_url' => ['sometimes', 'nullable', 'string', 'max:2048'],
        ];
    }
}
