import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HandRaisedIcon, LightBulbIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

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
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-[45vh] pt-40 pb-20 bg-gradient-to-br from-[#050a1f] via-[#0a1a1a] to-[#050a1f] overflow-hidden">
        
        {/* Bottom Fade Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-soft to-transparent z-20 pointer-events-none"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20 z-10 mix-blend-overlay pointer-events-none">
           <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
           </svg>
        </div>
        
        <div className="relative z-20 max-w-4xl mx-auto text-center px-4">
          <RevealOnScroll>
            <span className="inline-block py-1 px-4 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs font-bold mb-6 tracking-widest uppercase shadow-sm">
              {t('nav.about')}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
              {t('about.hero.title_p1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">{t('about.hero.title_p2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </RevealOnScroll>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24">
        
        {/* Story Section */}
        <RevealOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 dark:bg-secondary/10 rounded-xl translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" 
                alt="Notre histoire" 
                className="relative rounded-xl shadow-xl w-full h-auto object-cover z-10 transition-transform duration-500" 
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-main tracking-tight">{t('about.story.title')}</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <div className="prose dark:prose-invert prose-lg text-text-sub">
                <p>
                  {t('about.story.p1')}
                </p>
                <p>
                  {t('about.story.p2')}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-main">
                <div className="text-center p-5 bg-bg-card rounded-xl shadow-sm border border-border-main hover:border-primary/30 transition-colors">
                  <span className="block text-3xl font-black text-primary dark:text-secondary mb-1">500+</span>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('about.stats.properties')}</span>
                </div>
                <div className="text-center p-5 bg-bg-card rounded-xl shadow-sm border border-border-main hover:border-primary/30 transition-colors">
                  <span className="block text-3xl font-black text-primary dark:text-secondary mb-1">10k+</span>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('about.stats.clients')}</span>
                </div>
                <div className="text-center p-5 bg-bg-card rounded-xl shadow-sm border border-border-main hover:border-primary/30 transition-colors">
                  <span className="block text-3xl font-black text-primary dark:text-secondary mb-1">50+</span>
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('about.stats.agencies')}</span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <div className="text-center">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-main inline-block relative mb-16 tracking-tight">
              {t('about.values.title')}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-secondary"></div>
            </h2>
          </RevealOnScroll>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: HandRaisedIcon, title: t('about.values.trust.title'), desc: t('about.values.trust.desc'), color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { icon: LightBulbIcon, title: t('about.values.innovation.title'), desc: t('about.values.innovation.desc'), color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { icon: StarIcon, title: t('about.values.excellence.title'), desc: t('about.values.excellence.desc'), color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { icon: HeartIcon, title: t('about.values.passion.title'), desc: t('about.values.passion.desc'), color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' }
            ].map((v, i) => (
              <RevealOnScroll key={i} delay={i * 150}>
                <div className="bg-bg-card p-8 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 border border-border-main transition-all duration-300 h-full flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 ${v.bg} ${v.color}`}>
                    <v.icon className={`w-8 h-8`} />
                  </div>
                  <h3 className="text-lg font-bold text-text-main mb-3">{v.title}</h3>
                  <p className="text-text-sub leading-relaxed font-medium text-sm">{v.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-main inline-block relative mb-16 tracking-tight">
              {t('about.team.title')}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-secondary"></div>
            </h2>
          </RevealOnScroll>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { img: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'Jean Martin', role: t('about.team.founder') },
              { img: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'Sophie Bernard', role: t('about.team.sales_dir') },
              { img: 'https://randomuser.me/api/portraits/men/3.jpg', name: 'Pierre Dubois', role: t('about.team.tech_dir') },
              { img: 'https://randomuser.me/api/portraits/women/4.jpg', name: 'Marie Lambert', role: t('about.team.client_mgr') }
            ].map((member, i) => (
              <RevealOnScroll key={i} delay={i * 150}>
                <div className="bg-bg-card p-8 rounded-xl shadow-sm hover:shadow-xl border border-border-main transition-all duration-300 group h-full">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="relative w-full h-full rounded-lg object-cover border border-border-main shadow-md group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="text-lg font-bold text-text-main mb-1 group-hover:text-primary dark:group-hover:text-secondary transition-colors">{member.name}</h3>
                  <p className="text-xs font-bold text-primary/80 dark:text-secondary/80 uppercase tracking-widest">{member.role}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <RevealOnScroll>
          <div className="bg-bg-card border border-border-main rounded-2xl p-8 md:p-16 text-center shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 dark:bg-secondary/5 opacity-50 transition-opacity duration-500 group-hover:opacity-100"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-text-main mb-6 tracking-tight">{t('about.cta.title')}</h2>
              <p className="text-lg text-text-sub mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                {t('about.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white dark:bg-secondary dark:text-slate-900 hover:bg-primary-hover dark:hover:bg-yellow-400 rounded-lg font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg">
                  {t('about.cta.btn_register')}
                </Link>
                <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-primary dark:border-secondary text-primary dark:text-secondary hover:bg-primary/10 dark:hover:bg-secondary/10 rounded-lg font-bold uppercase tracking-widest transition-all shadow-sm">
                  {t('about.cta.btn_contact')}
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};

export default About;