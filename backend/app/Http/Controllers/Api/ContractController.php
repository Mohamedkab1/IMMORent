<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\RentalRequest;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Requests\StoreContractRequest;
use App\Notifications\GeneralNotification;

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
public function store(StoreContractRequest $request)
{
    try {

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

        // Mettre à jour le statut du bien et de la demande
        $property->update(['status' => $request->contract_type === 'rent' ? 'rented' : 'sold']);
        $rentalRequest->update(['status' => 'finalized']);
        
        // Notify the tenant/buyer
        $notifData = [
            'title' => 'Nouveau contrat disponible',
            'message' => "Un nouveau contrat a été créé pour le bien : {$property->title}.",
            'type' => 'contract',
            'link' => "/contracts/{$contract->id}",
            'icon' => 'document-check'
        ];
        
        $rentalRequest->user->notify(new \App\Notifications\GeneralNotification($notifData));
        event(new \App\Events\RealTimeNotification($rentalRequest->user->id, $notifData));

        // Notify the owner/seller if different from agent
        if ($property->owner_id && $property->owner_id !== $property->user_id) {
            $ownerNotifData = [
                'title' => 'Nouveau contrat signé',
                'message' => "Votre bien {$property->title} a fait l'objet d'un nouveau contrat.",
                'type' => 'contract',
                'link' => "/contracts/{$contract->id}",
                'icon' => 'briefcase'
            ];
            
            $property->owner->notify(new \App\Notifications\GeneralNotification($ownerNotifData));
            event(new \App\Events\RealTimeNotification($property->owner->id, $ownerNotifData));
        }

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

            $this->authorize('view', $contract);
            
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

            $this->authorize('update', $contract);

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

            // Notify parties about status change
            $statusLabel = $request->status === 'terminated' ? 'résilié' : ($request->status === 'expired' ? 'expiré' : 'activé');
            $message = "Le statut de votre contrat {$contract->contract_number} est désormais : {$statusLabel}.";
            
            if ($contract->tenant) {
                $contract->tenant->notify(new GeneralNotification([
                    'title' => 'Mise à jour contrat',
                    'message' => $message,
                    'type' => 'contract',
                    'link' => "/contracts/{$contract->id}",
                ]));
            }

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
            $contracts = Contract::with(['property', 'owner', 'seller'])
                ->where(function($query) use ($request) {
                    $query->where('tenant_id', $request->user()->id)
                          ->orWhere('buyer_id', $request->user()->id);
                })
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

            $this->authorize('view', $contract);
            
            // Déterminer le type de contrat et les labels
            $isSale = $contract->contract_type === 'sale';
            $title = $isSale ? 'Contrat de vente' : 'Contrat de location';
            $party1Label = $isSale ? 'Vendeur' : 'Bailleur';
            $party2Label = $isSale ? 'Acquéreur' : 'Locataire';

            // Préparer le contenu HTML avec des données formatées
            $signedDate = $contract->signed_at ? $contract->signed_at->format('d/m/Y') : date('d/m/Y');
            
            $html = '<!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                <title>' . $title . '</title>
                <style>
                    * { font-family: "DejaVu Sans", sans-serif; }
                    body { padding: 40px; color: #333; line-height: 1.5; }
                    .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { color: #2563eb; font-size: 28px; font-weight: bold; }
                    .title { font-size: 22px; text-transform: uppercase; margin-top: 10px; font-weight: bold; }
                    .info-block { margin: 20px 0; }
                    .info-row { margin-bottom: 10px; }
                    .label { font-weight: bold; display: inline-block; width: 180px; color: #4b5563; }
                    .value { font-weight: normal; color: #1f2937; }
                    .signature-section { margin-top: 80px; width: 100%; }
                    .signature-box { display: inline-block; width: 45%; }
                    .signature-line { border-top: 1px solid #9ca3af; width: 100%; margin-top: 60px; }
                    footer { position: fixed; bottom: -20px; left: 0; right: 0; text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">IMMORent</div>
                    <div class="title">' . $title . '</div>
                    <p style="color: #6b7280;">N° ' . $contract->contract_number . '</p>
                </div>

                <div class="info-block">
                    <div class="info-row"><span class="label">Référence:</span> <span class="value">' . $contract->contract_number . '</span></div>
                    <div class="info-row"><span class="label">Date de signature:</span> <span class="value">' . $signedDate . '</span></div>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    ';

            if ($isSale) {
                $saleDate = $contract->sale_date ? $contract->sale_date->format('d/m/Y') : '-';
                $html .= '
                    <div class="info-row"><span class="label">Prix de vente:</span> <span class="value">' . number_format((float)$contract->sale_price, 2, ',', ' ') . ' DH</span></div>
                    <div class="info-row"><span class="label">Date de vente:</span> <span class="value">' . $saleDate . '</span></div>';
            } else {
                $startDate = $contract->start_date ? $contract->start_date->format('d/m/Y') : '-';
                $endDate = $contract->end_date ? $contract->end_date->format('d/m/Y') : '-';
                $html .= '
                    <div class="info-row"><span class="label">Date de début:</span> <span class="value">' . $startDate . '</span></div>
                    <div class="info-row"><span class="label">Date de fin:</span> <span class="value">' . $endDate . '</span></div>
                    <div class="info-row"><span class="label">Loyer mensuel:</span> <span class="value">' . number_format((float)$contract->monthly_rent, 2, ',', ' ') . ' DH</span></div>
                    <div class="info-row"><span class="label">Charges:</span> <span class="value">' . number_format((float)($contract->charges ?? 0), 2, ',', ' ') . ' DH</span></div>
                    <div class="info-row"><span class="label">Dépôt de garantie:</span> <span class="value">' . number_format((float)$contract->security_deposit, 2, ',', ' ') . ' DH</span></div>';
            }

            $html .= '
                </div>

                <div class="signature-section">
                    <table style="width: 100%;">
                        <tr>
                            <td style="width: 45%; vertical-align: top;">
                                <p style="font-weight: bold;">Signature du ' . $party1Label . '</p>
                                <p style="font-size: 10px; color: #6b7280;">Lu et approuvé</p>
                                <div class="signature-line"></div>
                            </td>
                            <td style="width: 10%;"></td>
                            <td style="width: 45%; vertical-align: top; text-align: right;">
                                <p style="font-weight: bold;">Signature du ' . $party2Label . '</p>
                                <p style="font-size: 10px; color: #6b7280;">Lu et approuvé</p>
                                <div class="signature-line"></div>
                            </td>
                        </tr>
                    </table>
                </div>

                <footer>
                    IMMORent - Plateforme SaaS Immobilière Premium - Document généré le ' . date('d/m/Y H:i') . '
                </footer>
            </body>
            </html>';
            
            $pdf = Pdf::loadHTML($html);
            $pdf->setPaper('A4', 'portrait');
            $pdf->setOptions(['isHtml5ParserEnabled' => true, 'isRemoteEnabled' => true]);
            
            return $pdf->download('contrat_' . $contract->contract_number . '.pdf');
            
        } catch (\Throwable $e) {
            Log::error('Erreur download PDF: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du PDF: ' . $e->getMessage()
            ], 500);
        }
    }
}