<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::middleware('auth:api')->group(function () {});
});
