<?php

declare(strict_types=1);

namespace App\Actions;

use App\Jobs\PublishAuditEvent;
use App\Models\IpAddress;

final class UpdateIpAddressAction
{
    public function handle(IpAddress $ipAddress, array $data): bool
    {
        $before = $ipAddress->toArray();
        $result = $ipAddress->update($data);

        if ($result) {

            $user = auth()->user();
            PublishAuditEvent::dispatch(
                userId: auth()->id(),
                action: 'ip_address.updated',
                entityType: 'IpAddress',
                entityId: (string) $ipAddress->id,
                metadata: [
                    'user' => $user->only(['id', 'email', 'name', 'type']),
                    'before' => $before,
                    'after' => $ipAddress->fresh()->toArray(),
                ],
                context: [
                    'request_ip' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]

            );
        }

        return $result;
    }
}
