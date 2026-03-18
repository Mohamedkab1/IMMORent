import React from 'react';
import { 
  ScaleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  LockClosedIcon,
  UserGroupIcon,
  HandRaisedIcon,
  ComputerDesktopIcon,
  CakeIcon
} from '@heroicons/react/24/outline';

const LegalMentions = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="legal-page">
      {/* Hero Section */}
      <div className="legal-hero">
        <div className="hero-content">
          <ScaleIcon className="hero-icon" />
          <h1>Mentions Légales</h1>
          <p>Informations légales concernant la plateforme ImmoGest</p>
        </div>
      </div>

      <div className="legal-container">
        <div className="legal-content">
          {/* Éditeur du site */}
          <section className="legal-section">
            <div className="section-header">
              <BuildingOfficeIcon className="section-icon" />
              <h2>Éditeur du site</h2>
            </div>
            <div className="section-content">
              <p>Le site ImmoGest est édité par :</p>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Raison sociale :</span>
                  <span className="info-value">IMMOGEST SAS</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Forme juridique :</span>
                  <span className="info-value">Société par Actions Simplifiée</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Capital social :</span>
                  <span className="info-value">100 000 €</span>
                </div>
                <div className="info-item">
                  <span className="info-label">RCS :</span>
                  <span className="info-value">Paris B 123 456 789</span>
                </div>
                <div className="info-item">
                  <span className="info-label">N° TVA intracommunautaire :</span>
                  <span className="info-value">FR 12 345678901</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Code APE :</span>
                  <span className="info-value">6820B</span>
                </div>
              </div>
            </div>
          </section>

          {/* Directeur de publication */}
          <section className="legal-section">
            <div className="section-header">
              <IdentificationIcon className="section-icon" />
              <h2>Directeur de la publication</h2>
            </div>
            <div className="section-content">
              <p>Le directeur de la publication est :</p>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Nom :</span>
                  <span className="info-value">Jean Martin</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Fonction :</span>
                  <span className="info-value">Président Directeur Général</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email :</span>
                  <span className="info-value">direction@immogest.com</span>
                </div>
              </div>
            </div>
          </section>

          {/* Coordonnées */}
          <section className="legal-section">
            <div className="section-header">
              <MapPinIcon className="section-icon" />
              <h2>Coordonnées</h2>
            </div>
            <div className="section-content">
              <div className="contact-details">
                <div className="contact-item">
                  <MapPinIcon className="contact-icon" />
                  <div>
                    <h4>Adresse :</h4>
                    <p>123 rue de l'Immobilier<br />75001 Paris, France</p>
                  </div>
                </div>
                <div className="contact-item">
                  <PhoneIcon className="contact-icon" />
                  <div>
                    <h4>Téléphone :</h4>
                    <p>+33 1 23 45 67 89</p>
                  </div>
                </div>
                <div className="contact-item">
                  <EnvelopeIcon className="contact-icon" />
                  <div>
                    <h4>Email :</h4>
                    <p>contact@immogest.com</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hébergement */}
          <section className="legal-section">
            <div className="section-header">
              <GlobeAltIcon className="section-icon" />
              <h2>Hébergement</h2>
            </div>
            <div className="section-content">
              <p>Le site est hébergé par :</p>
              <div className="hosting-details">
                <h4>OVH SAS</h4>
                <p>2 rue Kellermann</p>
                <p>59100 Roubaix, France</p>
                <p>Tél : 1007</p>
                <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer">
                  www.ovh.com
                </a>
              </div>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="legal-section">
            <div className="section-header">
              <DocumentTextIcon className="section-icon" />
              <h2>Propriété intellectuelle</h2>
            </div>
            <div className="section-content">
              <p>
                L'ensemble du contenu du site ImmoGest (structure, textes, images, logos, icônes, 
                bases de données, etc.) est la propriété exclusive d'ImmoGest SAS ou de ses partenaires. 
                Toute reproduction, représentation, modification, publication, adaptation totale ou 
                partielle de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite, 
                sauf autorisation écrite préalable d'ImmoGest SAS.
              </p>
            </div>
          </section>

          {/* Protection des données */}
          <section className="legal-section">
            <div className="section-header">
              <ShieldCheckIcon className="section-icon" />
              <h2>Protection des données personnelles</h2>
            </div>
            <div className="section-content">
              <p>
                Conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers 
                et aux libertés, et au Règlement Général sur la Protection des Données (RGPD), vous 
                disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux 
                données vous concernant.
              </p>
              <p>Pour exercer ces droits, vous pouvez :</p>
              <ul>
                <li>Nous contacter par email : dpo@immogest.com</li>
                <li>Nous écrire à l'adresse postale indiquée ci-dessus</li>
                <li>Utiliser votre espace personnel pour modifier vos informations</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="legal-section">
            <div className="section-header">
              <CakeIcon className="section-icon" />
              <h2>Gestion des cookies</h2>
            </div>
            <div className="section-content">
              <p>
                Le site ImmoGest utilise des cookies pour améliorer l'expérience utilisateur et 
                réaliser des statistiques de visites. En poursuivant votre navigation sur ce site, 
                vous acceptez l'utilisation de ces cookies.
              </p>
              <p>Types de cookies utilisés :</p>
              <ul>
                <li><strong>Cookies techniques :</strong> nécessaires au fonctionnement du site</li>
                <li><strong>Cookies analytiques :</strong> pour mesurer l'audience du site</li>
                <li><strong>Cookies de session :</strong> pour gérer votre connexion</li>
              </ul>
            </div>
          </section>

          {/* Conditions d'utilisation */}
          <section className="legal-section">
            <div className="section-header">
              <HandRaisedIcon className="section-icon" />
              <h2>Conditions générales d'utilisation</h2>
            </div>
            <div className="section-content">
              <p>
                L'utilisation du site ImmoGest implique l'acceptation pleine et entière des conditions 
                générales d'utilisation décrites dans nos <a href="/cgv">CGV</a>. Ces conditions sont 
                susceptibles d'être modifiées à tout moment.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section className="legal-section">
            <div className="section-header">
              <ScaleIcon className="section-icon" />
              <h2>Limitation de responsabilité</h2>
            </div>
            <div className="section-content">
              <p>
                ImmoGest SAS s'efforce d'assurer l'exactitude et la mise à jour des informations 
                diffusées sur ce site. Toutefois, nous ne pouvons garantir l'absence d'erreurs ou 
                d'omissions. Les informations fournies le sont à titre indicatif et ne sauraient 
                engager la responsabilité d'ImmoGest SAS.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section className="legal-section">
            <div className="section-header">
              <ScaleIcon className="section-icon" />
              <h2>Droit applicable</h2>
            </div>
            <div className="section-content">
              <p>
                Les présentes mentions légales sont soumises au droit français. En cas de litige, 
                et après l'échec de toute tentative de solution amiable, les tribunaux français 
                seront seuls compétents.
              </p>
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
        .legal-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
        }

        .legal-hero {
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

        .legal-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .legal-content {
          background: white;
          border-radius: 10px;
          padding: 60px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .legal-section {
          margin-bottom: 50px;
          padding-bottom: 30px;
          border-bottom: 1px solid #e5e7eb;
        }

        .legal-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }

        .section-icon {
          width: 30px;
          height: 30px;
          color: #2563eb;
        }

        .section-header h2 {
          color: #1f2937;
          font-size: 24px;
          font-weight: 600;
        }

        .section-content {
          padding-left: 45px;
        }

        .section-content p {
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 15px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-top: 15px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .info-label {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }

        .info-value {
          color: #1f2937;
          font-size: 16px;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .contact-icon {
          width: 20px;
          height: 20px;
          color: #2563eb;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .contact-item h4 {
          color: #1f2937;
          font-size: 16px;
          margin-bottom: 5px;
        }

        .contact-item p {
          color: #6b7280;
          margin: 0;
        }

        .hosting-details {
          background: #f9fafb;
          padding: 20px;
          border-radius: 5px;
          margin-top: 15px;
        }

        .hosting-details h4 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .hosting-details p {
          color: #6b7280;
          margin-bottom: 5px;
        }

        .hosting-details a {
          color: #2563eb;
          text-decoration: none;
          display: inline-block;
          margin-top: 10px;
        }

        .hosting-details a:hover {
          text-decoration: underline;
        }

        .section-content ul {
          list-style: none;
          padding: 0;
          margin-top: 15px;
        }

        .section-content ul li {
          color: #4b5563;
          margin-bottom: 10px;
          padding-left: 20px;
          position: relative;
        }

        .section-content ul li:before {
          content: "•";
          color: #2563eb;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .section-content a {
          color: #2563eb;
          text-decoration: none;
        }

        .section-content a:hover {
          text-decoration: underline;
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

          .legal-content {
            padding: 30px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LegalMentions;