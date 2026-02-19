<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\IpAddressFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[UseFactory(IpAddressFactory::class)]
final class IpAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'value',
        'label',
        'comment',
        'created_by',
        'metadata',
        'type',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];
}
