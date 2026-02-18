<?php

declare(strict_types=1);

namespace App\Actions;

use App\Jobs\PublishAuditEvent;
use App\Models\IpAddress;

final class CreateIpAddressAction
{
    public function handle(array $data): IpAddress
    {
        $ipAddress = IpAddress::create($data);
        $user = auth()->user();

        PublishAuditEvent::dispatch(
            userId: auth()->id(),
            action: 'ip_address.created',
            entityType: 'IpAddress',
            entityId: (string) $ipAddress->id,
            metadata: [
                'user' => $user->only(['id', 'email', 'name', 'type']),
                'after' => $ipAddress->toArray(),
            ],
            context: [
                'request_ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]

        );

        return $ipAddress;
    }
}
