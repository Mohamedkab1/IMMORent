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
  ShieldCheckIcon,
  BuildingOfficeIcon,
  FingerPrintIcon,
  ServerIcon,
  CogIcon,
  ChartBarIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  HandRaisedIcon,
  ArchiveBoxIcon,
  PauseCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  InformationCircleIcon
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
            {t('legal.title')}
          </h1>
          <p className="text-xs text-text-sub font-bold uppercase tracking-[0.3em] opacity-60">
            {t('legal.subtitle')}
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
            
            {/* 1. Introduction */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <InformationCircleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('privacy.intro_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub leading-relaxed">
                <p>{t('privacy.intro_p1')}</p>
                <p>{t('privacy.intro_p2')}</p>
              </div>
            </motion.section>

            {/* 2. Responsable du traitement */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <BuildingOfficeIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('privacy.resp_title')}
                </h2>
              </div>
              <div className="pl-16 p-6 rounded-lg bg-bg-soft border border-border-main space-y-4 text-sm text-text-sub">
                <p className="font-bold text-text-main text-base">IMMORent Maroc SARL</p>
                <p>Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000, Maroc</p>
                <p className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-primary" /> +212 5 24 12 34 56</p>
                <p className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-primary" /> contact@immorent.ma</p>
              </div>
            </motion.section>

            {/* 3. Données collectées */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FingerPrintIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('privacy.data_title')}
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub mb-4">{t('privacy.data_desc')}</p>
                <ul className="space-y-3">
                  {[
                    [t('privacy.data_cat1'), ''],
                    [t('privacy.data_cat2'), ''],
                    [t('privacy.data_cat3'), ''],
                    [t('privacy.data_cat4'), '']
                  ].map(([label, desc], idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-text-main">{label}</strong> <span className="text-text-sub">{desc}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* 4. Base légale */}
            <motion.section variants={sectionVariants} className="group border-t border-border-main pt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ScaleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('privacy.law_title')}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-16">
                {[
                  { title: t('privacy.law_consent'), desc: t('privacy.law_consent_desc') },
                  { title: t('privacy.law_contract'), desc: t('privacy.law_contract_desc') },
                  { title: t('privacy.law_obligation'), desc: t('privacy.law_obligation_desc') },
                  { title: t('privacy.law_interest'), desc: t('privacy.law_interest_desc') }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">{item.title}</h4>
                    <p className="text-sm text-text-sub">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 5. Durée de conservation */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('privacy.duration_title')}
                </h2>
              </div>
              <div className="pl-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: t('privacy.duration_cat1'), time: t('privacy.duration_time1') },
                  { label: t('privacy.duration_cat2'), time: t('privacy.duration_time2') },
                  { label: t('privacy.duration_cat3'), time: t('privacy.duration_time3') },
                  { label: t('privacy.duration_cat4'), time: t('privacy.duration_time4') }
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-4 bg-bg-soft rounded-lg border border-border-main">
                    <div className="text-lg font-black text-text-main mb-1">{item.time}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 6. Sécurité des données */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('privacy.security_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub">
                <p>{t('privacy.security_desc')}</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3"><LockClosedIcon className="w-4 h-4 text-primary" /> {t('privacy.security_cat1')}</li>
                  <li className="flex items-center gap-3"><ServerIcon className="w-4 h-4 text-primary" /> {t('privacy.security_cat2')}</li>
                  <li className="flex items-center gap-3"><ChartBarIcon className="w-4 h-4 text-primary" /> {t('privacy.security_cat3')}</li>
                </ul>
              </div>
            </motion.section>

            {/* 7. Cookies */}
            <motion.section variants={sectionVariants} className="group border-t border-border-main pt-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FingerPrintIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('privacy.cookies_title')}
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub mb-6">{t('privacy.cookies_desc')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-bg-soft rounded-lg border border-border-main">
                    <CogIcon className="w-6 h-6 text-text-muted mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-main">{t('privacy.cookies_cat1')}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-bg-soft rounded-lg border border-border-main">
                    <ChartBarIcon className="w-6 h-6 text-text-muted mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-main">{t('privacy.cookies_cat2')}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-bg-soft rounded-lg border border-border-main">
                    <SparklesIcon className="w-6 h-6 text-text-muted mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-main">{t('privacy.cookies_cat3')}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-bg-soft rounded-lg border border-border-main">
                    <LockClosedIcon className="w-6 h-6 text-text-muted mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-main">{t('privacy.cookies_cat4')}</span>
                  </div>
                </div>
                <p className="text-xs text-text-sub italic">{t('privacy.cookies_footer')}</p>
              </div>
            </motion.section>

            {/* 8. Vos droits */}
            <motion.section variants={sectionVariants} className="group border-t border-border-main pt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  {t('privacy.rights_title')}
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub mb-6">{t('privacy.rights_desc')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: MagnifyingGlassIcon, title: t('privacy.rights_cat1'), desc: t('privacy.rights_desc1') },
                    { icon: PencilSquareIcon, title: t('privacy.rights_cat2'), desc: t('privacy.rights_desc2') },
                    { icon: TrashIcon, title: t('privacy.rights_cat3'), desc: t('privacy.rights_desc3') },
                    { icon: HandRaisedIcon, title: t('privacy.rights_cat4'), desc: t('privacy.rights_desc4') },
                    { icon: ArchiveBoxIcon, title: t('privacy.rights_cat5'), desc: t('privacy.rights_desc5') },
                    { icon: PauseCircleIcon, title: t('privacy.rights_cat6'), desc: t('privacy.rights_desc6') }
                  ].map((right, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-bg-soft border border-border-main">
                      <right.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-text-main mb-1">{right.title}</h4>
                        <p className="text-xs text-text-sub">{right.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-4 text-sm text-text-sub">
                  <EnvelopeIcon className="w-6 h-6 text-primary flex-shrink-0" />
                  <p><strong>{t('privacy.rights_footer_title', 'Pour exercer vos droits :')}</strong> Contactez notre DPO à <a href="mailto:dpo@immorent.ma" className="text-primary hover:underline font-bold">dpo@immorent.ma</a> ou par courrier à l'adresse du siège social.</p>
                </div>
              </div>
            </motion.section>

            {/* 9 & 10 */}
            <motion.section variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border-main pt-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <DocumentTextIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-black text-text-main uppercase tracking-widest">{t('privacy.mod_title')}</h2>
                </div>
                <p className="text-xs text-text-sub leading-relaxed pl-8">{t('privacy.mod_desc')}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <PhoneIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-black text-text-main uppercase tracking-widest">{t('privacy.contact_title')}</h2>
                </div>
                <div className="pl-8 space-y-2 text-xs text-text-sub">
                  <p>{t('privacy.contact_desc')}</p>
                  <p className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-primary" /> confidentialite@immorent.ma</p>
                  <p className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-primary" /> +212 5 24 12 34 56</p>
                  <p className="flex items-center gap-2"><BuildingOfficeIcon className="w-4 h-4 text-primary" /> Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000</p>
                </div>
              </div>
            </motion.section>

            {/* Footer info */}
            <motion.div variants={sectionVariants} className="pt-16 border-t border-border-main flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <CalendarIcon className="w-4 h-4" />
                {t('legal.updated_at')} {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : 'ar-SA')}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest">
                {t('legal.version')}
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
            ← {t('legal.back_home')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalMentions;