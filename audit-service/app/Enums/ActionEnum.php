<?php

declare(strict_types=1);

namespace App\Enums;

use App\Models\AuditLog;

enum ActionEnum: string
{
    case AuthLogin = 'auth.login';
    case AuthLogout = 'auth.logout';
    case IpAddressCreated = 'ip_address.created';
    case IpAddressUpdated = 'ip_address.updated';
    case IpAddressDeleted = 'ip_address.deleted';

    public function label(): string
    {
        return match ($this) {
            self::AuthLogin => 'User Login',
            self::AuthLogout => 'User Logout',
            self::IpAddressCreated => 'IP Address Created',
            self::IpAddressUpdated => 'IP Address Updated',
            self::IpAddressDeleted => 'IP Address Deleted',
        };
    }

    public function type(): string
    {
        return match ($this) {
            self::AuthLogin => 'login',
            self::AuthLogout => 'logout',
            self::IpAddressCreated => 'create',
            self::IpAddressUpdated => 'update',
            self::IpAddressDeleted => 'delete',
        };
    }

    public function ipAddress(AuditLog $auditLog): string
    {
        return match ($this) {
            self::AuthLogin, self::AuthLogout => '-',
            self::IpAddressCreated, self::IpAddressUpdated => $auditLog->metadata['after']['value'],
            self::IpAddressDeleted => $auditLog->metadata['before']['value'],
        };
    }

    public function details(AuditLog $auditLog): string
    {
        return match ($this) {
            self::AuthLogin => 'User logged in',
            self::AuthLogout => 'User logged out',
            self::IpAddressCreated => 'Created IP address: '.$auditLog->metadata['after']['value'],
            self::IpAddressUpdated => $this->ipUpdateMessage($auditLog->metadata['before'], $auditLog->metadata['after']),
            self::IpAddressDeleted => 'Deleted IP address: '.$auditLog->metadata['before']['value'],
        };
    }

    private function ipUpdateMessage(array $before, array $after): string
    {
        $changes = [];

        // Check for value changes
        if ($before['value'] !== $after['value']) {
            $changes[] = 'IP address from '.$before['value'].' to '.$after['value'];
        }

        // Check for label changes
        if ($before['label'] !== $after['label']) {
            $changes[] = 'label from "'.$before['label'].'" to "'.$after['label'].'"';
        }

        // Check for comment changes
        $beforeComment = $before['comment'] ?? null;
        $afterComment = $after['comment'] ?? null;

        if ($beforeComment !== $afterComment) {
            if ($beforeComment === null && $afterComment !== null) {
                $changes[] = 'added comment';
            } elseif ($beforeComment !== null && $afterComment === null) {
                $changes[] = 'removed the comment';
            } else {
                $changes[] = 'updated the comment';
            }
        }

        return '(Updated) '.implode(', ', $changes);
    }
}
