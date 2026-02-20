<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\CreateUserAction;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;

final class UsersController
{
    public function index(): AnonymousResourceCollection
    {
        $users = QueryBuilder::for(User::class)
            ->allowedFilters(['type'])
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
        $user = $action->handle($request->validated());

        return UserResource::make($user);
    }
}
