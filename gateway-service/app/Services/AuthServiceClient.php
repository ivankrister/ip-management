<?php

namespace App\Services;

use Illuminate\Http\Client\Response;

class AuthServiceClient extends ServiceClient
{
    public function __construct()
    {
        parent::__construct(config('services.auth.url'));
    }

    /**
     * Login user
     */
    public function login(array $credentials): Response
    {

        return $this->post('/api/v1/login', $credentials);
    }

    public function refresh(): Response
    {
        $this->addAuthorizationHeader();

        return $this->post('/api/v1/refresh');
    }

    public function logout(): Response
    {
        $this->addAuthorizationHeader();

        return $this->delete('/api/v1/logout');
    }
}
