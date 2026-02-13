<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::middleware('jwt.stateless')->group(function () {
        Route::get('test', function () {
            $user = auth()->user();
            // or $user = request()->user();

            return response()->json(['user' => $user]);
        });
    });
});
