<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRentalRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'property_id' => 'required|exists:properties,id',
            'type' => 'required|in:rent,sale',
            'start_date' => 'required_if:type,rent|nullable|date|after_or_equal:today',
            'end_date' => 'required_if:type,rent|nullable|date|after:start_date',
            'message' => 'nullable|string|max:1000',
        ];
    }
}
