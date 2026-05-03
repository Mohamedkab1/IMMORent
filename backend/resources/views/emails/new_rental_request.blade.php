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

        <p>Bonjour,</p>

        <p>Une nouvelle demande a été reçue pour le bien <strong>{{ $rentalRequest->property->title }}</strong>.</p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">Détails de la demande</h3>
            <p style="margin: 5px 0;"><strong>Client :</strong> {{ $rentalRequest->user->name }} ({{ $rentalRequest->user->email }})</p>
            <p style="margin: 5px 0;"><strong>Type :</strong> {{ $rentalRequest->type === 'rent' ? 'Location' : 'Achat' }}</p>
            @if($rentalRequest->type === 'rent')
                <p style="margin: 5px 0;"><strong>Dates :</strong> Du {{ $rentalRequest->start_date ? $rentalRequest->start_date->format('d/m/Y') : 'N/A' }} au {{ $rentalRequest->end_date ? $rentalRequest->end_date->format('d/m/Y') : 'N/A' }}</p>
            @endif
            @if($rentalRequest->message)
                <p style="margin: 5px 0;"><strong>Message du client :</strong><br>
                <em style="color: #475569;">"{{ $rentalRequest->message }}"</em></p>
            @endif
        </div>

        <p>Connectez-vous à votre espace agent pour traiter cette demande.</p>

        <p style="margin-top: 40px; color: #64748b;">
            Cordialement,<br>
            <strong>L'équipe ImmoRent</strong>
        </p>
    </div>
</body>
</html>
