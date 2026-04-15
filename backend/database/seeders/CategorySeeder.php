<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Appartement', 'slug' => 'apartment', 'description' => 'Appartements modernes en centre-ville ou en résidence.'],
            ['name' => 'Villa', 'slug' => 'house', 'description' => 'Villas de luxe, maisons avec jardin et propriétés spacieuses.'],
            ['name' => 'Bureau', 'slug' => 'office', 'description' => 'Espaces de travail et plateaux de bureaux professionnels.'],
            ['name' => 'Commerce', 'slug' => 'commercial', 'description' => 'Magasins, boutiques et locaux commerciaux.'],
            ['name' => 'Terrain', 'slug' => 'land', 'description' => 'Terrains constructibles, agricoles ou industriels.'],
            ['name' => 'Studio', 'slug' => 'studio', 'description' => 'Studios meublés ou vides pour célibataires ou étudiants.'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}