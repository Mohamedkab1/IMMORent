<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;

class PropertyController extends Controller
{
    /**
     * Liste des biens disponibles (PUBLIQUE)
     */
    public function index(Request $request)
    {
        try {
            $query = Property::with(['category', 'user', 'owner'])
                ->where('status', 'available');

            // Filtre par type de transaction (sale/rent) via listing_type
            if ($request->has('transaction_type') && !empty($request->transaction_type)) {
                $listingType = $request->transaction_type === 'sale' ? 'for_sale' : 'for_rent';
                $query->where('listing_type', $listingType);
            } elseif ($request->has('listing_type') && !empty($request->listing_type)) {
                $query->where('listing_type', $request->listing_type);
            }

            // Filtrage par type de bien (apartment, house, etc.)
            if ($request->has('type') && !empty($request->type)) {
                $query->where('type', $request->type);
            }

            // Filtrage par ville
            if ($request->has('city') && !empty($request->city)) {
                $query->where('city', 'like', '%' . $request->city . '%');
            }

            // Recherche textuelle
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('title', 'like', '%' . $searchTerm . '%')
                      ->orWhere('description', 'like', '%' . $searchTerm . '%')
                      ->orWhere('address', 'like', '%' . $searchTerm . '%');
                });
            }
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            if ($request->has('rooms')) {
                $query->where('rooms', '>=', $request->rooms);
            }

            // Tri
            $sortField = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('order', 'desc');
            $allowedSorts = ['price', 'created_at', 'surface', 'rooms'];
            
            if (in_array($sortField, $allowedSorts)) {
                $query->orderBy($sortField, $sortOrder);
            } else {
                $query->latest();
            }

            $properties = $query->paginate($request->get('per_page', 12));

            $properties->getCollection()->transform(function ($property) {
                return $this->formatProperty($property);
            });

            return response()->json([
                'success' => true,
                'data' => $properties
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur index properties: ' . $e->getMessage());
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
            Log::error('Erreur show property: ' . $e->getMessage());
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
    public function store(StorePropertyRequest $request)
    {
        try {
            $data = $request->validated();
            unset($data['images']); // On gère les images séparément
            
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

            // Traiter les features
            if (isset($data['features']) && is_array($data['features'])) {
                $data['features'] = json_encode($data['features']);
            }

            $data['user_id'] = $request->user()->id;
            $data['status'] = 'available';
            
            // Fix bug: transaction_type supplied by frontend must be stored in listing_type
            if (isset($data['transaction_type'])) {
                if (!isset($data['listing_type'])) {
                    $data['listing_type'] = $data['transaction_type'] === 'sale' ? 'for_sale' : 'for_rent';
                }
                unset($data['transaction_type']);
            }

            $property = Property::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Bien créé avec succès',
                'data' => $this->formatProperty($property)
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur store property: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du bien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Formater une propriété pour la réponse API.
     * Calcule les champs dérivés directement ici pour éviter
     * la dépendance sur des accesseurs non définis dans le modèle.
     */
    private function formatProperty($property, $detailed = false)
    {
        // --- Parser les features (JSON string ou array) ---
        $features = [];
        if (isset($property->features)) {
            $features = is_string($property->features)
                ? (json_decode($property->features, true) ?? [])
                : (array) $property->features;
        }

        // --- Parser les images (JSON string ou array) ---
        $images = [];
        if (isset($property->images)) {
            $images = is_string($property->images)
                ? (json_decode($property->images, true) ?? [])
                : (array) $property->images;
        }

        // --- Calculer transaction_type depuis listing_type ---
        $listingType = $property->listing_type ?? null;
        $transactionType = match($listingType) {
            'for_sale' => 'sale',
            'for_rent' => 'rent',
            default    => $property->transaction_type ?? 'rent',
        };
        $transactionTypeLabel = $transactionType === 'sale' ? 'À vendre' : 'À louer';

        // --- Labels de type de bien ---
        $typeLabels = [
            'apartment'  => 'Appartement',
            'house'      => 'Maison',
            'commercial' => 'Local commercial',
            'land'       => 'Terrain',
            'studio'     => 'Studio',
        ];
        $typeLabel = $typeLabels[$property->type] ?? ucfirst($property->type ?? '');

        // --- Affichage prix ---
        $priceFormatted = number_format((float) $property->price, 0, ',', ' ');
        $priceDisplay = $transactionType === 'rent'
            ? $priceFormatted . ' DH/mois'
            : $priceFormatted . ' DH';

        // --- Labels de statut ---
        $statusLabels = [
            'available'   => 'Disponible',
            'rented'      => 'Loué',
            'sold'        => 'Vendu',
            'reserved'    => 'Réservé',
            'unavailable' => 'Indisponible',
        ];
        $statusLabel = $statusLabels[$property->status] ?? ucfirst($property->status ?? '');

        $formatted = [
            'id'                    => $property->id,
            'title'                 => $property->title,
            'description'           => $property->description,
            'price'                 => (float) $property->price,
            'price_display'         => $priceDisplay,
            'transaction_type'      => $transactionType,
            'transaction_type_label'=> $transactionTypeLabel,
            'listing_type'          => $listingType,
            'address'               => $property->address,
            'city'                  => $property->city,
            'postal_code'           => $property->postal_code,
            'surface'               => (float) $property->surface,
            'rooms'                 => (int) $property->rooms,
            'bedrooms'              => (int) ($property->bedrooms ?? 0),
            'bathrooms'             => (int) ($property->bathrooms ?? 0),
            'status'                => $property->status,
            'status_label'          => $statusLabel,
            'type'                  => $property->type,
            'type_label'            => $typeLabel,
            'features'              => $features,
            'images'                => $images,
            'category_id'           => $property->category_id,
            'user_id'               => $property->user_id,
            'owner_id'              => $property->owner_id,
            'is_featured'           => (bool) $property->is_featured,
            'is_approved'           => (bool) $property->is_approved,
            'is_archived'           => (bool) $property->is_archived,
            'created_at'            => $property->created_at,
            'updated_at'            => $property->updated_at,
        ];

        if ($detailed) {
            $formatted['full_address'] = implode(', ', array_filter([
                $property->address,
                $property->city,
                $property->postal_code,
            ]));
            $formatted['user'] = $property->user ? [
                'id'    => $property->user->id,
                'name'  => $property->user->name,
                'email' => $property->user->email,
                'phone' => $property->user->phone,
            ] : null;
            $formatted['category'] = $property->category ? [
                'id'   => $property->category->id,
                'name' => $property->category->name,
                'slug' => $property->category->slug,
            ] : null;
        }

        return $formatted;
    }

    /**
     * Mettre à jour un bien
     */
    public function update(UpdatePropertyRequest $request, $id)
    {
        try {
            $property = Property::find($id);

            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }

            // Vérifier les permissions (propriétaire du listing ou admin)
            if ($property->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé à modifier ce bien'
                ], 403);
            }

            $data = $request->validated();
            unset($data['images']); // Géré séparément si upload
            unset($data['_method']);

            // ✅ FIX CRITIQUE : mapper transaction_type → listing_type
            if (isset($data['transaction_type'])) {
                $data['listing_type'] = $data['transaction_type'] === 'sale' ? 'for_sale' : 'for_rent';
            }

            // Traiter les features (peut arriver comme JSON string ou array)
            if (isset($data['features'])) {
                $data['features'] = is_array($data['features'])
                    ? json_encode($data['features'])
                    : $data['features'];
            }

            // Gérer les nouvelles images uploadées
            $currentImages = is_string($property->images)
                ? (json_decode($property->images, true) ?? [])
                : ($property->images ?? []);

            if ($request->hasFile('images')) {
                $newImages = [];
                foreach ($request->file('images') as $image) {
                    $newImages[] = $image->store('properties', 'public');
                }
                $data['images'] = array_merge($currentImages, $newImages);
            } elseif (isset($data['existing_images'])) {
                // Si on envoie la liste des images conservées
                $imagesToKeep = is_array($data['existing_images']) 
                    ? $data['existing_images'] 
                    : json_decode($data['existing_images'], true);
                
                // Supprimer physiquement les images retirées
                $removedImages = array_diff($currentImages, $imagesToKeep);
                foreach ($removedImages as $removed) {
                    Storage::disk('public')->delete($removed);
                }
                $data['images'] = $imagesToKeep;
                unset($data['existing_images']);
            }

            $property->update($data);
            $property->load(['user', 'category', 'owner']);

            return response()->json([
                'success' => true,
                'message' => 'Bien mis à jour avec succès',
                'data'    => $this->formatProperty($property->fresh(), true)
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur update property: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du bien',
                'error'   => $e->getMessage()
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
            Log::error('Erreur destroy property: ' . $e->getMessage());
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
                'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
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
            Log::error('Erreur uploadImages: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload des images',
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
            Log::error('Erreur myProperties: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des biens',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Liste complète des biens (Admin uniquement)
     */
    public function adminIndex(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        try {
            $query = Property::with(['category', 'user', 'owner']);

            // Filtres admin
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }

            if ($request->has('is_approved')) {
                $query->where('is_approved', $request->is_approved === 'true' || $request->is_approved === '1');
            }

            if ($request->has('is_archived')) {
                $query->where('is_archived', $request->is_archived === 'true' || $request->is_archived === '1');
            }

            if ($request->has('is_featured')) {
                $query->where('is_featured', $request->is_featured === 'true' || $request->is_featured === '1');
            }

            // Recherche
            if ($request->has('search') && !empty($request->search)) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('title', 'like', '%' . $searchTerm . '%')
                      ->orWhere('id', $searchTerm);
                });
            }

            $properties = $query->latest()->paginate($request->get('per_page', 15));

            $properties->getCollection()->transform(function ($property) {
                return $this->formatProperty($property, true);
            });

            return response()->json([
                'success' => true,
                'data' => $properties
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur adminIndex properties: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur serveur'], 500);
        }
    }

    /**
     * Approuver un bien
     */
    public function approve($id)
    {
        $property = Property::findOrFail($id);
        $property->is_approved = true;
        $property->save();

        return response()->json([
            'success' => true,
            'message' => 'Bien approuvé avec succès',
            'data' => $this->formatProperty($property)
        ]);
    }

    /**
     * Rejeter un bien
     */
    public function reject($id)
    {
        $property = Property::findOrFail($id);
        $property->is_approved = false;
        $property->status = 'unavailable';
        $property->save();

        return response()->json([
            'success' => true,
            'message' => 'Bien rejeté',
            'data' => $this->formatProperty($property)
        ]);
    }

    /**
     * Archiver/Désarchiver un bien
     */
    public function toggleArchive($id)
    {
        $property = Property::findOrFail($id);
        $property->is_archived = !$property->is_archived;
        $property->save();

        return response()->json([
            'success' => true,
            'message' => $property->is_archived ? 'Bien archivé' : 'Bien désarchivé',
            'data' => $this->formatProperty($property)
        ]);
    }

    /**
     * Mettre en avant / Retirer de la mise en avant
     */
    public function toggleFeatured($id)
    {
        $property = Property::findOrFail($id);
        $property->is_featured = !$property->is_featured;
        $property->save();

        return response()->json([
            'success' => true,
            'message' => $property->is_featured ? 'Bien mis en avant' : 'Mise en avant retirée',
            'data' => $this->formatProperty($property)
        ]);
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