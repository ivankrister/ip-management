<?php

namespace App\Actions;

class LogoutAction
{
    public function handle(): void
    {
        auth()->logout();
    }
}
