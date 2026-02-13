<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class IpAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'data.attributes.value' => ['required', 'ip', 'max:45', 'unique:ip_addresses,value'],
            'data.attributes.label' => ['required', 'string', 'min:1', 'max:50'],
            'data.attributes.comment' => ['nullable', 'string'],
        ];
    }
}
