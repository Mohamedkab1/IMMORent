<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Http\Requests\StorePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Notifications\GeneralNotification;
use App\Models\User;

class PropertyController extends Controller
{
    /**
     * Liste des biens disponibles (PUBLIQUE)
     */
    public function index(Request $request)
    {
        try {
            $query = Property::with(['category', 'user', 'owner'])
                // Afficher tous les biens publiés (available, reserved, rented, sold)
                // sauf les biens archivés ou non approuvés
                ->where('is_archived', false)
                ->where('is_approved', true)
                ->whereIn('status', ['available', 'reserved', 'rented', 'sold']);

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
            if ($request->has('min_price') && !empty($request->min_price)) {
                $query->where('price', '>=', (float) $request->min_price);
            }
            if ($request->has('max_price') && !empty($request->max_price)) {
                $query->where('price', '<=', (float) $request->max_price);
            }

            if ($request->has('surface_min') && !empty($request->surface_min)) {
                $query->where('surface', '>=', (float) $request->surface_min);
            }
            if ($request->has('surface_max') && !empty($request->surface_max)) {
                $query->where('surface', '<=', (float) $request->surface_max);
            }

            if ($request->has('rooms') && !empty($request->rooms)) {
                $rooms = (int) $request->rooms;
                if ($rooms >= 5) {
                    $query->where('rooms', '>=', 5);
                } else {
                    $query->where('rooms', $rooms);
                }
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
            $property = Property::with(['user', 'category', 'owner', 'contracts' => function($q) {
                $q->where('status', 'active')->latest();
            }])->find($id);

            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }

            $data = $this->formatProperty($property, true);

            // Si l'utilisateur est connecté, ajouter le statut de sa demande pour ce bien
            if (auth('sanctum')->check()) {
                $userRequest = \App\Models\RentalRequest::where('user_id', auth('sanctum')->id())
                    ->where('property_id', $id)
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                $data['user_request_status'] = $userRequest ? $userRequest->status : null;
            } else {
                $data['user_request_status'] = null;
            }

            return response()->json([
                'success' => true,
                'data' => $data
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

            // Automatiquement géocoder si latitude/longitude sont absents
            if ((!isset($data['latitude']) || !$data['latitude']) && isset($data['address'])) {
                $geo = $this->geocodeAddress($data['address']);
                if ($geo) {
                    $data['latitude'] = $geo['lat'];
                    $data['longitude'] = $geo['lon'];
                }
            }

            $property = Property::create($data);

            // Notifier les admins de la nouvelle annonce (pour approbation)
            $admins = User::getAdmins();
            $notifData = [
                'title' => 'Nouvelle annonce à approuver',
                'message' => "Un nouveau bien a été créé : \"{$property->title}\" par {$request->user()->name}. Il est en attente d'approbation.",
                'type' => 'property_created',
                'link' => '/admin/properties',
                'icon' => 'home'
            ];

            foreach ($admins as $admin) {
                if ($admin->id !== $request->user()->id) {
                    $admin->notify(new GeneralNotification($notifData));
                    try {
                        event(new \App\Events\RealTimeNotification($admin->id, $notifData));
                    } catch (\Exception $e) {}
                }
            }

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
        $imagesRaw = [];
        if (isset($property->images)) {
            $imagesRaw = is_string($property->images)
                ? (json_decode($property->images, true) ?? [])
                : (array) $property->images;
        }

        $images = array_map(function($path) {
            if (str_starts_with($path, 'http')) {
                return $path;
            }
            // Nettoyer le chemin pour éviter les doubles "storage/"
            $cleanPath = ltrim($path, '/');
            if (str_starts_with($cleanPath, 'storage/')) {
                $cleanPath = substr($cleanPath, 8);
            }
            return Storage::disk('public')->url($cleanPath);
        }, $imagesRaw);


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
            'latitude'              => (float) $property->latitude,
            'longitude'             => (float) $property->longitude,
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

            // Ajouter les infos du contrat actif si loué
            if ($property->status === 'rented' || $property->status === 'reserved') {
                $activeContract = $property->contracts->where('status', 'active')->first();
                if ($activeContract) {
                    $formatted['active_contract'] = [
                        'start_date' => $activeContract->start_date ? $activeContract->start_date->format('Y-m-d') : null,
                        'end_date' => $activeContract->end_date ? $activeContract->end_date->format('Y-m-d') : null,
                    ];
                }
            }
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
                
                // Normaliser les URLs complètes en chemins relatifs
                $imagesToKeep = array_map(function($path) {
                    if (str_contains($path, '/storage/')) {
                        $parts = explode('/storage/', $path);
                        return end($parts);
                    }
                    return $path;
                }, $imagesToKeep);

                // Supprimer physiquement les images retirées
                $removedImages = array_diff($currentImages, $imagesToKeep);
                foreach ($removedImages as $removed) {
                    Storage::disk('public')->delete($removed);
                }
                $data['images'] = $imagesToKeep;
                unset($data['existing_images']);
            }

            // Géocodage si l'adresse a changé ou si coordonnées absentes
            if (isset($data['address']) && (!isset($data['latitude']) || !$data['latitude'])) {
                $geo = $this->geocodeAddress($data['address']);
                if ($geo) {
                    $data['latitude'] = $geo['lat'];
                    $data['longitude'] = $geo['lon'];
                }
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
                'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240',
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

        // Notifier l'agent
        if ($property->user) {
            $property->user->notify(new GeneralNotification([
                'title' => 'Bien approuvé',
                'message' => "Votre bien \"{$property->title}\" a été approuvé par l'administrateur.",
                'type' => 'property_approved',
                'link' => '/dashboard/agent',
                'icon' => 'check-badge'
            ]));
        }

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

        // Notifier l'agent
        if ($property->user) {
            $property->user->notify(new GeneralNotification([
                'title' => 'Bien rejeté',
                'message' => "Votre bien \"{$property->title}\" a été rejeté par l'administrateur.",
                'type' => 'property_rejected',
                'link' => '/dashboard/agent',
                'icon' => 'x-circle'
            ]));
        }

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

    /**
     * Géocoder une adresse via Nominatim
     */
    private function geocodeAddress($address)
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'IMMORent-App'
            ])->get('https://nominatim.openstreetmap.org/search', [
                'q' => $address,
                'format' => 'json',
                'limit' => 1,
            ]);

            $coords = $response->json();
            if (!empty($coords)) {
                return [
                    'lat' => $coords[0]['lat'],
                    'lon' => $coords[0]['lon']
                ];
            }
        } catch (\Exception $e) {
            Log::error('Geocoding error for address ' . $address . ': ' . $e->getMessage());
        }
        return null;
    }

    /**
     * Endpoint temporaire pour géocoder les biens existants
     */
    public function geocodeExisting(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $properties = Property::whereNull('latitude')->orWhere('latitude', 0)->get();
        $count = 0;

        foreach ($properties as $property) {
            if ($property->address) {
                $geo = $this->geocodeAddress($property->address);
                if ($geo) {
                    $property->update([
                        'latitude' => $geo['lat'],
                        'longitude' => $geo['lon']
                    ]);
                    $count++;
                    // Respecter les limites de taux de Nominatim (1 requête par seconde recommandé)
                    usleep(1000000); 
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => "$count biens ont été géocodés avec succès."
        ]);
    }
}