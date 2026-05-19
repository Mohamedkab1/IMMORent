import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowPathIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  HandThumbUpIcon,
  LifebuoyIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  StarIcon,
  SparklesIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
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

const CGV = () => {
  const { t } = useLanguage();

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
            {t('cgv.title')}
          </h1>
          <p className="text-xs text-text-sub font-bold uppercase tracking-[0.3em] opacity-60">
            {t('cgv.subtitle')}
          </p>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-card border border-border-main rounded-xl shadow-xl overflow-hidden backdrop-blur-sm text-text-main"
        >
          <div className="p-8 md:p-12 space-y-16">

            {/* Article 1 : Objet */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ClipboardDocumentCheckIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art1_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub leading-relaxed">
                <p>{t('cgv.art1_p1')}</p>
                <p>{t('cgv.art1_p2')}</p>
                <p>{t('cgv.art1_p3')}</p>
              </div>
            </motion.section>

            {/* Article 2 : Services */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art2_title')}
                </h2>
              </div>
              <div className="pl-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 border border-border-main rounded-lg bg-bg-soft">
                  <CheckIcon className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium">{t('cgv.art2_s1')}</span>
                </div>
                <div className="flex items-center gap-3 p-4 border border-border-main rounded-lg bg-bg-soft">
                  <CheckIcon className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium">{t('cgv.art2_s2')}</span>
                </div>
                <div className="flex items-center gap-3 p-4 border border-border-main rounded-lg bg-bg-soft">
                  <CheckIcon className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium">{t('cgv.art2_s3')}</span>
                </div>
                <div className="flex items-center gap-3 p-4 border border-border-main rounded-lg bg-bg-soft">
                  <CheckIcon className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium">{t('cgv.art2_s4')}</span>
                </div>
              </div>
            </motion.section>

            {/* Article 3 : Tarification */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCardIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art3_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Pack Agent */}
                  <div className="border border-border-main rounded-xl p-6 bg-bg-soft relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-primary !text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg">{t('cgv.badge_pro')}</div>
                    <h3 className="font-bold text-text-main mb-1">{t('cgv.art3_pro')}</h3>
                    <div className="text-2xl font-black text-primary mb-4">{t('cgv.art3_pro_price')}</div>
                    <ul className="text-xs space-y-2 text-text-sub">
                      <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_pro_f1')}</li>
                      <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_pro_f2')}</li>
                      <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_pro_f3')}</li>
                      <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_pro_f4')}</li>
                    </ul>
                  </div>

                  {/* Pack Particulier */}
                  <div className="border border-border-main rounded-xl p-6 bg-bg-soft">
                    <h3 className="font-bold text-text-main mb-1">{t('cgv.art3_part')}</h3>
                    <div className="text-2xl font-black text-text-main mb-4">{t('cgv.art3_part_price')}</div>
                    <ul className="text-xs space-y-2 text-text-sub">
                      <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_part_f1')}</li>
                      <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_part_f2')}</li>
                      <li className="flex items-center gap-2"><CheckIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_part_f3')}</li>
                    </ul>
                  </div>

                  {/* Pack Promoteur */}
                  <div className="border border-primary/30 rounded-xl p-6 bg-primary/5 relative">
                    <div className="absolute -top-3 left-6 bg-primary !text-white text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                      <SparklesIcon className="w-3 h-3" /> {t('cgv.badge_recommended')}
                    </div>
                    <h3 className="font-bold text-text-main mb-1">{t('cgv.art3_promoter')}</h3>
                    <div className="text-xl font-black text-primary mb-4">{t('cgv.art3_promoter_price')}</div>
                    <ul className="text-xs space-y-2 text-text-sub">
                      <li className="flex items-center gap-2"><StarIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_promoter_f1')}</li>
                      <li className="flex items-center gap-2"><StarIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_promoter_f2')}</li>
                      <li className="flex items-center gap-2"><StarIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_promoter_f3')}</li>
                      <li className="flex items-center gap-2"><StarIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_promoter_f4')}</li>
                      <li className="flex items-center gap-2"><StarIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_promoter_f5')}</li>
                      <li className="flex items-center gap-2"><StarIcon className="w-3 h-3 text-primary" /> {t('cgv.art3_promoter_f6')}</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-text-muted italic mt-4">
                  {t('cgv.art3_footer')}
                </p>
              </div>
            </motion.section>

            {/* Article 4 : Paiement */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCardIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art4_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4">
                <p className="text-sm text-text-sub">{t('cgv.art4_desc')}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-bg-soft border border-border-main rounded-lg text-xs font-bold">{t('cgv.art4_m1')}</span>
                  <span className="px-4 py-2 bg-bg-soft border border-border-main rounded-lg text-xs font-bold">{t('cgv.art4_m2')}</span>
                  <span className="px-4 py-2 bg-bg-soft border border-border-main rounded-lg text-xs font-bold">{t('cgv.art4_m3')}</span>
                </div>
                <p className="text-xs text-text-muted">{t('cgv.art4_footer')}</p>
              </div>
            </motion.section>

            {/* Article 5 : Rétractation */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowPathIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art5_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub leading-relaxed">
                <p>{t('cgv.art5_p1')}</p>
                <p>{t('cgv.art5_p2')}</p>
              </div>
            </motion.section>

            {/* Article 6 : Résiliation */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <NoSymbolIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art6_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4">
                <p className="text-sm text-text-sub">{t('cgv.art6_desc')}</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-sub">
                  <li>{t('cgv.art6_m1')}</li>
                  <li>{t('cgv.art6_m2')}</li>
                </ul>
                <p className="text-xs text-text-muted mt-2">{t('cgv.art6_footer')}</p>
              </div>
            </motion.section>

            {/* Article 7 : Responsabilité */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ExclamationTriangleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art7_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub leading-relaxed">
                <p>{t('cgv.art7_desc')}</p>
              </div>
            </motion.section>

            {/* Article 8 : Obligations */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <HandThumbUpIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art8_title')}
                </h2>
              </div>
              <div className="pl-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-border-main rounded-lg bg-bg-soft text-sm">
                  {t('cgv.art8_m1')}
                </div>
                <div className="p-4 border border-border-main rounded-lg bg-bg-soft text-sm">
                  {t('cgv.art8_m2')}
                </div>
                <div className="p-4 border border-border-main rounded-lg bg-bg-soft text-sm">
                  {t('cgv.art8_m3')}
                </div>
                <div className="p-4 border border-border-main rounded-lg bg-bg-soft text-sm">
                  {t('cgv.art8_m4')}
                </div>
              </div>
            </motion.section>

            {/* Article 9 : Modification */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ScaleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art9_title')}
                </h2>
              </div>
              <div className="pl-16 text-sm text-text-sub leading-relaxed">
                <p>{t('cgv.art9_desc')}</p>
              </div>
            </motion.section>

            {/* Article 10 : Support */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <LifebuoyIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art10_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4">
                <p className="text-sm text-text-sub">{t('cgv.art10_desc')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-soft border border-border-main">
                    <EnvelopeIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm">
                      <a href="mailto:support@immorent.ma" className="text-text-main font-medium hover:text-primary">support@immorent.ma</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-soft border border-border-main">
                    <PhoneIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm">
                      <span className="text-text-main font-medium">+212 5 24 12 34 56</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-soft border border-border-main">
                    <ClockIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm">
                      <span className="text-text-main font-medium">{t('cgv.art10_hours')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-soft border border-border-main">
                    <StarIcon className="w-5 h-5 text-emerald-500" />
                    <div className="text-sm">
                      <span className="text-text-main font-medium">{t('cgv.art10_delay')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Article 11 : Droit applicable */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t('cgv.art11_title')}
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub leading-relaxed">
                <p>{t('cgv.art11_desc')}</p>
                <p className="text-xs text-text-muted italic">{t('cgv.art11_footer')}</p>
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
          <Link to="/confidentialite" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            {t('privacy.title')}
          </Link>
          <Link to="/mentions-legales" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            {t('legal.title_short')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CGV;