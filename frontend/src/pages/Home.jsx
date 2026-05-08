import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MagnifyingGlassIcon, DocumentTextIcon, CurrencyDollarIcon, ChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
  const { t, language } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[90vh] overflow-hidden bg-slate-900 group">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 to-primary-light/80 z-10 transition-opacity duration-700 group-hover:opacity-90"></div>
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" 
          alt="Luxury Real Estate" 
          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-[20s] group-hover:scale-110" 
        />
        
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
          <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-sm font-semibold mb-6 animate-fade-in-up">
            #1 {t('footer.services')}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-fade-in-up animation-delay-100">
            {t('home.hero.title')} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">
              IMMORent
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-200 mb-10 animate-fade-in-up animation-delay-200">
            {t('home.hero.subtitle')}
          </p>

        </div>
      </section>

      {/* Statistiques */}
      <section className="relative z-30 -mt-16 sm:-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <RevealOnScroll delay={400}>
          <div className="bg-bg-card rounded-3xl shadow-huge p-8 sm:p-10 border border-border-main backdrop-blur-xl relative overflow-hidden group">
            {/* Soft animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[ 
                { num: '500+', label: t('home.stats.properties') }, 
                { num: '1000+', label: t('home.stats.clients') }, 
                { num: '50+', label: t('home.stats.agencies') }, 
                { num: '98%', label: t('home.stats.satisfaction') }
              ].map((stat, i) => (
                <div key={i} className="text-center group/stat">
                  <div className="text-3xl sm:text-5xl font-extrabold text-primary dark:text-white mb-2 group-hover/stat:scale-110 group-hover/stat:-translate-y-1 transition-all duration-300">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light dark:from-white dark:to-slate-300">{stat.num}</span>
                  </div>
                  <div className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Services */}
      <section className="py-24 bg-bg-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">{t('nav.services')}</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mb-6">{t('footer.services')}</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            </div>
          </RevealOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MagnifyingGlassIcon, title: t('home.features.search.title'), desc: t('home.features.search.desc') },
              { icon: DocumentTextIcon, title: t('home.features.contracts.title'), desc: t('home.features.contracts.desc') },
              { icon: CurrencyDollarIcon, title: t('home.features.payments.title'), desc: t('home.features.payments.desc') },
              { icon: ChartBarIcon, title: t('home.features.dashboard.title'), desc: t('home.features.dashboard.desc') }
            ].map((Service, i) => (
              <RevealOnScroll key={i} delay={i * 150}>
                <div className="group h-full bg-bg-card p-8 rounded-3xl shadow-main hover:shadow-2xl border border-border-main hover:border-primary/20 transition-all duration-500 hover:-translate-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -translate-y-full translate-x-full group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary/5 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-secondary text-primary dark:text-secondary transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-3 group-hover:text-primary dark:group-hover:text-secondary transition-colors">{Service.title}</h3>
                    <p className="text-text-sub leading-relaxed">{Service.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Types de biens */}
      <section className="py-24 bg-bg-main relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="text-primary dark:text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">{t('home.explore')}</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-text-main mb-6">{t('home.categories.title')}</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              </div>
              <Link to="/properties" className="hidden md:inline-flex items-center text-primary dark:text-secondary font-bold hover:gap-3 transition-all px-6 py-3 rounded-full hover:bg-primary/5">
                {t('home.categories.see_all')} <ArrowRightIcon className="w-5 h-5 ms-1 rtl:rotate-180" />
              </Link>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80', title: t('home.apartments'), type: 'apartment' },
              { img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80', title: t('home.houses'), type: 'house' },
              { img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80', title: t('home.commercial'), type: 'commercial' },
              { img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80', title: t('home.lands'), type: 'land' },
            ].map((cat, i) => (
              <RevealOnScroll key={i} delay={i * 150}>
                <Link to={`/properties?type=${cat.type}`} className="group relative h-96 block rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                  <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full transform transition-all duration-500">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-secondary group-hover:-translate-y-1 transition-all duration-300">{cat.title}</h3>
                    <div className="flex items-center text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                      {t('home.categories.discover')} 
                      <div className="w-0 overflow-hidden group-hover:w-6 transition-all duration-300 ease-out flex items-center">
                        <ArrowRightIcon className="w-5 h-5 ms-2 rtl:rotate-180" />
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
          <RevealOnScroll delay={300} className="mt-10 text-center md:hidden">
             <Link to="/properties" className="inline-flex items-center px-8 py-4 bg-primary/10 text-primary dark:text-secondary font-bold rounded-xl hover:bg-primary/20 transition-all">
              {t('home.categories.see_all')} <ArrowRightIcon className="w-5 h-5 ms-2 rtl:rotate-180" />
             </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 relative overflow-hidden bg-primary dark:bg-slate-900 group">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center transition-transform duration-[20s] group-hover:scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <RevealOnScroll>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">{t('home.cta.title')}</h2>
            <p className="text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed">{t('home.cta.desc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
               <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-secondary hover:bg-yellow-400 text-primary font-extrabold rounded-2xl shadow-xl shadow-secondary/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/40 flex items-center justify-center">
                 {t('home.register_free')} <ArrowRightIcon className="w-5 h-5 ms-2 rtl:rotate-180" />
               </Link>
               <Link to="/contact" className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:-translate-y-2 flex items-center justify-center">
                 {t('home.contact_team')}
               </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Custom keyframes for fade animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
      `}</style>
    </div>
  );
};

export default Home;