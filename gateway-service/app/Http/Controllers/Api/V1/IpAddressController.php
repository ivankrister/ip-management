<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\GatewayController;
use App\Services\IpAddressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class IpAddressController extends GatewayController
{
    /**
     * Test authentication with IP service
     */
    public function test(IpAddressService $ipService, Request $request): JsonResponse
    {
        return $this->proxyRequest(function () use ($ipService) {
            return $ipService->test();
        });
    }
}
