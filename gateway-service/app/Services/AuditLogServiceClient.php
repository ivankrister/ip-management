<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Request;

final class AuditLogServiceClient extends ServiceClient
{
    public function __construct(Request $request)
    {
        parent::__construct(config('services.audit_log.url'));

        $token = $request->bearerToken();
        if ($token) {
            $this->defaultHeaders['Authorization'] = 'Bearer '.$token;
        }
    }
}
