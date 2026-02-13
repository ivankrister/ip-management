<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class IpAddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => 'ip_address',
            'id' => (string) $this->id,
            'attributes' => [
                'value' => $this->value,
                'label' => $this->label,
                'comment' => $this->comment,
                'created_by' => $this->created_by,
                'createdAt' => $this->created_at->format('Y-m-d H:i:s'),
                'updatedAt' => $this->updated_at->format('Y-m-d H:i:s'),
            ],
            'relationships' => [
                'createdBy' => [
                    'data' => [
                        'type' => 'user',
                        'id' => (string) $this->created_by,
                    ],
                ],
            ],
            'included' => [
                'createdBy' => $this->metadata['user'] ?? null,
            ],
            'links' => [
                'self' => route('ip-addresses.show', ['ip_address' => $this->id]),
            ],

        ];
    }
}
