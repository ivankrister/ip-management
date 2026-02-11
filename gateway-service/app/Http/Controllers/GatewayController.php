<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

abstract class GatewayController extends Controller
{
    /**
     * Handle a service response and return appropriate JSON response
     */
    protected function handleServiceResponse(Response $response): JsonResponse
    {
        return response()->json(
            $response->json(),
            $response->status()
        );
    }

    /**
     * Handle service request with automatic error handling
     */
    protected function proxyRequest(callable $serviceCall): JsonResponse
    {
        try {
            $response = $serviceCall();

            return $this->handleServiceResponse($response);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        } catch (RequestException $e) {
            return $this->handleServiceError($e);
        } catch (\Exception $e) {
            return $this->handleUnexpectedError($e);
        }
    }

    /**
     * Handle service request errors
     */
    protected function handleServiceError(RequestException $e): JsonResponse
    {
        $response = $e->response;

        if ($response) {
            return response()->json(
                $response->json() ?? ['message' => 'Service error occurred'],
                $response->status()
            );
        }

        return response()->json([
            'message' => 'Service is unavailable',
            'error' => $e->getMessage(),
        ], 503);
    }

    /**
     * Handle unexpected errors
     */
    protected function handleUnexpectedError(\Exception $e): JsonResponse
    {
        \Log::error('Gateway Error: '.$e->getMessage(), [
            'exception' => $e,
            'trace' => $e->getTraceAsString(),
        ]);

        return response()->json([
            'message' => 'An unexpected error occurred',
            'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
        ], 500);
    }

    /**
     * Forward all request data (useful for generic proxying)
     */
    protected function getRequestData(): array
    {
        return request()->all();
    }

    /**
     * Get validated data or all request data as fallback
     */
    protected function getValidatedOrAll(array $rules = []): array
    {
        if (empty($rules)) {
            return $this->getRequestData();
        }

        return request()->validate($rules);
    }
}
