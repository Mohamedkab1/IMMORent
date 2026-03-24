<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class TestPdfController extends Controller
{
    public function downloadContract($id)
    {
        try {
            $contract = Contract::find($id);
            
            if (!$contract) {
                return response()->json(['error' => 'Contrat non trouvé'], 404);
            }
            
            // Contenu HTML simple pour le PDF
            $html = '
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Contrat de location</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .title { color: #2563eb; font-size: 24px; }
                    .contract-number { color: #666; margin: 10px 0; }
                    .section { margin: 20px 0; }
                    .section-title { font-weight: bold; font-size: 18px; border-bottom: 2px solid #2563eb; margin-bottom: 15px; }
                    .info-row { margin: 10px 0; }
                    .label { font-weight: bold; display: inline-block; width: 150px; }
                    .signature { margin-top: 50px; display: flex; justify-content: space-between; }
                    .signature-box { text-align: center; width: 45%; }
                    .signature-line { border-top: 1px solid black; margin-top: 50px; padding-top: 10px; }
                    .footer { text-align: center; margin-top: 50px; font-size: 10px; color: #999; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 class="title">IMMOGEST</h1>
                    <h2>Contrat de location immobilière</h2>
                    <div class="contract-number">N° ' . $contract->contract_number . '</div>
                    <div class="contract-number">Date: ' . date('d/m/Y') . '</div>
                </div>

                <div class="section">
                    <div class="section-title">1. Parties prenantes</div>
                    <div class="info-row">
                        <span class="label">Locataire:</span>
                        <span>' . ($contract->tenant ? $contract->tenant->name : 'Non renseigné') . '</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Propriétaire:</span>
                        <span>' . ($contract->owner ? $contract->owner->name : 'Non renseigné') . '</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Agent:</span>
                        <span>' . ($contract->agent ? $contract->agent->name : 'Non renseigné') . '</span>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">2. Bien loué</div>
                    <div class="info-row">
                        <span class="label">Adresse:</span>
                        <span>' . ($contract->property ? $contract->property->address . ', ' . $contract->property->city : 'Non renseigné') . '</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Surface:</span>
                        <span>' . ($contract->property ? $contract->property->surface . ' m²' : 'Non renseigné') . '</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Pièces:</span>
                        <span>' . ($contract->property ? $contract->property->rooms : 'Non renseigné') . '</span>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">3. Durée du bail</div>
                    <div class="info-row">
                        <span class="label">Date de début:</span>
                        <span>' . date('d/m/Y', strtotime($contract->start_date)) . '</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Date de fin:</span>
                        <span>' . date('d/m/Y', strtotime($contract->end_date)) . '</span>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">4. Conditions financières</div>
                    <div class="info-row">
                        <span class="label">Loyer mensuel:</span>
                        <span>' . number_format($contract->monthly_rent, 2) . ' €</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Charges:</span>
                        <span>' . number_format($contract->charges ?? 0, 2) . ' €</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Total mensuel:</span>
                        <span><strong>' . number_format($contract->monthly_rent + ($contract->charges ?? 0), 2) . ' €</strong></span>
                    </div>
                    <div class="info-row">
                        <span class="label">Dépôt de garantie:</span>
                        <span>' . number_format($contract->security_deposit, 2) . ' €</span>
                    </div>
                </div>

                <div class="signature">
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <p>Signature du propriétaire</p>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <p>Signature du locataire</p>
                    </div>
                </div>

                <div class="footer">
                    <p>Le présent contrat est établi en double exemplaire, un pour chaque partie.</p>
                    <p>ImmoGest - Plateforme de gestion immobilière - www.immogest.com</p>
                </div>
            </body>
            </html>';
            
            $pdf = Pdf::loadHTML($html);
            return $pdf->download('contrat_' . $contract->contract_number . '.pdf');
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}