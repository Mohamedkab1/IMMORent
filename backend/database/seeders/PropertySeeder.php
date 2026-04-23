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
        $agent = User::where('email', 'yassine@agent.ma')->first();
        $owner = User::where('email', 'sara@client.ma')->first();
        
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
                'title' => 'Appartement de luxe à l\'Hivernage',
                'description' => 'Superbe appartement de standing situé au coeur du quartier Hivernage. Résidence sécurisée avec piscine et salle de sport. Finitions haut de gamme, marbre au sol et climatisation centralisée.',
                'price' => 12000.00,
                'address' => 'Avenue Mohammed VI',
                'city' => 'Marrakech',
                'postal_code' => '40000',
                'surface' => 110.0,
                'rooms' => 3,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'type' => 'apartment',
                'category_id' => $apartmentCat->id,
                'features' => json_encode(['Piscine', 'Sécurité 24/7', 'Parking', 'Climatisation', 'Ascenseur']),
                'images' => json_encode(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80']),
                'listing_type' => 'for_rent',
            ],
            [
                'title' => 'Villa Contemporaine à Anfa',
                'description' => 'Magnifique villa moderne située sur la colline d\'Anfa. Grand jardin avec piscine à débordement, vue imprenable sur l\'océan. Architecture épurée et grands espaces de vie baignés de lumière.',
                'price' => 45000.00,
                'address' => 'Boulevard de Biarritz',
                'city' => 'Casablanca',
                'postal_code' => '20050',
                'surface' => 450.0,
                'rooms' => 7,
                'bedrooms' => 5,
                'bathrooms' => 4,
                'type' => 'villa',
                'category_id' => $houseCat->id,
                'features' => json_encode(['Piscine', 'Jardin', 'Garage', 'Système Alarme', 'Vue sur mer']),
                'images' => json_encode(['https://images.unsplash.com/photo-1613490491584-38f2130eb5a1?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80']),
                'listing_type' => 'for_rent',
            ],
            [
                'title' => 'Plateau de bureaux à Agdal',
                'description' => 'Espace professionnel de 150m² idéalement situé à l\'Agdal. Plateau ouvert avec 3 bureaux cloisonnés, kitchenette et sanitaires. Proche de toutes commodités et du tramway.',
                'price' => 18000.00,
                'address' => 'Avenue de France',
                'city' => 'Rabat',
                'postal_code' => '10080',
                'surface' => 150.0,
                'rooms' => 4,
                'bedrooms' => 0,
                'bathrooms' => 2,
                'type' => 'office',
                'category_id' => Category::where('slug', 'office')->first()?->id ?? $apartmentCat->id,
                'features' => json_encode(['Fibre Optique', 'Climatisation', 'Gardiennage', 'Ascenseur']),
                'images' => json_encode(['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80']),
                'listing_type' => 'for_rent',
            ],
            [
                'title' => 'Studio Moderne au Maârif',
                'description' => 'Studio entièrement meublé et équipé dans une résidence neuve au Maârif Extension. Idéal pour jeune cadre. Décoration soignée et luminosité optimale.',
                'price' => 5500.00,
                'address' => 'Rue Jean Jaurès',
                'city' => 'Casablanca',
                'postal_code' => '20100',
                'surface' => 45.0,
                'rooms' => 1,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'type' => 'studio',
                'category_id' => $studioCat->id,
                'features' => json_encode(['Meublé', 'Cuisine équipée', 'Parking sous-sol', 'Balcon']),
                'images' => json_encode(['https://images.unsplash.com/photo-1536376074432-ad64903347bb?auto=format&fit=crop&q=80']),
                'listing_type' => 'for_rent',
            ],
            [
                'title' => 'Duplex avec Vue sur Mer à Malabata',
                'description' => 'Splendide duplex situé en front de mer à Tanger. 3 chambres dont une suite parentale avec dressing. Grande terrasse offrant une vue panoramique sur la baie de Tanger.',
                'price' => 15000.00,
                'address' => 'Route de Malabata',
                'city' => 'Tanger',
                'postal_code' => '90000',
                'surface' => 180.0,
                'rooms' => 5,
                'bedrooms' => 3,
                'bathrooms' => 3,
                'type' => 'apartment',
                'category_id' => $apartmentCat->id,
                'features' => json_encode(['Vue sur mer', 'Terrasse', 'Piscine', 'Parking', 'Double vitrage']),
                'images' => json_encode(['https://images.unsplash.com/photo-1512918766675-ed406e3e7f0d?auto=format&fit=crop&q=80']),
                'listing_type' => 'for_rent',
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