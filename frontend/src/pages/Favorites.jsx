import React from 'react';
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
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

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
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
  }
};

const Favorites = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { favorites, removeFavorite } = useFavorites();

  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';

  return (
    <div className="min-h-screen bg-bg-soft pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-border-main/50 pb-12"
        >
          <div className="space-y-4">
            <Link to="/properties" className="inline-flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              {t('prop.detail.back_to_list', 'Retour aux biens')}
            </Link>
            <h1 className="text-5xl md:text-6xl font-black text-text-main tracking-tighter leading-none">
              {t('fav.title_p1', 'Mes')} <span className="text-primary">{t('fav.title_p2', 'Favoris')}</span>
            </h1>
            <p className="text-xs text-text-sub font-bold uppercase tracking-[0.3em] opacity-60">
              {favorites.length} {t('fav.count_label', 'biens enregistrés dans votre sélection.')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <HeartSolid className="w-4 h-4" />
              {t('fav.exclusive', 'Sélection Exclusive')}
            </div>
          </div>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-40 rounded-xl border-2 border-dashed border-border-main text-center px-6 bg-bg-card shadow-2xl"
          >
            <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-10 animate-pulse border border-rose-500/20">
              <HeartIcon className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-3xl font-black text-text-main tracking-tight mb-4 uppercase">{t('fav.empty.title', 'Votre liste est vide')}</h3>
            <p className="max-w-md mx-auto mb-12 text-sm text-text-sub font-bold uppercase tracking-widest opacity-60 leading-loose">
              {t('fav.empty.desc', 'Commencez à explorer nos propriétés d\'exception et ajoutez vos coups de cœur ici.')}
            </p>
            <Link 
              to="/properties" 
              className="px-12 py-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
            >
              {t('fav.empty.btn', 'Explorer les biens')}
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
          >
            <AnimatePresence mode="popLayout">
              {favorites.map((property) => (
                <motion.div 
                  key={property.id}
                  layout
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="group relative"
                >
                  <div className="bg-bg-card border border-border-main rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30">
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img 
                        src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:8000/storage/${property.images[0]}`) : defaultImage} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt="" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] bg-slate-950/75 text-white backdrop-blur-md border border-white/10 shadow-lg select-none">
                          <span className={`w-2 h-2 rounded-full ${
                            property.transaction_type === 'sale' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          }`} />
                          {property.transaction_type === 'sale' ? t('prop.card.sale') : t('prop.card.rent')}
                        </span>
                      </div>

                      <button 
                        onClick={(e) => { e.preventDefault(); removeFavorite(property.id); }}
                        className="absolute top-4 right-4 p-3 bg-black/20 backdrop-blur-md text-white rounded-xl border border-white/10 hover:bg-rose-500 transition-all shadow-xl"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>

                      <div className="absolute inset-x-6 bottom-6 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          {property.city}
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight line-clamp-1 leading-snug group-hover:text-primary transition-colors">
                          {property.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-bg-soft/50 border border-border-main flex flex-col items-center gap-1">
                          <ArrowsRightLeftIcon className="w-5 h-5 text-primary opacity-60" />
                          <p className="text-[10px] font-black text-text-main">{property.surface} m²</p>
                        </div>
                        <div className="p-4 rounded-xl bg-bg-soft/50 border border-border-main flex flex-col items-center gap-1">
                          <BuildingOfficeIcon className="w-5 h-5 text-primary opacity-60" />
                          <p className="text-[10px] font-black text-text-main">{property.rooms} p.</p>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-border-main/50 flex items-center justify-between mt-auto">
                        <div className="text-2xl font-black text-text-main tracking-tighter">
                          {property.price?.toLocaleString()} <span className="text-[10px] font-black text-text-muted uppercase ml-1 opacity-40">DH</span>
                        </div>
                        <Link to={`/properties/${property.id}`} className="w-12 h-12 rounded-xl bg-bg-soft border border-border-main flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <ChevronRightIcon className="w-6 h-6" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
