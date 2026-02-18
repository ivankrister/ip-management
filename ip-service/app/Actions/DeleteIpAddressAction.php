<?php

declare(strict_types=1);

namespace App\Actions;

use App\Jobs\PublishAuditEvent;
use App\Models\IpAddress;

final class DeleteIpAddressAction
{
    public function handle(IpAddress $ipAddress): bool
    {
        $before = $ipAddress->toArray();
        $result = $ipAddress->delete();

        if ($result) {
            $user = auth()->user();
            PublishAuditEvent::dispatch(
                userId: auth()->id(),
                action: 'ip_address.deleted',
                entityType: 'IpAddress',
                entityId: (string) $ipAddress->id,
                metadata: [
                    'user' => $user->only(['id', 'email', 'name', 'type']),
                    'before' => $before,
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
