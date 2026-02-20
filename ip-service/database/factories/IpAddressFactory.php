<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IpAddress>
 */
final class IpAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'value' => $this->faker->ipv4(),
            'label' => $this->faker->word(),
            'comment' => $this->faker->sentence(),
            'type' => random_int(0, 1) === 0 ? 'ipv4' : 'ipv6',
            'created_by' => 1,
            'metadata' => [
                'user' => [
                    'id' => 1,
                    'name' => 'Admin User',
                    'email' => 'admin@localhost.com',
                    'user_type' => 'super_admin',
                ],
            ],
        ];
    }
}
