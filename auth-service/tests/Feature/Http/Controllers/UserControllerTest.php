<?php

use App\Models\User;

test('authenticated user can get their profile', function () {
    $user = User::factory()->create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer '.$token,
    ])->getJson('/api/v1/user');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'user' => [
                'id',
                'name',
                'email',
                'created_at',
                'updated_at',
            ],
        ])
        ->assertJson([
            'user' => [
                'id' => $user->id,
                'name' => 'John Doe',
                'email' => 'john@example.com',
            ],
        ]);
});

test('unauthenticated user cannot access user profile', function () {
    $response = $this->getJson('/api/v1/user');

    $response->assertStatus(401);
});

test('user with invalid token cannot access profile', function () {
    $response = $this->withHeaders([
        'Authorization' => 'Bearer invalid-token-here',
    ])->getJson('/api/v1/user');

    $response->assertStatus(401);
});

test('user profile does not include password', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password123'),
    ]);

    $token = auth('api')->login($user);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer '.$token,
    ])->getJson('/api/v1/user');

    $response->assertStatus(200)
        ->assertJsonMissing(['password'])
        ->assertJsonMissing(['remember_token']);
});
