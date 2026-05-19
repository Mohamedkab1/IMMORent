import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  InformationCircleIcon,
  UserIcon,
  DocumentDuplicateIcon,
  ScaleIcon,
  ClockIcon,
  ShieldCheckIcon,
  CogIcon,
  ChartBarIcon,
  SparklesIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  NoSymbolIcon,
  ArchiveBoxIcon,
  PauseIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();

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
            {t('privacy.title')}
          </h1>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-card border border-border-main rounded-xl shadow-xl overflow-hidden backdrop-blur-sm text-text-main"
        >
          <div className="p-8 md:p-12 space-y-12">

            {/* 1. Introduction */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <InformationCircleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('privacy.intro_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub leading-relaxed">
                <p>{t('privacy.intro_p1')}</p>
                <p>{t('privacy.intro_p2')}</p>
              </div>
            </motion.section>

            {/* 2. Responsable du traitement */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('privacy.resp_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-2 text-sm text-text-sub">
                <p className="font-bold text-text-main">IMMORent Maroc SARL</p>
                <p>Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000, Maroc</p>
                <p>Téléphone : +212 5 24 12 34 56</p>
                <p>Email : <a href="mailto:contact@immorent.ma" className="text-primary hover:underline">contact@immorent.ma</a></p>
              </div>
            </motion.section>

            {/* 3. Données collectées */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <DocumentDuplicateIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('privacy.data_title')}
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub mb-4">{t('privacy.data_desc')}</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-sub">
                  <li>{t('privacy.data_cat1')}</li>
                  <li>{t('privacy.data_cat2')}</li>
                  <li>{t('privacy.data_cat3')}</li>
                  <li>{t('privacy.data_cat4')}</li>
                </ul>
              </div>
            </motion.section>

            {/* 4. Base légale du traitement */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ScaleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('privacy.law_title')}
                </h2>
              </div>
              <div className="pl-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-text-main mb-2">{t('privacy.law_consent')}</h4>
                  <p className="text-xs text-text-muted">{t('privacy.law_consent_desc')}</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-text-main mb-2">{t('privacy.law_contract')}</h4>
                  <p className="text-xs text-text-muted">{t('privacy.law_contract_desc')}</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-text-main mb-2">{t('privacy.law_obligation')}</h4>
                  <p className="text-xs text-text-muted">{t('privacy.law_obligation_desc')}</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-text-main mb-2">{t('privacy.law_interest')}</h4>
                  <p className="text-xs text-text-muted">{t('privacy.law_interest_desc')}</p>
                </div>
              </div>
            </motion.section>

            {/* 5. Durée de conservation */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('privacy.duration_title')}
                </h2>
              </div>
              <div className="pl-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 border border-border-main rounded-lg bg-bg-soft">
                  <span className="text-sm font-medium text-text-sub">{t('privacy.duration_cat1')}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">{t('privacy.duration_time1')}</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-border-main rounded-lg bg-bg-soft">
                  <span className="text-sm font-medium text-text-sub">{t('privacy.duration_cat2')}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">{t('privacy.duration_time2')}</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-border-main rounded-lg bg-bg-soft">
                  <span className="text-sm font-medium text-text-sub">{t('privacy.duration_cat3')}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">{t('privacy.duration_time3')}</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-border-main rounded-lg bg-bg-soft">
                  <span className="text-sm font-medium text-text-sub">{t('privacy.duration_cat4')}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">{t('privacy.duration_time4')}</span>
                </div>
              </div>
            </motion.section>

            {/* 6. Sécurité des données */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('privacy.security_title')}
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub mb-4">{t('privacy.security_desc')}</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-sub">
                  <li>{t('privacy.security_cat1')}</li>
                  <li>{t('privacy.security_cat2')}</li>
                  <li>{t('privacy.security_cat3')}</li>
                </ul>
              </div>
            </motion.section>

            {/* 7. Cookies */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CogIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('privacy.cookies_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4">
                <p className="text-sm text-text-sub">{t('privacy.cookies_desc')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border border-border-main rounded-lg bg-bg-soft">
                    <CogIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-sub">{t('privacy.cookies_cat1')}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border-main rounded-lg bg-bg-soft">
                    <ChartBarIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-sub">{t('privacy.cookies_cat2')}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border-main rounded-lg bg-bg-soft">
                    <SparklesIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-sub">{t('privacy.cookies_cat3')}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border-main rounded-lg bg-bg-soft">
                    <LockClosedIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-sub">{t('privacy.cookies_cat4')}</span>
                  </div>
                </div>
                <p className="text-sm text-text-sub mt-4">{t('privacy.cookies_footer')}</p>
              </div>
            </motion.section>

            {/* 8. Vos droits */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ScaleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('privacy.rights_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-6">
                <p className="text-sm text-text-sub">{t('privacy.rights_desc')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <MagnifyingGlassIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">{t('privacy.rights_cat1')}</h4>
                    </div>
                    <p className="text-xs text-text-muted">{t('privacy.rights_desc1')}</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <PencilIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">{t('privacy.rights_cat2')}</h4>
                    </div>
                    <p className="text-xs text-text-muted">{t('privacy.rights_desc2')}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <TrashIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">{t('privacy.rights_cat3')}</h4>
                    </div>
                    <p className="text-xs text-text-muted">{t('privacy.rights_desc3')}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <NoSymbolIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">{t('privacy.rights_cat4')}</h4>
                    </div>
                    <p className="text-xs text-text-muted">{t('privacy.rights_desc4')}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <ArchiveBoxIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">{t('privacy.rights_cat5')}</h4>
                    </div>
                    <p className="text-xs text-text-muted">{t('privacy.rights_desc5')}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <PauseIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">{t('privacy.rights_cat6')}</h4>
                    </div>
                    <p className="text-xs text-text-muted">{t('privacy.rights_desc6')}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3">
                  <EnvelopeIcon className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-text-main mb-1">{t('privacy.rights_footer_title', 'Pour exercer vos droits :')}</h4>
                    <p className="text-sm text-text-sub">Contactez notre DPO à <a href="mailto:dpo@immorent.ma" className="text-primary hover:underline">dpo@immorent.ma</a> ou par courrier à l'adresse du siège social.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 9. Modifications de la politique */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('privacy.mod_title')}
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub leading-relaxed">
                  {t('privacy.mod_desc')}
                </p>
              </div>
            </motion.section>

            {/* 10. Nous contacter */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('privacy.contact_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4">
                <p className="text-sm text-text-sub">{t('privacy.contact_desc')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-soft border border-border-main">
                    <EnvelopeIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm">
                      <p className="text-text-muted text-xs mb-1">{t('privacy.contact_email')}</p>
                      <a href="mailto:confidentialite@immorent.ma" className="text-text-main font-medium hover:text-primary">confidentialite@immorent.ma</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-soft border border-border-main">
                    <PhoneIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm">
                      <p className="text-text-muted text-xs mb-1">{t('privacy.contact_phone')}</p>
                      <span className="text-text-main font-medium">+212 5 24 12 34 56</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-soft border border-border-main">
                    <MapPinIcon className="w-8 h-8 text-primary flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-text-muted text-xs mb-1">{t('privacy.contact_addr')}</p>
                      <span className="text-text-main font-medium">Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

          </div>
        </motion.div>

        {/* Footer links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8"
        >
          <Link to="/mentions-legales" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            {t('legal.title_short')}
          </Link>
          <Link to="/cgv" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            {t('cgv.title_short')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;