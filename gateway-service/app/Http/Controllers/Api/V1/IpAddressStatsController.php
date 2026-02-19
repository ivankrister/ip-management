<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\GatewayController;
use App\Services\IpAddressService;
use Illuminate\Http\JsonResponse;

final class IpAddressStatsController extends GatewayController
{
    public function index(IpAddressService $ipService): JsonResponse
    {
        return $this->proxyRequest(function () use ($ipService) {
            return $ipService->stats();
        });
    }
}
