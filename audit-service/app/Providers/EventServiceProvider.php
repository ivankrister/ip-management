<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\AuditEvent;
use App\Listeners\PersistAuditLog;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

final class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        AuditEvent::class => [
            PersistAuditLog::class,
        ],
    ];

    public function boot(): void
    {
        parent::boot();
    }
}
