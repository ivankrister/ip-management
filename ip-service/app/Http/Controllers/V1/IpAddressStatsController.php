<?php

declare(strict_types=1);

namespace App\Http\Controllers\V1;

use App\Http\Resources\IpAddressResource;
use App\Models\IpAddress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;

final class IpAddressStatsController
{
    public function index(): JsonResponse
    {
        $total = IpAddress::count();
        $ipv4Count = IpAddress::query()->where('type', 'ipv4')->count();
        $ipv6Count = IpAddress::query()->where('type', 'ipv6')->count();

        $last7DaysData = IpAddress::query()
            ->where('created_at', '>=', now()->subDays(7))
            ->get()
            ->groupBy(fn (IpAddress $item) => $item->created_at->format('M d'))
            ->map(fn (Collection $group): array => [
                'date' => $group->first()->created_at->format('M d'),
                'count' => $group->count(),
            ])
            ->values();

        $recentIpAddresses = IpAddress::query()
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        return response()->json([
            'data' => [
                'total' => $total,
                'ipv4Count' => $ipv4Count,
                'ipv6Count' => $ipv6Count,
                'last7Days' => $last7DaysData,
                'recentIpAddresses' => IpAddressResource::collection($recentIpAddresses),
            ],
        ]);
    }
}
