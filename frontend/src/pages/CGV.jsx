import React from 'react';

const CGV = () => {
  return (
    <>
      <div className="cgv-page">
        <div className="cgv-hero"><h1>Conditions Générales de Vente</h1><p>Les conditions d'utilisation de la plateforme IMMORent</p></div>
        <div className="cgv-container">
          <div className="cgv-content">
            <section><h2>Article 1 : Objet</h2><p>Les présentes CGV régissent l'utilisation de la plateforme IMMORent.</p></section>
            <section><h2>Article 2 : Acceptation</h2><p>L'utilisation de la plateforme implique l'acceptation pleine et entière des CGV.</p></section>
            <section><h2>Article 3 : Création de compte</h2><p>L'utilisateur doit fournir des informations exactes et complètes.</p></section>
            <section><h2>Article 4 : Types de comptes</h2><p><strong>Client:</strong> Gratuit - Consultation, demandes de location<br /><strong>Agent:</strong> Forfait mensuel 49€ HT - Gestion des biens, traitement des demandes</p></section>
            <section><h2>Article 5 : Tarifs et paiement</h2><p>Les paiements s'effectuent en ligne par carte bancaire ou virement.</p></section>
            <section><h2>Article 6 : Obligations</h2><p>L'utilisateur s'engage à fournir des informations exactes et à respecter les lois.</p></section>
            <section><h2>Article 7 : Responsabilité</h2><p>IMMORent ne peut être tenu responsable des litiges entre utilisateurs.</p></section>
            <section><h2>Article 8 : Données personnelles</h2><p>Conformément au RGPD, les données sont traitées de manière confidentielle.</p></section>
            <section><h2>Article 9 : Droit applicable</h2><p>Les présentes conditions sont soumises au droit français.</p></section>
            <div className="update"><p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p></div>
          </div>
        </div>
      </div>
      <style>{`
        .cgv-page { min-height: calc(100vh - 70px); background: #f8f9fa; }
        .cgv-hero { background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%); padding: 3rem 1.5rem; text-align: center; color: white; }
        .cgv-hero h1 { font-size: 2rem; margin-bottom: 0.5rem; color: white; }
        .cgv-container { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
        .cgv-content { background: white; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .cgv-content section { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; }
        .cgv-content section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .cgv-content h2 { font-size: 1.125rem; color: #0f2b4d; margin-bottom: 0.75rem; }
        .cgv-content p { color: #4b5563; line-height: 1.6; }
        .update { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 0.75rem; }
      `}</style>
    </>
  );
};

export default CGV;