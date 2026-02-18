<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\AuditLog
 */
final class AuditLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => 'audit_log',
            'id' => (string) $this->id,
            'attributes' => [
                'action' => $this->action->label(),
                'type' => $this->action->type(),
                'details' => $this->action->details($this),
                'ip_address' => $this->action->ipAddress($this),
                'user_id' => $this->user_id,
                'entity_type' => $this->entity_type,
                'entity_id' => $this->entity_id,
                'createdAt' => $this->created_at->format('Y-m-d H:i:s'),
                $this->mergeWhen($request->routeIs('audit-logs.show'), fn () => [
                    'metadata' => $this->metadata,
                    'request_ip' => $this->request_ip,
                    'user_agent' => $this->user_agent,
                ]),
            ],
            'relationships' => [
                'user' => [
                    'data' => [
                        'type' => 'user',
                        'id' => (string) $this->user_id,
                    ],
                ],
            ],
            'included' => [
                'user' => $this->metadata['user'] ?? null,
            ],
            'links' => [
                'self' => route('audit-logs.show', ['audit_log' => $this->id]),
            ],

        ];
    }
}
