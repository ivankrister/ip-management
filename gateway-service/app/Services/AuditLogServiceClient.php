<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;

final class AuditLogServiceClient extends ServiceClient
{
    public function __construct(Request $request)
    {
        parent::__construct(config('services.audit_log.url'));
        $this->addAuthorizationHeader();
    }

    public function index(array $queryParams = []): Response
    {
        return $this->get('api/v1/audit-logs', $queryParams);
    }

    public function show(int $id): Response
    {
        return $this->get("api/v1/audit-logs/{$id}");
    }
}
