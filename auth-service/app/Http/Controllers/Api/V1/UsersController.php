<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\CreateUserAction;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

final class UsersController
{
    public function index(): AnonymousResourceCollection
    {
        $users = QueryBuilder::for(User::class)
            ->allowedFilters(['type', AllowedFilter::callback('search', function (Builder $query, string $value): void {
                $query->where(function (Builder $q) use ($value): void {
                    $q->where('name', 'like', "%{$value}%")
                        ->orWhere('email', 'like', "%{$value}%");
                });
            }), ])
            ->allowedSorts(['name', 'email', 'type', 'created_at'])
            ->paginate(10)
            ->appends(request()->query());

        return UserResource::collection($users);
    }

    public function show(User $user): UserResource
    {
        return UserResource::make($user);
    }

    public function store(UserRequest $request, CreateUserAction $action): UserResource
    {
        $user = $action->handle($request->storeData());

        return UserResource::make($user);
    }
}
