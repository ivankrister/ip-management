<?php

declare(strict_types=1);

namespace App\Actions;

use App\Events\AuditEvent;
use App\Models\IpAddress;

final class UpdateIpAddressAction
{
    public function handle(IpAddress $ipAddress, array $data): bool
    {
        $before = $ipAddress->toArray();
        $result = $ipAddress->update($data);

        if ($result) {
            AuditEvent::dispatch(
                userId: auth()->id(),
                action: 'ip_address.updated',
                entityType: 'IpAddress',
                entityId: (string) $ipAddress->id,
                before: $before,
                after: $ipAddress->fresh()->toArray()
            );
        }

        return $result;
    }
}
