<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\LoginAction;
use App\Actions\LogoutAction;
use App\Actions\RefreshTokenAction;
use App\Http\Requests\LoginRequest;
use Exception;
use Illuminate\Http\JsonResponse;

final class AuthController extends Controller
{
    public function login(LoginRequest $request, LoginAction $action): JsonResponse
    {
        $data = $request->validated();

        try {
            $result = $action->handle($data);

            return response()->json($result);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }

    public function refresh(RefreshTokenAction $action): JsonResponse
    {
        try {
            $result = $action->handle();

            return response()->json($result);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }

    public function logout(LogoutAction $action): JsonResponse
    {
        try {
            $action->handle();

            return response()->json(['message' => 'Successfully logged out']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
