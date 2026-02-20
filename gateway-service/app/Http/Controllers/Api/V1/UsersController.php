<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\GatewayController;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

final class UsersController extends GatewayController
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(): JsonResponse
    {

        return $this->proxyRequest(function () {
            return $this->userService->index(request()->query());
        });
    }

    public function show($id): JsonResponse
    {
        return $this->proxyRequest(function () use ($id) {
            return $this->userService->show($id);
        });
    }

    public function store(): JsonResponse
    {
        return $this->proxyRequest(function () {
            return $this->userService->store(request()->all());
        });
    }
}
