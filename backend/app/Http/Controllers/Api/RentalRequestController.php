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
                $requests = RentalRequest::with(['user', 'property', 'contract'])
                    ->whereHas('property', function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })
                    ->orderBy('created_at', 'desc')
                    ->get();
            } 
            elseif ($user->isAdmin()) {
                $requests = RentalRequest::with(['user', 'property', 'contract'])
                    ->orderBy('created_at', 'desc')
                    ->get();
            } 
            else {
                $requests = RentalRequest::with(['property', 'contract'])
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
            
            // ✅ FIX: Normaliser le type de demande reçu
            $requestedType = match($request->type) {
                'for_rent', 'rent' => 'rent',
                'for_sale', 'sale' => 'sale',
                default => $request->type,
            };

            // ✅ FIX: Normaliser transaction_type du bien (for_rent => rent, for_sale => sale)
            $propertyType = match($property->listing_type ?? $property->transaction_type) {
                'for_rent', 'rent' => 'rent',
                'for_sale', 'sale' => 'sale',
                default => $property->transaction_type ?? 'rent',
            };
            
            // Vérifier que le type de demande correspond au type de bien
            if ($requestedType !== $propertyType) {
                return response()->json([
                    'success' => false,
                    'message' => "Le type de demande ($requestedType) ne correspond pas au type de bien ($propertyType)"
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

            $notifData = [
                'title' => 'Nouvelle demande',
                'message' => "{$request->user()->name} a envoyé une demande pour {$property->title}",
                'type' => 'request',
                'link' => '/dashboard/agent',
                'icon' => 'document-text'
            ];

            // Notifier le propriétaire (agent)
            $owner = $property->user;
            if ($owner) {
                $owner->notify(new GeneralNotification($notifData));
                try {
                    event(new \App\Events\RealTimeNotification($owner->id, $notifData));
                } catch (\Exception $e) {
                    Log::warning('Erreur RealTimeNotification (store) dans RentalRequestController: ' . $e->getMessage());
                }
                
                // Envoi de l'email
                try {
                    Mail::to($owner->email)->send(new NewRentalRequestMail($rentalRequest->load(['property', 'user'])));
                } catch (\Exception $mailEx) {
                    Log::warning('Impossible d\'envoyer l\'email de nouvelle demande: ' . $mailEx->getMessage());
                }
            }

            // Notifier également les administrateurs
            $admins = User::getAdmins();
            foreach ($admins as $admin) {
                // Éviter de notifier deux fois si l'admin est aussi le propriétaire
                if (!$owner || $admin->id !== $owner->id) {
                    $admin->notify(new GeneralNotification($notifData));
                    try {
                        event(new \App\Events\RealTimeNotification($admin->id, $notifData));
                    } catch (\Exception $e) {
                        // Silencieux pour les admins
                    }
                }
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
            $request = RentalRequest::with(['user', 'property', 'contract'])->find($id);
            
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
            
            $success = $rentalRequest->update([
                'status' => $request->status,
                'rejection_reason' => $request->rejection_reason,
                'processed_at' => now(),
                'processed_by' => $request->user()->id
            ]);

            if (!$success) {
                return response()->json(['success' => false, 'message' => 'Erreur lors de la mise à jour du statut'], 500);
            }

            Log::info('RentalRequest status updated', [
                'id' => $rentalRequest->id,
                'new_status' => $rentalRequest->status,
                'request_input' => $request->status
            ]);
            
            // Si approuvé, mettre à jour le statut du bien et générer le contrat
            if ($request->status === 'approved') {
                $property = Property::find($rentalRequest->property_id);
                if ($property) {
                    $property->update(['status' => 'reserved']);

                    // Génération automatique du contrat
                    $contractType = ($rentalRequest->type === 'rent' || $rentalRequest->type === 'for_rent') ? 'rent' : 'sale';
                    
                    $contractData = [
                        'contract_type' => $contractType,
                        'rental_request_id' => $rentalRequest->id,
                        'property_id' => $property->id,
                        'agent_id' => $property->user_id,
                        'status' => 'active',
                        'signed_at' => now(),
                    ];

                    if ($contractType === 'rent') {
                        $contractData['tenant_id'] = $rentalRequest->user_id;
                        $contractData['owner_id'] = $property->owner_id ?? $property->user_id;
                        $contractData['start_date'] = $rentalRequest->start_date;
                        $contractData['end_date'] = $rentalRequest->end_date;
                        $contractData['monthly_rent'] = $property->price;
                        $contractData['security_deposit'] = $property->price; // Par défaut, un mois de caution
                    } else {
                        $contractData['buyer_id'] = $rentalRequest->user_id;
                        $contractData['seller_id'] = $property->owner_id ?? $property->user_id;
                        $contractData['sale_date'] = now();
                        $contractData['sale_price'] = $property->price;
                    }

                    $contract = \App\Models\Contract::create($contractData);

                    // Notifier le client du nouveau contrat
                    $notifData = [
                        'title' => 'Nouveau contrat disponible',
                        'message' => "Un contrat a été généré pour votre demande sur : {$property->title}. Vous pouvez maintenant procéder au paiement.",
                        'type' => 'contract',
                        'link' => "/contracts/{$contract->id}",
                        'icon' => 'document-check'
                    ];
                    
                    $rentalRequest->user->notify(new \App\Notifications\GeneralNotification($notifData));
                    try {
                        event(new \App\Events\RealTimeNotification($rentalRequest->user->id, $notifData));
                    } catch (\Exception $e) {
                        Log::warning('Erreur RealTimeNotification (contrat) dans RentalRequestController: ' . $e->getMessage());
                    }
                }
            }

            // Notifier le client
            $client = User::find($rentalRequest->user_id);
            if ($client) {
                $statusText = $request->status === 'approved' ? 'approuvée' : 'refusée';
                $notifData = [
                    'title' => "Demande {$statusText}",
                    'message' => "Votre demande pour {$rentalRequest->property->title} a été {$statusText}",
                    'type' => 'request_update',
                    'link' => '/dashboard/client',
                    'icon' => $request->status === 'approved' ? 'check-circle' : 'x-circle'
                ];

                $client->notify(new \App\Notifications\GeneralNotification($notifData));
                try {
                    event(new \App\Events\RealTimeNotification($client->id, $notifData));
                } catch (\Exception $e) {
                    Log::warning('Erreur RealTimeNotification (process) dans RentalRequestController: ' . $e->getMessage());
                }

                Log::info('Notification envoyée au client', [
                    'client_id' => $client->id,
                    'status' => $request->status,
                    'property' => $rentalRequest->property->title
                ]);

                // Envoi de l'email au client (entouré de try-catch)
                try {
                    Mail::to($client->email)->send(new RentalRequestStatusMail($rentalRequest->load(['property', 'user'])));
                } catch (\Exception $mailEx) {
                    Log::warning('Impossible d\'envoyer l\'email de statut de demande au client: ' . $mailEx->getMessage());
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
            $rentalRequest = RentalRequest::with('property')->find($id);
            
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
            
            // Notifier l'agent et les admins que la demande a été annulée
            $agent = $rentalRequest->property->user;
            $admins = User::getAdmins();

            $notifData = [
                'title' => 'Demande annulée',
                'message' => "Le client {$rentalRequest->user->name} a annulé sa demande pour {$rentalRequest->property->title}.",
                'type' => 'request_cancelled',
                'link' => '/dashboard/agent',
                'icon' => 'x-mark'
            ];

            if ($agent) {
                $agent->notify(new GeneralNotification($notifData));
                try {
                    event(new \App\Events\RealTimeNotification($agent->id, $notifData));
                } catch (\Exception $e) {
                    Log::warning('Erreur RealTimeNotification (cancel) dans RentalRequestController: ' . $e->getMessage());
                }
            }

            // Notifier les admins
            foreach ($admins as $admin) {
                if (!$agent || $admin->id !== $agent->id) {
                    $admin->notify(new GeneralNotification($notifData));
                    try {
                        event(new \App\Events\RealTimeNotification($admin->id, $notifData));
                    } catch (\Exception $e) {}
                }
            }

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
            $requests = RentalRequest::with(['property', 'contract'])
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