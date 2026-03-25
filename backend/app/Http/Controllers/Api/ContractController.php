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
/**
 * Créer un contrat (Location ou Vente)
 */
public function store(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'rental_request_id' => 'required|exists:rental_requests,id',
            'contract_type' => 'required|in:rent,sale',
            'start_date' => 'required_if:contract_type,rent|nullable|date',
            'end_date' => 'required_if:contract_type,rent|nullable|date|after:start_date',
            'sale_date' => 'required_if:contract_type,sale|nullable|date',
            'monthly_rent' => 'required_if:contract_type,rent|nullable|numeric|min:0',
            'sale_price' => 'required_if:contract_type,sale|nullable|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'charges' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $rentalRequest = RentalRequest::with(['user', 'property'])->find($request->rental_request_id);
        
        if (!$rentalRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande non trouvée'
            ], 404);
        }

        $property = $rentalRequest->property;
        
        // Vérifier le type de transaction
        if ($request->contract_type !== $property->transaction_type) {
            return response()->json([
                'success' => false,
                'message' => 'Le type de contrat ne correspond pas au type de bien'
            ], 400);
        }

        $contractData = [
            'contract_type' => $request->contract_type,
            'rental_request_id' => $rentalRequest->id,
            'property_id' => $property->id,
            'agent_id' => $property->user_id,
            'security_deposit' => $request->security_deposit,
            'charges' => $request->charges,
            'status' => 'active',
            'signed_at' => now(),
        ];

        // Remplir selon le type de contrat
        if ($request->contract_type === 'rent') {
            $contractData['tenant_id'] = $rentalRequest->user_id;
            $contractData['owner_id'] = $property->owner_id;
            $contractData['start_date'] = $request->start_date;
            $contractData['end_date'] = $request->end_date;
            $contractData['monthly_rent'] = $request->monthly_rent;
        } else {
            $contractData['buyer_id'] = $rentalRequest->user_id;
            $contractData['seller_id'] = $property->owner_id;
            $contractData['sale_date'] = $request->sale_date;
            $contractData['sale_price'] = $request->sale_price;
        }

        $contract = Contract::create($contractData);

        // Mettre à jour le statut du bien
        $property->update(['status' => $request->contract_type === 'rent' ? 'rented' : 'sold']);

        return response()->json([
            'success' => true,
            'message' => $request->contract_type === 'rent' ? 'Contrat de location créé' : 'Contrat de vente créé',
            'data' => $contract->load(['property', 'tenant', 'buyer', 'owner', 'seller', 'agent'])
        ], 201);

    } catch (\Exception $e) {
        Log::error('Erreur store contract: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la création du contrat',
            'error' => $e->getMessage()
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