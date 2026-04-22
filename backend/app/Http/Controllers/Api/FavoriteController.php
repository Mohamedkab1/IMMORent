<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Property;

class FavoriteController extends Controller
{
    /**
     * Obtenir les favoris de l'utilisateur
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            // Charger les propriétés et leurs catégories pour l'affichage complet
            $favorites = $user->favorites()->with('category')->latest()->get();
            
            // Format property
            $formattedFavorites = $favorites->map(function($property) {
                // Utiliser la même logique de parsage basique que le frontend attend
                $features = is_string($property->features) ? json_decode($property->features, true) : ($property->features ?? []);
                $images = is_string($property->images) ? json_decode($property->images, true) : ($property->images ?? []);
                
                return [
                    'id' => $property->id,
                    'title' => $property->title,
                    'price' => (float) $property->price,
                    'transaction_type' => $property->transaction_type, // Direct use of the column
                    'address' => $property->address,
                    'city' => $property->city,
                    'surface' => (float) $property->surface,
                    'rooms' => $property->rooms,
                    'bedrooms' => $property->bedrooms,
                    'bathrooms' => $property->bathrooms,
                    'status' => $property->status,
                    'type' => $property->type,
                    'features' => $features,
                    'images' => $images,
                    'category' => $property->category ? ['name' => $property->category->name] : null
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedFavorites
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des favoris',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Basculer l'état d'un favori (Ajouter/Supprimer)
     */
    public function toggle(Request $request)
    {
        try {
            $request->validate([
                'property_id' => 'required|exists:properties,id',
            ]);

            $user = $request->user();
            $propertyId = $request->property_id;

            // La méthode toggle ajoutera l'id s'il n'existe pas, et le supprimera s'il existe
            $result = $user->favorites()->toggle($propertyId);

            $isNowFavorited = count($result['attached']) > 0;

            return response()->json([
                'success' => true,
                'is_favorited' => $isNowFavorited,
                'message' => $isNowFavorited ? 'Bien ajouté aux favoris' : 'Bien retiré des favoris'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification des favoris',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
