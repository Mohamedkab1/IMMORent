<x-mail::message>
# Bonjour,

Une nouvelle demande a été reçue pour le bien **{{ $rentalRequest->property->title }}**.

<x-mail::panel>
### Détails de la demande
- **Client :** {{ $rentalRequest->user->name }} ({{ $rentalRequest->user->email }})
- **Type :** {{ $rentalRequest->type === 'rent' ? 'Location' : 'Achat' }}
@if($rentalRequest->type === 'rent')
- **Dates :** Du {{ $rentalRequest->start_date ? $rentalRequest->start_date->format('d/m/Y') : 'N/A' }} au {{ $rentalRequest->end_date ? $rentalRequest->end_date->format('d/m/Y') : 'N/A' }}
@endif
@if($rentalRequest->message)
- **Message du client :**
*"{{ $rentalRequest->message }}"*
@endif
</x-mail::panel>

Connectez-vous à votre espace agent pour traiter cette demande.

<x-mail::button :url="config('app.frontend_url', 'http://localhost:5173') . '/dashboard/agent'">
Accéder à mon espace Agent
</x-mail::button>

Cordialement,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
