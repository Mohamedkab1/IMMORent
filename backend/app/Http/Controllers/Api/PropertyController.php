<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Property::with(['user', 'category', 'owner'])
                ->where('status', 'available');

            // Filtres
            if ($request->has('city') && !empty($request->city)) {
                $query->where('city', 'like', '%' . $request->city . '%');
            }

            if ($request->has('type') && !empty($request->type)) {
                $query->where('type', $request->type);
            }

            if ($request->has('min_price') && $request->has('max_price')) {
                $query->whereBetween('price', [$request->min_price, $request->max_price]);
            }

            if ($request->has('rooms') && $request->rooms > 0) {
                $query->where('rooms', '>=', $request->rooms);
            }

            $properties = $query->latest()->paginate($request->get('per_page', 12));

            // Transformer les données pour éviter les erreurs d'images
            $properties->getCollection()->transform(function ($property) {
                // S'assurer que images est un tableau
                if (is_string($property->images)) {
                    $property->images = json_decode($property->images, true) ?? [];
                }
                if (!is_array($property->images)) {
                    $property->images = [];
                }
                
                // Ajouter des labels
                $property->type_label = $this->getTypeLabel($property->type);
                $property->status_label = $this->getStatusLabel($property->status);
                
                return $property;
            });

            return response()->json([
                'success' => true,
                'data' => $properties
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des biens',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $property = Property::with(['user', 'category', 'owner'])->find($id);

            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }

            // S'assurer que images est un tableau
            if (is_string($property->images)) {
                $property->images = json_decode($property->images, true) ?? [];
            }
            if (!is_array($property->images)) {
                $property->images = [];
            }

            $property->type_label = $this->getTypeLabel($property->type);
            $property->status_label = $this->getStatusLabel($property->status);
            $property->full_address = $property->address . ', ' . $property->city . ' ' . $property->postal_code;

            return response()->json([
                'success' => true,
                'data' => $property
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement du bien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getTypeLabel($type)
    {
        $labels = [
            'apartment' => 'Appartement',
            'house' => 'Maison',
            'commercial' => 'Local commercial',
            'land' => 'Terrain',
            'studio' => 'Studio'
        ];
        return $labels[$type] ?? $type;
    }

    private function getStatusLabel($status)
    {
        $labels = [
            'available' => 'Disponible',
            'rented' => 'Loué',
            'reserved' => 'Réservé',
            'unavailable' => 'Indisponible'
        ];
        return $labels[$status] ?? $status;
    }
}