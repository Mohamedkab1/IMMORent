import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  ClipboardDocumentIcon, 
  UserIcon, 
  LockClosedIcon, 
  CheckIcon, 
  CalendarIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  ScaleIcon,
  ShieldCheckIcon
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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
  }
};

const LegalMentions = () => {
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
            {t('legal.mentions.title_p1', 'Mentions')} <span className="text-primary">{t('legal.mentions.title_p2', 'Légales')}</span>
          </h1>
          <p className="text-xs text-text-sub font-bold uppercase tracking-[0.3em] opacity-60">
            {t('legal.mentions.subtitle', 'Informations légales concernant la plateforme IMMORent Maroc')}
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-card border border-border-main rounded-xl shadow-xl overflow-hidden backdrop-blur-sm"
        >
          <div className="p-8 md:p-12 space-y-16">
            
            {/* Éditeur du site */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <ClipboardDocumentIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('legal.mentions.editor_title', '1. Éditeur du site')}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-text-sub leading-relaxed pl-16">
                <div className="space-y-3">
                  <p className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50 mb-1">{t('legal.mentions.label.denom', 'Dénomination Sociale')}</span>
                    <strong className="text-text-main">{t('legal.mentions.editor_desc', 'IMMORent Maroc SARL')}</strong>
                  </p>
                  <p className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50 mb-1">{t('legal.mentions.label.form', 'Forme Juridique')}</span>
                    {t('legal.mentions.capital', 'SARL au capital de 500 000 DH')}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50 mb-1">{t('legal.mentions.label.seat', 'Siège Social')}</span>
                    {t('legal.mentions.headquarters', 'Avenue Mohammed VI, Marrakech 40000')}
                  </p>
                  <p className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-50 mb-1">{t('legal.mentions.label.contact', 'Contact')}</span>
                    <a href="mailto:contact@immorent.ma" className="text-primary hover:underline font-bold">contact@immorent.ma</a>
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Directeur de publication */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('legal.mentions.pub_dir_title', '2. Directeur de publication')}
                </h2>
              </div>
              <div className="pl-16 space-y-2 text-sm text-text-sub">
                <p><strong>{t('legal.mentions.pub_dir_desc', 'Mohamed Kabbaj')}</strong></p>
                <p className="text-xs opacity-60 uppercase font-bold tracking-widest">{t('legal.mentions.pub_dir_role', 'Gérant & Directeur Général')}</p>
              </div>
            </motion.section>

            {/* Propriété intellectuelle */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('legal.mentions.intellectual_title', '3. Propriété intellectuelle')}
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub leading-relaxed max-w-2xl">
                <p>{t('legal.mentions.intellectual_desc_1', "L'ensemble des contenus présents sur le site IMMORent.ma sont la propriété exclusive de IMMORent Maroc SARL.")}</p>
                <div className="p-4 bg-bg-soft rounded-lg border-l-4 border-primary/30 italic text-xs">
                  {t('legal.mentions.intellectual_desc_2', "Toute reproduction, représentation, modification ou publication est strictement interdite sans autorisation écrite.")}
                </div>
              </div>
            </motion.section>

            {/* Protection des données */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('legal.mentions.data_title', '4. Données personnelles')}
                </h2>
              </div>
              <div className="pl-16 space-y-6">
                <p className="text-sm text-text-sub leading-relaxed max-w-2xl">
                  {t('legal.mentions.data_desc', "Conformément à la Loi n° 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition.")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['right_access', 'right_rectify', 'right_oppose'].map((key) => (
                    <div key={key} className="p-4 rounded-lg bg-bg-soft border border-border-main flex items-center gap-3 group/item hover:border-primary/30 transition-colors">
                      <CheckIcon className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-main">
                        {t(`legal.mentions.${key}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Footer info */}
            <motion.div variants={sectionVariants} className="pt-16 border-t border-border-main flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <CalendarIcon className="w-4 h-4" />
                {t('legal.mentions.last_update', 'Mis à jour le')} : 
                {new Date().toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest">
                Version 2.4.0 — © IMMORent Maroc
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Back Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <Link to="/" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            ← {t('legal.mentions.back_home', 'Retour à l\'accueil')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalMentions;