import React from 'react';
import { Link } from 'react-router-dom';
import { HandRaisedIcon, LightBulbIcon, StarIcon, HeartIcon, ArrowLeftIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  }
};

const About = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-bg-soft font-outfit">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-border-main/50">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-bg-soft to-bg-soft opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <CheckBadgeIcon className="w-3.5 h-3.5" />
              {t('nav.about_label', 'Qui sommes-nous')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter leading-none mb-6">
              {t('about.hero.title_p1', 'Redéfinir')} <span className="text-primary">{t('about.hero.title_p2', "L'Immobilier")}</span>
            </h1>
            <p className="text-sm md:text-lg text-text-sub font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto opacity-60">
              {t('about.hero.subtitle', 'La plateforme premium de gestion immobilière au Maroc.')}
            </p>
          </motion.div>
        </div>

        {/* Decorative element */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-primary/20 blur-[120px] rounded-full opacity-20" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-40">
        
        {/* Mission Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
        >
          <motion.div variants={itemVariants} className="relative aspect-square md:aspect-video lg:aspect-square overflow-hidden rounded-xl border border-border-main shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110" 
              alt="Mission" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white text-3xl font-black tracking-tighter">{t('about.mission.tag', 'Expertise & Excellence')}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-8">
            <div className="w-12 h-1 bg-primary" />
            <h2 className="text-4xl font-black text-text-main tracking-tight">{t('about.story.title', 'Notre Histoire')}</h2>
            <div className="space-y-6 text-sm text-text-sub font-medium leading-relaxed">
              <p>{t('about.story.p1', "Née de la volonté de moderniser le marché immobilier marocain, IMMORent s'est imposée comme la référence pour la location de prestige.")}</p>
              <p>{t('about.story.p2', "Nous connectons propriétaires exigeants et locataires de confiance via une plateforme technologique de pointe.")}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-12">
              {[
                { val: '500+', label: t('about.stats.properties', 'Biens') },
                { val: '10k+', label: t('about.stats.clients', 'Clients') },
                { val: '50+', label: t('about.stats.agencies', 'Agences') }
              ].map(s => (
                <div key={s.label} className="space-y-1">
                  <p className="text-2xl font-black text-primary">{s.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Values Grid */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-20"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-text-main uppercase tracking-widest">{t('about.values.title', 'Nos Valeurs')}</h2>
            <div className="w-12 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: HandRaisedIcon, title: t('about.values.trust.title'), desc: t('about.values.trust.desc'), color: 'text-blue-500' },
              { icon: LightBulbIcon, title: t('about.values.innovation.title'), desc: t('about.values.innovation.desc'), color: 'text-amber-500' },
              { icon: StarIcon, title: t('about.values.excellence.title'), desc: t('about.values.excellence.desc'), color: 'text-emerald-500' },
              { icon: HeartIcon, title: t('about.values.passion.title'), desc: t('about.values.passion.desc'), color: 'text-rose-500' }
            ].map((v, i) => (
              <motion.div 
                key={v.title}
                variants={itemVariants}
                className="bg-bg-card border border-border-main rounded-xl p-8 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 rounded-lg bg-bg-soft flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 ${v.color}`}>
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-text-main tracking-tight mb-4">{v.title}</h3>
                <p className="text-xs text-text-sub font-bold leading-relaxed opacity-60">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-bg-card border border-border-main rounded-xl p-12 md:p-24 text-center shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-50" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter">{t('about.cta.title', 'Prêt à commencer ?')}</h2>
            <p className="text-sm md:text-lg text-text-sub font-bold uppercase tracking-[0.2em] opacity-60">
              {t('about.cta.subtitle', 'Rejoignez la communauté IMMORent et découvrez une nouvelle façon de vivre l\'immobilier.')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link to="/register" className="w-full sm:w-auto px-12 py-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98]">
                {t('about.cta.btn_register', 'Créer un compte')}
              </Link>
              <Link to="/contact" className="w-full sm:w-auto px-12 py-5 bg-bg-soft border border-border-main text-text-main rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-border-main transition-all">
                {t('about.cta.btn_contact', 'Nous contacter')}
              </Link>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default About;