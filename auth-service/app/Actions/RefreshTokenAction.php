<?php

declare(strict_types=1);

namespace App\Actions;

use Exception;

final class RefreshTokenAction
{
    public function handle(): array
    {

        $user = auth()->user();
        if (! $user) {
            throw new Exception('User not authenticated');
        }
        $token = auth()->refresh();

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $user,
        ];
    }
}
