<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->isAgent() || $this->user()->isAdmin());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'transaction_type' => 'sometimes|in:rent,sale,for_rent,for_sale',
            'address' => 'sometimes|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'city' => 'sometimes|string',
            'postal_code' => 'sometimes|string|max:10',
            'surface' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:available,rented,sold,reserved,unavailable',
            'type' => 'sometimes|in:apartment,house,villa,office,commercial,land,studio',
            'category_id' => 'sometimes|exists:categories,id',
            'rooms' => 'nullable|integer|min:0',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'features' => 'nullable',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:3072',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
        ];
    }
}
