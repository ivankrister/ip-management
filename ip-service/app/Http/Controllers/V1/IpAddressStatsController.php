<?php

declare(strict_types=1);

namespace App\Http\Controllers\V1;

use App\Models\IpAddress;
use Illuminate\Http\JsonResponse;

final class IpAddressStatsController
{
    public function index(): JsonResponse
    {
        $total = IpAddress::count();
        $ipv4Count = IpAddress::query()->where('type', 'ipv4')->count();
        $ipv6Count = IpAddress::query()->where('type', 'ipv6')->count();

        return response()->json([
            'total' => $total,
            'ipv4' => $ipv4Count,
            'ipv6' => $ipv6Count,
        ]);
    }
}
