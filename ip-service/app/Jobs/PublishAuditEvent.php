<?php

declare(strict_types=1);

namespace App\Jobs;

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
        public readonly string $action,
        public readonly string $entityType,
        public readonly ?string $entityId,
        public readonly array $metadata = [],
        public readonly array $context = []
    ) {}

    public function handle(): void
    {
        // TODO: Implement audit event publishing logic
        // This could involve sending to a message queue, HTTP API, etc.
    }
}
