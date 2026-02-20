<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');

    Route::middleware('auth:api')->group(function () {
        Route::get('/user', [UserController::class, 'show'])->name('auth.user');
        Route::post('refresh', [AuthController::class, 'refresh'])->name('auth.refresh');
        Route::delete('/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::apiResource('users', UserController::class)->except(['update', 'destroy'])->middleware('auth.super_admin');
    });
});
