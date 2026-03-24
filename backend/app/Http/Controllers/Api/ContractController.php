<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\RentalRequest;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\DomPDF\Facades\Pdf;

class ContractController extends Controller
{
    /**
     * Liste des contrats
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->isAdmin()) {
                $contracts = Contract::with(['property', 'tenant', 'owner', 'agent'])
                    ->orderBy('created_at', 'desc')
                    ->paginate(20);
            } elseif ($user->isAgent()) {
                $contracts = Contract::with(['property', 'tenant', 'owner'])
                    ->where('agent_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->paginate(20);
            } else {
                $contracts = Contract::with(['property', 'owner'])
                    ->where('tenant_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->paginate(20);
            }
            
            return response()->json([
                'success' => true,
                'data' => $contracts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des contrats'
            ], 500);
        }
    }

    /**
     * Créer un contrat à partir d'une demande validée
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'rental_request_id' => 'required|exists:rental_requests,id',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'monthly_rent' => 'required|numeric|min:0',
                'security_deposit' => 'required|numeric|min:0',
                'charges' => 'nullable|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $rentalRequest = RentalRequest::with(['user', 'property', 'property.user'])->find($request->rental_request_id);
            
            if (!$rentalRequest || $rentalRequest->status !== 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette demande ne peut pas être transformée en contrat'
                ], 400);
            }

            $contract = Contract::create([
                'rental_request_id' => $rentalRequest->id,
                'property_id' => $rentalRequest->property_id,
                'tenant_id' => $rentalRequest->user_id,
                'owner_id' => $rentalRequest->property->owner_id,
                'agent_id' => $rentalRequest->property->user_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'monthly_rent' => $request->monthly_rent,
                'security_deposit' => $request->security_deposit,
                'charges' => $request->charges ?? 0,
                'status' => 'active',
                'signed_at' => now(),
            ]);

            // Mettre à jour le statut du bien
            $property = Property::find($rentalRequest->property_id);
            $property->update(['status' => 'rented']);

            return response()->json([
                'success' => true,
                'message' => 'Contrat créé avec succès',
                'data' => $contract->load(['property', 'tenant', 'owner'])
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur création contrat: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du contrat'
            ], 500);
        }
    }

    /**
     * Détails d'un contrat
     */
    public function show($id)
    {
        try {
            $contract = Contract::with(['property', 'tenant', 'owner', 'agent', 'payments'])
                ->find($id);
            
            if (!$contract) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contrat non trouvé'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $contract
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement'
            ], 500);
        }
    }

    /**
     * Mettre à jour le statut d'un contrat
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $contract = Contract::find($id);
            
            if (!$contract) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contrat non trouvé'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:active,terminated,expired',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $contract->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'message' => 'Statut du contrat mis à jour',
                'data' => $contract
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour'
            ], 500);
        }
    }

    /**
     * Mes contrats (Client)
     */
    public function myContracts(Request $request)
    {
        try {
            $contracts = Contract::with(['property', 'owner'])
                ->where('tenant_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);
                
            return response()->json([
                'success' => true,
                'data' => $contracts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement'
            ], 500);
        }
    }

 
    /**
     * Contrats gérés par l'agent connecté
     */
    public function agentContracts(Request $request)
    {
        try {
            $user = $request->user();
            
            // Vérifier que l'utilisateur est un agent ou admin
            if (!$user->isAgent() && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé. Seuls les agents et administrateurs peuvent accéder à cette ressource.'
                ], 403);
            }
            
            $contracts = Contract::with(['property', 'tenant', 'owner'])
                ->where('agent_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(20);
                
            return response()->json([
                'success' => true,
                'data' => $contracts
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur agentContracts: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des contrats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Télécharger le contrat au format PDF
     */
    public function download($id)
    {
        try {
            // Récupérer le contrat
            $contract = Contract::find($id);
            
            if (!$contract) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contrat non trouvé'
                ], 404);
            }
            
            // Créer un PDF simple sans relations
            $html = '<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Contrat de location</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    h1 { color: #2563eb; text-align: center; }
                    .info { margin: 20px 0; }
                    .label { font-weight: bold; display: inline-block; width: 150px; }
                </style>
            </head>
            <body>
                <h1>ImmoGest</h1>
                <h2 style="text-align:center">Contrat de location</h2>
                <p style="text-align:center">N° ' . $contract->contract_number . '</p>
                <p style="text-align:center">Date: ' . date('d/m/Y') . '</p>

                <div class="info">
                    <p><span class="label">Contrat N°:</span> ' . $contract->contract_number . '</p>
                    <p><span class="label">Date de début:</span> ' . date('d/m/Y', strtotime($contract->start_date)) . '</p>
                    <p><span class="label">Date de fin:</span> ' . date('d/m/Y', strtotime($contract->end_date)) . '</p>
                    <p><span class="label">Loyer mensuel:</span> ' . number_format($contract->monthly_rent, 2) . ' €</p>
                    <p><span class="label">Charges:</span> ' . number_format($contract->charges ?? 0, 2) . ' €</p>
                    <p><span class="label">Dépôt de garantie:</span> ' . number_format($contract->security_deposit, 2) . ' €</p>
                </div>

                <div style="margin-top: 50px;">
                    <div style="display: inline-block; width: 45%;">
                        <p>Signature du bailleur</p>
                        <div style="border-top: 1px solid black; width: 80%; margin-top: 50px;"></div>
                    </div>
                    <div style="display: inline-block; width: 45%; float: right;">
                        <p>Signature du locataire</p>
                        <div style="border-top: 1px solid black; width: 80%; margin-top: 50px;"></div>
                    </div>
                </div>

                <p style="text-align:center; margin-top:50px; font-size:10px; color:gray;">
                    ImmoGest - Plateforme de gestion immobilière
                </p>
            </body>
            </html>';
            
            $pdf = Pdf::loadHTML($html);
            $pdf->setPaper('A4', 'portrait');
            
            return $pdf->download('contrat_' . $contract->contract_number . '.pdf');
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}