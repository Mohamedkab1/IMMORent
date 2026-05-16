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
  ArrowLeftIcon
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
            {t('legal.cgv.title_p1', 'Conditions')} <span className="text-primary">{t('legal.cgv.title_p2', 'Générales')}</span>
          </h1>
          <p className="text-xs text-text-sub font-bold uppercase tracking-[0.3em] opacity-60">
            {t('legal.cgv.subtitle', 'Règles d\'utilisation et conditions de vente de la plateforme')}
          </p>
        </motion.div>

        {/* Content Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-card border border-border-main rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm"
        >
          <div className="p-8 md:p-12 space-y-20">
            
            {/* Objet & Services */}
            <motion.section variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <DocumentTextIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t('legal.cgv.art1_title', '1. Objet')}</h2>
                </div>
                <p className="text-sm text-text-sub leading-relaxed pl-14">
                  {t('legal.cgv.art1_desc_1', 'Les présentes CGV régissent l\'utilisation de la plateforme IMMORent.ma.')}
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <HomeIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t('legal.cgv.art2_title', '2. Services')}</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 pl-14">
                  {['pub', 'search', 'contact', 'tools'].map((s) => (
                    <div key={s} className="p-3 rounded-lg bg-bg-soft border border-border-main text-[9px] font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {t(`legal.cgv.service_${s}`)}
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Tarification */}
            <motion.section variants={sectionVariants} className="space-y-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCardIcon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">{t('legal.cgv.art3_title', '3. Tarification & Abonnements')}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Agent Card */}
                <div className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 relative group hover:scale-[1.02] transition-transform">
                  <div className="absolute -top-3 left-8 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-lg">PRO</div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">{t('legal.cgv.agent_title', 'Agent')}</h4>
                  <div className="text-3xl font-black text-text-main mb-6">149 DH <span className="text-xs font-normal opacity-40">/ MO</span></div>
                  <ul className="space-y-3">
                    {['Annonces illimitées', 'Support 7j/7', 'CRM Intégré'].map(f => (
                      <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-text-sub">
                        <CheckCircleIcon className="w-4 h-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Particulier Card */}
                <div className="p-8 rounded-xl bg-bg-soft border border-border-main hover:scale-[1.02] transition-transform">
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">{t('legal.cgv.particular_title', 'Particulier')}</h4>
                  <div className="text-3xl font-black text-text-main mb-6">99 DH <span className="text-xs font-normal opacity-40">/ MO</span></div>
                  <ul className="space-y-3">
                    {['5 Annonces', 'Tableau de bord'].map(f => (
                      <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-text-sub">
                        <CheckCircleIcon className="w-4 h-4 text-text-muted opacity-40" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Promoteur Card */}
                <div className="p-8 rounded-xl bg-bg-main border border-border-main flex flex-col justify-center text-center hover:scale-[1.02] transition-transform">
                  <UserGroupIcon className="w-8 h-8 mx-auto text-primary opacity-20 mb-4" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main mb-2">{t('legal.cgv.promoter_title', 'Promoteur')}</h4>
                  <div className="text-lg font-black text-primary">SUR DEVIS</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-5 bg-bg-soft rounded-lg border-l-4 border-yellow-400/50 text-[10px] text-text-sub font-medium">
                <InformationCircleIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <p>{t('legal.cgv.price_notice', 'Prix HT. TVA de 20% applicable.')}</p>
              </div>
            </motion.section>

            {/* Modalités & Rétractation */}
            <motion.section variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t('legal.cgv.art4_title', '4. Paiement')}</h2>
                </div>
                <div className="pl-14 space-y-4 text-sm text-text-sub leading-relaxed">
                  <p>{t('legal.cgv.pay_security', 'Sécurisé par HPS.')}</p>
                  <div className="flex gap-4">
                    <div className="px-3 py-2 border border-border-main rounded-md text-[9px] font-black uppercase tracking-widest">VISA</div>
                    <div className="px-3 py-2 border border-border-main rounded-md text-[9px] font-black uppercase tracking-widest">CMI</div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <HandRaisedIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t('legal.cgv.art5_title', '5. Rétractation')}</h2>
                </div>
                <div className="pl-14">
                  <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/10">
                    <p className="text-sm text-text-sub leading-relaxed">
                      {t('legal.cgv.art5_desc', 'Délai de 14 jours conformément à la loi.')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Litiges & Droit */}
            <motion.section variants={sectionVariants} className="pt-16 border-t border-border-main text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mx-auto">
                <ScaleIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">{t('legal.cgv.art11_title', 'Droit Applicable')}</h2>
              <p className="text-sm text-text-sub max-w-2xl mx-auto leading-relaxed">
                {t('legal.cgv.art11_desc', 'Les présentes CGV sont régies par le droit marocain. En cas de litige, les tribunaux de Marrakech sont seuls compétents.')}
              </p>
              <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-60">
                <span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Mis à jour : {new Date().toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR')}</span>
                <span>Version 2.8 — IMMORent SARL</span>
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