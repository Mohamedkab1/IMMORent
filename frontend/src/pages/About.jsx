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
      <div className="relative flex items-center justify-center min-h-[40vh] bg-slate-900 group overflow-hidden border-b border-primary/20 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-slate-900/90 z-10 transition-opacity duration-700 group-hover:opacity-80"></div>
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
          alt="About Us Background" 
          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-[15s] group-hover:scale-110" 
        />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10 z-10 mix-blend-overlay">
           <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
           </svg>
        </div>
        
        <div className="relative z-20 max-w-4xl mx-auto text-center px-4 mt-8">
          <RevealOnScroll>
            <span className="inline-block py-1 px-4 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold mb-4 tracking-widest uppercase">
              {t('nav.about')}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold !text-white mb-4 tracking-tight drop-shadow-lg">
              {t('about.hero.title_p1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">{t('about.hero.title_p2')}</span>
            </h1>
            <p className="text-lg md:text-xl !text-white font-medium max-w-2xl mx-auto drop-shadow-md leading-relaxed">
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
              <div className="absolute inset-0 bg-primary/20 dark:bg-secondary/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" 
                alt="Notre histoire" 
                className="relative rounded-3xl shadow-xl w-full h-auto object-cover z-10 hover:-translate-y-2 transition-transform duration-500" 
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-extrabold text-text-main">{t('about.story.title')}</h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <div className="prose dark:prose-invert prose-lg text-text-sub">
                <p>
                  {t('about.story.p1')}
                </p>
                <p>
                  {t('about.story.p2')}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-main">
                <div className="text-center p-4 bg-bg-card rounded-2xl shadow-sm border border-border-main hover:shadow-md transition-shadow">
                  <span className="block text-3xl font-black text-primary dark:text-secondary mb-1">500+</span>
                  <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">{t('about.stats.properties')}</span>
                </div>
                <div className="text-center p-4 bg-bg-card rounded-2xl shadow-sm border border-border-main hover:shadow-md transition-shadow">
                  <span className="block text-3xl font-black text-primary dark:text-secondary mb-1">10k+</span>
                  <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">{t('about.stats.clients')}</span>
                </div>
                <div className="text-center p-4 bg-bg-card rounded-2xl shadow-sm border border-border-main hover:shadow-md transition-shadow">
                  <span className="block text-3xl font-black text-primary dark:text-secondary mb-1">50+</span>
                  <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">{t('about.stats.agencies')}</span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <div className="text-center">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-main inline-block relative mb-16">
              {t('about.values.title')}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </h2>
          </RevealOnScroll>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: HandRaisedIcon, title: t('about.values.trust.title'), desc: t('about.values.trust.desc'), color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
              { icon: LightBulbIcon, title: t('about.values.innovation.title'), desc: t('about.values.innovation.desc'), color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
              { icon: StarIcon, title: t('about.values.excellence.title'), desc: t('about.values.excellence.desc'), color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
              { icon: HeartIcon, title: t('about.values.passion.title'), desc: t('about.values.passion.desc'), color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' }
            ].map((v, i) => (
              <RevealOnScroll key={i} delay={i * 150}>
                <div className="bg-bg-card p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-3 border border-border-main transition-all duration-500 h-full">
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 rotate-3 ${v.bg} ${v.color}`}>
                    <v.icon className={`w-8 h-8 ${v.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-3">{v.title}</h3>
                  <p className="text-text-sub leading-relaxed font-medium">{v.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-main inline-block relative mb-16">
              {t('about.team.title')}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
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
                <div className="bg-bg-card p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-3 border border-border-main transition-all duration-500 group h-full">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-primary/20 dark:bg-secondary/20 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="relative w-full h-full rounded-full object-cover border-4 border-bg-card shadow-lg" 
                    />
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-1 group-hover:text-primary dark:group-hover:text-secondary transition-colors">{member.name}</h3>
                  <p className="text-sm font-black text-primary/80 dark:text-secondary/80 uppercase tracking-widest">{member.role}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <RevealOnScroll>
          <div className="bg-gradient-to-r from-primary to-slate-900 dark:from-slate-800 dark:to-slate-950 rounded-[3rem] p-8 md:p-16 text-center shadow-huge relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 transition-transform duration-[20s] group-hover:scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 transition-transform duration-700 group-hover:rotate-45">
              <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold !text-white mb-6 drop-shadow-lg">{t('about.cta.title')}</h2>
              <p className="text-lg md:text-xl !text-white mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed font-medium">
                {t('about.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-secondary text-primary hover:bg-yellow-400 rounded-2xl font-black uppercase tracking-wider transition-all shadow-xl hover:-translate-y-2 hover:shadow-2xl">
                  {t('about.cta.btn_register')}
                </Link>
                <Link to="/contact" className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-2xl font-black uppercase tracking-wider transition-all hover:-translate-y-2 shadow-lg">
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