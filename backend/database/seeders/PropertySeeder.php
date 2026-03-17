<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\User;
use App\Models\Category;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer les utilisateurs
        $agent = User::where('email', 'jean.dupont@agence.com')->first();
        $owner = User::where('email', 'pierre.durand@email.com')->first();
        
        // Récupérer les catégories
        $apartmentCat = Category::where('slug', 'apartment')->first();
        $houseCat = Category::where('slug', 'house')->first();
        $studioCat = Category::where('slug', 'studio')->first();

        if (!$agent || !$owner || !$apartmentCat) {
            $this->command->warn('Données de référence manquantes, veuillez d\'abord exécuter UserSeeder et CategorySeeder');
            return;
        }

        $properties = [
            [
                'title' => 'Bel appartement centre-ville',
                'description' => 'Superbe appartement entièrement rénové avec vue dégagée. Proche commerces et transports.',
                'price' => 850.00,
                'address' => '15 rue de la Paix',
                'city' => 'Lyon',
                'postal_code' => '69002',
                'surface' => 65.5,
                'rooms' => 3,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'type' => 'apartment',
                'category_id' => $apartmentCat->id,
                'features' => json_encode(['Ascenseur', 'Cave', 'Balcon', 'Parking']),
                'images' => json_encode([]), // Pas d'images pour éviter les erreurs
            ],
            [
                'title' => 'Maison familiale avec jardin',
                'description' => 'Maison spacieuse avec grand jardin, calme et bien exposée. Garage et dépendances.',
                'price' => 1500.00,
                'address' => '25 chemin des Fleurs',
                'city' => 'Caluire-et-Cuire',
                'postal_code' => '69300',
                'surface' => 120.0,
                'rooms' => 5,
                'bedrooms' => 4,
                'bathrooms' => 2,
                'type' => 'house',
                'category_id' => $houseCat->id,
                'features' => json_encode(['Jardin', 'Garage', 'Cave', 'Terrasse']),
                'images' => json_encode([]),
            ],
            [
                'title' => 'Studio proche université',
                'description' => 'Studio meublé idéal pour étudiant. Proche université et transports.',
                'price' => 450.00,
                'address' => '8 rue de la Jeunesse',
                'city' => 'Villeurbanne',
                'postal_code' => '69100',
                'surface' => 28.0,
                'rooms' => 1,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'type' => 'studio',
                'category_id' => $studioCat->id,
                'features' => json_encode(['Meublé', 'Internet', 'Proche commerces']),
                'images' => json_encode([]),
            ],
        ];

        foreach ($properties as $propertyData) {
            Property::updateOrCreate(
                ['title' => $propertyData['title']],
                array_merge($propertyData, [
                    'user_id' => $agent->id,
                    'owner_id' => $owner->id,
                    'status' => 'available',
                ])
            );
        }

        $this->command->info('Propriétés créées avec succès !');
    }
}