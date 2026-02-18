<?php

declare(strict_types=1);

namespace App\Enums;

use App\Models\AuditLog;

enum ActionEnum: string
{
    case AuthLogin = 'auth.login';
    case AuthLogout = 'auth.logout';
    case IpAddressCreate = 'ip_address.create';
    case IpAddressUpdate = 'ip_address.update';
    case IpAddressDelete = 'ip_address.delete';

    public function label(): string
    {
        return match ($this) {
            self::AuthLogin => 'User Login',
            self::AuthLogout => 'User Logout',
            self::IpAddressCreate => 'IP Address Created',
            self::IpAddressUpdate => 'IP Address Updated',
            self::IpAddressDelete => 'IP Address Deleted',
        };
    }

    public function type(): string
    {
        return match ($this) {
            self::AuthLogin => 'login',
            self::AuthLogout => 'logout',
            self::IpAddressCreate => 'create',
            self::IpAddressUpdate => 'update',
            self::IpAddressDelete => 'delete',
        };
    }

    public function ipAddress(AuditLog $auditLog): string
    {
        return match ($this) {
            self::AuthLogin, self::AuthLogout => '-',
            self::IpAddressCreate, self::IpAddressUpdate => $auditLog->metadata['after']['value'],
            self::IpAddressDelete => $auditLog->metadata['before']['value'],
        };
    }

    public function details(AuditLog $auditLog): string
    {
        return match ($this) {
            self::AuthLogin => 'User logged in',
            self::AuthLogout => 'User logged out',
            self::IpAddressCreate => 'Created IP address: '.$auditLog->metadata['after']['value'],
            self::IpAddressUpdate => 'Updated IP address from '.$auditLog->metadata['before']['value'].' to '.$auditLog->metadata['after']['value'],
            self::IpAddressDelete => 'Deleted IP address: '.$auditLog->metadata['before']['value'],
        };
    }
}
