<?php

declare(strict_types=1);

namespace App\Http\Controllers\V1;

use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;

final class AuditLogController
{
    public function index(): AnonymousResourceCollection
    {
        $auditLogs = QueryBuilder::for(AuditLog::class)
            ->allowedFilters(['user_id', 'action', 'entity_type'])
            ->allowedSorts(['created_at'])
            ->paginate()
            ->appends(request()->query());

        return AuditLogResource::collection($auditLogs);
    }

    public function show(AuditLog $auditLog): AuditLogResource
    {
        return new AuditLogResource($auditLog);
    }
}
