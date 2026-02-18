<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

abstract class ServiceClient
{
    protected string $baseUrl;

    protected int $timeout = 30;

    protected array $defaultHeaders = [];

    public function __construct(string $baseUrl)
    {
        $this->baseUrl = mb_rtrim($baseUrl, '/');
    }

    /**
     * Set timeout for requests
     */
    final public function setTimeout(int $seconds): self
    {
        $this->timeout = $seconds;

        return $this;
    }

    /**
     * Set default headers for all requests
     */
    final public function setDefaultHeaders(array $headers): self
    {
        $this->defaultHeaders = $headers;

        return $this;
    }

    /**
     * Add Authorization header from incoming request
     */
    final public function addAuthorizationHeader(): self
    {
        $authHeader = request()->header('Authorization');
        if ($authHeader) {
            $this->defaultHeaders['Authorization'] = $authHeader;
        }

        return $this;
    }

    /**
     * Make a GET request to the service
     */
    protected function get(string $endpoint, array $query = [], array $headers = []): Response
    {
        return $this->makeRequest('GET', $endpoint, [
            'query' => $query,
            'headers' => array_merge($this->defaultHeaders, $headers),
        ]);
    }

    /**
     * Make a POST request to the service
     */
    protected function post(string $endpoint, array $data = [], array $headers = []): Response
    {
        return $this->makeRequest('POST', $endpoint, [
            'json' => $data,
            'headers' => array_merge($this->defaultHeaders, $headers),
        ]);
    }

    /**
     * Make a PUT request to the service
     */
    protected function put(string $endpoint, array $data = [], array $headers = []): Response
    {
        return $this->makeRequest('PUT', $endpoint, [
            'json' => $data,
            'headers' => array_merge($this->defaultHeaders, $headers),
        ]);
    }

    /**
     * Make a PATCH request to the service
     */
    protected function patch(string $endpoint, array $data = [], array $headers = []): Response
    {
        return $this->makeRequest('PATCH', $endpoint, [
            'json' => $data,
            'headers' => array_merge($this->defaultHeaders, $headers),
        ]);
    }

    /**
     * Make a DELETE request to the service
     */
    protected function delete(string $endpoint, array $headers = []): Response
    {
        return $this->makeRequest('DELETE', $endpoint, [
            'headers' => array_merge($this->defaultHeaders, $headers),
        ]);
    }

    /**
     * Make the actual HTTP request
     */
    protected function makeRequest(string $method, string $endpoint, array $options = []): Response
    {
        $url = $this->buildUrl($endpoint);

        try {
            $response = Http::timeout($this->timeout)
                ->accept('application/json')
                ->withOptions($options)
                ->{mb_strtolower($method)}($url);

            return $response;
        } catch (RequestException $e) {
            throw $e;
        }
    }

    /**
     * Build the full URL for the request
     */
    protected function buildUrl(string $endpoint): string
    {
        $endpoint = mb_ltrim($endpoint, '/');

        return "{$this->baseUrl}/{$endpoint}";
    }

    /**
     * Forward authorization header from incoming request
     */
    protected function forwardAuthHeader(array $headers = []): array
    {
        $authHeader = request()->header('Authorization');

        if ($authHeader) {
            $headers['Authorization'] = $authHeader;
        }

        return $headers;
    }
}
