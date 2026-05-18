import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
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
  PhoneIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';

const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { isAuthenticated, user, isAdmin, isAgent } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    company: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/contact`, formData);
      if (response.data.success) {
        toast.success(response.data.message || t('home.contact.success', 'Votre message a été envoyé avec succès.'));
        setFormData({ first_name: '', last_name: '', company: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Erreur contact:', error);
      toast.error(error.response?.data?.message || t('home.contact.error', 'Une erreur est survenue lors de l\'envoi du message.'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStartedPath = !isAuthenticated  
    ? '/login' 
    : isAdmin 
      ? '/dashboard/admin' 
      : isAgent 
        ? '/dashboard/agent' 
        : '/dashboard/client';
  
  const categories = [
    {
      title: t('home.apartments'),
      type: 'apartment',
      desc: t('home.categories.discover'),
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80"
    },
    {
      title: t('home.houses'),
      type: 'house',
      desc: t('home.categories.discover'),
      img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80"
    },
    {
      title: t('home.commercial'),
      type: 'commercial',
      desc: t('home.categories.discover'),
      img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80"
    },
    {
      title: t('home.lands'),
      type: 'land',
      desc: t('home.categories.discover'),
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 ${theme === 'light' ? 'bg-white' : 'bg-bg-main'}`}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-start pt-48 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
            alt="Skyscrapers" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className={`absolute inset-0 transition-all duration-700 ${
            theme === 'light' 
              ? 'bg-gradient-to-r from-white/95 via-white/80 to-transparent' 
              : 'bg-black/60 dark:bg-black/70'
          }`}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <RevealOnScroll>
              <h1 className={`text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.1] transition-colors duration-500 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {t('home.hero.title_part1')} <br />
                <span className="text-blue-600 dark:text-yellow-400">{t('home.hero.title_part2')}</span> <br />
                {t('home.hero.title_part3')}
              </h1>
              <p className={`text-xl mb-10 leading-relaxed font-light transition-colors duration-500 ${
                theme === 'light' ? 'text-slate-600' : 'text-white/90'
              }`}>
                {t('home.hero.description_part1')} <br className="hidden md:block" />
                {t('home.hero.description_part2')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to={getStartedPath} 
                  className={`px-8 py-4 font-bold rounded shadow-lg transition-all transform hover:scale-105 uppercase tracking-widest text-xs ${
                    theme === 'light' 
                      ? 'bg-blue-600 !text-white hover:bg-blue-700 shadow-blue-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  }`}
                >
                  {t('home.hero.get_started')}
                </Link>
                <Link 
                  to="/about" 
                  className={`px-8 py-4 border-2 font-bold rounded transition-all uppercase tracking-widest text-xs ${
                    theme === 'light' 
                      ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white' 
                      : 'border-white text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {t('home.hero.learn_more')}
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Main Content Area - Reactive to Theme */}
      <div className="bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-[#0a1a1a] dark:via-[#1a2b3d] dark:to-[#2a3b4d] text-gray-900 dark:text-white transition-all duration-500">
        
        {/* Categories Section */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="text-4xl font-bold mb-16 relative inline-block uppercase tracking-widest">
                {t('home.categories.title')}
                <div className="absolute -bottom-4 left-0 w-12 h-1 bg-blue-500 dark:bg-blue-400"></div>
              </h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <RevealOnScroll key={i} delay={i * 100}>
                  <Link to={`/properties?type=${cat.type}`} className="group relative h-[450px] overflow-hidden rounded-lg cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-2 block">
                    <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                    
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <h3 className={`text-2xl font-bold mb-4 leading-tight ${theme === 'light' ? '!text-white' : 'text-white'}`}>{cat.title}</h3>
                      <div className="h-0.5 bg-white/50 dark:bg-blue-500 w-0 group-hover:w-full transition-all duration-500 mb-4"></div>
                      <p className="text-white/80 text-sm font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                        {cat.desc}
                      </p>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Connect With Us Section */}
        <section className="pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              <RevealOnScroll>
                <div>
                  <h2 className="text-5xl font-bold mb-8 uppercase tracking-tighter">{t('home.contact.title')}</h2>
                  <p className="text-xl opacity-80 mb-10 leading-relaxed font-light">
                    {t('home.contact.subtitle')}
                  </p>
                  <div className="flex items-center gap-4 text-lg font-medium">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded flex items-center justify-center transition-colors">
                      <EnvelopeIcon className="w-6 h-6" />
                    </div>
                    <a href="mailto:info@immorent.com" className="hover:underline font-light">info@immorent.com</a>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('home.contact.first_name')}</label>
                    <input required type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors font-light" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('home.contact.last_name')}</label>
                    <input required type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors font-light" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('home.contact.company')}</label>
                    <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors font-light" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('home.contact.email')}</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors font-light" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t('home.contact.message')}</label>
                    <textarea required rows="3" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-transparent border-b border-gray-300 dark:border-white/20 py-3 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors resize-none font-light"></textarea>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] opacity-30 mb-8 font-light italic">
                      {t('home.contact.privacy_notice')}
                    </p>
                    <button disabled={isSubmitting} type="submit" className={`px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-500 ${theme === 'light' ? '!text-white' : 'text-white'} font-black uppercase tracking-[0.2em] text-xs hover:from-blue-500 hover:to-blue-400 transition-all active:scale-[0.98] shadow-lg dark:shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-lg disabled:opacity-50 flex items-center justify-center`}>
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        t('home.contact.submit')
                      )}
                    </button>
                  </div>
                </form>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* Transition to Footer - Only in dark mode */}
        <div className="hidden dark:block h-32 bg-gradient-to-b from-[#2a3b4d] to-bg-main transition-all duration-500"></div>
        <div className="dark:hidden h-24 bg-gradient-to-b from-white to-slate-50 transition-all duration-500"></div>
      </div>

    </div>
  );
};

export default Home;