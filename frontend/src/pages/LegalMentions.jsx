import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardDocumentIcon, UserIcon, ServerIcon, CodeBracketIcon, LockClosedIcon, ShieldCheckIcon, ScaleIcon, ExclamationTriangleIcon, CheckIcon, ChartBarIcon, MagnifyingGlassIcon, HeartIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

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
              <h2><ClipboardDocumentIcon className="section-icon" /> 1. Éditeur du site</h2>
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
              <h2><UserIcon className="section-icon" /> 2. Directeur de publication</h2>
              <p><strong>Mohamed Kabbaj</strong>, Gérant</p>
              <p>Email : <a href="mailto:M.Kabbaj@immorent.ma">M.Kabbaj@immorent.ma</a></p>
            </section>

            {/* Hébergement */}
            <section>
              <h2><ServerIcon className="section-icon" /> 3. Hébergement</h2>
              <p><strong>Maroc Datacenter</strong></p>
              <p>Adresse : Technopark, 1100 Avenue Al Irfane, Casablanca, Maroc</p>
              <p>Téléphone : +212 5 22 12 34 56</p>
              <p>Site web : <a href="https://www.marocdatacenter.ma" target="_blank" rel="noopener noreferrer">www.marocdatacenter.ma</a></p>
            </section>

            {/* Conception et développement */}
            <section>
              <h2><CodeBracketIcon className="section-icon" /> 4. Conception et développement</h2>
              <p><strong>IMMORent Tech Solutions</strong></p>
              <p>Agence digitale spécialisée dans les solutions immobilières</p>
              <p>Email : <a href="mailto:dev@immorent.ma">dev@immorent.ma</a></p>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2><DocumentTextIcon className="section-icon" /> 5. Propriété intellectuelle</h2>
              <p>L'ensemble des contenus présents sur le site <strong>IMMORent.ma</strong> (textes, images, logos, vidéos, icônes, base de données, etc.) sont la propriété exclusive de <strong>IMMORent Maroc SARL</strong> ou de ses partenaires et sont protégés par les dispositions du Code de la Propriété Intellectuelle marocain (Loi n° 17-97 relative à la protection de la propriété littéraire et artistique).</p>
              <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de la société.</p>
            </section>

            {/* Protection des données personnelles */}
            <section>
              <h2><LockClosedIcon className="section-icon" /> 6. Protection des données personnelles</h2>
              <p>Conformément à la <strong>Loi n° 09-08</strong> relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel (CNDP), vous disposez des droits suivants :</p>
              <ul className="legal-list">
                <li><CheckIcon className="list-icon" /> Droit d'accès à vos données personnelles</li>
                <li><CheckIcon className="list-icon" /> Droit de rectification des informations inexactes</li>
                <li><CheckIcon className="list-icon" /> Droit d'opposition pour motifs légitimes</li>
                <li><CheckIcon className="list-icon" /> Droit à l'effacement (droit à l'oubli)</li>
                <li><CheckIcon className="list-icon" /> Droit à la portabilité de vos données</li>
              </ul>
              <p>Pour exercer ces droits, contactez notre Délégué à la Protection des Données (DPO) : <a href="mailto:dpo@immorent.ma">dpo@immorent.ma</a></p>
              <p>Pour plus d'informations, consultez notre <Link to="/confidentialite">Politique de confidentialité</Link>.</p>
            </section>

            {/* Cookies */}
            <section>
              <h2><ShieldCheckIcon className="section-icon" /> 7. Cookies</h2>
              <p>Le site IMMORent.ma utilise des cookies pour :</p>
              <ul className="legal-list">
                <li><ChartBarIcon className="list-icon" /> Analyser l'audience et mesurer les performances</li>
                <li><MagnifyingGlassIcon className="list-icon" /> Mémoriser vos préférences de recherche</li>
                <li><HeartIcon className="list-icon" /> Gérer vos biens favoris</li>
                <li><LockClosedIcon className="list-icon" /> Assurer la sécurité de votre session</li>
              </ul>
              <p>Vous pouvez paramétrer vos préférences en matière de cookies à tout moment depuis le bandeau présent sur le site ou via les paramètres de votre navigateur.</p>
            </section>

            {/* Conditions générales d'utilisation */}
            <section>
              <h2><ScaleIcon className="section-icon" /> 8. Conditions générales d'utilisation</h2>
              <p>L'utilisation du site IMMORent.ma implique l'acceptation pleine et entière des conditions générales d'utilisation décrites dans les présentes mentions légales et dans nos <Link to="/cgv">CGV</Link>.</p>
              <p>IMMORent Maroc SARL se réserve le droit de modifier à tout moment ces conditions. Les utilisateurs sont invités à les consulter régulièrement.</p>
            </section>

            {/* Responsabilité */}
            <section>
              <h2><ExclamationTriangleIcon className="section-icon" /> 9. Responsabilité</h2>
              <p>IMMORent Maroc SARL met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, l'entreprise ne peut garantir l'exhaustivité, l'exactitude ou l'absence de modification par un tiers des informations présentes.</p>
              <p>Les informations fournies sur le site le sont à titre indicatif et ne sauraient engager la responsabilité de IMMORent Maroc SARL. L'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.</p>
            </section>

            {/* Droit applicable */}
            <section>
              <h2><ScaleIcon className="section-icon" /> 10. Droit applicable</h2>
              <p>Les présentes mentions légales sont régies par le droit marocain. En cas de litige, et après tentative de recherche d'une solution amiable, les tribunaux de <strong>Marrakech</strong> seront seuls compétents.</p>
            </section>

            {/* Contact */}
            <section>
              <h2><PhoneIcon className="section-icon" /> 11. Nous contacter</h2>
              <p>Pour toute question relative aux mentions légales ou à l'utilisation du site :</p>
              <ul className="legal-list">
                <li><EnvelopeIcon className="list-icon" /> Email : <a href="mailto:legal@immorent.ma">legal@immorent.ma</a></li>
                <li><PhoneIcon className="list-icon" /> Téléphone : +212 5 24 12 34 56</li>
                <li><MapPinIcon className="list-icon" /> Adresse : Avenue Mohammed VI, Guéliz, Marrakech 40000</li>
              </ul>
            </section>

            <div className="update">
              <p><CalendarIcon className="update-icon" /> Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p>Version : 2.0</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .legal-page {
          min-height: calc(100vh - 70px);
          background: var(--bg-main);
          transition: var(--theme-transition);
        }

        .legal-hero {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          padding: 4rem 1.5rem;
          text-align: center;
          color: white;
        }

        .legal-hero h1 {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          color: white;
          margin-top: 0;
          font-weight: 800;
          letter-spacing: -0.025em;
        }

        .legal-hero p {
          font-size: 1.125rem;
          opacity: 0.9;
          margin: 0;
          font-weight: 500;
        }

        .legal-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
        }

        .legal-content {
          background: var(--card-bg);
          border-radius: 1.5rem;
          padding: 3rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border-color);
          transition: var(--theme-transition);
        }

        .legal-content section {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .legal-content section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .legal-content h2 {
          font-size: 1.5rem;
          color: var(--text-main);
          margin-bottom: 1.25rem;
          font-weight: 700;
          margin-top: 0;
          display: flex;
          align-items: center;
          letter-spacing: -0.0125em;
        }

        .section-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.75rem;
          color: var(--primary);
          flex-shrink: 0;
        }

        .legal-content p {
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .legal-content a {
          color: var(--primary);
          text-decoration: none;
          transition: color 0.3s ease;
          font-weight: 600;
        }

        .legal-content a:hover {
          color: var(--primary-light);
          text-decoration: underline;
        }

        .legal-list {
          margin: 1.25rem 0;
          padding-left: 1.5rem;
          list-style: none;
        }

        .legal-list li {
          margin-bottom: 0.75rem;
          color: var(--text-muted);
          line-height: 1.5;
          display: flex;
          align-items: center;
          font-weight: 500;
        }

        .list-icon {
          width: 1.125rem;
          height: 1.125rem;
          margin-right: 0.75rem;
          color: var(--primary);
          flex-shrink: 0;
        }

        .update {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
          text-align: center;
          color: var(--text-muted);
          font-size: 0.8125rem;
          opacity: 0.7;
        }

        .update p {
          margin-bottom: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .update-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .legal-hero h1 {
            font-size: 1.75rem;
          }
          
          .legal-hero p {
            font-size: 0.9375rem;
          }
          
          .legal-content {
            padding: 2rem 1.5rem;
          }
          
          .legal-content h2 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  );
};

export default LegalMentions;