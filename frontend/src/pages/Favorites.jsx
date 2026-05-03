import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { 
  HeartIcon,
  MapPinIcon,
  ArrowsRightLeftIcon,
  BuildingOfficeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const Favorites = () => {
  const { t } = useLanguage();
  const { favorites, removeFavorite } = useFavorites();

  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-text-main flex items-center gap-3">
            <HeartSolid className="w-8 h-8 text-rose-500" />
            {t('nav.favorites', 'Mes Favoris')}
          </h1>
          <p className="text-text-sub mt-2">
            Retrouvez ici tous les biens immobiliers que vous avez sauvegardés.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-bg-card rounded-2xl border border-border-main text-center px-4 shadow-sm">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/10 rounded-full flex items-center justify-center mb-6">
              <HeartIcon className="w-10 h-10 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Aucun bien en favori</h3>
            <p className="text-text-sub mb-6 max-w-sm">
              Vous n'avez pas encore ajouté de propriétés à vos favoris. Parcourez nos annonces et cliquez sur le cœur pour les sauvegarder.
            </p>
            <Link to="/properties" className="px-6 py-3 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-md">
              Explorer les biens
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(property => (
              <div key={property.id} className="group flex flex-col bg-bg-card rounded-2xl border border-border-main overflow-hidden hover:shadow-huge hover:-translate-y-2 transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-bg-soft">
                  <img 
                    src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : defaultImage} 
                    alt={property.title}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${property.status !== 'available' ? 'brightness-75' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
                  
                  <div className="absolute top-4 start-4 flex flex-col gap-2">
                    {property.transaction_type === 'sale' ? (
                      <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full shadow-lg">Vente</span>
                    ) : (
                       <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">Location</span>
                    )}
                  </div>
                  
                  <div className="absolute top-4 end-4">
                    <button 
                      onClick={(e) => { e.preventDefault(); removeFavorite(property.id); }}
                      className="p-2 bg-bg-glass backdrop-blur-sm text-rose-500 hover:bg-rose-500 hover:text-white rounded-full shadow-large transition-colors"
                      title="Retirer des favoris"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-4 inset-x-4">
                     <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 drop-shadow-md">{property.title}</h3>
                     <div className="text-slate-200 text-xs mt-1 flex items-center gap-1 opacity-90">
                       <MapPinIcon className="w-3.5 h-3.5" />
                       {property.city}
                     </div>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                       <span className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">Prix</span>
                       <div className="text-xl font-black text-primary dark:text-white">
                         {property.price?.toLocaleString('fr-FR')} <span className="text-sm font-bold text-text-muted">DH{property.transaction_type === 'rent' ? '/ms' : ''}</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-4 border-y border-border-main mb-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-text-sub text-sm font-medium">
                      <ArrowsRightLeftIcon className="w-4 h-4 text-text-muted" />
                      {property.surface} m²
                    </div>
                    <div className="w-1 h-1 bg-border-main rounded-full"></div>
                    <div className="flex items-center gap-1.5 text-text-sub text-sm font-medium">
                      <BuildingOfficeIcon className="w-4 h-4 text-text-muted" />
                      {property.rooms} p.
                    </div>
                  </div>

                  <Link 
                    to={`/properties/${property.id}`}
                    className="block w-full py-3 text-center font-bold rounded-xl transition-all shadow-md bg-secondary text-primary hover:bg-secondary-hover"
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
