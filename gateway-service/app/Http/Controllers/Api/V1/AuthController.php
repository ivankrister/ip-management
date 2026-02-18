<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\GatewayController;
use App\Services\AuthServiceClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AuthController extends GatewayController
{
    public function __construct(
        private AuthServiceClient $authService
    ) {}

    /**
     * Login user
     */
    public function login(Request $request): JsonResponse
    {

        return $this->proxyRequest(function () {
            return $this->authService->login($this->getRequestData());
        });
    }

    /**
     * Refresh token
     */
    public function refresh(): JsonResponse
    {
        return $this->proxyRequest(function () {
            return $this->authService->refresh();
        });
    }

    /**
     * Logout user
     */
    public function logout(): JsonResponse
    {
        return $this->proxyRequest(function () {
            return $this->authService->logout();
        });
    }
}
