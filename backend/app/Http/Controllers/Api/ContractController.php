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
        $property->update(['status' => 'reserved']);
        $rentalRequest->update(['status' => 'approved']);
        
        // Notify the tenant/buyer
        $notifData = [
            'title' => 'Nouveau contrat disponible',
            'message' => "Un nouveau contrat a été créé pour le bien : {$property->title}.",
            'type' => 'contract',
            'link' => "/contracts/{$contract->id}",
            'icon' => 'document-check'
        ];
        
        $rentalRequest->user->notify(new \App\Notifications\GeneralNotification($notifData));
        try {
            event(new \App\Events\RealTimeNotification($rentalRequest->user->id, $notifData));
        } catch (\Exception $e) {
            Log::warning('Erreur RealTimeNotification (client) dans ContractController: ' . $e->getMessage());
        }

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
            try {
                event(new \App\Events\RealTimeNotification($property->owner->id, $ownerNotifData));
            } catch (\Exception $e) {
                Log::warning('Erreur RealTimeNotification (owner) dans ContractController: ' . $e->getMessage());
            }
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
            $contract = Contract::with(['property', 'tenant', 'owner', 'agent'])->find($id);
            
            if (!$contract) {
                return response()->json(['success' => false, 'message' => 'Contrat non trouvé'], 404);
            }

            $this->authorize('view', $contract);

            $isSale     = $contract->contract_type === 'sale';
            $isRent     = !$isSale;
            $title      = $isSale ? 'CONTRAT DE VENTE IMMOBILIÈRE' : 'CONTRAT DE LOCATION IMMOBILIÈRE';

            // Couleurs monochromes (Noir/Blanc/Gris)
            $accent     = '#0f172a'; // Noir (slate-900)
            $accentDark = '#000000'; // Noir pur
            $bgLight    = '#f8fafc'; // Gris très clair (slate-50)
            $borderLight= '#e2e8f0'; // Gris pour bordures (slate-200)
            $cinBg      = '#f1f5f9'; // Gris clair pour badge CIN (slate-100)
            $cinBorder  = '#cbd5e1'; // Gris bordure CIN (slate-300)

            // Données parties
            $tenant  = $contract->tenant;
            $owner   = $contract->owner;
            $agent   = $contract->agent;
            $property = $contract->property;

            $signedDate = $contract->signed_at ? $contract->signed_at->format('d/m/Y') : date('d/m/Y');

            // Infos financières
            if ($isRent) {
                $startDate = $contract->start_date ? $contract->start_date->format('d/m/Y') : '-';
                $endDate   = $contract->end_date   ? $contract->end_date->format('d/m/Y')   : '-';
                $loyer     = number_format((float)$contract->monthly_rent, 2, ',', ' ');
                $charges   = number_format((float)($contract->charges ?? 0), 2, ',', ' ');
                $total     = number_format((float)$contract->monthly_rent + (float)($contract->charges ?? 0), 2, ',', ' ');
                $depot     = number_format((float)$contract->security_deposit, 2, ',', ' ');
            } else {
                $saleDate  = $contract->sale_date ? $contract->sale_date->format('d/m/Y') : date('d/m/Y');
                $prix      = number_format((float)$contract->sale_price, 2, ',', ' ');
            }

            $html = '<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>' . $title . '</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:"DejaVu Sans",Arial,sans-serif; font-size:11px; color:#1e293b; background:#fff; }

