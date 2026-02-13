<?php

declare(strict_types=1);

namespace App\Http\Controllers\V1;

use App\Http\Resources\IpAddressResource;
use App\Models\IpAddress;
use Spatie\QueryBuilder\QueryBuilder;

final class IpAddressController
{
    public function index()
    {
        $ipAddresses = QueryBuilder::for(IpAddress::class)
            ->allowedFilters(['value', 'label', 'created_by'])
            ->allowedSorts(['id', 'value', 'label', 'created_by', 'created_at'])
            ->paginate()
            ->appends(request()->query());

        return IpAddressResource::collection($ipAddresses);
    }
}
