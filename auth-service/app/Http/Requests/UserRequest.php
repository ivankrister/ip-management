<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UserRequest extends FormRequest
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
            'data.attributes.name' => ['required', 'string', 'max:50'],
            'data.attributes.email' => ['required', 'string', 'email', 'max:100', 'unique:users,email,'.$this->route('user')],
            'data.attributes.password' => ['required', 'string', 'min:8', 'confirmed'],
            'data.attributes.role' => ['required', 'string', 'in:super_admin,user'],
        ];
    }

    public function messages(): array
    {
        return [
            'data.attributes.name.required' => 'The name is required.',
            'data.attributes.name.string' => 'The name must be a string.',
            'data.attributes.name.max' => 'The name may not be greater than 50 characters.',
            'data.attributes.email.required' => 'The email is required.',
            'data.attributes.email.string' => 'The email must be a string.',
            'data.attributes.email.email' => 'The email must be a valid email address.',
            'data.attributes.email.max' => 'The email may not be greater than 100 characters.',
            'data.attributes.email.unique' => 'The email has already been taken.',
            'data.attributes.password.required' => 'The password is required.',
            'data.attributes.password.string' => 'The password must be a string.',
            'data.attributes.password.min' => 'The password must be at least 8 characters.',
            'data.attributes.password.confirmed' => 'The password confirmation does not match.',
            'data.attributes.role.required' => 'The user role is required.',
            'data.attributes.role.string' => 'The user role must be a string.',
            'data.attributes.role.in' => 'The user role must be either super_admin or user.',
        ];
    }

    public function storeData(): array
    {
        return [
            'name' => $this->input('data.attributes.name'),
            'email' => $this->input('data.attributes.email'),
            'password' => $this->input('data.attributes.password'),
            'role' => $this->input('data.attributes.role'),
        ];
    }
}
