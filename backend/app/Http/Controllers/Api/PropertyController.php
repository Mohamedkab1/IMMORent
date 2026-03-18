<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    /**
     * Liste des biens disponibles (PUBLIQUE)
     */
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

            if ($request->has('surface_min') && $request->surface_min > 0) {
                $query->where('surface', '>=', $request->surface_min);
            }

            if ($request->has('surface_max') && $request->surface_max > 0) {
                $query->where('surface', '<=', $request->surface_max);
            }

            if ($request->has('category_id') && !empty($request->category_id)) {
                $query->where('category_id', $request->category_id);
            }

            // Tri
            $orderBy = $request->get('order_by', 'created_at');
            $orderDir = $request->get('order_dir', 'desc');
            $query->orderBy($orderBy, $orderDir);

            $properties = $query->paginate($request->get('per_page', 12));

            // Transformer les données
            $properties->getCollection()->transform(function ($property) {
                return $this->formatProperty($property);
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

    /**
     * Détails d'un bien (PUBLIQUE)
     */
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

            return response()->json([
                'success' => true,
                'data' => $this->formatProperty($property, true)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement du bien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer un bien (Agent/Admin)
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'address' => 'required|string',
                'city' => 'required|string',
                'postal_code' => 'required|string|max:10',
                'surface' => 'required|numeric|min:0',
                'type' => 'required|in:apartment,house,commercial,land,studio',
                'category_id' => 'required|exists:categories,id',
                'owner_id' => 'nullable|exists:users,id',
                'rooms' => 'nullable|integer|min:0',
                'bedrooms' => 'nullable|integer|min:0',
                'bathrooms' => 'nullable|integer|min:0',
                'features' => 'nullable|array',
                'images' => 'nullable|array',
                'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except('images');
            
            // Gestion des images
            if ($request->hasFile('images')) {
                $images = [];
                foreach ($request->file('images') as $image) {
                    $path = $image->store('properties', 'public');
                    $images[] = $path;
                }
                $data['images'] = $images;
            } else {
                $data['images'] = [];
            }

            // Traiter les features (équipements)
            if (isset($data['features']) && is_array($data['features'])) {
                $data['features'] = json_encode($data['features']);
            }

            $data['user_id'] = $request->user()->id; // Agent connecté
            $data['status'] = 'available';

            $property = Property::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Bien créé avec succès',
                'data' => $this->formatProperty($property)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du bien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un bien
     */
    public function update(Request $request, $id)
    {
        try {
            $property = Property::find($id);

            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }

            // Vérifier les permissions
            if ($property->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé à modifier ce bien'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric|min:0',
                'address' => 'sometimes|string',
                'city' => 'sometimes|string',
                'postal_code' => 'sometimes|string|max:10',
                'surface' => 'sometimes|numeric|min:0',
                'status' => 'sometimes|in:available,rented,reserved,unavailable',
                'type' => 'sometimes|in:apartment,house,commercial,land,studio',
                'category_id' => 'sometimes|exists:categories,id',
                'owner_id' => 'nullable|exists:users,id',
                'rooms' => 'nullable|integer|min:0',
                'bedrooms' => 'nullable|integer|min:0',
                'bathrooms' => 'nullable|integer|min:0',
                'features' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();
            
            // Traiter les features (équipements)
            if (isset($data['features']) && is_array($data['features'])) {
                $data['features'] = json_encode($data['features']);
            }

            $property->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Bien mis à jour avec succès',
                'data' => $this->formatProperty($property)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du bien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un bien
     */
    public function destroy(Request $request, $id)
    {
        try {
            $property = Property::find($id);

            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }

            // Vérifier les permissions
            if ($property->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé à supprimer ce bien'
                ], 403);
            }

            // Supprimer les images associées
            if ($property->images && is_array($property->images)) {
                foreach ($property->images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }

            $property->delete();

            return response()->json([
                'success' => true,
                'message' => 'Bien supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du bien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload d'images pour un bien
     */
    public function uploadImages(Request $request, $id)
    {
        try {
            $property = Property::find($id);

            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }

            if ($property->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'images' => 'required|array',
                'images.*' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $newImages = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('properties', 'public');
                $newImages[] = $path;
            }

            $currentImages = $property->images ?? [];
            if (is_string($currentImages)) {
                $currentImages = json_decode($currentImages, true) ?? [];
            }
            
            $property->images = array_merge($currentImages, $newImages);
            $property->save();

            return response()->json([
                'success' => true,
                'message' => 'Images uploadées avec succès',
                'data' => $this->formatProperty($property)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload des images',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une image d'un bien
     */
    public function deleteImage(Request $request, $id, $index)
    {
        try {
            $property = Property::find($id);

            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }

            if ($property->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé'
                ], 403);
            }

            $images = $property->images ?? [];
            if (is_string($images)) {
                $images = json_decode($images, true) ?? [];
            }

            if (isset($images[$index])) {
                Storage::disk('public')->delete($images[$index]);
                unset($images[$index]);
                $property->images = array_values($images); // Réindexer le tableau
                $property->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Image supprimée avec succès',
                'data' => $this->formatProperty($property)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Liste des biens gérés par l'agent connecté
     */
    public function myProperties(Request $request)
    {
        try {
            $properties = Property::with(['category', 'owner'])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            $properties->getCollection()->transform(function ($property) {
                return $this->formatProperty($property);
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

    /**
     * Liste de tous les biens (Admin uniquement)
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = Property::with(['user', 'category', 'owner']);

            // Filtres
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            if ($request->has('user_id') && !empty($request->user_id)) {
                $query->where('user_id', $request->user_id);
            }

            $properties = $query->orderBy('created_at', 'desc')->paginate(20);

            $properties->getCollection()->transform(function ($property) {
                return $this->formatProperty($property);
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

    /**
     * Vérifier/Approuver un bien (Admin)
     */
    public function verify(Request $request, $id)
    {
        try {
            $property = Property::find($id);

            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:available,unavailable',
                'verified' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $property->update([
                'status' => $request->status,
                'verified' => $request->verified,
                'verified_at' => now(),
                'verified_by' => $request->user()->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bien vérifié avec succès',
                'data' => $this->formatProperty($property)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification du bien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Formater les données d'une propriété
     */
    private function formatProperty($property, $detailed = false)
    {
        // Parser les features
        $features = [];
        if (isset($property->features)) {
            if (is_string($property->features)) {
                $features = json_decode($property->features, true) ?? [];
            } elseif (is_array($property->features)) {
                $features = $property->features;
            }
        }

        // Parser les images
        $images = [];
        if (isset($property->images)) {
            if (is_string($property->images)) {
                $images = json_decode($property->images, true) ?? [];
            } elseif (is_array($property->images)) {
                $images = $property->images;
            }
        }

        $formatted = [
            'id' => $property->id,
            'title' => $property->title,
            'description' => $property->description,
            'price' => (float) $property->price,
            'address' => $property->address,
            'city' => $property->city,
            'postal_code' => $property->postal_code,
            'surface' => (float) $property->surface,
            'rooms' => $property->rooms,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'status' => $property->status,
            'status_label' => $this->getStatusLabel($property->status),
            'type' => $property->type,
            'type_label' => $this->getTypeLabel($property->type),
            'features' => $features,
            'images' => $images,
            'category_id' => $property->category_id,
            'category' => $property->category ? [
                'id' => $property->category->id,
                'name' => $property->category->name,
                'slug' => $property->category->slug,
            ] : null,
            'user_id' => $property->user_id,
            'user' => $property->user ? [
                'id' => $property->user->id,
                'name' => $property->user->name,
                'email' => $property->user->email,
                'phone' => $property->user->phone,
            ] : null,
            'owner_id' => $property->owner_id,
            'owner' => $property->owner ? [
                'id' => $property->owner->id,
                'name' => $property->owner->name,
                'email' => $property->owner->email,
                'phone' => $property->owner->phone,
            ] : null,
            'created_at' => $property->created_at,
            'updated_at' => $property->updated_at,
            'full_address' => $property->address . ', ' . $property->city . ' ' . $property->postal_code,
        ];

        // Ajouter des détails supplémentaires pour la vue détaillée
        if ($detailed) {
            $formatted['latitude'] = $property->latitude;
            $formatted['longitude'] = $property->longitude;
            $formatted['deleted_at'] = $property->deleted_at;
            $formatted['requests_count'] = $property->rentalRequests()->count();
            $formatted['contracts_count'] = $property->contracts()->count();
        }

        return $formatted;
    }

    /**
     * Obtenir le libellé du type de bien
     */
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

    /**
     * Obtenir le libellé du statut
     */
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