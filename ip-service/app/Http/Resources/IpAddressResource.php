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
                'createdAt' => $this->created_at,
                'updatedAt' => $this->updated_at,
            ],
            'relationships' => [
            ],
            'links' => [
                'self' => route('ip-addresses.show', ['ip_address' => $this->id]),
            ],

        ];
    }
}
