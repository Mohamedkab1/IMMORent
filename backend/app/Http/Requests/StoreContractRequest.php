<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContractRequest extends FormRequest
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
            'rental_request_id' => 'required|exists:rental_requests,id',
            'contract_type' => 'required|in:rent,sale',
            'start_date' => 'required_if:contract_type,rent|nullable|date',
            'end_date' => 'required_if:contract_type,rent|nullable|date|after:start_date',
            'sale_date' => 'required_if:contract_type,sale|nullable|date',
            'monthly_rent' => 'required_if:contract_type,rent|nullable|numeric|min:0',
            'sale_price' => 'required_if:contract_type,sale|nullable|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'charges' => 'nullable|numeric|min:0',
        ];
    }
}