/* HEADER */
.header {
    background: #ffffff;
    color: #1e293b;
    padding:28px 36px 20px;
    border-bottom: 2px solid ' . $accent . ';
}
.brand { font-size:26px; font-weight:900; letter-spacing:-1px; color: #2563eb; }
.brand span { color: #eab308; opacity: 1; }
.contract-type { font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; margin-top:4px; color: #64748b; }
.header-meta { display:table; width:100%; margin-top:16px; padding-top:14px; border-top:1px solid #e2e8f0; }
.header-meta-cell { display:table-cell; font-size:9px; letter-spacing:1px; color: #64748b; }
.header-meta-cell strong { display:block; font-size:12px; letter-spacing:0; color: #0f172a; }
.badge { display:inline-block; padding:2px 8px; border-radius:20px; font-size:8px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; background: ' . $accent . '; color: #fff; }

/* BODY */
.body { padding:28px 36px; }

/* PARTIES */
.parties { display:table; width:100%; margin-bottom:22px; }
.partie { display:table-cell; width:33%; vertical-align:top; padding:12px; border:1.5px solid ' . $borderLight . '; border-top:4px solid ' . $accent . '; background:' . $bgLight . '; }
.partie + .partie { padding-left:14px; margin-left:10px; }
.partie-role { font-size:8px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:' . $accentDark . '; margin-bottom:6px; }
.partie-name { font-size:13px; font-weight:700; color:#0f172a; margin-bottom:5px; }
.partie-line { font-size:10px; color:#475569; margin:2px 0; }
.partie-line b { color:#64748b; font-weight:600; }
.cin-badge { display:inline-block; background:' . $cinBg . '; border:1px solid ' . $cinBorder . '; color:' . $accentDark . '; padding:2px 8px; font-size:10px; font-weight:700; letter-spacing:1px; margin-top:6px; }

/* SEPARATEUR */
.sep-title { font-size:8px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:' . $accent . '; border-bottom:2px solid ' . $cinBorder . '; padding-bottom:5px; margin-bottom:12px; }

/* TABLE INFO */
.info-table { width:100%; border-collapse:collapse; margin-bottom:22px; }
.info-table td { padding:7px 10px; font-size:11px; border-bottom:1px solid #f1f5f9; }
.info-table td:first-child { font-weight:600; color:#64748b; width:40%; }
.info-table tr.highlight td { background:' . $cinBg . '; font-weight:700; color:' . $accentDark . '; font-size:13px; }

/* SIGNATURES */
.sig-table { width:100%; border-collapse:collapse; margin-top:30px; }
.sig-table td { width:33%; vertical-align:top; text-align:center; padding:0 8px; }
.sig-role { font-size:8px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#64748b; margin-bottom:6px; }
.sig-name { font-size:11px; font-weight:700; color:#0f172a; margin-bottom:3px; }
.sig-cin { font-size:9px; color:#64748b; margin-bottom:36px; }
.sig-line { border-top:1.5px solid ' . $accent . '; padding-top:6px; font-size:8px; color:#94a3b8; }

/* FOOTER */
.footer { margin-top:24px; padding:12px 36px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center; font-size:9px; color:#94a3b8; }
.footer strong { color:' . $accent . '; }
</style>
</head>
<body>

<div class="header">
    <div class="brand">IMMOR<span>ENT</span></div>
    <div class="contract-type">' . $title . '</div>
    <div class="header-meta">
        <div class="header-meta-cell">Référence <strong>' . $contract->contract_number . '</strong></div>
        <div class="header-meta-cell">Date d\'établissement <strong>' . $signedDate . '</strong></div>
        <div class="header-meta-cell">Statut <strong><span class="badge">' . ucfirst($contract->status) . '</span></strong></div>
    </div>
</div>

<div class="body">

    <!-- Parties -->
    <div style="margin-bottom:8px;" class="sep-title">1. Parties prenantes</div>
    <div class="parties">
        <div class="partie">
            <div class="partie-role">' . ($isRent ? 'Locataire' : 'Acheteur') . '</div>
            <div class="partie-name">' . ($tenant ? htmlspecialchars($tenant->name) : '—') . '</div>
            <div class="partie-line"><b>Email :</b> ' . ($tenant ? htmlspecialchars($tenant->email) : '—') . '</div>
            <div class="partie-line"><b>Tél. :</b> ' . ($tenant ? htmlspecialchars($tenant->phone ?? '—') : '—') . '</div>
            <div class="cin-badge">CIN : ' . ($tenant ? htmlspecialchars($tenant->cin ?? 'N/A') : 'N/A') . '</div>
        </div>
        <div class="partie" style="margin-left:10px;">
            <div class="partie-role">' . ($isRent ? 'Bailleur / Propriétaire' : 'Vendeur') . '</div>
            <div class="partie-name">' . ($owner ? htmlspecialchars($owner->name) : '—') . '</div>
            <div class="partie-line"><b>Email :</b> ' . ($owner ? htmlspecialchars($owner->email) : '—') . '</div>
            <div class="partie-line"><b>Tél. :</b> ' . ($owner ? htmlspecialchars($owner->phone ?? '—') : '—') . '</div>
            <div class="cin-badge">CIN : ' . ($owner ? htmlspecialchars($owner->cin ?? 'N/A') : 'N/A') . '</div>
        </div>
        <div class="partie" style="margin-left:10px;">
            <div class="partie-role">Agent Immobilier</div>
            <div class="partie-name">' . ($agent ? htmlspecialchars($agent->name) : '—') . '</div>
            <div class="partie-line"><b>Email :</b> ' . ($agent ? htmlspecialchars($agent->email) : '—') . '</div>
            <div class="partie-line"><b>Tél. :</b> ' . ($agent ? htmlspecialchars($agent->phone ?? '—') : '—') . '</div>
            <div class="cin-badge">CIN : ' . ($agent ? htmlspecialchars($agent->cin ?? 'N/A') : 'N/A') . '</div>
        </div>
    </div>

    <!-- Bien -->
    <div class="sep-title">2. Description du bien</div>
    <table class="info-table">
        <tr><td>Adresse</td><td>' . ($property ? htmlspecialchars($property->address . ', ' . $property->city . ' ' . ($property->postal_code ?? '')) : '—') . '</td></tr>
        <tr><td>Type de bien</td><td>' . ($property ? ucfirst($property->type) : '—') . '</td></tr>
        <tr><td>Surface</td><td>' . ($property ? $property->surface . ' m²' : '—') . '</td></tr>
        <tr><td>Pièces</td><td>' . ($property ? $property->rooms . ' pièce(s)' : '—') . '</td></tr>
    </table>';

            if ($isRent) {
                $html .= '
    <!-- Durée du bail -->
    <div class="sep-title">3. Durée du bail</div>
    <table class="info-table">
        <tr><td>Date de début</td><td>' . $startDate . '</td></tr>
        <tr><td>Date de fin</td><td>' . $endDate . '</td></tr>
        <tr><td>Date de signature</td><td>' . $signedDate . '</td></tr>
    </table>

    <!-- Conditions financières -->
    <div class="sep-title">4. Conditions financières</div>
    <table class="info-table">
        <tr><td>Loyer mensuel (hors charges)</td><td>' . $loyer . ' DH</td></tr>
        <tr><td>Charges mensuelles</td><td>' . $charges . ' DH</td></tr>
        <tr class="highlight"><td>Total mensuel</td><td>' . $total . ' DH</td></tr>
        <tr><td>Dépôt de garantie</td><td>' . $depot . ' DH</td></tr>
    </table>';
            } else {
                $html .= '
    <!-- Conditions de vente -->
    <div class="sep-title">3. Conditions de vente</div>
    <table class="info-table">
        <tr class="highlight"><td>Prix de vente</td><td>' . $prix . ' DH</td></tr>
        <tr><td>Date de vente</td><td>' . $saleDate . '</td></tr>
    </table>';
            }

            $html .= '
    <!-- Signatures -->
    <table class="sig-table">
        <tr>
            <td>
                <div class="sig-role">' . ($isRent ? 'Locataire' : 'Acheteur') . '</div>
                <div class="sig-name">' . ($tenant ? htmlspecialchars($tenant->name) : '—') . '</div>
                <div class="sig-cin">CIN : ' . ($tenant ? htmlspecialchars($tenant->cin ?? 'N/A') : 'N/A') . '</div>
                <div class="sig-line">Lu et approuvé</div>
            </td>
            <td>
                <div class="sig-role">' . ($isRent ? 'Bailleur' : 'Vendeur') . '</div>
                <div class="sig-name">' . ($owner ? htmlspecialchars($owner->name) : '—') . '</div>
                <div class="sig-cin">CIN : ' . ($owner ? htmlspecialchars($owner->cin ?? 'N/A') : 'N/A') . '</div>
                <div class="sig-line">Lu et approuvé</div>
            </td>
            <td>
                <div class="sig-role">Agent Immobilier</div>
                <div class="sig-name">' . ($agent ? htmlspecialchars($agent->name) : '—') . '</div>
                <div class="sig-cin">CIN : ' . ($agent ? htmlspecialchars($agent->cin ?? 'N/A') : 'N/A') . '</div>
                <div class="sig-line">Certifié conforme</div>
            </td>
        </tr>
    </table>

</div>

<div class="footer">
    <p>Ce contrat a été généré automatiquement par <strong>IMMORent</strong> &bull; www.immorent.ma &bull; Généré le ' . date('d/m/Y H:i') . '</p>
</div>

</body>
</html>';

            $pdf = Pdf::loadHTML($html);
            $pdf->setPaper('A4', 'portrait');
            $pdf->setOptions(['isHtml5ParserEnabled' => true, 'isRemoteEnabled' => true, 'defaultFont' => 'DejaVu Sans']);
            
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
