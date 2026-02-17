<?php

declare(strict_types=1);

namespace App\Http\Controllers\V1;

use App\Actions\CreateIpAddressAction;
use App\Actions\DeleteIpAddressAction;
use App\Actions\UpdateIpAddressAction;
use App\Http\Requests\IpAddressRequest;
use App\Http\Resources\IpAddressResource;
use App\Models\IpAddress;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class IpAddressController
{
    public function index(): AnonymousResourceCollection
    {
        $ipAddresses = QueryBuilder::for(IpAddress::class)
            ->allowedFilters([
                AllowedFilter::exact('created_by'),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('value', 'like', "%{$value}%")
                            ->orWhere('label', 'like', "%{$value}%");
                    });
                }),
            ])
            ->allowedSorts(['id', 'value', 'label', 'created_by', 'created_at'])
            ->paginate()
            ->appends(request()->query());

        return IpAddressResource::collection($ipAddresses);
    }

    public function show(IpAddress $ipAddress): IpAddressResource
    {
        return IpAddressResource::make($ipAddress);
    }

    public function store(IpAddressRequest $request, CreateIpAddressAction $action): IpAddressResource
    {
        $ipAddress = $action->handle($request->storeData());

        return IpAddressResource::make($ipAddress);
    }

    public function update(IpAddressRequest $request, UpdateIpAddressAction $action, IpAddress $ipAddress): IpAddressResource
    {
        $action->handle($ipAddress, $request->updateData());

        return IpAddressResource::make($ipAddress);
    }

    public function destroy(DeleteIpAddressAction $action, IpAddress $ipAddress): bool
    {

        if ($ipAddress->created_by !== auth()->id() && auth()->user()->type !== 'super_admin') {
            abort(403, 'Unauthorized');
        }

        return $action->handle($ipAddress);
    }
}
