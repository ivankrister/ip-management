<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\AuditEvent;
use App\Models\AuditLog;

final class PersistAuditLog
{
    /**
     * Create the event listener.
     */
    public function __construct() {}

    /**
     * Handle the event.
     */
    public function handle(AuditEvent $event): void
    {
        AuditLog::create([
            'user_id' => $event->userId,
            'session_id' => $event->sessionId,
            'action' => $event->action,
            'entity_type' => $event->entityType,
            'entity_id' => $event->entityId,
            'before' => $event->before,
            'after' => $event->after,
            'request_ip' => $event->context['request_ip'] ?? null,
            'user_agent' => $event->context['user_agent'] ?? null,
        ]);
    }
}
