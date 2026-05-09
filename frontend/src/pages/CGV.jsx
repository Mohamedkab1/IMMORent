import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  DocumentTextIcon, 
  CreditCardIcon, 
  ScaleIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  UserGroupIcon, 
  InformationCircleIcon,
  HomeIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  HandRaisedIcon,
  LockClosedIcon,
  LightBulbIcon,
  ArrowPathIcon,
  GiftIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const CGV = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-light py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md">
          {t('legal.cgv.title', 'Conditions Générales de Vente')}
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          {t('legal.cgv.subtitle', 'Les conditions d\'utilisation de la plateforme IMMORent Maroc')}
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-bg-card rounded-3xl p-8 md:p-12 shadow-large border border-border-main">
          <div className="space-y-12">
            
            {/* Article 1 : Objet */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <DocumentTextIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art1_title', 'Article 1 : Objet')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>
                  {t('legal.cgv.art1_desc_1', 'Les présentes Conditions Générales de Vente (CGV) régissent l\'utilisation de la plateforme IMMORent.ma et définissent les droits et obligations des utilisateurs (particuliers, agents immobiliers, promoteurs).')}
                </p>
                <p>
                  {t('legal.cgv.art1_desc_2', 'Elles s\'appliquent sans restriction ni réserve à l\'ensemble des services proposés par IMMORent Maroc SARL à ses clients.')}
                </p>
                <p>
                  {t('legal.cgv.art1_desc_3', 'L\'utilisation de la plateforme implique l\'acceptation pleine et entière des présentes CGV par l\'utilisateur.')}
                </p>
              </div>
            </section>

            {/* Article 2 : Services proposés */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <HomeIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art2_title', 'Article 2 : Services proposés')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-bg-soft rounded-xl">
                  <StarIcon className="w-5 h-5 text-secondary" />
                  <span className="text-text-sub">{t('legal.cgv.service_pub', 'Publication d\'annonces immobilières')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-bg-soft rounded-xl">
                  <StarIcon className="w-5 h-5 text-secondary" />
                  <span className="text-text-sub">{t('legal.cgv.service_search', 'Recherche de biens immobiliers')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-bg-soft rounded-xl">
                  <StarIcon className="w-5 h-5 text-secondary" />
                  <span className="text-text-sub">{t('legal.cgv.service_contact', 'Mise en relation acheteurs/vendeurs')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-bg-soft rounded-xl">
                  <StarIcon className="w-5 h-5 text-secondary" />
                  <span className="text-text-sub">{t('legal.cgv.service_tools', 'Outils de gestion immobilière')}</span>
                </div>
              </div>
            </section>

            {/* Article 3 : Tarification */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <CreditCardIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art3_title', 'Article 3 : Tarification')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Offre Agent Immobilier */}
                <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl border-2 border-primary/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3">
                    <UserGroupIcon className="w-8 h-8 text-primary/20 group-hover:text-primary/30 transition-colors" />
                  </div>
                  <h4 className="font-bold text-primary mb-2 uppercase tracking-wider text-xs">
                    {t('legal.cgv.agent_title', 'Agent Immobilier')}
                  </h4>
                  <p className="text-3xl font-black text-text-main mb-4">
                    149 DH <span className="text-sm font-normal opacity-60">{t('legal.cgv.price_ht', 'HT / mois')}</span>
                  </p>
                  <ul className="space-y-2 text-xs text-text-sub font-medium">
                    {t('legal.cgv.agent_features', ['Annonces illimitées', 'Gestion complète', 'Support 7j/7', 'Statistiques avancées']).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500" /> 
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Offre Particulier */}
                <div className="p-6 bg-bg-soft rounded-3xl border border-border-main group">
                  <h4 className="font-bold text-text-main mb-2 uppercase tracking-wider text-xs opacity-60">
                    {t('legal.cgv.particular_title', 'Particulier')}
                  </h4>
                  <p className="text-3xl font-black text-text-main mb-4">
                    99 DH <span className="text-sm font-normal opacity-60">{t('legal.cgv.price_ht', 'HT / mois')}</span>
                  </p>
                  <ul className="space-y-2 text-xs text-text-sub font-medium">
                    {t('legal.cgv.particular_features', ['Jusqu\'à 5 annonces', 'Gestion directe', 'Support email']).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-primary" /> 
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Offre Promoteur */}
              <div className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-3xl border-2 border-secondary/30 mb-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h4 className="font-bold text-secondary mb-2 uppercase tracking-wider text-xs">
                      {t('legal.cgv.promoter_title', 'Promoteur Immobilier')}
                    </h4>
                    <p className="text-3xl font-black text-text-main mb-2">
                      {t('legal.cgv.on_quote', 'Sur devis personnalisé')}
                    </p>
                    <p className="text-sm text-text-muted">Programmes neufs et VEFA</p>
                  </div>
                  <div className="bg-secondary/20 px-4 py-2 rounded-full">
                    <span className="text-secondary font-bold text-sm">{t('legal.cgv.custom_solution', 'Solution sur mesure')}</span>
                  </div>
                </div>
                <ul className="grid grid-cols-2 gap-2 mt-4">
                  {t('legal.cgv.promoter_features', ['Visibility premium', 'Pages dédiées', 'Gestion de projet', 'API personnalisée']).map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-text-sub">
                      <CheckCircleIcon className="w-4 h-4 text-secondary" /> 
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl text-text-sub text-sm border border-primary/10">
                <InformationCircleIcon className="w-5 h-5 text-secondary flex-shrink-0" />
                <p>
                  {t('legal.cgv.price_notice', 'Tous les prix sont exprimés en Dirhams Marocains (DH) hors taxes. La TVA de 20% est applicable sur chaque transaction sécurisée via notre partenaire HPS. Les abonnements sont reconduits tacitement sauf dénonciation 15 jours avant la fin du mois en cours.')}
                </p>
              </div>
            </section>

            {/* Article 4 : Modalités de paiement */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <LockClosedIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art4_title', 'Article 4 : Modalités de paiement')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>{t('legal.cgv.pay_modes', 'Le paiement des services s\'effectue en ligne par :')}</p>
                <ul className="space-y-2 ps-2">
                  <li className="flex items-center gap-3">
                    <CreditCardIcon className="w-4 h-4 text-secondary" />
                    {t('legal.cgv.pay_card', 'Carte bancaire (CIB, Visa, Mastercard)')}
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowPathIcon className="w-4 h-4 text-secondary" />
                    {t('legal.cgv.pay_transfer', 'Virement bancaire')}
                  </li>
                  <li className="flex items-center gap-3">
                    <GiftIcon className="w-4 h-4 text-secondary" />
                    {t('legal.cgv.pay_mobile', 'Mobile Money (Orange Money, MTN Mobile Money)')}
                  </li>
                </ul>
                <p>
                  {t('legal.cgv.pay_security', 'Les transactions sont sécurisées par notre partenaire HPS (Center of Payment), certifié PCI DSS. IMMORent n\'a pas accès aux données bancaires complètes des utilisateurs.')}
                </p>
              </div>
            </section>

            {/* Article 5 : Droit de rétractation */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <HandRaisedIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art5_title', 'Article 5 : Droit de rétractation')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>
                  {t('legal.cgv.art5_desc', 'Conformément à la loi marocaine, le client dispose d\'un délai de 14 jours à compter de la souscription pour exercer son droit de rétractation, sauf si le service a déjà été entièrement exécuté.')}
                </p>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200">
                  <p className="text-sm flex items-start gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span className="text-amber-800 dark:text-amber-400">
                      {t('legal.cgv.retract_contact', 'Pour exercer ce droit, contactez-nous à retractation@immorent.ma en précisant vos coordonnées et la référence de votre commande.')}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* Article 6 : Résiliation */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ExclamationTriangleIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art6_title', 'Article 6 : Résiliation')}
              </h2>
              <div className="space-y-3 text-text-sub leading-relaxed">
                <p>{t('legal.cgv.resiliation_modes', 'L\'utilisateur peut résilier son abonnement à tout moment :')}</p>
                <ul className="space-y-2 ps-2">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-4 h-4 text-secondary mt-1" />
                    {t('legal.cgv.resiliation_space', 'Depuis son espace personnel')}
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="w-4 h-4 text-secondary mt-1" />
                    {t('legal.cgv.resiliation_email', 'Par email à resiliation@immorent.ma')}
                  </li>
                </ul>
                <p className="mt-2">
                  {t('legal.cgv.resiliation_effect', 'La résiliation prend effet à la fin du mois en cours. Aucun remboursement n\'est dû pour la période en cours.')}
                </p>
              </div>
            </section>

            {/* Article 7 : Responsabilité */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ShieldCheckIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art7_title', 'Article 7 : Responsabilité')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>
                  {t('legal.cgv.art7_desc', 'IMMORent Maroc SARL s\'efforce d\'assurer l\'exactitude des informations publiées sur son site, mais ne peut garantir l\'exhaustivité ou l\'absence d\'erreur. La responsabilité de la plateforme ne saurait être engagée pour :')}
                </p>
                <ul className="space-y-2 ps-2">
                  <li className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 mt-1" />
                    {t('legal.cgv.resp_user_content', 'Les contenus publiés par les utilisateurs (annonces, photos, descriptions)')}
                  </li>
                  <li className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 mt-1" />
                    {t('legal.cgv.resp_transactions', 'Les transactions réalisées directement entre utilisateurs')}
                  </li>
                  <li className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 mt-1" />
                    {t('legal.cgv.resp_tech', 'Les interruptions techniques indépendantes de sa volonté')}
                  </li>
                </ul>
              </div>
            </section>

            {/* Article 8 : Obligations des utilisateurs */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <UserIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art8_title', 'Article 8 : Obligations des utilisateurs')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-bg-soft rounded-xl">
                  <LightBulbIcon className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-text-sub">{t('legal.cgv.oblig_info', 'Fournir des informations exactes')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-bg-soft rounded-xl">
                  <LightBulbIcon className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-text-sub">{t('legal.cgv.oblig_legal', 'Respecter la législation en vigueur')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-bg-soft rounded-xl">
                  <LightBulbIcon className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-text-sub">{t('legal.cgv.oblig_content', 'Ne pas publier de contenus illicites')}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-bg-soft rounded-xl">
                  <LightBulbIcon className="w-5 h-5 text-secondary" />
                  <span className="text-sm text-text-sub">{t('legal.cgv.oblig_creds', 'Protéger ses identifiants de connexion')}</span>
                </div>
              </div>
            </section>

            {/* Article 9 : Modification des CGV */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ArrowPathIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art9_title', 'Article 9 : Modification des CGV')}
              </h2>
                <p className="text-text-sub leading-relaxed">
                  {t('legal.cgv.art9_desc', 'IMMORent se réserve le droit de modifier les présentes CGV à tout moment. Les modifications entrent en vigueur dès leur publication en ligne. Les utilisateurs seront informés par email en cas de modification substantielle.')}
                </p>
            </section>

            {/* Article 10 : Support et réclamations */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <PhoneIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art10_title', 'Article 10 : Support et réclamations')}
              </h2>
              <div className="space-y-3 text-text-sub">
                <p>{t('legal.cgv.support_desc', 'Pour toute question ou réclamation :')}</p>
                <div className="p-4 bg-bg-soft rounded-2xl space-y-2">
                  <p className="flex items-center gap-2">
                    <EnvelopeIcon className="w-4 h-4 text-secondary" />
                    {t('legal.mentions.email', 'Email')} : <a href="mailto:support@immorent.ma" className="text-secondary hover:underline">
                      support@immorent.ma
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-secondary" />
                    {t('legal.mentions.phone', 'Téléphone')} : +212 5 24 12 34 56 (du lundi au vendredi, 9h-18h)
                  </p>
                  <p className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-secondary" />
                    {t('legal.cgv.support_response', 'Délai de réponse maximum : 48h ouvrées')}
                  </p>
                </div>
              </div>
            </section>

            {/* Article 11 : Droit applicable et litiges */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ScaleIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.cgv.art11_title', 'Article 11 : Droit applicable et litiges')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>
                  {t('legal.cgv.art11_desc', 'Les présentes CGV sont régies par le droit marocain. En cas de litige, et après tentative de recherche d\'une solution amiable, les tribunaux de Marrakech seront seuls compétents.')}
                </p>
                <div className="flex items-start gap-3 p-4 bg-secondary/10 rounded-2xl">
                  <HandRaisedIcon className="w-5 h-5 text-secondary flex-shrink-0" />
                  <p className="text-sm">
                    {t('legal.cgv.mediation', 'Avant toute action judiciaire, un médiateur peut être saisi à l\'adresse mediation@immorent.ma')}
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="pt-8 text-center text-xs text-text-muted space-y-4">
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <p className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" /> 
                  {t('legal.mentions.version', 'Version en vigueur :')} {new Date().toLocaleDateString(t('common.locale', 'fr-FR'), { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
                <p>{t('legal.mentions.version', 'Version :')} 2.0</p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/" className="inline-block px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-full transition-all">
                  {t('legal.mentions.back_home', '← Retour à l\'accueil')}
                </Link>
                <Link to="/legal-mentions" className="inline-block px-6 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold rounded-full transition-all">
                  {t('legal.mentions.title', 'Mentions légales')}
                </Link>
                <Link to="/privacy" className="inline-block px-6 py-2 bg-bg-soft hover:bg-border-main text-text-sub font-bold rounded-full transition-all">
                  {t('legal.privacy.title', 'Confidentialité')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGV;