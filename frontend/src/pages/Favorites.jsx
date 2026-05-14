import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { 
  HeartIcon,
  MapPinIcon,
  ArrowsRightLeftIcon,
  BuildingOfficeIcon,
  TrashIcon,
  HomeIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

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
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Favorites = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { favorites, removeFavorite } = useFavorites();

  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';

  return (
    <div className={`min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
      theme === 'light' ? 'bg-slate-50' : 'bg-[#050a1f]'
    }`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <RevealOnScroll>
          <div className="mb-16 border-b border-white/5 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="relative">
              <span className="inline-block px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-lg mb-4">
                {t('fav.title', 'Mes Favoris')}
              </span>
              <h1 className={`text-6xl font-black tracking-tighter ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {favorites.length} {t('nav.favorites', 'Favoris')}
              </h1>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
              theme === 'light' ? 'text-slate-400' : 'text-white/30'
            }`}>
              {t('fav.desc', 'Retrouvez tous les biens que vous avez aimés.')}
            </p>
          </div>
        </RevealOnScroll>

        {favorites.length === 0 ? (
          <RevealOnScroll delay={200}>
            <div className={`flex flex-col items-center justify-center py-32 rounded-lg border border-dashed text-center px-6 transition-all ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
            }`}>
              <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <HeartIcon className="w-12 h-12 text-rose-500" />
              </div>
              <h3 className={`text-3xl font-black tracking-tight mb-4 ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>{t('fav.empty.title', 'Aucun favori')}</h3>
              <p className={`max-w-md mx-auto mb-12 font-medium leading-relaxed ${
                theme === 'light' ? 'text-slate-500' : 'text-white/40'
              }`}>
                {t('fav.empty.desc', 'Explorez nos propriétés et ajoutez celles qui vous plaisent à votre liste de favoris.')}
              </p>
              <Link 
                to="/properties" 
                className="px-12 py-5 bg-blue-600 !text-white rounded-lg font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-2xl shadow-blue-600/20 active:scale-[0.98]"
              >
                {t('fav.empty.btn', 'Découvrir les biens')}
              </Link>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {favorites.map((property, i) => (
                <motion.div 
                  key={property.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={`group relative h-full flex flex-col border transition-all duration-500 rounded-lg overflow-hidden ${
                    theme === 'light' ? 'bg-white border-slate-100 hover:shadow-2xl' : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:shadow-2xl'
                  }`}>
                    {/* Image Section */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img 
                        src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : defaultImage} 
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-80"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl ${
                          property.transaction_type === 'sale' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                        }`}>
                          {property.transaction_type === 'sale' ? t('prop.card.sale') : t('prop.card.rent')}
                        </span>
                      </div>
                      
                      {/* Remove Button */}
                      <div className="absolute top-4 right-4">
                        <button 
                          onClick={(e) => { e.preventDefault(); removeFavorite(property.id); }}
                          className="p-3 bg-white/10 backdrop-blur-md !text-white hover:bg-rose-500 transition-all rounded-lg shadow-2xl active:scale-90"
                          title={t('fav.remove')}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Bottom Info on Image */}
                      <div className="absolute bottom-6 inset-x-6">
                         <div className="flex items-center gap-2 !text-white/60 mb-2 font-black text-[10px] uppercase tracking-widest">
                           <MapPinIcon className="w-4 h-4" />
                           {property.city}
                         </div>
                         <h3 className="text-2xl font-black !text-white tracking-tight leading-tight mb-2 group-hover:!text-blue-300 transition-colors">
                           {t(property.title)}
                         </h3>
                         <div className="text-2xl font-black !text-white">
                           {property.price?.toLocaleString()} <span className="text-xs !text-white/50">{t('prop.card.price_unit', 'DH')}{property.transaction_type === 'rent' ? '/'+t('prop.per_month', 'mois') : ''}</span>
                         </div>
                      </div>
                    </div>
                    
                    {/* Details Section */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className={`p-4 rounded-lg flex flex-col items-center justify-center gap-1 ${
                           theme === 'light' ? 'bg-slate-50' : 'bg-white/5'
                         }`}>
                            <ArrowsRightLeftIcon className="w-5 h-5 text-blue-500 mb-1" />
                            <span className="text-xs font-black tracking-tight">{property.surface} m²</span>
                         </div>
                         <div className={`p-4 rounded-lg flex flex-col items-center justify-center gap-1 ${
                           theme === 'light' ? 'bg-slate-50' : 'bg-white/5'
                         }`}>
                            <BuildingOfficeIcon className="w-5 h-5 text-blue-500 mb-1" />
                            <span className="text-xs font-black tracking-tight">{property.rooms} {t('prop.details.rooms', 'Ch.')}</span>
                         </div>
                      </div>
                      
                      <Link 
                        to={`/properties/${property.id}`}
                        className="mt-auto block w-full py-5 text-center bg-blue-600 !text-white rounded-lg font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-600/10 active:scale-[0.98]"
                      >
                        {t('common.view_details', 'Voir Détails')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
