<?php

declare(strict_types=1);

namespace App\Actions;

use App\Events\AuditEvent;
use App\Models\IpAddress;

final class DeleteIpAddressAction
{
    public function handle(IpAddress $ipAddress): bool
    {
        $before = $ipAddress->toArray();
        $result = $ipAddress->delete();

        if ($result) {
            AuditEvent::dispatch(
                userId: auth()->id(),
                action: 'ip_address.deleted',
                entityType: 'IpAddress',
                entityId: (string) $ipAddress->id,
                before: $before
            );
        }

        return $result;
    }
}
