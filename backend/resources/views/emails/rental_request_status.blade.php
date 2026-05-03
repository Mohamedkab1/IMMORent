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

        <p>Bonjour <strong>{{ $rentalRequest->user->name }}</strong>,</p>

        @if($rentalRequest->status === 'approved')
            <p>Nous avons le plaisir de vous informer que votre demande pour le bien <strong>{{ $rentalRequest->property->title }}</strong> a été <span style="color: #16a34a; font-weight: bold;">approuvée</span> ! 🎉</p>
        @else
            <p>Nous regrettons de vous informer que votre demande pour le bien <strong>{{ $rentalRequest->property->title }}</strong> a été <span style="color: #dc2626; font-weight: bold;">refusée</span>.</p>
        @endif

        @if($rentalRequest->rejection_reason)
            <div style="background: #f8fafc; border-left: 4px solid {{ $rentalRequest->status === 'approved' ? '#3b82f6' : '#ef4444' }}; padding: 15px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Message de l'agent :</strong><br>
                <em style="color: #475569;">"{{ $rentalRequest->rejection_reason }}"</em></p>
            </div>
        @endif

        @if($rentalRequest->status === 'approved')
            <p>La prochaine étape consiste à procéder au paiement de votre réservation/contrat.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}/dashboard/client" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; display: inline-block;">Aller à mon espace pour payer</a>
            </div>
        @else
            <p>N'hésitez pas à parcourir notre catalogue pour trouver d'autres biens qui pourraient vous convenir.</p>
        @endif

        <p style="margin-top: 40px; color: #64748b;">
            Cordialement,<br>
            <strong>L'équipe ImmoRent</strong>
        </p>
    </div>
</body>
</html>
