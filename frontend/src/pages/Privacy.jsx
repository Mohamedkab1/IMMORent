import React from 'react';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ScaleIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CakeIcon,
  ComputerDesktopIcon,
  KeyIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const Privacy = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="privacy-page">
      {/* Hero Section */}
      <div className="privacy-hero">
        <div className="hero-content">
          <ShieldCheckIcon className="hero-icon" />
          <h1>Politique de Confidentialité</h1>
          <p>Comment nous protégeons vos données personnelles</p>
        </div>
      </div>

      <div className="privacy-container">
        <div className="privacy-content">
          {/* Introduction */}
          <section className="privacy-section">
            <h2>Introduction</h2>
            <p>
              Chez ImmoGest, nous accordons une importance primordiale à la protection de vos 
              données personnelles. La présente politique de confidentialité vous informe sur 
              la manière dont nous collectons, utilisons et protégeons vos informations lorsque 
              vous utilisez notre plateforme.
            </p>
          </section>

          {/* Responsable du traitement */}
          <section className="privacy-section">
            <h2>Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données est :
            </p>
            <div className="info-box">
              <p><strong>ImmoGest SAS</strong></p>
              <p>123 rue de l'Immobilier</p>
              <p>75001 Paris, France</p>
              <p>Email : dpo@immogest.com</p>
            </div>
          </section>

          {/* Données collectées */}
          <section className="privacy-section">
            <h2>Données collectées</h2>
            <p>Nous collectons les catégories de données suivantes :</p>
            
            <div className="data-categories">
              <div className="data-category">
                <h3>Données d'identification</h3>
                <ul>
                  <li>Nom, prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse postale</li>
                </ul>
              </div>

              <div className="data-category">
                <h3>Données de compte</h3>
                <ul>
                  <li>Identifiants de connexion</li>
                  <li>Historique des connexions</li>
                  <li>Préférences utilisateur</li>
                </ul>
              </div>

              <div className="data-category">
                <h3>Données de transaction</h3>
                <ul>
                  <li>Historique des locations</li>
                  <li>Contrats signés</li>
                  <li>Historique des paiements</li>
                </ul>
              </div>

              <div className="data-category">
                <h3>Données techniques</h3>
                <ul>
                  <li>Adresse IP</li>
                  <li>Type de navigateur</li>
                  <li>Cookies</li>
                  <li>Pages visitées</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Finalités du traitement */}
          <section className="privacy-section">
            <h2>Finalités du traitement</h2>
            <p>Vos données sont collectées pour les finalités suivantes :</p>
            <ul>
              <li>Gestion de votre compte et accès aux services</li>
              <li>Traitement des demandes de location</li>
              <li>Gestion des contrats et paiements</li>
              <li>Communication et support client</li>
              <li>Amélioration de nos services</li>
              <li>Respect des obligations légales</li>
            </ul>
          </section>

          {/* Base légale */}
          <section className="privacy-section">
            <h2>Base légale du traitement</h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul>
              <li><strong>L'exécution du contrat :</strong> pour la gestion de votre compte et des services</li>
              <li><strong>Votre consentement :</strong> pour les cookies et communications marketing</li>
              <li><strong>Nos obligations légales :</strong> pour la conservation des données</li>
              <li><strong>Notre intérêt légitime :</strong> pour l'amélioration de nos services</li>
            </ul>
          </section>

          {/* Destinataires des données */}
          <section className="privacy-section">
            <h2>Destinataires des données</h2>
            <p>Vos données peuvent être communiquées à :</p>
            <ul>
              <li>Les agents immobiliers et propriétaires (dans le cadre des locations)</li>
              <li>Nos prestataires techniques (hébergement, maintenance)</li>
              <li>Les autorités légales (sur réquisition judiciaire)</li>
            </ul>
          </section>

          {/* Durée de conservation */}
          <section className="privacy-section">
            <h2>Durée de conservation</h2>
            <p>Nous conservons vos données pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :</p>
            <ul>
              <li><strong>Données de compte :</strong> pendant toute la durée de votre inscription et 3 ans après votre dernière activité</li>
              <li><strong>Données contractuelles :</strong> 10 ans (obligation légale)</li>
              <li><strong>Cookies :</strong> 13 mois maximum</li>
            </ul>
          </section>

          {/* Vos droits */}
          <section className="privacy-section">
            <h2>Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            
            <div className="rights-grid">
              <div className="right-item">
                <EyeIcon className="right-icon" />
                <h3>Droit d'accès</h3>
                <p>Obtenir une copie de vos données</p>
              </div>
              <div className="right-item">
                <DocumentTextIcon className="right-icon" />
                <h3>Droit de rectification</h3>
                <p>Modifier vos données inexactes</p>
              </div>
              <div className="right-item">
                <LockClosedIcon className="right-icon" />
                <h3>Droit à l'effacement</h3>
                <p>Demander la suppression de vos données</p>
              </div>
              <div className="right-item">
                <ScaleIcon className="right-icon" />
                <h3>Droit d'opposition</h3>
                <p>Vous opposer au traitement</p>
              </div>
              <div className="right-item">
                <UserGroupIcon className="right-icon" />
                <h3>Droit à la portabilité</h3>
                <p>Récupérer vos données dans un format structuré</p>
              </div>
              <div className="right-item">
                <CakeIcon className="right-icon" />
                <h3>Gestion des cookies</h3>
                <p>Paramétrer vos préférences</p>
              </div>
            </div>

            <p className="rights-info">
              Pour exercer vos droits, contactez-nous à : <strong>dpo@immogest.com</strong>
            </p>
          </section>

          {/* Cookies */}
          <section className="privacy-section">
            <h2>Gestion des cookies</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
              Vous pouvez à tout moment modifier vos préférences via les paramètres de 
              votre navigateur.
            </p>
            <p>Types de cookies utilisés :</p>
            <ul>
              <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
              <li><strong>Cookies fonctionnels :</strong> pour mémoriser vos préférences</li>
              <li><strong>Cookies analytiques :</strong> pour mesurer l'audience</li>
            </ul>
          </section>

          {/* Sécurité */}
          <section className="privacy-section">
            <h2>Sécurité des données</h2>
            <p>
              Nous mettons en œuvre toutes les mesures techniques et organisationnelles 
              appropriées pour garantir la sécurité de vos données :
            </p>
            <ul>
              <li>Chiffrement des données sensibles</li>
              <li>Protection par mots de passe et authentification</li>
              <li>Accès restreint aux données</li>
              <li>Sauvegardes régulières</li>
              <li>Surveillance continue</li>
            </ul>
          </section>

          {/* Transferts internationaux */}
          <section className="privacy-section">
            <h2>Transferts internationaux</h2>
            <p>
              Vos données sont hébergées en France et dans l'Union Européenne. En cas de 
              transfert hors UE, nous nous assurons que des garanties appropriées sont mises 
              en place (clauses contractuelles types, Privacy Shield, etc.).
            </p>
          </section>

          {/* Modifications */}
          <section className="privacy-section">
            <h2>Modifications de la politique</h2>
            <p>
              Nous pouvons modifier cette politique de confidentialité à tout moment. 
              La version la plus récente est toujours disponible sur cette page. En cas 
              de modifications importantes, nous vous en informerons par email.
            </p>
          </section>

          {/* Contact DPO */}
          <section className="privacy-section">
            <h2>Contact du Délégué à la Protection des Données</h2>
            <p>Pour toute question relative à vos données personnelles :</p>
            <div className="contact-dpo">
              <p><EnvelopeIcon className="contact-icon" /> Email : dpo@immogest.com</p>
              <p><GlobeAltIcon className="contact-icon" /> Adresse : ImmoGest SAS - DPO, 123 rue de l'Immobilier, 75001 Paris</p>
            </div>
          </section>

          {/* CNIL */}
          <section className="privacy-section">
            <h2>Réclamation auprès de la CNIL</h2>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire 
              une réclamation auprès de la CNIL :
            </p>
            <div className="cnil-info">
              <p>CNIL - Service des plaintes</p>
              <p>3 Place de Fontenoy</p>
              <p>75007 Paris, France</p>
              <p>www.cnil.fr</p>
            </div>
          </section>

          {/* Date de mise à jour */}
          <div className="update-info">
            <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>
      </div>

      <style>{`
        .privacy-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
        }

        .privacy-hero {
          background: linear-gradient(135deg, #1e2937 0%, #0f172a 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          color: #2563eb;
        }

        .hero-content h1 {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .hero-content p {
          font-size: 20px;
          opacity: 0.9;
        }

        .privacy-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .privacy-content {
          background: white;
          border-radius: 10px;
          padding: 60px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .privacy-section {
          margin-bottom: 50px;
          padding-bottom: 30px;
          border-bottom: 1px solid #e5e7eb;
        }

        .privacy-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .privacy-section h2 {
          color: #1f2937;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .privacy-section h3 {
          color: #2563eb;
          font-size: 18px;
          margin: 15px 0 10px;
        }

        .privacy-section p {
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 15px;
        }

        .privacy-section ul {
          list-style: none;
          padding: 0;
          margin: 15px 0;
        }

        .privacy-section ul li {
          color: #4b5563;
          margin-bottom: 10px;
          padding-left: 25px;
          position: relative;
        }

        .privacy-section ul li:before {
          content: "•";
          color: #2563eb;
          font-weight: bold;
          font-size: 18px;
          position: absolute;
          left: 5px;
          top: -2px;
        }

        .info-box {
          background: #f9fafb;
          padding: 20px;
          border-radius: 5px;
          margin: 15px 0;
        }

        .data-categories {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin: 20px 0;
        }

        .data-category {
          background: #f9fafb;
          padding: 20px;
          border-radius: 5px;
        }

        .data-category h3 {
          color: #2563eb;
          margin-bottom: 10px;
        }

        .data-category ul {
          margin: 0;
        }

        .rights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 30px 0;
        }

        .right-item {
          text-align: center;
          padding: 20px;
          background: #f9fafb;
          border-radius: 5px;
        }

        .right-icon {
          width: 30px;
          height: 30px;
          margin: 0 auto 10px;
          color: #2563eb;
        }

        .right-item h3 {
          font-size: 16px;
          margin-bottom: 8px;
        }

        .right-item p {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .rights-info {
          background: #e5e7eb;
          padding: 15px;
          border-radius: 5px;
          text-align: center;
        }

        .contact-dpo {
          background: #f9fafb;
          padding: 20px;
          border-radius: 5px;
          margin-top: 15px;
        }

        .contact-dpo p {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .contact-dpo p:last-child {
          margin-bottom: 0;
        }

        .contact-icon {
          width: 20px;
          height: 20px;
          color: #2563eb;
        }

        .cnil-info {
          background: #f9fafb;
          padding: 20px;
          border-radius: 5px;
          margin-top: 15px;
        }

        .update-info {
          margin-top: 50px;
          padding-top: 30px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
        }

        .update-info p {
          color: #9ca3af;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 36px;
          }

          .hero-content p {
            font-size: 18px;
          }

          .privacy-content {
            padding: 30px;
          }

          .data-categories {
            grid-template-columns: 1fr;
          }

          .rights-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .rights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Privacy;