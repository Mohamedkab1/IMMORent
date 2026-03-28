import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="privacy-page">
        <div className="privacy-hero">
          <h1>Politique de confidentialité</h1>
          <p>Comment nous protégeons vos données personnelles sur IMMORent Maroc</p>
        </div>
        
        <div className="privacy-container">
          <div className="privacy-content">
            
            {/* Introduction */}
            <section>
              <h2>🔒 1. Introduction</h2>
              <p>IMMORent Maroc SARL (ci-après "IMMORent", "nous", "notre") accorde une importance primordiale à la protection de vos données personnelles. La présente politique de confidentialité a pour objectif de vous informer sur la manière dont nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre plateforme immobilière <strong>IMMORent.ma</strong>.</p>
              <p>Nous nous engageons à respecter la <strong>Loi n° 09-08</strong> relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à garantir la confidentialité de vos informations.</p>
            </section>

            {/* Responsable du traitement */}
            <section>
              <h2>🏢 2. Responsable du traitement</h2>
              <p><strong>IMMORent Maroc SARL</strong></p>
              <p>Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000, Maroc</p>
              <p>Téléphone : +212 5 24 12 34 56</p>
              <p>Email : <a href="mailto:contact@immorent.ma">contact@immorent.ma</a></p>
              <p>RC : 123456 / Marrakech | IF : 12345678 | ICE : 001234567890123</p>
            </section>

            {/* Données collectées */}
            <section>
              <h2>📊 3. Données personnelles collectées</h2>
              <p>Nous collectons les catégories de données suivantes :</p>
              
              <h3>3.1 Données d'identification</h3>
              <ul className="privacy-list">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Adresse postale complète</li>
                <li>Date de naissance (facultatif)</li>
              </ul>
              
              <h3>3.2 Données de compte</h3>
              <ul className="privacy-list">
                <li>Identifiants de connexion (email, mot de passe chiffré)</li>
                <li>Historique des connexions (date, heure, adresse IP)</li>
                <li>Préférences de recherche et paramètres du compte</li>
                <li>Biens favoris et alertes personnalisées</li>
              </ul>
              
              <h3>3.3 Données de transaction</h3>
              <ul className="privacy-list">
                <li>Historique des demandes de location/achat</li>
                <li>Contrats de location et d'achat</li>
                <li>Historique des paiements (sans données bancaires complètes)</li>
                <li>Évaluations et avis laissés</li>
              </ul>
              
              <h3>3.4 Données techniques</h3>
              <ul className="privacy-list">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Système d'exploitation</li>
                <li>Pages visitées et durée de visite</li>
                <li>Cookies et technologies similaires</li>
              </ul>
            </section>

            {/* Finalités du traitement */}
            <section>
              <h2>🎯 4. Finalités du traitement</h2>
              <p>Vos données personnelles sont utilisées pour les finalités suivantes :</p>
              <ul className="privacy-list">
                <li><strong>Gestion du compte utilisateur :</strong> Création et administration de votre compte, authentification sécurisée</li>
                <li><strong>Traitement des demandes :</strong> Gestion des demandes de location et d'achat</li>
                <li><strong>Gestion des contrats :</strong> Création, suivi et archivage des contrats immobiliers</li>
                <li><strong>Communication client :</strong> Envoi d'informations sur vos demandes, notifications importantes</li>
                <li><strong>Amélioration du service :</strong> Analyse des données pour optimiser notre plateforme et l'expérience utilisateur</li>
                <li><strong>Marketing :</strong> Envoi d'offres promotionnelles (avec votre consentement)</li>
                <li><strong>Conformité légale :</strong> Respect de nos obligations légales et réglementaires</li>
              </ul>
            </section>

            {/* Base légale du traitement */}
            <section>
              <h2>⚖️ 5. Base légale du traitement</h2>
              <p>Nous traitons vos données personnelles sur la base de :</p>
              <ul className="privacy-list">
                <li>✔️ <strong>Votre consentement</strong> (pour les communications marketing, cookies)</li>
                <li>✔️ <strong>L'exécution du contrat</strong> (pour la gestion des locations et des contrats)</li>
                <li>✔️ <strong>Notre intérêt légitime</strong> (pour l'amélioration de nos services, la sécurité)</li>
                <li>✔️ <strong>Obligations légales</strong> (conservation des données, réponse aux autorités)</li>
              </ul>
            </section>

            {/* Durée de conservation */}
            <section>
              <h2>⏱️ 6. Durée de conservation des données</h2>
              <ul className="privacy-list">
                <li><strong>Données de compte :</strong> Conservées pendant toute la durée de votre compte utilisateur + 3 ans après la dernière activité</li>
                <li><strong>Données contractuelles :</strong> 10 ans après la fin du contrat (conformément aux obligations légales marocaines)</li>
                <li><strong>Données de navigation :</strong> 13 mois maximum (cookies)</li>
                <li><strong>Demandes non abouties :</strong> 3 ans</li>
                <li><strong>Preuves de transaction :</strong> 10 ans</li>
              </ul>
              <p>À l'expiration de ces délais, vos données sont anonymisées ou supprimées de manière sécurisée.</p>
            </section>

            {/* Destinataires des données */}
            <section>
              <h2>👥 7. Destinataires des données</h2>
              <p>Vos données personnelles sont accessibles uniquement par :</p>
              <ul className="privacy-list">
                <li><strong>Personnel autorisé :</strong> Équipes techniques, commerciales et administratives d'IMMORent</li>
                <li><strong>Agents immobiliers :</strong> Pour traiter vos demandes de location/achat</li>
                <li><strong>Partenaires techniques :</strong> Hébergeurs, prestataires de services (sous contrat de confidentialité)</li>
                <li><strong>Autorités légales :</strong> Sur demande justifiée (tribunaux, autorités de régulation)</li>
              </ul>
              <p>Nous ne vendons ni ne louons vos données personnelles à des tiers à des fins commerciales.</p>
            </section>

            {/* Vos droits */}
            <section>
              <h2>✅ 8. Vos droits</h2>
              <p>Conformément à la <strong>Loi n° 09-08</strong> et au <strong>RGPD</strong>, vous disposez des droits suivants :</p>
              
              <div className="rights-grid">
                <div className="right-card">
                  <span className="right-icon">🔍</span>
                  <div>
                    <strong>Droit d'accès</strong>
                    <p>Obtenir la confirmation que vos données sont traitées et y accéder.</p>
                  </div>
                </div>
                <div className="right-card">
                  <span className="right-icon">✏️</span>
                  <div>
                    <strong>Droit de rectification</strong>
                    <p>Faire rectifier vos données si elles sont inexactes ou incomplètes.</p>
                  </div>
                </div>
                <div className="right-card">
                  <span className="right-icon">🗑️</span>
                  <div>
                    <strong>Droit à l'effacement</strong>
                    <p>Demander la suppression de vos données (droit à l'oubli).</p>
                  </div>
                </div>
                <div className="right-card">
                  <span className="right-icon">⛔</span>
                  <div>
                    <strong>Droit d'opposition</strong>
                    <p>S'opposer au traitement de vos données pour des motifs légitimes.</p>
                  </div>
                </div>
                <div className="right-card">
                  <span className="right-icon">📱</span>
                  <div>
                    <strong>Droit à la portabilité</strong>
                    <p>Recevoir vos données dans un format structuré.</p>
                  </div>
                </div>
                <div className="right-card">
                  <span className="right-icon">⏸️</span>
                  <div>
                    <strong>Droit à la limitation</strong>
                    <p>Suspendre le traitement de vos données.</p>
                  </div>
                </div>
              </div>
              
              <p>Pour exercer ces droits, contactez notre DPO : <a href="mailto:dpo@immorent.ma">dpo@immorent.ma</a> ou par courrier à l'adresse indiquée.</p>
            </section>

            {/* Sécurité des données */}
            <section>
              <h2>🛡️ 9. Sécurité des données</h2>
              <p>Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :</p>
              <ul className="privacy-list">
                <li>🔐 Chiffrement SSL/TLS pour toutes les communications</li>
                <li>🔒 Chiffrement des mots de passe (hachage)</li>
                <li>🛡️ Pare-feu et systèmes de détection d'intrusion</li>
                <li>📋 Contrôle d'accès strict aux données</li>
                <li>📊 Sauvegardes régulières et sécurisées</li>
                <li>👨‍💻 Audits de sécurité réguliers</li>
              </ul>
              <p>En cas de violation de données, nous vous informerons dans les meilleurs délais conformément à la réglementation.</p>
            </section>

            {/* Transfert de données */}
            <section>
              <h2>🌍 10. Transfert de données</h2>
              <p>Vos données sont hébergées au Maroc (Maroc Datacenter, Casablanca). Elles ne sont pas transférées hors du territoire marocain sans garanties suffisantes de protection.</p>
            </section>

            {/* Cookies */}
            <section>
              <h2>🍪 11. Cookies et technologies similaires</h2>
              <p>Nous utilisons des cookies pour :</p>
              <ul className="privacy-list">
                <li><strong>Cookies essentiels :</strong> Authentification, sécurité, session</li>
                <li><strong>Cookies fonctionnels :</strong> Mémorisation de vos préférences</li>
                <li><strong>Cookies analytiques :</strong> Mesure d'audience (Google Analytics)</li>
                <li><strong>Cookies marketing :</strong> Publicités personnalisées (avec consentement)</li>
              </ul>
              <p>Vous pouvez gérer vos préférences cookies via notre bandeau de consentement ou dans les paramètres de votre navigateur.</p>
            </section>

            {/* Modification de la politique */}
            <section>
              <h2>📝 12. Modification de la politique</h2>
              <p>Nous nous réservons le droit de modifier cette politique de confidentialité. Toute modification sera publiée sur cette page avec une date de mise à jour. Nous vous invitons à consulter régulièrement cette page.</p>
            </section>

            {/* Contact DPO */}
            <section>
              <h2>📧 13. Contact</h2>
              <p><strong>Délégué à la Protection des Données (DPO) :</strong></p>
              <p>Email : <a href="mailto:dpo@immorent.ma">dpo@immorent.ma</a></p>
              <p>Adresse : Avenue Mohammed VI, Guéliz, Marrakech 40000, Maroc</p>
              <p>Téléphone : +212 5 24 12 34 56</p>
              <p>Pour toute réclamation, vous pouvez également contacter la <strong>Commission Nationale de Contrôle de la Protection des Données à Caractère Personnel (CNDP)</strong> : <a href="https://www.cndp.ma" target="_blank" rel="noopener noreferrer">www.cndp.ma</a></p>
            </section>

            <div className="update">
              <p>📅 Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p>Version : 2.0</p>
              <p><Link to="/" className="back-link">← Retour à l'accueil</Link></p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .privacy-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .privacy-hero {
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%);
          padding: 3rem 1.5rem;
          text-align: center;
          color: white;
        }

        .privacy-hero h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: white;
          margin-top: 0;
        }

        .privacy-hero p {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
        }

        .privacy-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .privacy-content {
          background: white;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .privacy-content section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .privacy-content section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .privacy-content h2 {
          font-size: 1.25rem;
          color: #0f2b4d;
          margin-bottom: 1rem;
          font-weight: 600;
          margin-top: 0;
        }

        .privacy-content h3 {
          font-size: 1rem;
          color: #0f2b4d;
          margin: 1rem 0 0.5rem 0;
          font-weight: 600;
        }

        .privacy-content p {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }

        .privacy-content a {
          color: #d4af37;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .privacy-content a:hover {
          color: #b8921a;
          text-decoration: underline;
        }

        .privacy-list {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
          list-style: none;
        }

        .privacy-list li {
          margin-bottom: 0.5rem;
          color: #4b5563;
          line-height: 1.5;
          position: relative;
          padding-left: 1rem;
        }

        .privacy-list li::before {
          content: "•";
          color: #d4af37;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .rights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .right-card {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
          transition: transform 0.2s ease;
        }

        .right-card:hover {
          transform: translateY(-2px);
        }

        .right-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .right-card strong {
          display: block;
          color: #0f2b4d;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }

        .right-card p {
          font-size: 0.75rem;
          margin: 0;
          color: #6b7280;
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

        .back-link {
          display: inline-block;
          margin-top: 0.5rem;
          color: #d4af37;
          text-decoration: none;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .privacy-hero h1 {
            font-size: 1.5rem;
          }
          
          .privacy-hero p {
            font-size: 0.875rem;
          }
          
          .privacy-content {
            padding: 1.5rem;
          }
          
          .privacy-content h2 {
            font-size: 1.125rem;
          }
          
          .rights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default Privacy;