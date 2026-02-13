<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;

final class IpAddressService extends ServiceClient
{
    public function __construct(Request $request)
    {
        parent::__construct(config('services.ip.url'));

        // Set bearer token from request for all requests
        $token = $request->bearerToken();
        if ($token) {
            $this->defaultHeaders['Authorization'] = 'Bearer '.$token;
        }
    }

    /**
     * Test authentication with IP service
     */
    public function index(): Response
    {
        return $this->get('api/v1/ip-addresses');
    }
}
