<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\IpAddress;

final class UpdateIpAddressAction
{
    public function handle(IpAddress $ipAddress, array $data): bool
    {
        return $ipAddress->update($data);
    }
}
