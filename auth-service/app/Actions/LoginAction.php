<?php

declare(strict_types=1);

namespace App\Actions;

use App\Jobs\PublishAuditEvent;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;

final class LoginAction
{
    public function handle(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || Hash::check($data['password'], $user->password) === false) {

            throw new Exception('Invalid credentials');
        }

        $token = auth()->login($user);

        PublishAuditEvent::dispatch(
            userId: $user->id,
            action: 'auth.login',
            entityType: 'User',
            entityId: (string) $user->id,
            metadata: [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'user_type' => $user->type->value,
                ],
            ],
            context: [
                'request_ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]
        );

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 5,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'user_type' => $user->type->value,
            ],
        ];
    }
}
