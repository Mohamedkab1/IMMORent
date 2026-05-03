<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RentalRequest;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\StoreRentalRequestRequest;
use App\Notifications\GeneralNotification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewRentalRequestMail;
use App\Mail\RentalRequestStatusMail;

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
            
            // ✅ FIX: Normaliser transaction_type (for_rent => rent, for_sale => sale)
            $propertyType = match($property->listing_type ?? $property->transaction_type) {
                'for_rent' => 'rent',
                'for_sale' => 'sale',
                default    => $property->transaction_type ?? 'rent',
            };
            
            // Vérifier que le type de demande correspond au type de bien
            if ($request->type !== $propertyType) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le type de demande ne correspond pas au type de bien'
                ], 400);
            }
            
            // ✅ Seuls les biens vendus ou indisponibles sont totalement bloqués
            if ($property->status === 'sold') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce bien a déjà été vendu et n\'est plus disponible.',
                    'property_status' => 'sold'
                ], 400);
            }

            if ($property->status === 'unavailable') {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce bien n\'est plus disponible à la réservation.',
                    'property_status' => 'unavailable'
                ], 400);
            }

            // Les biens 'available', 'rented' et 'reserved' peuvent être réservés
            // à condition que les dates ne chevauchent pas une réservation existante

            // ✅ Vérifier chevauchement de dates pour les locations
            if ($request->type === 'rent' && $request->start_date && $request->end_date) {
                $overlap = RentalRequest::where('property_id', $request->property_id)
                    ->whereIn('status', ['pending', 'approved'])
                    ->where(function ($q) use ($request) {
                        $q->where(function ($q2) use ($request) {
                            $q2->where('start_date', '<=', $request->end_date)
                               ->where('end_date', '>=', $request->start_date);
                        });
                    })
                    ->exists();

                if ($overlap) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ces dates sont déjà réservées ou en attente de confirmation pour ce bien. Veuillez choisir d\'autres dates.',
                        'property_status' => 'date_conflict'
                    ], 400);
                }
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

            // Notifier l'agent/propriétaire
            $owner = $property->user; // Le créateur du bien
            if ($owner) {
                $owner->notify(new GeneralNotification([
                    'title' => 'Nouvelle demande',
                    'message' => "{$request->user()->name} a envoyé une demande pour {$property->title}",
                    'type' => 'request',
                    'link' => '/dashboard/agent',
                    'icon' => 'document-text'
                ]));
                
                // Envoi de l'email
                Mail::to($owner->email)->send(new NewRentalRequestMail($rentalRequest->load(['property', 'user'])));
            }

            return response()->json([
                'success' => true,
                'message' => $request->type === 'rent' ? 'Demande de location envoyée avec succès !' : 'Demande d\'achat envoyée avec succès !',
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
            
            // Si approuvé, mettre à jour le statut du bien
            if ($request->status === 'approved') {
                $property = Property::find($rentalRequest->property_id);
                if ($property) {
                    $property->update(['status' => 'reserved']);
                }
            }

            // Notifier le client
            $client = User::find($rentalRequest->user_id);
            if ($client) {
                $statusText = $request->status === 'approved' ? 'approuvée' : 'refusée';
                $client->notify(new GeneralNotification([
                    'title' => "Demande {$statusText}",
                    'message' => "Votre demande pour {$rentalRequest->property->title} a été {$statusText}",
                    'type' => 'request_update',
                    'link' => '/dashboard/client',
                    'icon' => $request->status === 'approved' ? 'check-circle' : 'x-circle'
                ]));

                // Envoi de l'email au client
                Mail::to($client->email)->send(new RentalRequestStatusMail($rentalRequest->load(['property', 'user'])));
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