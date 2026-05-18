<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Contrat {{ $contract->contract_type === 'rent' ? 'de location' : 'de vente' }} - {{ $contract->contract_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            color: #1e293b;
            background: #fff;
            padding: 0;
        }

        /* ===== VARIABLES PAR TYPE ===== */
        /* Contrat location → jaune/or | Contrat vente → bleu */

        /* HEADER */
        .header {
            background: {{ $contract->contract_type === 'rent' ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)' : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)' }};
            color: #fff;
            padding: 32px 40px 24px;
            position: relative;
            overflow: hidden;
        }
        .header::after {
            content: '';
            position: absolute;
            right: -40px;
            top: -40px;
            width: 180px;
            height: 180px;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
        }
        .header::before {
            content: '';
            position: absolute;
            right: 60px;
            bottom: -60px;
            width: 240px;
            height: 240px;
            border-radius: 50%;
            background: rgba(255,255,255,0.05);
        }
        .header-brand {
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -1px;
            text-transform: uppercase;
        }
        .header-brand span {
            opacity: 0.7;
        }
        .header-type {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-top: 6px;
            opacity: 0.9;
        }
        .header-meta {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid rgba(255,255,255,0.25);
        }
        .header-meta-item {
            font-size: 10px;
            letter-spacing: 1px;
            opacity: 0.85;
        }
        .header-meta-item strong {
            display: block;
            font-size: 13px;
            letter-spacing: 0;
            opacity: 1;
        }

        /* BADGES STATUT */
        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            background: rgba(255,255,255,0.2);
            color: #fff;
            border: 1px solid rgba(255,255,255,0.35);
        }

        /* BODY */
        .body {
            padding: 32px 40px;
        }

        /* PARTIES - CARDS CÔTE À CÔTE */
        .parties-grid {
            display: table;
            width: 100%;
            border-spacing: 12px 0;
            margin-bottom: 28px;
        }
        .partie-card {
            display: table-cell;
            width: 33%;
            vertical-align: top;
            border: 1.5px solid {{ $contract->contract_type === 'rent' ? '#fde68a' : '#bfdbfe' }};
            border-top: 4px solid {{ $contract->contract_type === 'rent' ? '#f59e0b' : '#2563eb' }};
            border-radius: 8px;
            padding: 14px;
            background: {{ $contract->contract_type === 'rent' ? '#fffbeb' : '#eff6ff' }};
        }
        .partie-card:not(:last-child) {
            margin-right: 12px;
        }
        .partie-role {
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: {{ $contract->contract_type === 'rent' ? '#92400e' : '#1e40af' }};
            margin-bottom: 8px;
        }
        .partie-name {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
        }
        .partie-detail {
            font-size: 10px;
            color: #475569;
            margin: 3px 0;
            display: flex;
            align-items: flex-start;
            gap: 6px;
        }
        .partie-detail-label {
            font-weight: 600;
            color: #64748b;
            min-width: 55px;
        }
        .cin-badge {
            display: inline-block;
            background: {{ $contract->contract_type === 'rent' ? '#fef3c7' : '#dbeafe' }};
            border: 1px solid {{ $contract->contract_type === 'rent' ? '#fcd34d' : '#93c5fd' }};
            color: {{ $contract->contract_type === 'rent' ? '#92400e' : '#1e40af' }};
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            font-family: monospace;
            letter-spacing: 1px;
            margin-top: 6px;
        }

        /* SECTIONS */
        .section {
            margin-bottom: 24px;
        }
        .section-title {
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: {{ $contract->contract_type === 'rent' ? '#b45309' : '#1d4ed8' }};
            border-bottom: 2px solid {{ $contract->contract_type === 'rent' ? '#fcd34d' : '#93c5fd' }};
            padding-bottom: 6px;
            margin-bottom: 14px;
        }

        /* TABLE INFO-ROWS */
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table tr td {
            padding: 7px 10px;
            font-size: 11px;
            border-bottom: 1px solid #f1f5f9;
        }
        .info-table tr:last-child td {
            border-bottom: none;
        }
        .info-table tr td:first-child {
            font-weight: 600;
            color: #64748b;
            width: 35%;
        }
        .info-table tr td:last-child {
            color: #0f172a;
            font-weight: 500;
        }
        .info-table tr.highlight td {
            background: {{ $contract->contract_type === 'rent' ? '#fef3c7' : '#dbeafe' }};
            font-weight: 700;
            color: {{ $contract->contract_type === 'rent' ? '#92400e' : '#1e40af' }};
            font-size: 12px;
        }

        /* MONTANTS */
        .amount-big {
            font-size: 16px;
            font-weight: 900;
        }

        /* SIGNATURES */
        .signatures {
            margin-top: 36px;
            display: table;
            width: 100%;
        }
        .sig-box {
            display: table-cell;
            width: 33%;
            text-align: center;
            padding: 0 8px;
        }
        .sig-title {
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 8px;
        }
        .sig-name {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
        }
        .sig-cin {
            font-size: 10px;
            color: #64748b;
            font-family: monospace;
            margin-bottom: 40px;
        }
        .sig-line {
            border-top: 1.5px solid {{ $contract->contract_type === 'rent' ? '#f59e0b' : '#2563eb' }};
            padding-top: 8px;
            font-size: 9px;
            color: #94a3b8;
        }

        /* FOOTER */
        .footer {
            margin-top: 28px;
            padding: 16px 40px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
            letter-spacing: 0.5px;
        }
        .footer strong {
            color: {{ $contract->contract_type === 'rent' ? '#d97706' : '#2563eb' }};
        }

        /* SEPARATOR */
        .sep {
            height: 1px;
            background: #e2e8f0;
            margin: 20px 0;
        }
    </style>
