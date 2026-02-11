<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/login', [LoginController::class, 'store'])->name('auth.login');

    Route::middleware('auth:api')->group(function () {
        Route::get('/user', [UserController::class, 'show'])->name('auth.user');
    });
});
