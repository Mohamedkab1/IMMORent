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
     * Liste des demandes (pour les agents)
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            // Si l'utilisateur est agent, voir les demandes de ses biens
            if ($user->isAgent()) {
                $requests = RentalRequest::with(['user', 'property', 'property.user'])
                    ->whereHas('property', function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })
                    ->orderBy('created_at', 'desc')
                    ->get(); // Utiliser get() au lieu de paginate() pour simplifier
                    
                Log::info('Demandes pour agent', [
                    'agent_id' => $user->id,
                    'count' => $requests->count()
                ]);
            } 
            // Si admin, voir toutes les demandes
            elseif ($user->isAdmin()) {
                $requests = RentalRequest::with(['user', 'property'])
                    ->orderBy('created_at', 'desc')
                    ->get();
            } 
            // Sinon, voir uniquement ses propres demandes
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
     * Créer une demande de location (Client)
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'property_id' => 'required|exists:properties,id',
                'start_date' => 'required|date|after_or_equal:today',
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
                          ->orWhereBetween('end_date', [$request->start_date, $request->end_date]);
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

            Log::info('Nouvelle demande créée', [
                'request_id' => $rentalRequest->id,
                'property_id' => $rentalRequest->property_id,
                'user_id' => $rentalRequest->user_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Demande envoyée avec succès',
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