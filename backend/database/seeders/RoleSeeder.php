<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Administrateur', 'slug' => 'admin', 'description' => 'Super utilisateur avec tous les droits'],
            ['name' => 'Agent immobilier', 'slug' => 'agent', 'description' => 'Gère les biens et les locations'],
            ['name' => 'Client', 'slug' => 'client', 'description' => 'Recherche et loue des biens'],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}