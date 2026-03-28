import React from 'react';
import { Link } from 'react-router-dom';

const CGV = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="cgv-page">
        <div className="cgv-hero">
          <h1>Conditions Générales de Vente</h1>
          <p>Les conditions d'utilisation de la plateforme IMMORent Maroc</p>
        </div>
        
        <div className="cgv-container">
          <div className="cgv-content">
            
            {/* Article 1 */}
            <section>
              <h2>📜 Article 1 : Objet</h2>
              <p>Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation de la plateforme <strong>IMMORent.ma</strong> et définissent les droits et obligations des utilisateurs (clients et agents immobiliers) dans le cadre de la mise en relation pour la location et l'achat de biens immobiliers au Maroc.</p>
              <p>Elles s'appliquent sans restriction ni réserve à l'ensemble des services proposés par <strong>IMMORent Maroc SARL</strong>.</p>
            </section>

            {/* Article 2 */}
            <section>
              <h2>✅ Article 2 : Acceptation des CGV</h2>
              <p>L'utilisation de la plateforme IMMORent.ma implique l'acceptation pleine et entière des présentes CGV. Tout utilisateur qui ne souhaite pas accepter ces conditions ne doit pas utiliser nos services.</p>
              <p>IMMORent se réserve le droit de modifier les CGV à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Il est recommandé de consulter régulièrement cette page.</p>
            </section>

            {/* Article 3 */}
            <section>
              <h2>👤 Article 3 : Création de compte</h2>
              <p>Pour utiliser les services de la plateforme, l'utilisateur doit créer un compte en fournissant des informations exactes, complètes et à jour : nom, prénom, adresse email, numéro de téléphone, etc.</p>
              <p>L'utilisateur est responsable de la confidentialité de ses identifiants de connexion. Toute activité réalisée depuis son compte lui est imputable.</p>
              <p>IMMORent se réserve le droit de suspendre ou supprimer tout compte en cas de non-respect des présentes conditions.</p>
            </section>

            {/* Article 4 */}
            <section>
              <h2>👥 Article 4 : Types de comptes et tarifs</h2>
              
              <h3>4.1 Compte Client (Gratuit)</h3>
              <ul className="cgv-list">
                <li>Consultation des annonces immobilières</li>
                <li>Recherche avancée avec filtres</li>
                <li>Ajout de biens en favoris</li>
                <li>Création d'alertes personnalisées</li>
                <li>Envoi de demandes de location/achat</li>
                <li>Suivi des demandes en cours</li>
                <li>Gestion des contrats et paiements</li>
              </ul>
              
              <h3>4.2 Compte Agent Immobilier</h3>
              <ul className="cgv-list">
                <li><strong>Forfait mensuel : 149 DH HT (soit environ 165 DH TTC)</strong></li>
                <li>Publication d'annonces illimitées</li>
                <li>Gestion complète des biens (ajout, modification, suppression)</li>
                <li>Traitement des demandes clients</li>
                <li>Génération de contrats PDF</li>
                <li>Statistiques détaillées (vues, demandes)</li>
                <li>Mise en avant prioritaire des annonces</li>
                <li>Support prioritaire 7j/7</li>
              </ul>
              
              <h3>4.3 Compte Particulier (Propriétaire)</h3>
              <ul className="cgv-list">
                <li><strong>Forfait mensuel : 99 DH HT (soit environ 110 DH TTC)</strong></li>
                <li>Publication jusqu'à 5 annonces</li>
                <li>Gestion de vos biens en direct</li>
                <li>Réception des demandes clients</li>
                <li>Support par email</li>
              </ul>
              
              <div className="info-box">
                <span className="info-icon">ℹ️</span>
                <p>Tous les prix sont exprimés en Dirhams Marocains (DH) hors taxes. La TVA est applicable au taux en vigueur (20%). Les abonnements sont sans engagement et peuvent être résiliés à tout moment.</p>
              </div>
            </section>

            {/* Article 5 */}
            <section>
              <h2>💳 Article 5 : Modalités de paiement</h2>
              <p>Les paiements des abonnements s'effectuent en ligne par :</p>
              <ul className="cgv-list">
                <li>Carte bancaire (Visa, MasterCard, CMI)</li>
                <li>Virement bancaire (compte marocain)</li>
                <li>Paiement mobile (CIH Mobile, Orange Money, etc.)</li>
              </ul>
              <p>Le paiement est sécurisé via notre partenaire <strong>HPS (Payment Center)</strong>. IMMORent ne stocke aucune donnée bancaire.</p>
              <p>En cas de non-paiement à l'échéance, l'accès aux services payants sera suspendu.</p>
            </section>

            {/* Article 6 */}
            <section>
              <h2>⏱️ Article 6 : Durée et résiliation</h2>
              <p>Les abonnements sont souscrits pour une durée d'un mois renouvelable tacitement. L'utilisateur peut résilier son abonnement à tout moment depuis son espace personnel ou par email. La résiliation prend effet à la fin de la période en cours.</p>
              <p>IMMORent se réserve le droit de résilier un compte en cas de non-respect des CGV ou d'activité frauduleuse.</p>
            </section>

            {/* Article 7 */}
            <section>
              <h2>⚖️ Article 7 : Obligations des utilisateurs</h2>
              <p>L'utilisateur s'engage à :</p>
              <ul className="cgv-list">
                <li>Fournir des informations exactes et à jour</li>
                <li>Ne pas publier de contenus illicites, frauduleux ou contraires aux lois marocaines</li>
                <li>Respecter les droits de propriété intellectuelle d'IMMORent</li>
                <li>Ne pas utiliser la plateforme pour des activités frauduleuses</li>
                <li>Ne pas tenter de contourner les systèmes de sécurité</li>
                <li>Ne pas reproduire ou redistribuer les annonces sans autorisation</li>
              </ul>
              <p>Toute annonce non conforme pourra être supprimée sans préavis.</p>
            </section>

            {/* Article 8 */}
            <section>
              <h2>🏠 Article 8 : Publication d'annonces</h2>
              <p>Les agents et propriétaires sont responsables du contenu de leurs annonces. Les annonces doivent être conformes à la réalité du bien (surface, prix, équipements, photos).</p>
              <p>Les annonces comportant des informations trompeuses seront supprimées et le compte pourra être suspendu.</p>
              <p>IMMORent se réserve le droit de vérifier les annonces et de refuser toute publication non conforme.</p>
            </section>

            {/* Article 9 */}
            <section>
              <h2>🤝 Article 9 : Mise en relation</h2>
              <p>IMMORent agit uniquement comme une plateforme de mise en relation entre les clients et les professionnels de l'immobilier. Nous ne sommes pas partie aux transactions immobilières et n'intervenons pas dans les négociations, la rédaction des actes ou le paiement des loyers.</p>
              <p>Les contrats de location ou de vente sont conclus directement entre le client et l'agent immobilier ou le propriétaire.</p>
            </section>

            {/* Article 10 */}
            <section>
              <h2>⚠️ Article 10 : Responsabilité</h2>
              <p>IMMORent ne peut être tenu responsable :</p>
              <ul className="cgv-list">
                <li>Des litiges entre utilisateurs (clients et agents)</li>
                <li>De l'exactitude des informations fournies dans les annonces</li>
                <li>Des interruptions de service pour maintenance ou force majeure</li>
                <li>Des dommages indirects liés à l'utilisation de la plateforme</li>
              </ul>
              <p>Notre responsabilité est limitée à la fourniture du service conformément aux présentes CGV.</p>
            </section>

            {/* Article 11 */}
            <section>
              <h2>🛡️ Article 11 : Assurance</h2>
              <p>Les agents immobiliers utilisant la plateforme déclarent être couverts par une assurance responsabilité civile professionnelle conforme à la réglementation marocaine. IMMORent ne fournit aucune assurance.</p>
            </section>

            {/* Article 12 */}
            <section>
              <h2>🔒 Article 12 : Données personnelles</h2>
              <p>Les données personnelles collectées sont traitées conformément à notre <Link to="/confidentialite">Politique de confidentialité</Link> et à la <strong>Loi n° 09-08</strong> relative à la protection des données à caractère personnel.</p>
              <p>Pour plus d'informations sur vos droits (accès, rectification, opposition), consultez notre politique de confidentialité.</p>
            </section>

            {/* Article 13 */}
            <section>
              <h2>💡 Article 13 : Propriété intellectuelle</h2>
              <p>Tous les éléments de la plateforme (textes, logos, images, code, base de données) sont la propriété exclusive d'IMMORent Maroc SARL et sont protégés par le droit marocain de la propriété intellectuelle.</p>
              <p>Toute reproduction, représentation, modification ou exploitation non autorisée est interdite.</p>
            </section>

            {/* Article 14 */}
            <section>
              <h2>⚖️ Article 14 : Droit applicable et litiges</h2>
              <p>Les présentes CGV sont régies par le <strong>droit marocain</strong>. En cas de litige, une solution amiable sera recherchée. À défaut, les tribunaux de <strong>Marrakech</strong> seront seuls compétents.</p>
              <p>Conformément à la loi, vous pouvez recourir à une médiation conventionnelle ou à tout mode alternatif de règlement des différends.</p>
            </section>

            {/* Article 15 */}
            <section>
              <h2>📞 Article 15 : Contact</h2>
              <p>Pour toute question relative aux présentes CGV :</p>
              <ul className="cgv-list">
                <li>📧 Email : <a href="mailto:contact@immorent.ma">contact@immorent.ma</a></li>
                <li>📞 Téléphone : +212 5 24 12 34 56</li>
                <li>📍 Adresse : Avenue Mohammed VI, Guéliz, Marrakech 40000, Maroc</li>
              </ul>
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
        .cgv-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .cgv-hero {
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%);
          padding: 3rem 1.5rem;
          text-align: center;
          color: white;
        }

        .cgv-hero h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: white;
          margin-top: 0;
        }

        .cgv-hero p {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
        }

        .cgv-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .cgv-content {
          background: white;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .cgv-content section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .cgv-content section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .cgv-content h2 {
          font-size: 1.25rem;
          color: #0f2b4d;
          margin-bottom: 1rem;
          font-weight: 600;
          margin-top: 0;
        }

        .cgv-content h3 {
          font-size: 1rem;
          color: #0f2b4d;
          margin: 1rem 0 0.5rem 0;
          font-weight: 600;
        }

        .cgv-content p {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }

        .cgv-content a {
          color: #d4af37;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .cgv-content a:hover {
          color: #b8921a;
          text-decoration: underline;
        }

        .cgv-list {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
          list-style: none;
        }

        .cgv-list li {
          margin-bottom: 0.5rem;
          color: #4b5563;
          line-height: 1.5;
          position: relative;
          padding-left: 1rem;
        }

        .cgv-list li::before {
          content: "•";
          color: #d4af37;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .info-box {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          background: #fef3c7;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .info-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .info-box p {
          margin: 0;
          color: #d97706;
          font-size: 0.875rem;
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
          .cgv-hero h1 {
            font-size: 1.5rem;
          }
          
          .cgv-hero p {
            font-size: 0.875rem;
          }
          
          .cgv-content {
            padding: 1.5rem;
          }
          
          .cgv-content h2 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </>
  );
};

export default CGV;