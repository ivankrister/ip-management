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
            // Audit failed login attempt
            if ($user) {
                PublishAuditEvent::dispatch(
                    userId: $user->id,
                    sessionId: null,
                    action: 'auth.login_failed',
                    entityType: 'User',
                    entityId: (string) $user->id,
                    before: null,
                    after: null,
                    context: [
                        'request_ip' => request()->ip(),
                        'user_agent' => request()->userAgent(),
                    ]
                );
            }
            throw new Exception('Invalid credentials');
        }

        $token = auth()->login($user);

        PublishAuditEvent::dispatch(
            userId: $user->id,
            sessionId: auth()->getSession()->getId(),
            action: 'auth.login',
            entityType: 'User',
            entityId: (string) $user->id,
            before: null,
            after: null,
            context: [
                'request_ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]
        );

        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $user,
        ];
    }
}
