import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LockClosedIcon, 
  BuildingOfficeIcon, 
  CalendarIcon, 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ScaleIcon,
  DocumentTextIcon,
  ServerIcon,
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const Privacy = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-light py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md">
          Politique de confidentialité
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Comment nous protégeons vos données personnelles sur IMMORent Maroc
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-bg-card rounded-3xl p-8 md:p-12 shadow-large border border-border-main">
          <div className="space-y-12">
            
            {/* Introduction */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <LockClosedIcon className="w-5 h-5 text-secondary" /> 
                1. Introduction
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>
                  IMMORent Maroc SARL (ci-après "IMMORent", "nous", "notre") accorde une importance 
                  primordiale à la protection de vos données personnelles. La présente politique de 
                  confidentialité a pour objectif de vous informer sur la manière dont nous collectons, 
                  utilisons, stockons et protégeons vos informations lorsque vous utilisez notre 
                  plateforme immobilière <strong>IMMORent.ma</strong>.
                </p>
                <p>
                  Nous nous engageons à respecter la <strong>Loi n° 09-08</strong> relative à la protection 
                  des personnes physiques à l'égard du traitement des données à caractère personnel 
                  et à garantir la confidentialité de vos informations.
                </p>
              </div>
            </section>

            {/* Responsable du traitement */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <BuildingOfficeIcon className="w-5 h-5 text-secondary" /> 
                2. Responsable du traitement
              </h2>
              <div className="space-y-2 text-text-sub leading-relaxed">
                <p><strong>IMMORent Maroc SARL</strong></p>
                <p className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-secondary" />
                  Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000, Maroc
                </p>
                <p className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-secondary" />
                  Téléphone : +212 5 24 12 34 56
                </p>
                <p className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 text-secondary" />
                  Email : <a href="mailto:contact@immorent.ma" className="text-secondary hover:underline font-bold">
                    contact@immorent.ma
                  </a>
                </p>
              </div>
            </section>

            {/* Données collectées */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <DocumentTextIcon className="w-5 h-5 text-secondary" /> 
                3. Données collectées
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>Nous collectons les catégories de données suivantes :</p>
                <ul className="space-y-2 ps-2">
                  <li className="flex items-start gap-3">
                    <CheckBadgeIcon className="w-4 h-4 text-secondary mt-1" />
                    <strong>Données d'identification :</strong> nom, prénom, email, téléphone
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckBadgeIcon className="w-4 h-4 text-secondary mt-1" />
                    <strong>Données de connexion :</strong> adresse IP, logs, navigateur
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckBadgeIcon className="w-4 h-4 text-secondary mt-1" />
                    <strong>Données de transaction :</strong> historique des recherches, annonces consultées
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckBadgeIcon className="w-4 h-4 text-secondary mt-1" />
                    <strong>Données de paiement :</strong> (uniquement si nécessaire via des prestataires sécurisés)
                  </li>
                </ul>
              </div>
            </section>

            {/* Base légale */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ScaleIcon className="w-5 h-5 text-secondary" /> 
                4. Base légale du traitement
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-bg-soft rounded-2xl border border-border-main">
                  <h4 className="font-bold text-text-main mb-2">Consentement</h4>
                  <p className="text-sm text-text-muted">Pour l'envoi de newsletters et communications marketing</p>
                </div>
                <div className="p-4 bg-bg-soft rounded-2xl border border-border-main">
                  <h4 className="font-bold text-text-main mb-2">Contrat</h4>
                  <p className="text-sm text-text-muted">Pour l'exécution de nos services immobiliers</p>
                </div>
                <div className="p-4 bg-bg-soft rounded-2xl border border-border-main">
                  <h4 className="font-bold text-text-main mb-2">Obligation légale</h4>
                  <p className="text-sm text-text-muted">Pour répondre aux exigences réglementaires</p>
                </div>
                <div className="p-4 bg-bg-soft rounded-2xl border border-border-main">
                  <h4 className="font-bold text-text-main mb-2">Intérêt légitime</h4>
                  <p className="text-sm text-text-muted">Pour améliorer nos services et la sécurité</p>
                </div>
              </div>
            </section>

            {/* Durée de conservation */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ClockIcon className="w-5 h-5 text-secondary" /> 
                5. Durée de conservation
              </h2>
              <div className="space-y-3 text-text-sub leading-relaxed">
                <p className="flex justify-between items-center py-2 border-b border-border-main">
                  <span>Comptes inactifs</span>
                  <span className="font-bold text-secondary">3 ans</span>
                </p>
                <p className="flex justify-between items-center py-2 border-b border-border-main">
                  <span>Données de navigation</span>
                  <span className="font-bold text-secondary">13 mois</span>
                </p>
                <p className="flex justify-between items-center py-2 border-b border-border-main">
                  <span>Factures et documents légaux</span>
                  <span className="font-bold text-secondary">10 ans</span>
                </p>
                <p className="flex justify-between items-center py-2">
                  <span>Demandes de contact</span>
                  <span className="font-bold text-secondary">1 an</span>
                </p>
              </div>
            </section>

            {/* Sécurité des données */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ShieldCheckIcon className="w-5 h-5 text-secondary" /> 
                6. Sécurité des données
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>Nous mettons en œuvre les mesures techniques et organisationnelles suivantes :</p>
                <ul className="space-y-2 ps-2">
                  <li className="flex items-start gap-3">
                    <LockClosedIcon className="w-4 h-4 text-secondary mt-1" />
                    Chiffrement SSL/TLS pour toutes les transmissions de données
                  </li>
                  <li className="flex items-start gap-3">
                    <ServerIcon className="w-4 h-4 text-secondary mt-1" />
                    Hébergement sécurisé avec accès restreint
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-4 h-4 text-secondary mt-1" />
                    Sauvegardes quotidiennes et monitoring 24/7
                  </li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                🍪 7. Cookies
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>Nous utilisons des cookies pour :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-bg-soft rounded-xl">
                    <span className="text-xl">🛠️</span>
                    <span className="text-sm">Fonctionnement du site</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-bg-soft rounded-xl">
                    <span className="text-xl">📊</span>
                    <span className="text-sm">Analyses statistiques</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-bg-soft rounded-xl">
                    <span className="text-xl">🎯</span>
                    <span className="text-sm">Personnalisation des annonces</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-bg-soft rounded-xl">
                    <span className="text-xl">🔒</span>
                    <span className="text-sm">Sécurité et authentification</span>
                  </div>
                </div>
                <p className="text-sm text-text-muted mt-4">
                  Vous pouvez gérer vos préférences de cookies à tout moment via notre 
                  <a href="#" className="text-secondary hover:underline ml-1"> gestionnaire de cookies</a>.
                </p>
              </div>
            </section>

            {/* Vos droits */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ShieldCheckIcon className="w-5 h-5 text-secondary" /> 
                8. Vos droits
              </h2>
              <p className="text-text-sub mb-6">
                Conformément à la <strong>Loi n° 09-08</strong> et au <strong>RGPD</strong>, 
                vous disposez des droits suivants :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <h4 className="font-bold text-text-main">Droit d'accès</h4>
                    <p className="text-xs text-text-muted mt-1">
                      Obtenir la confirmation que vos données sont traitées et y accéder.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">✏️</span>
                  <div>
                    <h4 className="font-bold text-text-main">Droit de rectification</h4>
                    <p className="text-xs text-text-muted mt-1">
                      Faire rectifier vos données si elles sont inexactes.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">🗑️</span>
                  <div>
                    <h4 className="font-bold text-text-main">Droit à l'effacement</h4>
                    <p className="text-xs text-text-muted mt-1">
                      Demander la suppression de vos données.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">⛔</span>
                  <div>
                    <h4 className="font-bold text-text-main">Droit d'opposition</h4>
                    <p className="text-xs text-text-muted mt-1">
                      S'opposer au traitement pour des motifs légitimes.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h4 className="font-bold text-text-main">Droit à la portabilité</h4>
                    <p className="text-xs text-text-muted mt-1">
                      Recevoir vos données dans un format structuré.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">⏸️</span>
                  <div>
                    <h4 className="font-bold text-text-main">Droit à la limitation</h4>
                    <p className="text-xs text-text-muted mt-1">
                      Suspendre le traitement de vos données.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-secondary/10 rounded-2xl border border-secondary/20">
                <p className="text-text-sub text-sm">
                  <strong className="text-secondary">📧 Pour exercer vos droits :</strong><br />
                  Contactez notre DPO à <a href="mailto:dpo@immorent.ma" className="text-secondary hover:underline font-bold">
                    dpo@immorent.ma
                  </a> ou par courrier à l'adresse du siège social.
                </p>
              </div>
            </section>

            {/* Modifications */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                📝 9. Modifications de la politique
              </h2>
              <p className="text-text-sub leading-relaxed">
                Nous nous réservons le droit de modifier la présente politique de confidentialité 
                à tout moment. La version la plus récente est toujours disponible sur cette page. 
                En cas de modification substantielle, nous vous en informerons par email ou via une 
                notification sur notre plateforme.
              </p>
            </section>

            {/* Contact */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <EnvelopeIcon className="w-5 h-5 text-secondary" /> 
                10. Nous contacter
              </h2>
              <div className="space-y-3 text-text-sub">
                <p>Pour toute question relative à cette politique :</p>
                <div className="p-4 bg-bg-soft rounded-2xl">
                  <p className="flex items-center gap-2">
                    <EnvelopeIcon className="w-4 h-4 text-secondary" />
                    Email : <a href="mailto:confidentialite@immorent.ma" className="text-secondary hover:underline">
                      confidentialite@immorent.ma
                    </a>
                  </p>
                  <p className="flex items-center gap-2 mt-2">
                    <PhoneIcon className="w-4 h-4 text-secondary" />
                    Téléphone : +212 5 24 12 34 56
                  </p>
                  <p className="flex items-center gap-2 mt-2">
                    <MapPinIcon className="w-4 h-4 text-secondary" />
                    Adresse : Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="pt-8 text-center text-xs text-text-muted space-y-2">
              <p className="flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" /> 
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <p>Version : 2.0</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Link to="/" className="text-secondary font-bold hover:underline">
                  ← Retour à l'accueil
                </Link>
                <Link to="/legal-mentions" className="text-secondary font-bold hover:underline">
                  Mentions légales →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;