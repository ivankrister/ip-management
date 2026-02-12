<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\IpAddress;

final class CreateIpAddressAction
{
    public function handle(array $data): IpAddress
    {
        return IpAddress::create($data);
    }
}
