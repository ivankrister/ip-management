<?php

declare(strict_types=1);

use App\Http\Middleware\JWTStateless;
use App\Models\IpAddress;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    // Mock the JWT authentication middleware
    $this->withoutMiddleware([JWTStateless::class]);

    // Create and authenticate a mock user
    $user = new User;
    $user->id = 1;
    $user->name = 'Test User';
    $user->email = 'test@example.com';
    $user->type = 'super_admin';

    actingAs($user);
});

it('can display IP address stats for super admin', function () {
    // Create IP addresses with different types
    IpAddress::factory()->count(5)->create(['type' => 'ipv4']);
    IpAddress::factory()->count(3)->create(['type' => 'ipv6']);

    $response = getJson('/api/v1/ip-addresses/stats');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                'total',
                'ipv4Count',
                'ipv6Count',
                'last7Days',
                'recentIpAddresses',
            ],
        ])
        ->assertJson([
            'data' => [
                'total' => 8,
                'ipv4Count' => 5,
                'ipv6Count' => 3,
            ],
        ]);

    $data = $response->json('data');
    expect($data['last7Days'])->toBeArray();

    expect($data['recentIpAddresses'])->toHaveCount(3)
        ->and($data['recentIpAddresses'][0])->toHaveKeys(['id', 'type', 'attributes']);
});

it('cannot access by non-super admin users', function () {
    $user = new User;
    $user->id = 2;
    $user->name = 'Regular User';
    $user->email = 'user@example.com';
    $user->type = 'user';
    actingAs($user);
    $response = getJson('/api/v1/ip-addresses/stats');
    $response->assertStatus(403);
});
