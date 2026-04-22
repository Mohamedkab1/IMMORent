<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RentalRequest;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreRentalRequestRequest;

class RentalRequestController extends Controller
{
    /**
     * Liste des demandes (pour les agents)
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->isAgent()) {
                $requests = RentalRequest::with(['user', 'property'])
                    ->whereHas('property', function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })
                    ->orderBy('created_at', 'desc')
                    ->get();
            } 
            elseif ($user->isAdmin()) {
                $requests = RentalRequest::with(['user', 'property'])
                    ->orderBy('created_at', 'desc')
                    ->get();
            } 
            else {
                $requests = RentalRequest::with(['property'])
                    ->where('user_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
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
     * Créer une demande (Location ou Achat)
     */
    public function store(StoreRentalRequestRequest $request)
    {
        try {
            $property = Property::find($request->property_id);
            
            if (!$property) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bien non trouvé'
                ], 404);
            }
            
            // Vérifier que le type de demande correspond au type de bien
            if ($request->type !== $property->transaction_type) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le type de demande ne correspond pas au type de bien'
                ], 400);
            }
            
            if ($property->status !== 'available') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce bien n\'est plus disponible'
                ], 400);
            }

            $rentalRequest = RentalRequest::create([
                'type' => $request->type,
                'user_id' => $request->user()->id,
                'property_id' => $request->property_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'message' => $request->message,
                'status' => 'pending'
            ]);

            // Classifier la notification vers le propriétaire (l'agent)
            $owner = $property->user;
            if ($owner) {
                $owner->notify(new \App\Notifications\RentalRequestStatusNotification($rentalRequest, 'created'));
            }

            return response()->json([
                'success' => true,
                'message' => $request->type === 'rent' ? 'Demande de location envoyée' : 'Demande d\'achat envoyée',
                'data' => $rentalRequest->load(['property', 'user'])
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
            $request = RentalRequest::with(['user', 'property'])->find($id);
            
            if (!$request) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée'
                ], 404);
            }

            $this->authorize('view', $request);
            
            return response()->json([
                'success' => true,
                'data' => $request
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement'
            ], 500);
        }
    }

    /**
     * Traiter une demande (Approuver/Refuser) - Pour les agents
     */
    public function process(Request $request, $id)
    {
        try {
            $rentalRequest = RentalRequest::with(['property'])->find($id);
            
            if (!$rentalRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demande non trouvée'
                ], 404);
            }

            $this->authorize('update', $rentalRequest);
            
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
            
            $rentalRequest->update([
                'status' => $request->status,
                'rejection_reason' => $request->rejection_reason,
                'processed_at' => now(),
                'processed_by' => $request->user()->id
            ]);
            
            // Envoyer la notification au client (le demandeur)
            if ($rentalRequest->user) {
                $rentalRequest->user->notify(new \App\Notifications\RentalRequestStatusNotification($rentalRequest, $request->status));
            }
            
            // Si approuvé, mettre à jour le statut du bien
            if ($request->status === 'approved') {
                $property = Property::find($rentalRequest->property_id);
                if ($property) {
                    $property->update(['status' => 'reserved']);
                }
            }
            
            Log::info('Demande traitée', [
                'request_id' => $id,
                'status' => $request->status,
                'processed_by' => $request->user()->id
            ]);
            
            return response()->json([
                'success' => true,
                'message' => $request->status === 'approved' ? 'Demande approuvée' : 'Demande refusée',
                'data' => $rentalRequest
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erreur process request: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement',
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

            $this->authorize('delete', $rentalRequest);

            // Vérifier que la demande appartient à l'utilisateur
            if ($rentalRequest->user_id !== request()->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé à annuler cette demande'
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
                'message' => 'Demande annulée avec succès'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'annulation'
            ], 500);
        }
    }

    /**
     * Mes demandes (Client)
     */
    public function myRequests(Request $request)
    {
        try {
            $requests = RentalRequest::with(['property'])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $requests
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement'
            ], 500);
        }
    }
}