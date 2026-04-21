import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MagnifyingGlassIcon, DocumentTextIcon, CurrencyDollarIcon, ChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-300 rtl:gap-reverse">
            <Link to="/properties" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-primary bg-secondary hover:bg-secondary-hover shadow-lg shadow-secondary/30 hover:shadow-secondary/50 transition-all duration-300 hover:-translate-y-1">
              Explorer les biens
              <ArrowRightIcon className="w-5 h-5 ms-2 rtl:rotate-180" />
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:-translate-y-1">
              {t('nav.register')}
            </Link>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="relative z-30 -mt-16 sm:-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8 sm:p-10 border border-slate-100 dark:border-slate-700 backdrop-blur-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[ 
              { num: '500+', label: t('home.stats.properties') }, 
              { num: '1000+', label: t('home.stats.clients') }, 
              { num: '50+', label: t('home.stats.agencies') }, 
              { num: '98%', label: t('home.stats.satisfaction') }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl sm:text-4xl font-extrabold text-primary dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light dark:from-white dark:to-slate-300">{stat.num}</span>
                </div>
                <div className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('footer.services')}</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MagnifyingGlassIcon, title: 'Recherche Avancée', desc: 'Trouvez le bien idéal avec nos filtres par ville, prix, type et superficie.' },
              { icon: DocumentTextIcon, title: 'Contrats Sécurisés', desc: 'Génération automatique et gestion simplifiée de vos contrats.' },
              { icon: CurrencyDollarIcon, title: 'Paiements en Ligne', desc: 'Suivez vos loyers et consultez votre historique financier.' },
              { icon: ChartBarIcon, title: 'Tableaux de Bord', desc: 'Visualisez vos statistiques et suivez vos performances.' }
            ].map((Service, i) => (
              <div key={i} className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-2">
                <div className="w-14 h-14 bg-primary/5 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-secondary text-primary dark:text-secondary transition-colors duration-300">
                  <Service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{Service.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{Service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types de biens */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Catégories</h2>
              <div className="w-24 h-1 bg-secondary rounded-full"></div>
            </div>
            <Link to="/properties" className="hidden md:inline-flex items-center text-primary dark:text-secondary font-semibold hover:gap-2 transition-all">
              Tout voir <ArrowRightIcon className="w-4 h-4 ms-1 rtl:rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80', title: t('home.apartments'), type: 'apartment' },
              { img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80', title: t('home.houses'), type: 'house' },
              { img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80', title: t('home.commercial'), type: 'commercial' },
              { img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80', title: t('home.lands'), type: 'land' },
            ].map((cat, i) => (
              <Link to={`/properties?type=${cat.type}`} key={i} className="group relative h-80 rounded-2xl overflow-hidden shadow-md">
                <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-secondary transition-colors">{cat.title}</h3>
                  <span className="inline-flex items-center text-sm text-slate-300 group-hover:text-white transition-colors">
                    Découvrir <ArrowRightIcon className="w-4 h-4 ms-1 opacity-0 -translate-x-2 rtl:translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
             <Link to="/properties" className="inline-flex items-center text-primary dark:text-secondary font-semibold">
              Tout voir <ArrowRightIcon className="w-4 h-4 ms-1 rtl:rotate-180" />
             </Link>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 relative overflow-hidden bg-primary dark:bg-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Prêt à commencer votre projet ?</h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Rejoignez la confiance de milliers de propriétaires et locataires sur IMMORent.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/register" className="px-8 py-4 bg-secondary hover:bg-secondary-hover text-primary font-bold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1">S'inscrire gratuitement</Link>
             <Link to="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-bold shadow-lg transition-all duration-300 hover:-translate-y-1">Contacter l'équipe</Link>
          </div>
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