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
        $users = [
            [
                'name' => 'Amine Bensouda',
                'email' => 'admin@immorent.ma',
                'password' => Hash::make('password'),
                'phone' => '+212 661 123456',
                'role_slug' => 'admin',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Yassine Lamrani',
                'email' => 'yassine@agent.ma',
                'password' => Hash::make('password'),
                'phone' => '+212 662 234567',
                'role_slug' => 'agent',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Leila Tazi',
                'email' => 'leila@agent.ma',
                'password' => Hash::make('password'),
                'phone' => '+212 663 345678',
                'role_slug' => 'agent',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Mehdi Alami',
                'email' => 'mehdi@client.ma',
                'password' => Hash::make('password'),
                'phone' => '+212 664 456789',
                'role_slug' => 'client',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Sara El Fassi',
                'email' => 'sara@client.ma',
                'password' => Hash::make('password'),
                'phone' => '+212 665 567890',
                'role_slug' => 'client',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            $roleSlug = $userData['role_slug'];
            unset($userData['role_slug']);
            
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
            
            $role = Role::where('slug', $roleSlug)->first();
            if ($role) {
                $user->role_id = $role->id;
                $user->save();
            }
        }
    }
}