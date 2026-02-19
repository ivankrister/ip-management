<?php

declare(strict_types=1);

namespace App\Http\Controllers\V1;

use App\Http\Resources\IpAddressResource;
use App\Models\IpAddress;
use Illuminate\Http\JsonResponse;

final class IpAddressStatsController
{
    public function index(): JsonResponse
    {
        $total = IpAddress::count();
        $ipv4Count = IpAddress::query()->where('type', 'ipv4')->count();
        $ipv6Count = IpAddress::query()->where('type', 'ipv6')->count();
        $last7Days = IpAddress::query()
            ->where('created_at', '>=', now()->subDays(7))
            ->selectRaw("DATE_FORMAT(created_at, '%b %d') as date, COUNT(*) as count")
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        $recentIpAddresses = IpAddress::query()
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        return response()->json([
            'data' => [
                'total' => $total,
                'ipv4Count' => $ipv4Count,
                'ipv6Count' => $ipv6Count,
                'last7Days' => $last7Days,
                'recentIpAddresses' => IpAddressResource::collection($recentIpAddresses),
            ],
        ]);
    }
}
