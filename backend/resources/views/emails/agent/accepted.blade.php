<x-mail::message>
# Félicitations {{ $user->name }} !

Votre demande pour devenir agent sur la plateforme **IMMORent** a été **acceptée** par notre équipe d'administration.

Vous avez désormais accès au tableau de bord Agent avec toutes les fonctionnalités exclusives :
- Ajout et gestion de biens immobiliers
- Traitement des demandes de location et d'achat
- Génération et suivi des contrats
- Accès aux statistiques détaillées de votre activité

<x-mail::button :url="config('app.frontend_url') . '/dashboard/agent'">
Accéder à mon espace Agent
</x-mail::button>

Nous vous souhaitons beaucoup de succès sur IMMORent !

Cordialement,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
