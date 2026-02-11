<?php

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginAction
{
    public function handle(array $data): User
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || Hash::check($data['password'], $user->password) == false) {
            throw new \Exception('Invalid credentials');
        }

        return $user;
    }
}
