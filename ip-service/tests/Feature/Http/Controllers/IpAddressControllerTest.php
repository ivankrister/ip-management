<?php

declare(strict_types=1);

use App\Http\Middleware\JWTStateless;
use App\Models\IpAddress;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

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

describe('IpAddressController', function () {
    describe('index', function () {
        it('can list all IP addresses', function () {
            IpAddress::factory()->count(3)->create();

            $response = getJson('/api/v1/ip-addresses?filter[created_by]=all');

            $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'type',
                            'id',
                            'attributes' => [
                                'value',
                                'label',
                                'comment',
                                'created_by',
                                'createdAt',
                                'updatedAt',
                            ],
                            'relationships',
                            'included',
                            'links',
                        ],
                    ],
                    'links',
                    'meta',
                ]);

            expect($response->json('data'))->toHaveCount(3);
        });

        it('can filter IP addresses by created_by', function () {
            IpAddress::factory()->create(['created_by' => 1]);
            IpAddress::factory()->create(['created_by' => 2]);

            $response = getJson('/api/v1/ip-addresses?filter[created_by]=me');

            $response->assertStatus(200);
            expect($response->json('data'))->toHaveCount(1);
        });

        it('can filter by search term', function () {
            IpAddress::factory()->create(['value' => '192.168.1.1']);
            IpAddress::factory()->create(['value' => '10.0.0.1']);

            $response = getJson('/api/v1/ip-addresses?filter[search]=192.168');

            $response->assertStatus(200);
            expect($response->json('data'))->toHaveCount(1);
        });

        it('can sort IP addresses by value ascending', function () {
            IpAddress::factory()->create(['value' => '192.168.1.1']);
            IpAddress::factory()->create(['value' => '10.0.0.1']);

            $response = getJson('/api/v1/ip-addresses?sort=value');

            $response->assertStatus(200);
            expect($response->json('data.0.attributes.value'))->toBe('10.0.0.1');
            expect($response->json('data.1.attributes.value'))->toBe('192.168.1.1');
        });

        it('can sort IP addresses by value descending', function () {
            IpAddress::factory()->create(['value' => '10.0.0.1']);
            IpAddress::factory()->create(['value' => '192.168.1.1']);

            $response = getJson('/api/v1/ip-addresses?sort=-value');

            $response->assertStatus(200);
            expect($response->json('data.0.attributes.value'))->toBe('192.168.1.1');
            expect($response->json('data.1.attributes.value'))->toBe('10.0.0.1');
        });

        it('paginates IP addresses', function () {
            IpAddress::factory()->count(20)->create();

            $response = getJson('/api/v1/ip-addresses?page=1');

            $response->assertStatus(200);
            expect($response->json('meta'))->toHaveKey('current_page');
            expect($response->json('meta'))->toHaveKey('total');
            expect($response->json('links'))->toHaveKey('first');
            expect($response->json('links'))->toHaveKey('last');
        });
    });

    describe('show', function () {
        it('can show a single IP address', function () {
            $ipAddress = IpAddress::factory()->create([
                'value' => '192.168.1.100',
                'label' => 'Test Server',
            ]);

            $response = getJson("/api/v1/ip-addresses/{$ipAddress->id}");

            $response->assertStatus(200)
                ->assertJson([
                    'data' => [
                        'type' => 'ip_address',
                        'id' => (string) $ipAddress->id,
                        'attributes' => [
                            'value' => '192.168.1.100',
                            'label' => 'Test Server',
                        ],
                    ],
                ]);
        });

        it('returns 404 when IP address not found', function () {
            $response = getJson('/api/v1/ip-addresses/999999');

            $response->assertStatus(404);
        });
    });

    describe('store', function () {
        it('can create a new IP address', function () {
            $data = [
                'data' => [
                    'attributes' => [
                        'value' => '192.168.1.50',
                        'label' => 'New Server',
                        'comment' => 'This is a test server',
                    ],
                ],
            ];

            $response = postJson('/api/v1/ip-addresses', $data);

            $response->assertStatus(201)
                ->assertJson([
                    'data' => [
                        'attributes' => [
                            'value' => '192.168.1.50',
                            'label' => 'New Server',
                            'comment' => 'This is a test server',
                        ],
                    ],
                ]);

            $this->assertDatabaseHas('ip_addresses', [
                'value' => '192.168.1.50',
                'label' => 'New Server',
                'comment' => 'This is a test server',
            ]);
        });

        it('validates required value field', function () {
            $data = [
                'data' => [
                    'attributes' => [
                        'label' => 'New Server',
                    ],
                ],
            ];

            $response = postJson('/api/v1/ip-addresses', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['data.attributes.value']);
        });

        it('validates required label field', function () {
            $data = [
                'data' => [
                    'attributes' => [
                        'value' => '192.168.1.50',
                    ],
                ],
            ];

            $response = postJson('/api/v1/ip-addresses', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['data.attributes.label']);
        });

        it('validates IP address format', function () {
            $data = [
                'data' => [
                    'attributes' => [
                        'value' => 'not-an-ip-address',
                        'label' => 'New Server',
                    ],
                ],
            ];

            $response = postJson('/api/v1/ip-addresses', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['data.attributes.value']);
        });

        it('validates unique IP address', function () {
            IpAddress::factory()->create(['value' => '192.168.1.100']);

            $data = [
                'data' => [
                    'attributes' => [
                        'value' => '192.168.1.100',
                        'label' => 'Duplicate Server',
                    ],
                ],
            ];

            $response = postJson('/api/v1/ip-addresses', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['data.attributes.value']);
        });

        it('validates label max length', function () {
            $data = [
                'data' => [
                    'attributes' => [
                        'value' => '192.168.1.50',
                        'label' => str_repeat('a', 51), // 51 characters, max is 50
                    ],
                ],
            ];

            $response = postJson('/api/v1/ip-addresses', $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['data.attributes.label']);
        });

        it('accepts nullable comment field', function () {
            $data = [
                'data' => [
                    'attributes' => [
                        'value' => '192.168.1.50',
                        'label' => 'New Server',
                    ],
                ],
            ];

            $response = postJson('/api/v1/ip-addresses', $data);

            $response->assertStatus(201);
        });
    });

    describe('update', function () {
        it('can update an IP address', function () {
            $ipAddress = IpAddress::factory()->create([
                'value' => '192.168.1.100',
                'label' => 'Old Server',
            ]);

            $data = [
                'data' => [
                    'attributes' => [
                        'value' => '192.168.1.101',
                        'label' => 'Updated Server',
                        'comment' => 'Updated comment',
                    ],
                ],
            ];

            $response = putJson("/api/v1/ip-addresses/{$ipAddress->id}", $data);

            $response->assertStatus(200)
                ->assertJson([
                    'data' => [
                        'type' => 'ip_address',
                        'id' => (string) $ipAddress->id,
                        'attributes' => [
                            'value' => '192.168.1.101',
                            'label' => 'Updated Server',
                            'comment' => 'Updated comment',
                        ],
                    ],
                ]);

            $this->assertDatabaseHas('ip_addresses', [
                'id' => $ipAddress->id,
                'value' => '192.168.1.101',
                'label' => 'Updated Server',
                'comment' => 'Updated comment',
            ]);
        });

        it('validates required fields on update', function () {
            $ipAddress = IpAddress::factory()->create();

            $data = [
                'data' => [
                    'attributes' => [],
                ],
            ];

            $response = putJson("/api/v1/ip-addresses/{$ipAddress->id}", $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['data.attributes.value', 'data.attributes.label']);
        });

        it('validates IP address format on update', function () {
            $ipAddress = IpAddress::factory()->create();

            $data = [
                'data' => [
                    'attributes' => [
                        'value' => 'invalid-ip',
                        'label' => 'Updated Server',
                    ],
                ],
            ];

            $response = putJson("/api/v1/ip-addresses/{$ipAddress->id}", $data);

            $response->assertStatus(422)
                ->assertJsonValidationErrors(['data.attributes.value']);
        });

        it('returns 404 when updating non-existent IP address', function () {
            $data = [
                'data' => [
                    'attributes' => [
                        'value' => '192.168.1.101',
                        'label' => 'Updated Server',
                    ],
                ],
            ];

            $response = putJson('/api/v1/ip-addresses/999999', $data);

            $response->assertStatus(404);
        });

        it('can update all ip address if the user is a super admin', function () {

            $ipAddress = IpAddress::factory()->create(['created_by' => 2]);
            $data = [
                'data' => [
                    'attributes' => [
                        'value' => '192.168.1.101',
                        'label' => 'Updated Server',
                    ],
                ],
            ];
            $response = putJson("/api/v1/ip-addresses/{$ipAddress->id}", $data);
            $response->assertStatus(200);
        });

        it('can only update his own IP address if the user is not a super admin', function () {
            $user1 = new User;
            $user1->id = 1;
            $user1->type = 'user';
            $user2 = new User;
            $user2->id = 2;
            $user2->type = 'user';

            $ipAddress = IpAddress::factory()->create(['created_by' => $user1->id]);

            actingAs($user2);
            $data = [
                'data' => [
                    'attributes' => [
                        'value' => '192.168.1.101',
                        'label' => 'Updated Server',
                    ],
                ],
            ];
            $response = putJson("/api/v1/ip-addresses/{$ipAddress->id}", $data);
            $response->assertStatus(403);
            actingAs($user1);
            $response = putJson("/api/v1/ip-addresses/{$ipAddress->id}", $data);
            $response->assertStatus(200);
        });
    });

    describe('destroy', function () {
        it('can delete an IP address', function () {
            $ipAddress = IpAddress::factory()->create();

            $response = deleteJson("/api/v1/ip-addresses/{$ipAddress->id}");

            $response->assertStatus(200);

            $this->assertDatabaseMissing('ip_addresses', [
                'id' => $ipAddress->id,
            ]);
        });

        it('returns 404 when deleting non-existent IP address', function () {
            $response = deleteJson('/api/v1/ip-addresses/999999');

            $response->assertStatus(404);
        });

        it('can delete all ip address if the user is a super admin', function () {
            $ipAddress = IpAddress::factory()->create(['created_by' => 2]);
            $response = deleteJson("/api/v1/ip-addresses/{$ipAddress->id}");
            $response->assertStatus(200);
        });
        it('can only delete his own IP address if the user is not a super admin', function () {
            $user1 = new User;
            $user1->id = 1;
            $user1->type = 'user';
            $user2 = new User;
            $user2->id = 2;
            $user2->type = 'user';

            $ipAddress = IpAddress::factory()->create(['created_by' => $user1->id]);

            actingAs($user2);
            $response = deleteJson("/api/v1/ip-addresses/{$ipAddress->id}");
            $response->assertStatus(403);
            actingAs($user1);
            $response = deleteJson("/api/v1/ip-addresses/{$ipAddress->id}");
            $response->assertStatus(200);
        });
    });
});
