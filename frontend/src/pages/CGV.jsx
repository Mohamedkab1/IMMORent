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
  ShieldCheckIcon,
  HandRaisedIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  UserIcon,
  PencilSquareIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const CGV = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-soft pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            <ArrowLeftIcon className="w-3 h-3" />
            {t('common.prev', 'Retour')}
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">
            Conditions <span className="text-primary">Générales de Vente</span>
          </h1>
          <p className="text-xs text-text-sub font-bold uppercase tracking-[0.3em] opacity-60">
            Règles d'utilisation et conditions de vente de la plateforme
          </p>
        </motion.div>

        {/* Content Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-card border border-border-main rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm"
        >
          <div className="p-8 md:p-12 space-y-16">
            
            {/* Article 1 & 2 */}
            <motion.section variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <DocumentTextIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Article 1 : Objet</h2>
                </div>
                <div className="text-sm text-text-sub leading-relaxed pl-14 space-y-4">
                  <p>Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation de la plateforme IMMORent.ma et définissent les droits et obligations des utilisateurs (particuliers, agents immobiliers, promoteurs).</p>
                  <p>Elles s'appliquent sans restriction ni réserve à l'ensemble des services proposés par IMMORent Maroc SARL à ses clients.</p>
                  <p>L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGV par l'utilisateur.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <HomeIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Article 2 : Services proposés</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 pl-14">
                  {['Publication d\'annonces immobilières', 'Recherche de biens immobiliers', 'Mise en relation acheteurs/vendeurs', 'Outils de gestion immobilière'].map((s, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-bg-soft border border-border-main text-[9px] font-black uppercase tracking-widest text-text-main flex flex-col gap-2 justify-center text-center hover:border-primary/30 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Article 3 : Tarification */}
            <motion.section variants={sectionVariants} className="space-y-10 border-t border-border-main pt-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCardIcon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">Article 3 : Tarification</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Agent Card */}
                <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 relative group hover:scale-[1.02] transition-transform">
                  <div className="absolute -top-3 left-8 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-lg">PRO</div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Agent Immobilier</h4>
                  <div className="text-3xl font-black text-text-main mb-6">149 DH <span className="text-xs font-normal opacity-40">HT / MOIS</span></div>
                  <ul className="space-y-3">
                    {['Annonces illimitées', 'Gestion complète', 'Support 7j/7', 'Statistiques avancées'].map(f => (
                      <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-text-sub">
                        <CheckCircleIcon className="w-4 h-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Particulier Card */}
                <div className="p-8 rounded-xl bg-bg-soft border border-border-main hover:scale-[1.02] transition-transform">
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">Particulier</h4>
                  <div className="text-3xl font-black text-text-main mb-6">99 DH <span className="text-xs font-normal opacity-40">HT / MOIS</span></div>
                  <ul className="space-y-3">
                    {['Jusqu\'à 5 annonces', 'Gestion directe', 'Support email'].map(f => (
                      <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-text-sub">
                        <CheckCircleIcon className="w-4 h-4 text-text-muted opacity-40" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Promoteur Card */}
                <div className="p-8 rounded-xl bg-bg-main border border-border-main flex flex-col justify-center text-center hover:scale-[1.02] transition-transform">
                  <UserGroupIcon className="w-8 h-8 mx-auto text-primary opacity-20 mb-4" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main mb-2">Promoteur Immobilier</h4>
                  <div className="text-lg font-black text-primary mb-6">SUR DEVIS</div>
                  <ul className="space-y-2 text-left w-full pl-4">
                    {['Programmes neufs et VEFA', 'Solution sur mesure', 'Visibility premium', 'Pages dédiées', 'Gestion de projet', 'API personnalisée'].map(f => (
                      <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-text-sub">
                        <div className="w-1 h-1 rounded-full bg-primary/50" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-5 bg-bg-soft rounded-lg border-l-4 border-yellow-400/50 text-[11px] text-text-sub font-medium leading-relaxed">
                <InformationCircleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p>Tous les prix sont exprimés en Dirhams Marocains (DH) hors taxes. La TVA de 20% est applicable sur chaque transaction sécurisée via notre partenaire HPS. Les abonnements sont reconduits tacitement sauf dénonciation 15 jours avant la fin du mois en cours.</p>
              </div>
            </motion.section>

            {/* Article 4 & 5 */}
            <motion.section variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border-main pt-16">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Article 4 : Modalités de paiement</h2>
                </div>
                <div className="pl-14 space-y-4 text-sm text-text-sub leading-relaxed">
                  <p>Le paiement des services s'effectue en ligne par :</p>
                  <ul className="space-y-2 pl-4 border-l-2 border-border-main">
                    <li className="pl-4">Carte bancaire (CIB, Visa, Mastercard)</li>
                    <li className="pl-4">Virement bancaire</li>
                    <li className="pl-4">Mobile Money (Orange Money, MTN Mobile Money)</li>
                  </ul>
                  <p className="pt-2 text-xs opacity-80">Les transactions sont sécurisées par notre partenaire HPS (Center of Payment), certifié PCI DSS. IMMORent n'a pas accès aux données bancaires complètes des utilisateurs.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <HandRaisedIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Article 5 : Droit de rétractation</h2>
                </div>
                <div className="pl-14">
                  <div className="space-y-4 text-sm text-text-sub leading-relaxed">
                    <p>Conformément à la loi marocaine, le client dispose d'un délai de 14 jours à compter de la souscription pour exercer son droit de rétractation, sauf si le service a déjà été entièrement exécuté.</p>
                    <p>Pour exercer ce droit, contactez-nous à <span className="text-primary font-bold">retractation@immorent.ma</span> en précisant vos coordonnées et la référence de votre commande.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Article 6, 7 & 8 */}
            <motion.section variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border-main pt-16">
              <div className="space-y-6 p-6 rounded-xl bg-bg-soft border border-border-main">
                <div className="flex items-center gap-3">
                  <XMarkIcon className="w-5 h-5 text-rose-500" />
                  <h2 className="text-sm font-black text-text-main uppercase tracking-widest">Article 6 : Résiliation</h2>
                </div>
                <div className="text-xs text-text-sub leading-relaxed space-y-3">
                  <p>L'utilisateur peut résilier son abonnement à tout moment :</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Depuis son espace personnel</li>
                    <li>Par email à resiliation@immorent.ma</li>
                  </ul>
                  <p className="opacity-80 italic">La résiliation prend effet à la fin du mois en cours. Aucun remboursement n'est dû pour la période en cours.</p>
                </div>
              </div>

              <div className="space-y-6 p-6 rounded-xl bg-bg-soft border border-border-main">
                <div className="flex items-center gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-sm font-black text-text-main uppercase tracking-widest">Article 7 : Responsabilité</h2>
                </div>
                <div className="text-xs text-text-sub leading-relaxed space-y-3">
                  <p>IMMORent Maroc SARL s'efforce d'assurer l'exactitude des informations, mais ne peut garantir l'exhaustivité. La responsabilité ne saurait être engagée pour :</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Les contenus publiés par les utilisateurs</li>
                    <li>Les transactions réalisées directement entre utilisateurs</li>
                    <li>Les interruptions techniques indépendantes de sa volonté</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6 p-6 rounded-xl bg-bg-soft border border-border-main">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-sm font-black text-text-main uppercase tracking-widest">Article 8 : Obligations</h2>
                </div>
                <div className="text-xs text-text-sub leading-relaxed space-y-3">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> Fournir des informations exactes</li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> Respecter la législation en vigueur</li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> Ne pas publier de contenus illicites</li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> Protéger ses identifiants de connexion</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Article 9 & 10 */}
            <motion.section variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border-main pt-16">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <PencilSquareIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Article 9 : Modification des CGV</h2>
                </div>
                <div className="pl-14 text-sm text-text-sub leading-relaxed">
                  <p>IMMORent se réserve le droit de modifier les présentes CGV à tout moment. Les modifications entrent en vigueur dès leur publication en ligne. Les utilisateurs seront informés par email en cas de modification substantielle.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Article 10 : Support et réclamations</h2>
                </div>
                <div className="pl-14 space-y-4">
                  <div className="text-sm text-text-sub leading-relaxed">
                    Pour toute question ou réclamation :
                  </div>
                  <div className="bg-bg-soft p-4 rounded-lg border border-border-main space-y-2">
                    <p className="text-xs font-bold text-text-main uppercase tracking-widest flex items-center justify-between">Email <span className="text-primary font-normal normal-case tracking-normal">support@immorent.ma</span></p>
                    <div className="h-px w-full bg-border-main" />
                    <p className="text-xs font-bold text-text-main uppercase tracking-widest flex items-center justify-between">Téléphone <span className="text-primary font-normal normal-case tracking-normal">+212 5 24 12 34 56</span></p>
                    <p className="text-[10px] text-text-muted text-right">Du lundi au vendredi, 9h-18h</p>
                    <div className="h-px w-full bg-border-main" />
                    <p className="text-xs font-bold text-text-main uppercase tracking-widest flex items-center justify-between">Délai de réponse <span className="text-primary font-normal normal-case tracking-normal">Max 48h ouvrées</span></p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Article 11 : Litiges & Droit */}
            <motion.section variants={sectionVariants} className="pt-16 border-t border-border-main text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mx-auto">
                <ScaleIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">Article 11 : Droit applicable et litiges</h2>
              <div className="text-sm text-text-sub max-w-2xl mx-auto leading-relaxed space-y-4">
                <p>Les présentes CGV sont régies par le droit marocain. En cas de litige, et après tentative de recherche d'une solution amiable, les tribunaux de Marrakech seront seuls compétents.</p>
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg text-primary text-xs font-bold border border-primary/20">
                  Avant toute action judiciaire, un médiateur peut être saisi à l'adresse mediation@immorent.ma
                </div>
              </div>
              <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-60">
                <span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Mis à jour : {new Date().toLocaleDateString('fr-FR')}</span>
                <span>IMMORent SARL</span>
              </div>
            </motion.section>

          </div>
        </motion.div>

        {/* Bottom Nav */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex items-center justify-center gap-12"
        >
          <Link to="/legal-mentions" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">Mentions Légales</Link>
          <Link to="/privacy" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">Confidentialité</Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CGV;