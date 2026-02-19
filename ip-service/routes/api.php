<?php

declare(strict_types=1);

use App\Http\Controllers\V1\IpAddressController;
use App\Http\Controllers\V1\IpAddressStatsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::middleware('jwt.stateless')->group(function () {
        Route::get('ip-addresses/stats', [IpAddressStatsController::class, 'index'])->middleware('auth.super_admin');
        Route::apiResource('ip-addresses', IpAddressController::class);
    });
});
