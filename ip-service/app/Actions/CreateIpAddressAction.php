<?php

declare(strict_types=1);

namespace App\Actions;

use App\Jobs\PublishAuditEvent;
use App\Models\IpAddress;

final class CreateIpAddressAction
{
    public function handle(array $data): IpAddress
    {
        $ip = $data['value'];
        $data['type'] = 'ipv4';
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            $data['type'] = 'ipv6';
        }

        $ipAddress = IpAddress::create($data);
        $user = auth()->user();

        PublishAuditEvent::dispatch(
            userId: auth()->id(),
            action: 'ip_address.created',
            entityType: 'IpAddress',
            entityId: (string) $ipAddress->id,
            metadata: [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'type' => $user->type,
                ],
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
