<?php

declare(strict_types=1);

namespace App\Actions;

use App\Events\AuditEvent;

final class LogoutAction
{
    public function handle(): void
    {
        $userId = auth()->id();

        auth()->logout();

        // Audit logout
        if ($userId) {
            event(new AuditEvent(
                userId: $userId,
                sessionId: null,
                action: 'user.logged_out',
                entityType: 'User',
                entityId: (string) $userId,
                before: null,
                after: null,
                context: [
                    'request_ip' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]
            ));
        }
    }
}
