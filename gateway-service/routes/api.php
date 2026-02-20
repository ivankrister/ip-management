<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuditLogController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\IpAddressController;
use App\Http\Controllers\Api\V1\IpAddressStatsController;
use App\Http\Controllers\Api\V1\UsersController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');
    Route::delete('/logout', [AuthController::class, 'logout'])->name('auth.logout');

    Route::get('ip-addresses/stats', [IpAddressStatsController::class, 'index']);
    Route::apiResource('ip-addresses', IpAddressController::class);
    Route::apiResource('audit-logs', AuditLogController::class)->only(['index', 'show']);
    Route::apiResource('users', UsersController::class)->only(['index', 'show', 'store']);

});
