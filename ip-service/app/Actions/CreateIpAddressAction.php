<?php

declare(strict_types=1);

namespace App\Actions;

use App\Events\AuditEvent;
use App\Models\IpAddress;

final class CreateIpAddressAction
{
    public function handle(array $data): IpAddress
    {
        $ipAddress = IpAddress::create($data);

        AuditEvent::publish(
            userId: auth()->id(),
            action: 'ip_address.created',
            entityType: 'IpAddress',
            entityId: (string) $ipAddress->id,
            after: $ipAddress->toArray()
        );

        return $ipAddress;
    }
}
