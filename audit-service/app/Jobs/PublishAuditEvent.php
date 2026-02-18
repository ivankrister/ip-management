<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\AuditLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

final class PublishAuditEvent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

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

    public function handle(): void
    {
        // Persist the audit log when the job is processed
        AuditLog::create([
            'user_id' => $this->userId,
            'session_id' => $this->sessionId,
            'action' => $this->action,
            'entity_type' => $this->entityType,
            'entity_id' => $this->entityId,
            'before' => $this->before,
            'after' => $this->after,
            'request_ip' => $this->context['request_ip'] ?? null,
            'user_agent' => $this->context['user_agent'] ?? null,
        ]);
    }
}
