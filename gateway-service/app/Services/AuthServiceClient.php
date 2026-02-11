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
}
