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

        $token = $request->bearerToken();
        if ($token) {
            $this->defaultHeaders['Authorization'] = 'Bearer '.$token;
        }
    }

    public function index(array $queryParams = []): Response
    {
        return $this->get('api/v1/ip-addresses', $queryParams);
    }

    public function store(array $data): Response
    {
        return $this->post('api/v1/ip-addresses', $data);
    }

    public function update(int $id, array $data): Response
    {
        return $this->put("api/v1/ip-addresses/{$id}", $data);
    }

    public function destroy(int $id): Response
    {
        return $this->delete("api/v1/ip-addresses/{$id}");
    }
}
