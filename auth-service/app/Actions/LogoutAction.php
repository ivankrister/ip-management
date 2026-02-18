<?php

declare(strict_types=1);

namespace App\Actions;

use App\Jobs\PublishAuditEvent;

final class LogoutAction
{
    public function handle(): void
    {
        $user = auth()->user();

        auth()->logout();

        // Audit logout
        if ($user) {
            PublishAuditEvent::dispatch(
                userId: $user->id,
                action: 'auth.logout',
                entityType: 'User',
                entityId: (string) $user->id,
                metadata: [
                    'user' => $user->only(['id', 'email', 'name', 'type']),
                ],
                context: [
                    'request_ip' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]
            );
        }
    }
}
