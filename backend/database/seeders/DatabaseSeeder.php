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
        // Sembrar usuario administrador de pruebas
        User::create([
            'name' => 'Admin Principal',
            'email' => 'admin@test.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'ADMIN',
            'dinero' => 100.00,
        ]);

        // Sembrar usuario común de pruebas
        User::create([
            'name' => 'Usuario Normal',
            'email' => 'usuario@test.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'USUARIO',
            'dinero' => 100.00,
        ]);
    }
}
