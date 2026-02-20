<?php

namespace App\Services;

use Illuminate\Http\Client\Response;

class UserService extends ServiceClient
{
    public function __construct()
    {
        parent::__construct(config('services.auth.url'));
        $this->addAuthorizationHeader();
    }

    public function index(array $queryParams = []): Response
    {
        return $this->get('/api/v1/users', $queryParams);
    }

    public function show(int $id): Response
    {
        return $this->get("/api/v1/users/{$id}");
    }

    public function store(array $data): Response
    {
        return $this->post('/api/v1/users', $data);
    }
}
