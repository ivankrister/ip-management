<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserController
{
    public function show(): JsonResponse
    {
        return response()->json([
            'user' => Auth::user(),
        ]);
    }
}
