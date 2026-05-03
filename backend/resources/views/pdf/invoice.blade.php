<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Facture {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            font-size: 16px;
            line-height: 24px;
        }
        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            border-collapse: collapse;
        }
        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }
        .invoice-box table tr td:nth-child(2) {
            text-align: right;
        }
        .invoice-box table tr.top table td {
            padding-bottom: 20px;
        }
        .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
            font-weight: bold;
        }
        .invoice-box table tr.information table td {
            padding-bottom: 40px;
        }
        .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }
        .invoice-box table tr.details td {
            padding-bottom: 20px;
        }
        .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
        }
        .invoice-box table tr.item.last td {
            border-bottom: none;
        }
        .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="title">
                                <span style="color: #2563eb;">IMMO</span><span style="color: #1e40af;">Rent</span>
                            </td>
                            <td>
                                Facture n° : <strong>{{ $invoice->invoice_number }}</strong><br>
                                Date d'émission : {{ $invoice->issued_at->format('d/m/Y') }}<br>
                                Échéance : {{ $invoice->due_date ? $invoice->due_date->format('d/m/Y') : 'Immédiat' }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="information">
                <td colspan="2">
                    <table>
                        <tr>
                            <td>
                                <strong>ImmoRent Agence Immobilière</strong><br>
                                123 Boulevard de la Résistance<br>
                                Casablanca, Maroc<br>
                                Tél: +212 5 22 00 00 00<br>
                                Email: contact@immorent.com
                            </td>
                            <td>
                                <strong>Client :</strong><br>
                                {{ $invoice->client->name }}<br>
                                {{ $invoice->client->email }}<br>
                                {{ $invoice->client->phone ?? 'Téléphone non renseigné' }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="heading">
                <td>Détail de la transaction</td>
                <td>Montant (DH)</td>
            </tr>

            <tr class="item">
                <td>
                    <strong>Réservation / Paiement pour le bien :</strong><br>
                    Réf : {{ $payment->property->title ?? 'Bien non spécifié' }}<br>
                    Type : {{ $payment->property->type_label ?? '' }}<br>
                    Localisation : {{ $payment->property->city ?? '' }}
                </td>
                <td>
                    {{ number_format($payment->amount, 2, ',', ' ') }}
                </td>
            </tr>

            <tr class="item">
                <td>Frais de dossier & taxes</td>
                <td>0,00</td>
            </tr>

            <tr class="total">
                <td></td>
                <td>
                   Total TTC: {{ number_format($invoice->total_amount, 2, ',', ' ') }} DH
                </td>
            </tr>
        </table>

        <div class="footer">
            <p><strong>Conditions de paiement :</strong> Le paiement a été effectué via {{ $payment->payment_method_label }}.</p>
            <p>Merci pour votre confiance - ImmoRent</p>
            <p>Immatriculation RC: 123456 | Patente: 7890123</p>
        </div>
    </div>
</body>
</html>
