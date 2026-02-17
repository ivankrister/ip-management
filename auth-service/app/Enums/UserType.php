<?php

declare(strict_types=1);

namespace App\Enums;

enum UserType: string
{
    case SuperAdmin = 'super_admin';
    case User = 'user';

    public function label(): string
    {
        return match ($this) {
            self::SuperAdmin => 'Super Admin',
            self::User => 'User',
        };
    }
}
