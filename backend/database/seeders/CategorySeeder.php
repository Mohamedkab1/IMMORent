<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Appartement', 'slug' => 'apartment', 'description' => 'Appartements en ville ou en résidence'],
            ['name' => 'Maison', 'slug' => 'house', 'description' => 'Maisons individuelles ou mitoyennes'],
            ['name' => 'Local commercial', 'slug' => 'commercial', 'description' => 'Boutiques, bureaux, locaux d\'activité'],
            ['name' => 'Terrain', 'slug' => 'land', 'description' => 'Terrains nus ou constructibles'],
            ['name' => 'Studio', 'slug' => 'studio', 'description' => 'Studios et petits appartements'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}