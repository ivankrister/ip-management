<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\IpAddressController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::post('/login', [AuthController::class, 'login']);
    Route::prefix('ip-addresses')->group(function () {
        Route::get('/test', [IpAddressController::class, 'test']);
    });
});
