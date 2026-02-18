<?php

declare(strict_types=1);

use App\Http\Controllers\V1\AuditLogController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::middleware(['jwt.stateless', 'auth.super_admin'])->group(function () {
        Route::apiResource('ip-addresses', AuditLogController::class)->except(['store', 'update', 'destroy']);
    });
});
