<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('slug', 'admin')->first();
        $agentRole = Role::where('slug', 'agent')->first();
        $clientRole = Role::where('slug', 'client')->first();

        // Admin
        User::updateOrCreate(
            ['email' => 'admin@immobilier.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'phone' => '0123456789',
                'address' => '1 rue de l\'Administration, Paris',
                'is_active' => true,
            ]
        );

        // Agents
        User::updateOrCreate(
            ['email' => 'jean.dupont@agence.com'],
            [
                'name' => 'Jean Dupont',
                'password' => Hash::make('password'),
                'role_id' => $agentRole->id,
                'phone' => '0123456780',
                'address' => '10 rue des Agents, Lyon',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'marie.martin@agence.com'],
            [
                'name' => 'Marie Martin',
                'password' => Hash::make('password'),
                'role_id' => $agentRole->id,
                'phone' => '0123456781',
                'address' => '20 avenue des Pros, Marseille',
                'is_active' => true,
            ]
        );

        // Clients
        User::updateOrCreate(
            ['email' => 'pierre.durand@email.com'],
            [
                'name' => 'Pierre Durand',
                'password' => Hash::make('password'),
                'role_id' => $clientRole->id,
                'phone' => '0623456789',
                'address' => '5 rue des Clients, Bordeaux',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'sophie.bernard@email.com'],
            [
                'name' => 'Sophie Bernard',
                'password' => Hash::make('password'),
                'role_id' => $clientRole->id,
                'phone' => '0634567890',
                'address' => '15 rue des Locataires, Lille',
                'is_active' => true,
            ]
        );
    }
}