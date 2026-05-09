import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-light py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md">
          {t('legal.privacy.title', 'Politique de confidentialité')}
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          {t('legal.privacy.subtitle', 'Comment nous protégeons vos données personnelles sur IMMORent Maroc')}
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-bg-card rounded-3xl p-8 md:p-12 shadow-large border border-border-main">
          <div className="space-y-12">
            
            {/* Introduction */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <LockClosedIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.privacy.intro_title', '1. Introduction')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>
                  {t('legal.privacy.intro_desc_1', 'IMMORent Maroc SARL (ci-après "IMMORent", "nous", "notre") accorde une importance primordiale à la protection de vos données personnelles. La présente politique de confidentialité a pour objectif de vous informer sur la manière dont nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre plateforme immobilière IMMORent.ma.')}
                </p>
                <p>
                  {t('legal.privacy.intro_desc_2', 'Nous nous engageons à respecter la Loi n° 09-08 relative à la protection des personnes physiques à l\'égard du traitement des données à caractère personnel et à garantir la confidentialité de vos informations.')}
                </p>
              </div>
            </section>

            {/* Responsable du traitement */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <BuildingOfficeIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.privacy.resp_title', '2. Responsable du traitement')}
              </h2>
              <div className="space-y-2 text-text-sub leading-relaxed">
                <p><strong>{t('legal.mentions.editor_desc', 'IMMORent Maroc SARL')}</strong></p>
                <p className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-secondary" />
                  Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000, Maroc
                </p>
                <p className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-secondary" />
                  {t('legal.mentions.phone', 'Téléphone')} : +212 5 24 12 34 56
                </p>
                <p className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 text-secondary" />
                  {t('legal.mentions.email', 'Email')} : <a href="mailto:contact@immorent.ma" className="text-secondary hover:underline font-bold">
                    contact@immorent.ma
                  </a>
                </p>
              </div>
            </section>

            {/* Données collectées */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <DocumentTextIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.privacy.data_title', '3. Données collectées')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>{t('legal.privacy.data_desc', 'Nous collectons les catégories de données suivantes :')}</p>
                <ul className="space-y-2 ps-2">
                  <li className="flex items-start gap-3">
                    <CheckBadgeIcon className="w-4 h-4 text-secondary mt-1" />
                    <strong>{t('legal.privacy.data_ident', 'Données d\'identification : nom, prénom, email, téléphone')}</strong>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckBadgeIcon className="w-4 h-4 text-secondary mt-1" />
                    <strong>{t('legal.privacy.data_conn', 'Données de connexion : adresse IP, logs, navigateur')}</strong>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckBadgeIcon className="w-4 h-4 text-secondary mt-1" />
                    <strong>{t('legal.privacy.data_trans', 'Données de transaction : historique des recherches, annonces consultées')}</strong>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckBadgeIcon className="w-4 h-4 text-secondary mt-1" />
                    <strong>{t('legal.privacy.data_pay', 'Données de paiement : (uniquement si nécessaire via des prestataires sécurisés)')}</strong>
                  </li>
                </ul>
              </div>
            </section>

            {/* Base légale */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ScaleIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.privacy.legal_base_title', '4. Base légale du traitement')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-bg-soft rounded-2xl border border-border-main">
                  <h4 className="font-bold text-text-main mb-2">{t('legal.privacy.consent', 'Consentement')}</h4>
                  <p className="text-sm text-text-muted">{t('legal.privacy.consent_desc', 'Pour l\'envoi de newsletters et communications marketing')}</p>
                </div>
                <div className="p-4 bg-bg-soft rounded-2xl border border-border-main">
                  <h4 className="font-bold text-text-main mb-2">{t('legal.privacy.contract', 'Contrat')}</h4>
                  <p className="text-sm text-text-muted">{t('legal.privacy.contract_desc', 'Pour l\'exécution de nos services immobiliers')}</p>
                </div>
                <div className="p-4 bg-bg-soft rounded-2xl border border-border-main">
                  <h4 className="font-bold text-text-main mb-2">{t('legal.privacy.legal_oblig', 'Obligation légale')}</h4>
                  <p className="text-sm text-text-muted">{t('legal.privacy.legal_oblig_desc', 'Pour répondre aux exigences réglementaires')}</p>
                </div>
                <div className="p-4 bg-bg-soft rounded-2xl border border-border-main">
                  <h4 className="font-bold text-text-main mb-2">{t('legal.privacy.legit_interest', 'Intérêt légitime')}</h4>
                  <p className="text-sm text-text-muted">{t('legal.privacy.legit_interest_desc', 'Pour améliorer nos services et la sécurité')}</p>
                </div>
              </div>
            </section>

            {/* Durée de conservation */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ClockIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.privacy.retention_title', '5. Durée de conservation')}
              </h2>
              <div className="space-y-3 text-text-sub leading-relaxed">
                <p className="flex justify-between items-center py-2 border-b border-border-main">
                  <span>{t('legal.privacy.retention_inactive', 'Comptes inactifs')}</span>
                  <span className="font-bold text-secondary">3 ans</span>
                </p>
                <p className="flex justify-between items-center py-2 border-b border-border-main">
                  <span>{t('legal.privacy.retention_nav', 'Données de navigation')}</span>
                  <span className="font-bold text-secondary">13 mois</span>
                </p>
                <p className="flex justify-between items-center py-2 border-b border-border-main">
                  <span>{t('legal.privacy.retention_legal', 'Factures et documents légaux')}</span>
                  <span className="font-bold text-secondary">10 ans</span>
                </p>
                <p className="flex justify-between items-center py-2">
                  <span>{t('legal.privacy.retention_contact', 'Demandes de contact')}</span>
                  <span className="font-bold text-secondary">1 an</span>
                </p>
              </div>
            </section>

            {/* Sécurité des données */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ShieldCheckIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.privacy.security_title', '6. Sécurité des données')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>{t('legal.privacy.security_desc', 'Nous mettons en œuvre les mesures techniques et organisationnelles suivantes :')}</p>
                <ul className="space-y-2 ps-2">
                  <li className="flex items-start gap-3">
                    <LockClosedIcon className="w-4 h-4 text-secondary mt-1" />
                    {t('legal.privacy.security_ssl', 'Chiffrement SSL/TLS pour toutes les transmissions de données')}
                  </li>
                  <li className="flex items-start gap-3">
                    <ServerIcon className="w-4 h-4 text-secondary mt-1" />
                    {t('legal.privacy.security_host', 'Hébergement sécurisé avec accès restreint')}
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-4 h-4 text-secondary mt-1" />
                    {t('legal.privacy.security_backup', 'Sauvegardes quotidiennes et monitoring 24/7')}
                  </li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                🍪 {t('legal.privacy.cookies_title', '7. Cookies')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>{t('legal.privacy.cookies_desc', 'Nous utilisons des cookies pour :')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-bg-soft rounded-xl">
                    <span className="text-xl">🛠️</span>
                    <span className="text-sm">{t('legal.privacy.cookies_operation', 'Fonctionnement du site')}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-bg-soft rounded-xl">
                    <span className="text-xl">📊</span>
                    <span className="text-sm">{t('legal.privacy.cookies_stats', 'Analyses statistiques')}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-bg-soft rounded-xl">
                    <span className="text-xl">🎯</span>
                    <span className="text-sm">{t('legal.privacy.cookies_personalize', 'Personnalisation des annonces')}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-bg-soft rounded-xl">
                    <span className="text-xl">🔒</span>
                    <span className="text-sm">{t('legal.privacy.cookies_security', 'Sécurité et authentification')}</span>
                  </div>
                </div>
                <p className="text-sm text-text-muted mt-4">
                  {t('legal.privacy.cookies_manage', 'Vous pouvez gérer vos préférences de cookies à tout moment via notre')} 
                  {' '}<a href="#" className="text-secondary hover:underline ml-1">{t('admin.settings.media', ' gestionnaire de cookies')}</a>.
                </p>
              </div>
            </section>

            {/* Vos droits */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ShieldCheckIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.privacy.rights_title', '8. Vos droits')}
              </h2>
              <p className="text-text-sub mb-6">
                {t('legal.privacy.rights_desc', 'Conformément à la Loi n° 09-08 et au RGPD, vous disposez des droits suivants :')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <h4 className="font-bold text-text-main">{t('legal.privacy.rights_access_title', 'Droit d\'accès')}</h4>
                    <p className="text-xs text-text-muted mt-1">
                      {t('legal.privacy.rights_access_desc', 'Obtenir la confirmation que vos données sont traitées et y accéder.')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">✏️</span>
                  <div>
                    <h4 className="font-bold text-text-main">{t('legal.privacy.rights_rectify_title', 'Droit de rectification')}</h4>
                    <p className="text-xs text-text-muted mt-1">
                      {t('legal.privacy.rights_rectify_desc', 'Faire rectifier vos données si elles sont inexactes.')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">🗑️</span>
                  <div>
                    <h4 className="font-bold text-text-main">{t('legal.privacy.rights_erase_title', 'Droit à l\'effacement')}</h4>
                    <p className="text-xs text-text-muted mt-1">
                      {t('legal.privacy.rights_erase_desc', 'Demander la suppression de vos données.')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">⛔</span>
                  <div>
                    <h4 className="font-bold text-text-main">{t('legal.privacy.rights_oppose_title', 'Droit d\'opposition')}</h4>
                    <p className="text-xs text-text-muted mt-1">
                      {t('legal.privacy.rights_oppose_desc', 'S\'opposer au traitement pour des motifs légitimes.')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h4 className="font-bold text-text-main">{t('legal.privacy.rights_portability_title', 'Droit à la portabilité')}</h4>
                    <p className="text-xs text-text-muted mt-1">
                      {t('legal.privacy.rights_portability_desc', 'Recevoir vos données dans un format structuré.')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                  <span className="text-2xl">⏸️</span>
                  <div>
                    <h4 className="font-bold text-text-main">{t('legal.privacy.rights_limit_title', 'Droit à la limitation')}</h4>
                    <p className="text-xs text-text-muted mt-1">
                      {t('legal.privacy.rights_limit_desc', 'Suspendre le traitement de vos données.')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-secondary/10 rounded-2xl border border-secondary/20">
                <p className="text-text-sub text-sm">
                  <strong className="text-secondary">📧 {t('legal.privacy.exercise_rights', 'Pour exercer vos droits :')}</strong><br />
                  Contactez notre DPO à <a href="mailto:dpo@immorent.ma" className="text-secondary hover:underline font-bold">
                    dpo@immorent.ma
                  </a> ou par courrier à l'adresse du siège social.
                </p>
              </div>
            </section>

            {/* Modifications */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                📝 {t('legal.privacy.mod_title', '9. Modifications de la politique')}
              </h2>
              <p className="text-text-sub leading-relaxed">
                  {t('legal.privacy.mod_desc', 'Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. La version la plus récente est toujours disponible sur cette page. En cas de modification substantielle, nous vous en informerons par email ou via une notification sur notre plateforme.')}
              </p>
            </section>

            {/* Contact */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <EnvelopeIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.privacy.contact_title', '10. Nous contacter')}
              </h2>
              <div className="space-y-3 text-text-sub">
                <p>{t('legal.privacy.contact_desc', 'Pour toute question relative à cette politique :')}</p>
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
                    {t('profile.address_label', 'Adresse')} : Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="pt-8 text-center text-xs text-text-muted space-y-2">
              <p className="flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" /> 
                {t('legal.mentions.last_update', 'Dernière mise à jour :')} 
                {' '}{new Date().toLocaleDateString(t('common.locale', 'fr-FR'), { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <p>{t('legal.mentions.version', 'Version :')} 2.0</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Link to="/" className="text-secondary font-bold hover:underline">
                  {t('legal.mentions.back_home', '← Retour à l\'accueil')}
                </Link>
                <Link to="/legal-mentions" className="text-secondary font-bold hover:underline">
                  {t('legal.mentions.title', 'Mentions légales')} →
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