<?php

declare(strict_types=1);

use App\Http\Middleware\JWTStateless;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

beforeEach(function () {
    $this->middleware = new JWTStateless;
    $this->request = Request::create('/test', 'GET');
    $this->next = fn ($request) => response()->json(['success' => true]);
});

describe('JWTStateless', function () {
    it('authenticates user with valid JWT token', function () {
        // Mock payload data
        $payload = Mockery::mock('PHPOpenSourceSaver\JWTAuth\Payload');
        $payload->shouldReceive('get')
            ->with('sub')
            ->andReturn(123);
        $payload->shouldReceive('get')
            ->with('email')
            ->andReturn('john@example.com');
        $payload->shouldReceive('get')
            ->with('name')
            ->andReturn('John Doe');
        $payload->shouldReceive('get')
            ->with('user_type')
            ->andReturn('super_admin');

        // Mock token
        $token = Mockery::mock('PHPOpenSourceSaver\JWTAuth\Token');
        $token->shouldReceive('getPayload')
            ->andReturn($payload);

        // Mock JWTAuth facade
        JWTAuth::shouldReceive('parseToken')
            ->once()
            ->andReturn($token);

        $response = $this->middleware->handle($this->request, $this->next);

        expect($response->status())->toBe(200)
            ->and($response->getData(true))->toBe(['success' => true])
            ->and($this->request->user())->toBeInstanceOf(User::class)
            ->and($this->request->user()->id)->toBe(123)
            ->and($this->request->user()->email)->toBe('john@example.com')
            ->and($this->request->user()->name)->toBe('John Doe')
            ->and($this->request->user()->type)->toBe('super_admin')
            ->and($this->request->user()->exists)->toBeTrue();
    });

    it('sets user for both request and auth', function () {
        // Mock payload data
        $payload = Mockery::mock('PHPOpenSourceSaver\JWTAuth\Payload');
        $payload->shouldReceive('get')
            ->with('sub')
            ->andReturn(456);
        $payload->shouldReceive('get')
            ->with('email')
            ->andReturn('jane@example.com');
        $payload->shouldReceive('get')
            ->with('name')
            ->andReturn('Jane Smith');
        $payload->shouldReceive('get')
            ->with('user_type')
            ->andReturn('user');

        // Mock token
        $token = Mockery::mock('PHPOpenSourceSaver\JWTAuth\Token');
        $token->shouldReceive('getPayload')
            ->andReturn($payload);

        // Mock JWTAuth facade
        JWTAuth::shouldReceive('parseToken')
            ->once()
            ->andReturn($token);

        $this->middleware->handle($this->request, $this->next);

        // Check both request()->user() and auth()->user()
        expect($this->request->user())->toBeInstanceOf(User::class)
            ->and($this->request->user()->id)->toBe(456)
            ->and(Auth::user())->toBeInstanceOf(User::class)
            ->and(Auth::user()->id)->toBe(456);
    });

    it('returns 401 when token is missing', function () {
        JWTAuth::shouldReceive('parseToken')
            ->once()
            ->andThrow(new JWTException('Token not provided'));

        $response = $this->middleware->handle($this->request, $this->next);

        expect($response->status())->toBe(401)
            ->and($response->getData(true))->toBe(['error' => 'Unauthenticated']);
    });

    it('returns 401 when token is invalid', function () {
        JWTAuth::shouldReceive('parseToken')
            ->once()
            ->andThrow(new JWTException('Token is invalid'));

        $response = $this->middleware->handle($this->request, $this->next);

        expect($response->status())->toBe(401)
            ->and($response->getData(true))->toBe(['error' => 'Unauthenticated']);
    });

    it('returns 401 when token is expired', function () {
        JWTAuth::shouldReceive('parseToken')
            ->once()
            ->andThrow(new JWTException('Token has expired'));

        $response = $this->middleware->handle($this->request, $this->next);

        expect($response->status())->toBe(401)
            ->and($response->getData(true))->toBe(['error' => 'Unauthenticated']);
    });

    it('creates user without database lookup', function () {
        // Mock payload data
        $payload = Mockery::mock('PHPOpenSourceSaver\JWTAuth\Payload');
        $payload->shouldReceive('get')
            ->with('sub')
            ->andReturn(789);
        $payload->shouldReceive('get')
            ->with('email')
            ->andReturn('bob@example.com');
        $payload->shouldReceive('get')
            ->with('name')
            ->andReturn('Bob Wilson');
        $payload->shouldReceive('get')
            ->with('user_type')
            ->andReturn('user');

        // Mock token
        $token = Mockery::mock('PHPOpenSourceSaver\JWTAuth\Token');
        $token->shouldReceive('getPayload')
            ->andReturn($payload);

        // Mock JWTAuth facade
        JWTAuth::shouldReceive('parseToken')
            ->once()
            ->andReturn($token);

        $this->middleware->handle($this->request, $this->next);

        // User should be created from JWT payload only
        expect($this->request->user())->toBeInstanceOf(User::class)
            ->and($this->request->user()->wasRecentlyCreated)->toBeFalse()
            ->and($this->request->user()->exists)->toBeTrue();
    });

    it('handles different user types correctly', function () {
        $userTypes = ['super_admin', 'user', 'admin', 'moderator'];

        foreach ($userTypes as $userType) {
            // Create new request for each iteration
            $request = Request::create('/test', 'GET');

            // Mock payload data
            $payload = Mockery::mock('PHPOpenSourceSaver\JWTAuth\Payload');
            $payload->shouldReceive('get')
                ->with('sub')
                ->andReturn(1);
            $payload->shouldReceive('get')
                ->with('email')
                ->andReturn('test@example.com');
            $payload->shouldReceive('get')
                ->with('name')
                ->andReturn('Test User');
            $payload->shouldReceive('get')
                ->with('user_type')
                ->andReturn($userType);

            // Mock token
            $token = Mockery::mock('PHPOpenSourceSaver\JWTAuth\Token');
            $token->shouldReceive('getPayload')
                ->andReturn($payload);

            // Mock JWTAuth facade
            JWTAuth::shouldReceive('parseToken')
                ->once()
                ->andReturn($token);

            $this->middleware->handle($request, $this->next);

            expect($request->user()->type)->toBe($userType);
        }
    });
});
