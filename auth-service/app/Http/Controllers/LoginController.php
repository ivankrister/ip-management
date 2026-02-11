<?php

namespace App\Http\Controllers;

use App\Actions\LoginAction;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;

class LoginController extends Controller
{
    public function store(LoginRequest $request, LoginAction $action): JsonResponse
    {
        $data = $request->validated();

        try {
            $result = $action->handle($data);

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }
}
