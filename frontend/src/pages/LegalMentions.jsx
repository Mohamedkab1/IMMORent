import React from 'react';

const LegalMentions = () => {
  return (
    <>
      <div className="legal-page">
        <div className="legal-hero"><h1>Mentions légales</h1><p>Informations légales concernant la plateforme IMMORent</p></div>
        <div className="legal-container">
          <div className="legal-content">
            <section><h2>Éditeur du site</h2><p><strong>IMMORent SAS</strong><br />123 rue de l'Immobilier, 75001 Paris<br />RCS Paris B 123 456 789<br />N° TVA: FR 12 345678901</p></section>
            <section><h2>Directeur de publication</h2><p>Jean Martin, Président Directeur Général</p></section>
            <section><h2>Hébergement</h2><p>OVH SAS - 2 rue Kellermann, 59100 Roubaix</p></section>
            <section><h2>Propriété intellectuelle</h2><p>Tous les contenus du site sont la propriété exclusive d'IMMORent SAS.</p></section>
            <section><h2>Protection des données</h2><p>Conformément à la loi Informatique et Libertés, vous disposez d'un droit d'accès et de rectification.</p></section>
            <section><h2>Cookies</h2><p>Le site utilise des cookies pour améliorer l'expérience utilisateur.</p></section>
            <div className="update"><p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p></div>
          </div>
        </div>
      </div>
      <style>{`
        .legal-page { min-height: calc(100vh - 70px); background: #f8f9fa; }
        .legal-hero { background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%); padding: 3rem 1.5rem; text-align: center; color: white; }
        .legal-hero h1 { font-size: 2rem; margin-bottom: 0.5rem; color: white; }
        .legal-container { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
        .legal-content { background: white; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .legal-content section { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; }
        .legal-content section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .legal-content h2 { font-size: 1.25rem; color: #0f2b4d; margin-bottom: 1rem; }
        .legal-content p { color: #4b5563; line-height: 1.6; margin-bottom: 0.5rem; }
        .update { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 0.75rem; }
      `}</style>
    </>
  );
};

export default LegalMentions;