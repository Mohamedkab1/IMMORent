<x-mail::message>
# 📬 Nouveau message de contact

Un visiteur a envoyé un message depuis le formulaire de contact du site **IMMORent**.

<x-mail::panel>
### Informations du contact
- **Nom :** {{ $contactData['first_name'] ?? '' }} {{ $contactData['last_name'] ?? '' }}
@if(!empty($contactData['company']))
- **Entreprise :** {{ $contactData['company'] }}
@endif
- **Email :** {{ $contactData['email'] ?? '' }}
@if(!empty($contactData['phone']))
- **Téléphone :** {{ $contactData['phone'] }}
@endif
</x-mail::panel>

### Message :
*"{{ $contactData['message'] ?? '' }}"*

Cordialement,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
