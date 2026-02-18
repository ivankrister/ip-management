<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ActionEnum;
use Illuminate\Database\Eloquent\Model;

final class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'metadata',
        'request_ip',
        'user_agent',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
        'action' => ActionEnum::class,
    ];
}
