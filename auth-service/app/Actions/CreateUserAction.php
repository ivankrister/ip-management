<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\User;

final class CreateUserAction
{
    public function handle(array $data): User
    {
        return User::create($data);
    }
}
