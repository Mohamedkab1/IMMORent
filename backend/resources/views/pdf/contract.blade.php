<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Contrat de location</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            font-size: 12px;
        }
        h1 {
            color: #2563eb;
            text-align: center;
            font-size: 24px;
        }
        h2 {
            text-align: center;
            font-size: 18px;
        }
        .contract-number {
            text-align: center;
            color: #666;
            margin: 10px 0;
        }
        .section {
            margin: 20px 0;
        }
        .section-title {
            font-weight: bold;
            font-size: 14px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        .info-row {
            margin: 8px 0;
        }
        .label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
        }
        .signature {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
            text-align: center;
        }
        .signature-line {
            border-top: 1px solid #000;
            margin-top: 50px;
            padding-top: 10px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #eee;
        }
    </style>
</head>
<body>
    <h1>IMMOGEST</h1>
    <h2>Contrat de location immobilière</h2>
    <div class="contract-number">N° {{ $contract->contract_number }}</div>
    <div class="contract-number">Établi le {{ date('d/m/Y') }}</div>

    <!-- Parties prenantes -->
    <div class="section">
        <div class="section-title">1. Parties prenantes</div>
        <div class="info-row">
            <span class="label">BAILLEUR (Propriétaire) :</span>
            <span>{{ $owner->name }}</span>
        </div>
        <div class="info-row">
            <span class="label">PRENEUR (Locataire) :</span>
            <span>{{ $tenant->name }}</span>
        </div>
        <div class="info-row">
            <span class="label">AGENT IMMOBILIER :</span>
            <span>{{ $agent->name }}</span>
        </div>
    </div>

    <!-- Description du bien -->
    <div class="section">
        <div class="section-title">2. Description du bien loué</div>
        <div class="info-row">
            <span class="label">Adresse :</span>
            <span>{{ $property->address }}, {{ $property->city }} {{ $property->postal_code }}</span>
        </div>
        <div class="info-row">
            <span class="label">Type :</span>
            <span>{{ ucfirst($property->type) }}</span>
        </div>
        <div class="info-row">
            <span class="label">Surface :</span>
            <span>{{ $property->surface }} m²</span>
        </div>
        <div class="info-row">
            <span class="label">Pièces :</span>
            <span>{{ $property->rooms }}</span>
        </div>
    </div>

    <!-- Durée du bail -->
    <div class="section">
        <div class="section-title">3. Durée du bail</div>
        <div class="info-row">
            <span class="label">Date de début :</span>
            <span>{{ date('d/m/Y', strtotime($contract->start_date)) }}</span>
        </div>
        <div class="info-row">
            <span class="label">Date de fin :</span>
            <span>{{ date('d/m/Y', strtotime($contract->end_date)) }}</span>
        </div>
    </div>

    <!-- Conditions financières -->
    <div class="section">
        <div class="section-title">4. Conditions financières</div>
        <table>
            <tr>
                <td width="70%">Loyer mensuel (hors charges)</td>
                <td width="30%">{{ number_format($contract->monthly_rent, 2) }} €</td>
            </tr>
            <tr>
                <td>Charges mensuelles</td>
                <td>{{ number_format($contract->charges ?? 0, 2) }} €</td>
            </tr>
            <tr style="font-weight: bold;">
                <td>Total mensuel</td>
                <td>{{ number_format($contract->monthly_rent + ($contract->charges ?? 0), 2) }} €</td>
            </tr>
            <tr>
                <td>Dépôt de garantie</td>
                <td>{{ number_format($contract->security_deposit, 2) }} €</td>
            </tr>
        </table>
    </div>

    <!-- Signatures -->
    <div class="signature">
        <div class="signature-box">
            <div class="signature-line"></div>
            <p>Signature du bailleur</p>
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
</html>