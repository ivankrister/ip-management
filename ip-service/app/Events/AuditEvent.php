<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class AuditEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $userId,
        public readonly string $action,
        public readonly string $entityType,
        public readonly ?string $entityId = null,
        public readonly ?array $before = null,
        public readonly ?array $after = null,
        public readonly ?string $sessionId = null,
        public readonly ?string $requestIp = null,
        public readonly ?string $userAgent = null,
    ) {}

    /**
     * Create and dispatch an audit event
     */
    public static function dispatch(
        int $userId,
        string $action,
        string $entityType,
        ?string $entityId = null,
        ?array $before = null,
        ?array $after = null,
    ): void {
        event(new self(
            userId: $userId,
            action: $action,
            entityType: $entityType,
            entityId: $entityId,
            before: $before,
            after: $after,
            sessionId: request()->header('X-Session-Id'),
            requestIp: request()->ip(),
            userAgent: request()->userAgent(),
        ));
    }
}
