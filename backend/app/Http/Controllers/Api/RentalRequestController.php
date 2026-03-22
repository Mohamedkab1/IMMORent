<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RentalRequest;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class RentalRequestController extends Controller
{
    /**
     * Liste des demandes (pour les agents et admin)
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            // Si l'utilisateur est agent, voir les demandes de ses biens
            if ($user->isAgent()) {
                $requests = RentalRequest::with(['user', 'property'])
                    ->whereHas('property', function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })
                    ->orderBy('created_at', 'desc')
                    ->paginate(20);
            } 
            // Si admin, voir toutes les demandes
            elseif ($user->isAdmin()) {
                $requests = RentalRequest::with(['user', 'property'])
                    ->orderBy('created_at', 'desc')
                    ->paginate(20);
            } 
            // Sinon, voir uniquement ses propres demandes
            else {
                $requests = RentalRequest::with(['property'])
                    ->where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->paginate(20);
            }
            
            return response()->json([
                'success' => true,
                'data' => $requests
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur index requests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des demandes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer une demande de location (Client)
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'property_id' => 'required|exists:properties,id',
                'start_date' => 'required|date|after_or_equal:today', // Changé de "after" à "after_or_equal"
                'end_date' => 'required|date|after:start_date',
                'message' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $property = Property::find($request->property_id);
            
            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }
            
            if ($property->status !== 'available') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce bien n\'est plus disponible à la location'
                ], 400);
            }

            // Vérifier si une demande existe déjà pour cette période
            $existingRequest = RentalRequest::where('property_id', $request->property_id)
                ->where('status', 'pending')
                ->where(function($query) use ($request) {
                    $query->whereBetween('start_date', [$request->start_date, $request->end_date])
                          ->orWhereBetween('end_date', [$request->start_date, $request->end_date])
                          ->orWhere(function($q) use ($request) {
                              $q->where('start_date', '<=', $request->start_date)
                                ->where('end_date', '>=', $request->end_date);
                          });
                })->first();

            if ($existingRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Une demande existe déjà pour cette période'
                ], 400);
            }

            $rentalRequest = RentalRequest::create([
                'user_id' => $request->user()->id,
                'property_id' => $request->property_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'message' => $request->message,
                'status' => 'pending'
            ]);

            // Charger les relations pour la réponse
            $rentalRequest->load('property', 'user');

            return response()->json([
                'success' => true,
                'message' => 'Demande envoyée avec succès',
                'data' => $rentalRequest
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur store request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Détails d'une demande
     */
    public function show($id)
    {
        try {
            $request = RentalRequest::with(['user', 'property', 'property.user', 'processor'])
                ->find($id);
            
            if (!$request) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $request
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur show request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Traiter une demande (Approuver/Refuser) - Pour les agents
     */
    public function process(Request $request, $id)
    {
        try {
            $rentalRequest = RentalRequest::with(['property', 'user'])->find($id);
            
            if (!$rentalRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée'
                ], 404);
            }
            
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:approved,rejected',
                'rejection_reason' => 'required_if:status,rejected|nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Vérifier que l'utilisateur a le droit de traiter cette demande
            $user = $request->user();
            $property = $rentalRequest->property;
            
            if (!$user->isAdmin() && $property->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à traiter cette demande'
                ], 403);
            }
            
            // Vérifier que la demande est toujours en attente
            if ($rentalRequest->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette demande a déjà été traitée'
                ], 400);
            }
            
            $rentalRequest->update([
                'status' => $request->status,
                'rejection_reason' => $request->rejection_reason,
                'processed_at' => now(),
                'processed_by' => $user->id
            ]);
            
            // Si approuvé, mettre à jour le statut du bien
            if ($request->status === 'approved') {
                $property->update(['status' => 'reserved']);
            }
            
            return response()->json([
                'success' => true,
                'message' => $request->status === 'approved' ? 'Demande approuvée avec succès' : 'Demande refusée',
                'data' => $rentalRequest->load('user', 'property')
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur process request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Annuler une demande (Client)
     */
    public function cancel($id)
    {
        try {
            $rentalRequest = RentalRequest::find($id);
            
            if (!$rentalRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée'
                ], 404);
            }
            
            // Vérifier que l'utilisateur est le propriétaire de la demande
            if ($rentalRequest->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à annuler cette demande'
                ], 403);
            }
            
            if ($rentalRequest->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Seules les demandes en attente peuvent être annulées'
                ], 400);
            }
            
            $rentalRequest->update(['status' => 'cancelled']);
            
            return response()->json([
                'success' => true,
                'message' => 'Demande annulée avec succès',
                'data' => $rentalRequest
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur cancel request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'annulation de la demande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mes demandes (Client)
     */
    public function myRequests(Request $request)
    {
        try {
            $requests = RentalRequest::with(['property', 'property.user'])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);
                
            return response()->json([
                'success' => true,
                'data' => $requests
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur myRequests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement de vos demandes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Demandes pour un bien spécifique (Agent)
     */
    public function propertyRequests(Request $request, $propertyId)
    {
        try {
            $property = Property::find($propertyId);
            
            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }
            
            // Vérifier que l'utilisateur a le droit de voir ces demandes
            $user = $request->user();
            if (!$user->isAdmin() && $property->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à voir les demandes de ce bien'
                ], 403);
            }
            
            $requests = RentalRequest::with(['user'])
                ->where('property_id', $propertyId)
                ->orderBy('created_at', 'desc')
                ->paginate(20);
                
            return response()->json([
                'success' => true,
                'data' => $requests
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur propertyRequests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des demandes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Statistiques des demandes (Agent)
     */
    public function stats(Request $request)
    {
        try {
            $user = $request->user();
            
            $query = RentalRequest::query();
            
            // Filtrer par biens de l'agent si ce n'est pas admin
            if (!$user->isAdmin()) {
                $query->whereHas('property', function($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
            }
            
            $stats = [
                'total' => $query->count(),
                'pending' => (clone $query)->where('status', 'pending')->count(),
                'approved' => (clone $query)->where('status', 'approved')->count(),
                'rejected' => (clone $query)->where('status', 'rejected')->count(),
                'cancelled' => (clone $query)->where('status', 'cancelled')->count(),
                'this_month' => (clone $query)->whereMonth('created_at', now()->month)->count(),
            ];
            
            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur stats requests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}