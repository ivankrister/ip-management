<?php

declare(strict_types=1);

use App\Http\Controllers\V1\IpAddressController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::middleware('jwt.stateless')->group(function () {
        Route::apiResource('ip-addresses', IpAddressController::class);
    });
});
