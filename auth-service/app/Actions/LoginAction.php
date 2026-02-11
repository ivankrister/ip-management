<?php

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginAction
{
    public function handle(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || Hash::check($data['password'], $user->password) == false) {
            throw new \Exception('Invalid credentials');
        }

        $token = auth()->login($user);

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $user,
        ];
    }
}
