<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class UserController
{
    public function show()
    {
        return response()->json([
            'user' => Auth::user(),
        ]);
    }
}