</head>
<body>

    <!-- HEADER -->
    <div class="header">
        <div class="header-brand">IMMOR<span>ENT</span></div>
        <div class="header-type">
            @if($contract->contract_type === 'rent')
                Contrat de Location Immobilière
            @else
                Contrat de Vente Immobilière
            @endif
        </div>
        <div class="header-meta">
            <div class="header-meta-item">
                Référence
                <strong>{{ $contract->contract_number }}</strong>
            </div>
            <div class="header-meta-item">
                Date d'établissement
                <strong>{{ date('d/m/Y') }}</strong>
            </div>
            <div class="header-meta-item">
                Statut
                <strong><span class="badge">{{ ucfirst($contract->status) }}</span></strong>
            </div>
        </div>
    </div>

    <!-- BODY -->
    <div class="body">

        <!-- PARTIES PRENANTES -->
        <div class="section">
            <div class="section-title">1. Parties prenantes</div>
            <div class="parties-grid">
                <!-- LOCATAIRE / ACHETEUR -->
                <div class="partie-card">
                    <div class="partie-role">
                        @if($contract->contract_type === 'rent') Locataire @else Acheteur @endif
                    </div>
                    <div class="partie-name">{{ $tenant->name ?? $buyer->name ?? '—' }}</div>
                    <div class="partie-detail">
                        <span class="partie-detail-label">Email :</span>
                        <span>{{ $tenant->email ?? $buyer->email ?? '—' }}</span>
                    </div>
                    <div class="partie-detail">
                        <span class="partie-detail-label">Tél. :</span>
                        <span>{{ $tenant->phone ?? $buyer->phone ?? '—' }}</span>
                    </div>
                    <div class="cin-badge">CIN : {{ $tenant->cin ?? $buyer->cin ?? 'N/A' }}</div>
                </div>

                <!-- PROPRIÉTAIRE / VENDEUR -->
                <div class="partie-card">
                    <div class="partie-role">
                        @if($contract->contract_type === 'rent') Bailleur / Propriétaire @else Vendeur @endif
                    </div>
                    <div class="partie-name">{{ $owner->name ?? $seller->name ?? '—' }}</div>
                    <div class="partie-detail">
                        <span class="partie-detail-label">Email :</span>
                        <span>{{ $owner->email ?? $seller->email ?? '—' }}</span>
                    </div>
                    <div class="partie-detail">
                        <span class="partie-detail-label">Tél. :</span>
                        <span>{{ $owner->phone ?? $seller->phone ?? '—' }}</span>
                    </div>
                    <div class="cin-badge">CIN : {{ $owner->cin ?? $seller->cin ?? 'N/A' }}</div>
                </div>

                <!-- AGENT -->
                <div class="partie-card">
                    <div class="partie-role">Agent Immobilier</div>
                    <div class="partie-name">{{ $agent->name ?? '—' }}</div>
                    <div class="partie-detail">
                        <span class="partie-detail-label">Email :</span>
                        <span>{{ $agent->email ?? '—' }}</span>
                    </div>
                    <div class="partie-detail">
                        <span class="partie-detail-label">Tél. :</span>
                        <span>{{ $agent->phone ?? '—' }}</span>
                    </div>
                    <div class="cin-badge">CIN : {{ $agent->cin ?? 'N/A' }}</div>
                </div>
            </div>
        </div>

        <!-- BIEN IMMOBILIER -->
        <div class="section">
            <div class="section-title">2. Description du bien</div>
            <table class="info-table">
                <tr>
                    <td>Adresse</td>
                    <td>{{ $property->address }}, {{ $property->city }} {{ $property->postal_code }}</td>
                </tr>
                <tr>
                    <td>Type de bien</td>
                    <td>{{ ucfirst($property->type) }}</td>
                </tr>
                <tr>
                    <td>Surface</td>
                    <td>{{ $property->surface }} m²</td>
                </tr>
                <tr>
                    <td>Nombre de pièces</td>
                    <td>{{ $property->rooms }} pièces @if($property->bedrooms > 0)(dont {{ $property->bedrooms }} chambre(s))@endif</td>
                </tr>
            </table>
        </div>

        @if($contract->contract_type === 'rent')
        <!-- DURÉE DU BAIL -->
        <div class="section">
            <div class="section-title">3. Durée du bail</div>
            <table class="info-table">
                <tr>
                    <td>Date de début</td>
                    <td>{{ date('d/m/Y', strtotime($contract->start_date)) }}</td>
                </tr>
                <tr>
                    <td>Date de fin</td>
                    <td>{{ date('d/m/Y', strtotime($contract->end_date)) }}</td>
                </tr>
                <tr>
                    <td>Date de signature</td>
                    <td>{{ $contract->signed_at ? date('d/m/Y', strtotime($contract->signed_at)) : date('d/m/Y') }}</td>
                </tr>
            </table>
        </div>

        <!-- CONDITIONS FINANCIÈRES (LOCATION) -->
        <div class="section">
            <div class="section-title">4. Conditions financières</div>
            <table class="info-table">
                <tr>
                    <td>Loyer mensuel (hors charges)</td>
                    <td>{{ number_format($contract->monthly_rent, 2, ',', ' ') }} DH</td>
                </tr>
                <tr>
                    <td>Charges mensuelles</td>
                    <td>{{ number_format($contract->charges ?? 0, 2, ',', ' ') }} DH</td>
                </tr>
                <tr class="highlight">
                    <td>Total mensuel</td>
                    <td class="amount-big">{{ number_format($contract->monthly_rent + ($contract->charges ?? 0), 2, ',', ' ') }} DH</td>
                </tr>
                <tr>
                    <td>Dépôt de garantie</td>
                    <td>{{ number_format($contract->security_deposit, 2, ',', ' ') }} DH</td>
                </tr>
            </table>
        </div>

        @else
        <!-- CONDITIONS DE VENTE -->
        <div class="section">
            <div class="section-title">3. Conditions de vente</div>
            <table class="info-table">
                <tr class="highlight">
                    <td>Prix de vente</td>
                    <td class="amount-big">{{ number_format($contract->sale_price, 2, ',', ' ') }} DH</td>
                </tr>
                <tr>
                    <td>Date de vente</td>
                    <td>{{ $contract->sale_date ? date('d/m/Y', strtotime($contract->sale_date)) : date('d/m/Y') }}</td>
                </tr>
                @if($contract->charges > 0)
                <tr>
                    <td>Frais annexes</td>
                    <td>{{ number_format($contract->charges, 2, ',', ' ') }} DH</td>
                </tr>
                @endif
            </table>
        </div>
        @endif

        <!-- SIGNATURES -->
        <div class="sep"></div>
        <div class="signatures">
            <div class="sig-box">
                <div class="sig-title">
                    @if($contract->contract_type === 'rent') Locataire @else Acheteur @endif
                </div>
                <div class="sig-name">{{ $tenant->name ?? $buyer->name ?? '—' }}</div>
                <div class="sig-cin">CIN : {{ $tenant->cin ?? $buyer->cin ?? 'N/A' }}</div>
                <div class="sig-line">Lu et approuvé</div>
            </div>
            <div class="sig-box">
                <div class="sig-title">
                    @if($contract->contract_type === 'rent') Bailleur @else Vendeur @endif
                </div>
                <div class="sig-name">{{ $owner->name ?? $seller->name ?? '—' }}</div>
                <div class="sig-cin">CIN : {{ $owner->cin ?? $seller->cin ?? 'N/A' }}</div>
                <div class="sig-line">Lu et approuvé</div>
            </div>
            <div class="sig-box">
                <div class="sig-title">Agent Immobilier</div>
                <div class="sig-name">{{ $agent->name ?? '—' }}</div>
                <div class="sig-cin">CIN : {{ $agent->cin ?? 'N/A' }}</div>
                <div class="sig-line">Certifié conforme</div>
            </div>
        </div>

    </div>

    <!-- FOOTER -->
    <div class="footer">
        <p>Ce contrat a été généré automatiquement par la plateforme <strong>IMMORent</strong>.</p>
        <p style="margin-top:4px;">Il est établi en double exemplaire, un pour chaque partie. &bull; www.immorent.ma &bull; contact@immorent.ma</p>
    </div>

</body>
</html>