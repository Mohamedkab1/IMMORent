import React from 'react';
import { Link } from 'react-router-dom';

const LegalMentions = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="legal-page">
        <div className="legal-hero">
          <h1>Mentions légales</h1>
          <p>Informations légales concernant la plateforme IMMORent Maroc</p>
        </div>
        
        <div className="legal-container">
          <div className="legal-content">
            
            {/* Éditeur du site */}
            <section>
              <h2>📋 1. Éditeur du site</h2>
              <p><strong>IMMORent Maroc SARL</strong></p>
              <p>Société à responsabilité limitée au capital de 500 000 DH</p>
              <p>Siège social : Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000, Maroc</p>
              <p>RC : 123456 / Marrakech</p>
              <p>IF : 12345678</p>
              <p>ICE : 001234567890123</p>
              <p>N° TVA : 12345678</p>
              <p>Téléphone : +212 5 24 12 34 56</p>
              <p>Email : <a href="mailto:contact@immorent.ma">contact@immorent.ma</a></p>
            </section>

            {/* Directeur de publication */}
            <section>
              <h2>👨‍💼 2. Directeur de publication</h2>
              <p><strong>Mohamed Kabbaj</strong>, Gérant</p>
              <p>Email : <a href="mailto:M.Kabbaj@immorent.ma">M.Kabbaj@immorent.ma</a></p>
            </section>

            {/* Hébergement */}
            <section>
              <h2>🖥️ 3. Hébergement</h2>
              <p><strong>Maroc Datacenter</strong></p>
              <p>Adresse : Technopark, 1100 Avenue Al Irfane, Casablanca, Maroc</p>
              <p>Téléphone : +212 5 22 12 34 56</p>
              <p>Site web : <a href="https://www.marocdatacenter.ma" target="_blank" rel="noopener noreferrer">www.marocdatacenter.ma</a></p>
            </section>

            {/* Conception et développement */}
            <section>
              <h2>💻 4. Conception et développement</h2>
              <p><strong>IMMORent Tech Solutions</strong></p>
              <p>Agence digitale spécialisée dans les solutions immobilières</p>
              <p>Email : <a href="mailto:dev@immorent.ma">dev@immorent.ma</a></p>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2>©️ 5. Propriété intellectuelle</h2>
              <p>L'ensemble des contenus présents sur le site <strong>IMMORent.ma</strong> (textes, images, logos, vidéos, icônes, base de données, etc.) sont la propriété exclusive de <strong>IMMORent Maroc SARL</strong> ou de ses partenaires et sont protégés par les dispositions du Code de la Propriété Intellectuelle marocain (Loi n° 17-97 relative à la protection de la propriété littéraire et artistique).</p>
              <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de la société.</p>
            </section>

            {/* Protection des données personnelles */}
            <section>
              <h2>🔒 6. Protection des données personnelles</h2>
              <p>Conformément à la <strong>Loi n° 09-08</strong> relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel (CNDP), vous disposez des droits suivants :</p>
              <ul className="legal-list">
                <li>✔️ Droit d'accès à vos données personnelles</li>
                <li>✔️ Droit de rectification des informations inexactes</li>
                <li>✔️ Droit d'opposition pour motifs légitimes</li>
                <li>✔️ Droit à l'effacement (droit à l'oubli)</li>
                <li>✔️ Droit à la portabilité de vos données</li>
              </ul>
              <p>Pour exercer ces droits, contactez notre Délégué à la Protection des Données (DPO) : <a href="mailto:dpo@immorent.ma">dpo@immorent.ma</a></p>
              <p>Pour plus d'informations, consultez notre <Link to="/confidentialite">Politique de confidentialité</Link>.</p>
            </section>

            {/* Cookies */}
            <section>
              <h2>🍪 7. Cookies</h2>
              <p>Le site IMMORent.ma utilise des cookies pour :</p>
              <ul className="legal-list">
                <li>📊 Analyser l'audience et mesurer les performances</li>
                <li>🔍 Mémoriser vos préférences de recherche</li>
                <li>❤️ Gérer vos biens favoris</li>
                <li>🔐 Assurer la sécurité de votre session</li>
              </ul>
              <p>Vous pouvez paramétrer vos préférences en matière de cookies à tout moment depuis le bandeau présent sur le site ou via les paramètres de votre navigateur.</p>
            </section>

            {/* Conditions générales d'utilisation */}
            <section>
              <h2>⚖️ 8. Conditions générales d'utilisation</h2>
              <p>L'utilisation du site IMMORent.ma implique l'acceptation pleine et entière des conditions générales d'utilisation décrites dans les présentes mentions légales et dans nos <Link to="/cgv">CGV</Link>.</p>
              <p>IMMORent Maroc SARL se réserve le droit de modifier à tout moment ces conditions. Les utilisateurs sont invités à les consulter régulièrement.</p>
            </section>

            {/* Responsabilité */}
            <section>
              <h2>⚠️ 9. Responsabilité</h2>
              <p>IMMORent Maroc SARL met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, l'entreprise ne peut garantir l'exhaustivité, l'exactitude ou l'absence de modification par un tiers des informations présentes.</p>
              <p>Les informations fournies sur le site le sont à titre indicatif et ne sauraient engager la responsabilité de IMMORent Maroc SARL. L'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.</p>
            </section>

            {/* Droit applicable */}
            <section>
              <h2>⚖️ 10. Droit applicable</h2>
              <p>Les présentes mentions légales sont régies par le droit marocain. En cas de litige, et après tentative de recherche d'une solution amiable, les tribunaux de <strong>Marrakech</strong> seront seuls compétents.</p>
            </section>

            {/* Contact */}
            <section>
              <h2>📞 11. Nous contacter</h2>
              <p>Pour toute question relative aux mentions légales ou à l'utilisation du site :</p>
              <ul className="legal-list">
                <li>📧 Email : <a href="mailto:legal@immorent.ma">legal@immorent.ma</a></li>
                <li>📞 Téléphone : +212 5 24 12 34 56</li>
                <li>📍 Adresse : Avenue Mohammed VI, Guéliz, Marrakech 40000</li>
              </ul>
            </section>

            <div className="update">
              <p>📅 Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p>Version : 2.0</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .legal-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .legal-hero {
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%);
          padding: 3rem 1.5rem;
          text-align: center;
          color: white;
        }

        .legal-hero h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: white;
          margin-top: 0;
        }

        .legal-hero p {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
        }

        .legal-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .legal-content {
          background: white;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .legal-content section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .legal-content section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .legal-content h2 {
          font-size: 1.25rem;
          color: #0f2b4d;
          margin-bottom: 1rem;
          font-weight: 600;
          margin-top: 0;
        }

        .legal-content p {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }

        .legal-content a {
          color: #d4af37;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .legal-content a:hover {
          color: #b8921a;
          text-decoration: underline;
        }

        .legal-list {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
          list-style: none;
        }

        .legal-list li {
          margin-bottom: 0.5rem;
          color: #4b5563;
          line-height: 1.5;
          position: relative;
          padding-left: 0.5rem;
        }

        .legal-list li::before {
          content: "•";
          color: #d4af37;
          font-weight: bold;
          position: absolute;
          left: -1rem;
        }

        .update {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .update p {
          margin-bottom: 0.25rem;
        }

        @media (max-width: 768px) {
          .legal-hero h1 {
            font-size: 1.5rem;
          }
          
          .legal-hero p {
            font-size: 0.875rem;
          }
          
          .legal-content {
            padding: 1.5rem;
          }
          
          .legal-content h2 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </>
  );
};

export default LegalMentions;