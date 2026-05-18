<x-mail::message>
# Bonjour **{{ $rentalRequest->user->name }}**,

@if($rentalRequest->status === 'approved')
Nous avons le plaisir de vous informer que votre demande pour le bien **{{ $rentalRequest->property->title }}** a été **approuvée** ! 🎉
@else
Nous regrettons de vous informer que votre demande pour le bien **{{ $rentalRequest->property->title }}** a été **refusée**.
@endif

@if($rentalRequest->rejection_reason)
<x-mail::panel>
**Message de l'agent :**
*{{ $rentalRequest->rejection_reason }}*
</x-mail::panel>
@endif

@if($rentalRequest->status === 'approved')
La prochaine étape consiste à procéder au paiement de votre réservation/contrat.

<x-mail::button :url="config('app.frontend_url', 'http://localhost:5173') . '/dashboard/client'">
Accéder à mon espace pour payer
</x-mail::button>
@else
N'hésitez pas à parcourir notre catalogue pour trouver d'autres biens qui pourraient vous convenir.
@endif

Cordialement,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
