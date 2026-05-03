<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">IMMO<span style="color: #1e40af;">Rent</span></h1>
        </div>

        <p>Bonjour <strong>{{ $invoice->client->name }}</strong>,</p>

        <p>Nous vous confirmons que votre paiement de <strong>{{ number_format($invoice->total_amount, 2, ',', ' ') }} MAD</strong> a bien été reçu.</p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">Récapitulatif</h3>
            <p style="margin: 5px 0;"><strong>Référence du bien :</strong> {{ $invoice->payment->property->title ?? 'N/A' }}</p>
            <p style="margin: 5px 0;"><strong>Date de paiement :</strong> {{ $invoice->payment->payment_date->format('d/m/Y') }}</p>
            <p style="margin: 5px 0;"><strong>N° Facture :</strong> {{ $invoice->invoice_number }}</p>
        </div>

        <p>Vous trouverez votre facture au format PDF en pièce jointe de cet e-mail.</p>

        <p style="margin-top: 40px; color: #64748b;">
            Cordialement,<br>
            <strong>L'équipe ImmoRent</strong>
        </p>
    </div>
</body>
</html>
