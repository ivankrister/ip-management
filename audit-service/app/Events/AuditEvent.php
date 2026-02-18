<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class AuditEvent implements ShouldQueue
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $userId,
        public readonly ?string $sessionId,
        public readonly string $action,
        public readonly string $entityType,
        public readonly ?string $entityId,
        public readonly ?array $before,
        public readonly ?array $after,
        public readonly array $context = []
    ) {}
}
