import React from 'react';

const Privacy = () => {
  return (
    <>
      <div className="privacy-page">
        <div className="privacy-hero"><h1>Politique de confidentialité</h1><p>Comment nous protégeons vos données personnelles</p></div>
        <div className="privacy-container">
          <div className="privacy-content">
            <section><h2>Introduction</h2><p>IMMORent accorde une importance primordiale à la protection de vos données personnelles.</p></section>
            <section><h2>Données collectées</h2><p><strong>Données d'identification :</strong> Nom, prénom, email, téléphone, adresse<br /><strong>Données de compte :</strong> Identifiants, historique des connexions<br /><strong>Données de transaction :</strong> Historique des locations, contrats, paiements</p></section>
            <section><h2>Finalités du traitement</h2><p>Gestion du compte, traitement des demandes, gestion des contrats, communication client.</p></section>
            <section><h2>Vos droits</h2><p>Droit d'accès, de rectification, à l'effacement, d'opposition, à la portabilité.</p></section>
            <section><h2>Contact DPO</h2><p>Email : dpo@immorent.com</p></section>
            <section><h2>CNIL</h2><p>3 Place de Fontenoy, 75007 Paris - www.cnil.fr</p></section>
            <div className="update"><p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p></div>
          </div>
        </div>
      </div>
      <style>{`
        .privacy-page { min-height: calc(100vh - 70px); background: #f8f9fa; }
        .privacy-hero { background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%); padding: 3rem 1.5rem; text-align: center; color: white; }
        .privacy-hero h1 { font-size: 2rem; margin-bottom: 0.5rem; color: white; }
        .privacy-container { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
        .privacy-content { background: white; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .privacy-content section { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; }
        .privacy-content section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .privacy-content h2 { font-size: 1.125rem; color: #0f2b4d; margin-bottom: 0.75rem; }
        .privacy-content p { color: #4b5563; line-height: 1.6; }
        .update { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 0.75rem; }
      `}</style>
    </>
  );
};

export default Privacy;