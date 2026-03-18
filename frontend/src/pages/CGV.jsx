import React from 'react';
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  CurrencyEuroIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const CGV = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="cgv-page">
      {/* Hero Section */}
      <div className="cgv-hero">
        <div className="hero-content">
          <DocumentTextIcon className="hero-icon" />
          <h1>Conditions Générales de Vente</h1>
          <p>Les conditions d'utilisation de la plateforme ImmoGest</p>
        </div>
      </div>

      <div className="cgv-container">
        <div className="cgv-content">
          {/* Préambule */}
          <section className="cgv-section">
            <h2>Préambule</h2>
            <p>
              Les présentes conditions générales de vente (CGV) régissent l'utilisation de la 
              plateforme ImmoGest, accessible via le site internet www.immogest.com. Elles 
              définissent les droits et obligations des parties dans le cadre de la mise en 
              relation entre propriétaires, agents immobiliers et locataires, ainsi que la 
              gestion des locations.
            </p>
          </section>

          {/* Article 1 - Objet */}
          <section className="cgv-section">
            <h2>Article 1 : Objet</h2>
            <p>
              La plateforme ImmoGest a pour objet de fournir un service de mise en relation 
              entre :
            </p>
            <ul>
              <li>Les propriétaires et agents immobiliers souhaitant proposer des biens à la location</li>
              <li>Les locataires recherchant un bien immobilier à louer</li>
            </ul>
            <p>
              La plateforme propose également des outils de gestion des locations, des contrats 
              et des paiements.
            </p>
          </section>

          {/* Article 2 - Acceptation des CGV */}
          <section className="cgv-section">
            <h2>Article 2 : Acceptation des conditions</h2>
            <p>
              L'utilisation de la plateforme ImmoGest implique l'acceptation pleine et entière 
              des présentes conditions générales par l'utilisateur. Cette acceptation est 
              matérialisée par le fait de cocher la case correspondante lors de la création 
              du compte.
            </p>
          </section>

          {/* Article 3 - Création de compte */}
          <section className="cgv-section">
            <h2>Article 3 : Création de compte</h2>
            <p>
              Pour utiliser les services de la plateforme, l'utilisateur doit créer un compte 
              en fournissant des informations exactes et complètes. Chaque utilisateur est 
              responsable de la confidentialité de ses identifiants et de toutes les activités 
              réalisées depuis son compte.
            </p>
          </section>

          {/* Article 4 - Types de comptes */}
          <section className="cgv-section">
            <h2>Article 4 : Types de comptes</h2>
            <div className="account-types">
              <div className="account-type">
                <h3>Compte Client (Locataire)</h3>
                <ul>
                  <li>Consultation gratuite des biens</li>
                  <li>Création de demandes de location</li>
                  <li>Suivi des contrats et paiements</li>
                  <li>Gratuit</li>
                </ul>
              </div>
              <div className="account-type">
                <h3>Compte Agent</h3>
                <ul>
                  <li>Gestion des biens immobiliers</li>
                  <li>Traitement des demandes de location</li>
                  <li>Création de contrats</li>
                  <li>Forfait mensuel : 49€ HT</li>
                </ul>
              </div>
              <div className="account-type">
                <h3>Compte Administrateur</h3>
                <ul>
                  <li>Supervision complète de la plateforme</li>
                  <li>Gestion des utilisateurs</li>
                  <li>Statistiques avancées</li>
                  <li>Forfait sur devis</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Article 5 - Tarifs et paiement */}
          <section className="cgv-section">
            <h2>Article 5 : Tarifs et modalités de paiement</h2>
            <p>
              Les tarifs applicables aux différents services sont indiqués sur la plateforme 
              et sont susceptibles d'être modifiés. Les paiements s'effectuent en ligne par 
              carte bancaire ou virement. Les factures sont disponibles dans l'espace 
              personnel de l'utilisateur.
            </p>
          </section>

          {/* Article 6 - Obligations des utilisateurs */}
          <section className="cgv-section">
            <h2>Article 6 : Obligations des utilisateurs</h2>
            <p>Chaque utilisateur s'engage à :</p>
            <ul>
              <li>Fournir des informations exactes et à jour</li>
              <li>Respecter les lois et règlements en vigueur</li>
              <li>Ne pas utiliser la plateforme à des fins frauduleuses</li>
              <li>Ne pas porter atteinte à l'image de la plateforme</li>
              <li>Respecter la confidentialité des données des autres utilisateurs</li>
            </ul>
          </section>

          {/* Article 7 - Responsabilité */}
          <section className="cgv-section">
            <h2>Article 7 : Responsabilité</h2>
            <p>
              ImmoGest s'engage à mettre en œuvre tous les moyens nécessaires pour assurer 
              le bon fonctionnement de la plateforme. Toutefois, la responsabilité d'ImmoGest 
              ne saurait être engagée en cas de :
            </p>
            <ul>
              <li>Indisponibilité temporaire du service</li>
              <li>Pertes de données</li>
              <li>Utilisation frauduleuse par un tiers</li>
              <li>Litiges entre utilisateurs</li>
            </ul>
          </section>

          {/* Article 8 - Données personnelles */}
          <section className="cgv-section">
            <h2>Article 8 : Données personnelles</h2>
            <p>
              Conformément au RGPD, les données personnelles des utilisateurs sont traitées 
              de manière confidentielle. Chaque utilisateur dispose d'un droit d'accès, de 
              rectification et de suppression de ses données. Pour plus d'informations, 
              consultez notre <a href="/confidentialite">politique de confidentialité</a>.
            </p>
          </section>

          {/* Article 9 - Résiliation */}
          <section className="cgv-section">
            <h2>Article 9 : Résiliation</h2>
            <p>
              L'utilisateur peut résilier son compte à tout moment depuis son espace personnel. 
              ImmoGest se réserve le droit de suspendre ou supprimer tout compte en cas de 
              non-respect des présentes conditions.
            </p>
          </section>

          {/* Article 10 - Modification des CGV */}
          <section className="cgv-section">
            <h2>Article 10 : Modification des CGV</h2>
            <p>
              ImmoGest se réserve le droit de modifier les présentes conditions à tout moment. 
              Les utilisateurs seront informés des modifications significatives par email ou 
              lors de leur prochaine connexion.
            </p>
          </section>

          {/* Article 11 - Droit applicable */}
          <section className="cgv-section">
            <h2>Article 11 : Droit applicable et litiges</h2>
            <p>
              Les présentes conditions sont soumises au droit français. En cas de litige, 
              les parties s'engagent à rechercher une solution amiable avant toute action 
              judiciaire. À défaut, les tribunaux français seront compétents.
            </p>
          </section>

          {/* Article 12 - Contact */}
          <section className="cgv-section">
            <h2>Article 12 : Contact</h2>
            <p>Pour toute question concernant les CGV, vous pouvez nous contacter :</p>
            <div className="contact-info">
              <p><EnvelopeIcon className="inline-icon" /> Email : legal@immogest.com</p>
              <p><BuildingOfficeIcon className="inline-icon" /> Adresse : 123 rue de l'Immobilier, 75001 Paris</p>
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
        .cgv-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
        }

        .cgv-hero {
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

        .cgv-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .cgv-content {
          background: white;
          border-radius: 10px;
          padding: 60px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .cgv-section {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 1px solid #e5e7eb;
        }

        .cgv-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .cgv-section h2 {
          color: #1f2937;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .cgv-section h3 {
          color: #2563eb;
          font-size: 18px;
          margin: 15px 0 10px;
        }

        .cgv-section p {
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 15px;
        }

        .cgv-section ul {
          list-style: none;
          padding: 0;
          margin: 15px 0;
        }

        .cgv-section ul li {
          color: #4b5563;
          margin-bottom: 10px;
          padding-left: 25px;
          position: relative;
        }

        .cgv-section ul li:before {
          content: "•";
          color: #2563eb;
          font-weight: bold;
          font-size: 18px;
          position: absolute;
          left: 5px;
          top: -2px;
        }

        .account-types {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 20px 0;
        }

        .account-type {
          background: #f9fafb;
          padding: 20px;
          border-radius: 5px;
        }

        .account-type h3 {
          color: #2563eb;
          font-size: 18px;
          margin-bottom: 15px;
        }

        .account-type ul {
          margin: 0;
        }

        .account-type ul li {
          margin-bottom: 8px;
          font-size: 14px;
        }

        .contact-info {
          background: #f9fafb;
          padding: 20px;
          border-radius: 5px;
          margin-top: 15px;
        }

        .contact-info p {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .contact-info p:last-child {
          margin-bottom: 0;
        }

        .inline-icon {
          width: 20px;
          height: 20px;
          color: #2563eb;
        }

        .cgv-section a {
          color: #2563eb;
          text-decoration: none;
        }

        .cgv-section a:hover {
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

          .cgv-content {
            padding: 30px;
          }

          .account-types {
            grid-template-columns: 1fr;
          }

          .cgv-section h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CGV;