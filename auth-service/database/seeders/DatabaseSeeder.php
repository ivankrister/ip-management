<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'super_admin@ip.com',
            'type' => 'super_admin',
        ]);

        User::factory()->create([
            'name' => 'Normal User',
            'email' => 'nomal_user@ip.com',
            'type' => 'user',
        ]);
    }
}
