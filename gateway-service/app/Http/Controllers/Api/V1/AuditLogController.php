<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\GatewayController;
use App\Services\AuditLogServiceClient;

final class AuditLogController extends GatewayController
{
    public function __construct(
        private AuditLogServiceClient $auditLogService
    ) {}

    public function index()
    {

        return $this->proxyRequest(function () {
            return $this->auditLogService->index(request()->query());
        });
    }

    public function show($id)
    {
        return $this->proxyRequest(function () use ($id) {
            return $this->auditLogService->show($id);
        });
    }
}
