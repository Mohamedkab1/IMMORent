import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ArrowRightIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  }
};

const Home = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { isAuthenticated, user, isAdmin, isAgent } = useAuth();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  
  const getStartedPath = !isAuthenticated 
    ? '/login' 
    : isAdmin 
      ? '/dashboard/admin' 
      : isAgent 
        ? '/dashboard/agent' 
        : '/dashboard/client';
  
  const categories = [
    {
      title: t('home.apartments', 'Appartements'),
      type: 'apartment',
      desc: t('home.categories.discover', 'Découvrez notre sélection exclusive.'),
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80"
    },
    {
      title: t('home.houses', 'Maisons'),
      type: 'house',
      desc: t('home.categories.discover', 'Découvrez notre sélection exclusive.'),
      img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80"
    },
    {
      title: t('home.commercial', 'Commerces'),
      type: 'commercial',
      desc: t('home.categories.discover', 'Découvrez notre sélection exclusive.'),
      img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80"
    },
    {
      title: t('home.lands', 'Terrains'),
      type: 'land',
      desc: t('home.categories.discover', 'Découvrez notre sélection exclusive.'),
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-soft font-outfit">
      
      {/* Hero Section */}
      <section ref={targetRef} className="relative h-screen flex items-center overflow-hidden border-b border-border-main/50">
        <motion.div style={{ scale }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-3xl space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-primary/30">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t('home.hero.premium', 'Luxe & Prestige')}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
              {t('home.hero.title_part1', 'Votre')} <br />
              <span className="text-primary">{t('home.hero.title_part2', 'Résidence')}</span> <br />
              {t('home.hero.title_part3', "D'Exception")}
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xl">
              {t('home.hero.description', 'Découvrez une sélection exclusive de biens immobiliers au Maroc.')}
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <Link 
                to={getStartedPath} 
                className="px-12 py-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:bg-primary-dark transition-all active:scale-[0.98] flex items-center gap-3"
              >
                {t('home.hero.get_started', 'Découvrir')}
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
              <Link 
                to="/about" 
                className="px-12 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/20 transition-all active:scale-[0.98]"
              >
                {t('home.hero.learn_more', 'En savoir plus')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">{t('home.scroll', 'Défiler')}</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 bg-bg-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase">{t('home.categories.title', 'Explorer par Catégorie')}</h2>
              <div className="w-12 h-1 bg-primary" />
            </div>
            <Link to="/properties" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">
              {t('home.categories.view_all', 'Voir tous les biens')}
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/properties?type=${cat.type}`} className="group relative h-[500px] block overflow-hidden rounded-xl border border-border-main shadow-lg">
                  <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute inset-x-0 bottom-0 p-8 space-y-4">
                    <h3 className="text-2xl font-black text-white tracking-tight">{cat.title}</h3>
                    <p className="text-xs text-white/60 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      {cat.desc}
                    </p>
                    <div className="w-0 group-hover:w-full h-0.5 bg-primary transition-all duration-500" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-bg-card border-y border-border-main/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h2 className="text-5xl font-black text-text-main tracking-tighter">{t('home.features.title', 'Pourquoi nous choisir ?')}</h2>
              
              <div className="space-y-10">
                {[
                  { icon: ShieldCheckIcon, title: t('home.features.f1.title', 'Sécurité Totale'), desc: t('home.features.f1.desc', 'Toutes nos transactions sont sécurisées et vérifiées.') },
                  { icon: UserGroupIcon, title: t('home.features.f2.title', 'Accompagnement'), desc: t('home.features.f2.desc', 'Des agents dédiés pour vous guider à chaque étape.') },
                  { icon: ChartBarIcon, title: t('home.features.f3.title', 'Transparence'), desc: t('home.features.f3.desc', 'Aucun frais caché, une gestion claire et précise.') }
                ].map((f, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <f.icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-text-main tracking-tight">{f.title}</h3>
                      <p className="text-sm text-text-sub font-medium opacity-60 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-white/5"
            >
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-32 bg-bg-soft">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-5xl font-black text-text-main tracking-tighter uppercase">{t('home.contact.title', 'Une question ?')}</h2>
            <p className="text-sm text-text-sub font-bold uppercase tracking-[0.3em] opacity-60">{t('home.contact.subtitle', 'Notre équipe vous répond sous 24h.')}</p>
            <div className="w-12 h-1 bg-primary mx-auto" />
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">{t('home.contact.name', 'Nom Complet')}</label>
              <input type="text" className="w-full bg-bg-card border border-border-main rounded-xl px-6 py-4 font-bold text-text-main outline-none focus:border-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">{t('home.contact.email', 'Adresse Email')}</label>
              <input type="email" className="w-full bg-bg-card border border-border-main rounded-xl px-6 py-4 font-bold text-text-main outline-none focus:border-primary transition-all" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">{t('home.contact.message', 'Votre Message')}</label>
              <textarea rows="4" className="w-full bg-bg-card border border-border-main rounded-xl px-6 py-4 font-bold text-text-main outline-none focus:border-primary transition-all resize-none" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full py-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98]">
                {t('home.contact.submit', 'Envoyer le message')}
              </button>
            </div>
          </motion.form>
        </div>
      </section>

    </div>
  );
};

export default Home;