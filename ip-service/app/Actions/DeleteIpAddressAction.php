<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\IpAddress;

final class DeleteIpAddressAction
{
    public function handle(IpAddress $ipAddress): bool
    {
        return $ipAddress->delete();
    }
}
