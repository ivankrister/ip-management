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
        info('Authorizing request', [
            'user_id' => $this->user()->id,
            'user_type' => $this->user()->type,
            'route_name' => $this->route()->getName(),
        ]);
        if ($this->user()->type === 'super_admin') {
            return true;
        }
        if ($this->route()->getName() === 'ip-addresses.update') {
            $ipAddress = $this->route('ip_address');
            if ($ipAddress && $ipAddress->created_by === $this->user()->id) {
                return true;
            }
        }

        return false;
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
                    'type' => $this->user()->type,
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
