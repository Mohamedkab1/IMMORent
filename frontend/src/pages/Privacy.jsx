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
  CheckBadgeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const Privacy = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-soft pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto">
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
            {t('legal.privacy.title_p1', 'Politique de')} <span className="text-primary">{t('legal.privacy.title_p2', 'Confidentialité')}</span>
          </h1>
          <p className="text-xs text-text-sub font-bold uppercase tracking-[0.3em] opacity-60">
            {t('legal.privacy.subtitle', 'Comment nous protégeons vos données personnelles')}
          </p>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-card border border-border-main rounded-xl shadow-xl overflow-hidden backdrop-blur-sm"
        >
          <div className="p-8 md:p-12 space-y-16">
            
            {/* Introduction */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <LockClosedIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('legal.privacy.intro_title', '1. Introduction')}
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub leading-relaxed max-w-2xl">
                <p>{t('legal.privacy.intro_desc_1', 'IMMORent Maroc SARL accorde une importance primordiale à la protection de vos données personnelles.')}</p>
                <p className="font-bold text-text-main">{t('legal.privacy.intro_desc_2', 'Engagement conforme à la Loi n° 09-08.')}</p>
              </div>
            </motion.section>

            {/* Données collectées */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('legal.privacy.data_title', '2. Données collectées')}
                </h2>
              </div>
              <div className="pl-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'data_ident', icon: CheckBadgeIcon },
                  { key: 'data_conn', icon: ServerIcon },
                  { key: 'data_trans', icon: ClockIcon },
                  { key: 'data_pay', icon: ShieldCheckIcon }
                ].map((item) => (
                  <div key={item.key} className="p-5 rounded-lg bg-bg-soft border border-border-main flex items-start gap-4 hover:border-primary/30 transition-colors">
                    <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-text-main mb-1">
                        {t(`legal.privacy.${item.key}_title`, item.key.split('_')[1])}
                      </h4>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {t(`legal.privacy.${item.key}`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Base légale */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <ScaleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('legal.privacy.legal_base_title', '3. Base légale')}
                </h2>
              </div>
              <div className="pl-16 grid grid-cols-2 md:grid-cols-4 gap-3">
                {['consent', 'contract', 'legal_oblig', 'legit_interest'].map((key) => (
                  <div key={key} className="p-4 rounded-lg bg-bg-soft border border-border-main text-center group/card hover:bg-primary transition-all duration-300">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-text-main group-hover/card:text-white">
                      {t(`legal.privacy.${key}`)}
                    </h4>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Durée de conservation */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('legal.privacy.retention_title', '4. Durée de conservation')}
                </h2>
              </div>
              <div className="pl-16 space-y-3 max-w-xl">
                {[
                  { key: 'retention_inactive', val: '3 ans' },
                  { key: 'retention_nav', val: '13 mois' },
                  { key: 'retention_legal', val: '10 ans' }
                ].map((item) => (
                  <div key={item.key} className="flex justify-between items-center py-3 border-b border-border-main group/row">
                    <span className="text-sm font-medium text-text-sub group-hover/row:text-text-main transition-colors">{t(`legal.privacy.${item.key}`)}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-primary">{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Cookies */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <CheckBadgeIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('legal.privacy.cookies_title', '5. Cookies & Tracking')}
                </h2>
              </div>
              <div className="pl-16 flex flex-wrap gap-3">
                {['operation', 'stats', 'personalize', 'security'].map((key) => (
                  <div key={key} className="px-5 py-3 rounded-md bg-bg-soft border border-border-main text-[10px] font-black uppercase tracking-widest text-text-sub hover:text-primary hover:border-primary/30 transition-all">
                    {t(`legal.privacy.cookies_${key}`)}
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Footer Contact */}
            <motion.div variants={sectionVariants} className="pt-16 border-t border-border-main grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-main">{t('legal.privacy.contact_title', 'Support DPO')}</h4>
                <a href="mailto:dpo@immorent.ma" className="block p-4 rounded-lg bg-primary/5 border border-primary/10 text-primary text-sm font-bold hover:bg-primary/10 transition-all">
                  dpo@immorent.ma
                </a>
              </div>
              <div className="md:col-span-2 flex flex-col justify-end text-right">
                <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  {t('legal.mentions.last_update', 'Dernière mise à jour')} : {new Date().toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-40">
                  © {new Date().getFullYear()} IMMORent Maroc — Tous droits réservés
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center justify-center gap-8"
        >
          <Link to="/legal-mentions" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            Mentions Légales
          </Link>
          <Link to="/cgv" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            Conditions de Vente
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;