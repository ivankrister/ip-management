<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class IpAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->user()->role === 'super_admin') {
            return true;
        }
        if ($this->route()->getName() === 'ip-addresses.update') {
            $ipAddress = $this->route('ip_address');
            if ($ipAddress && $ipAddress->created_by === $this->user()->id) {
                return true;
            }
        }

        return $this->route()->getName() === 'ip-addresses.store';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'data.attributes.value' => ['required', 'ip', 'max:45', Rule::unique('ip_addresses', 'value')->ignore($this->route('ip_address'))],
            'data.attributes.label' => ['required', 'string', 'min:1', 'max:50'],
            'data.attributes.comment' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'data.attributes.value.required' => 'The IP address value is required.',
            'data.attributes.value.ip' => 'The IP address must be a valid IP address.',
            'data.attributes.value.max' => 'The IP address value may not be greater than 45 characters.',
            'data.attributes.value.unique' => 'The IP address value must be unique.',
            'data.attributes.label.required' => 'The label is required.',
            'data.attributes.label.string' => 'The label must be a string.',
            'data.attributes.label.min' => 'The label must be at least 1 character.',
            'data.attributes.label.max' => 'The label may not be greater than 50 characters.',
            'data.attributes.comment.string' => 'The comment must be a string.',
        ];
    }

    public function storeData(): array
    {

        return [
            'value' => $this->input('data.attributes.value'),
            'label' => $this->input('data.attributes.label'),
            'comment' => $this->input('data.attributes.comment'),
            'created_by' => $this->user()->id,
            'metadata' => [
                'user' => [
                    'id' => (string) $this->user()->id,
                    'name' => $this->user()->name,
                    'email' => $this->user()->email,
                    'role' => $this->user()->role,
                ],
            ],
        ];
    }

    public function updateData(): array
    {
        return [
            'value' => $this->input('data.attributes.value'),
            'label' => $this->input('data.attributes.label'),
            'comment' => $this->input('data.attributes.comment'),
        ];
    }
}
