import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { useLanguage } from '../context/LanguageContext';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ArrowPathIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

const Properties = () => {
  const { t } = useLanguage();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });

  const [filters, setFilters] = useState({
    city: '',
    type: '',
    transaction_type: '',
    min_price: '',
    max_price: '',
    min_surface: '',
    max_surface: '',
    rooms: ''
  });

  const [debouncedCity, setDebouncedCity] = useState('');

  const propertyTypes = [
    { value: '', label: t('prop.filter.type') },
    { value: 'apartment', label: t('home.apartments') },
    { value: 'house', label: t('home.houses') },
    { value: 'studio', label: 'Studio' },
    { value: 'commercial', label: t('home.commercial') },
    { value: 'land', label: t('home.lands') }
  ];

  // Debounce for city input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(filters.city);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.city]);

  // Fetch properties when filters or page change
  useEffect(() => {
    fetchProperties();
  }, [debouncedCity, filters.type, filters.transaction_type, filters.min_price, filters.max_price, filters.min_surface, filters.max_surface, filters.rooms, pagination.currentPage]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries({ ...filters, city: debouncedCity }).filter(([_, value]) => value !== '')
      );
      
      const response = await propertyService.getAll({
        ...activeFilters,
        page: pagination.currentPage,
        per_page: 12
      });
      
      if (response.success) {
        setProperties(response.data.data);
        setPagination({
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          total: response.data.total
        });
      }
    } catch (err) {
      setError('Erreur lors du chargement des biens');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // Reset to first page when filter changes
    if (name !== 'city') {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  };

  const handleReset = () => {
    setFilters({
      city: '',
      type: '',
      transaction_type: '',
      min_price: '',
      max_price: '',
      min_surface: '',
      max_surface: '',
      rooms: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';

  return (
    <div className="min-h-screen bg-[var(--bg-main)] transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary-hover to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#pattern-circles)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            Trouvez votre <span className="text-secondary">lieu idéal</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto drop-shadow-sm font-medium">
            Découvrez notre sélection premium de biens immobiliers à louer ou à vendre, adaptés à votre style de vie.
          </p>
          <button 
            className="md:hidden inline-flex items-center gap-2 px-6 py-3 bg-secondary text-primary hover:bg-secondary-hover rounded-xl font-bold transition-all shadow-xl hover:-translate-y-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="w-5 h-5" />
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className={`fixed md:relative top-0 ${showFilters ? 'start-0' : '-start-full'} md:start-0 w-80 md:w-1/4 h-full md:h-auto bg-[var(--card-bg)] z-50 md:z-0 shadow-2xl md:shadow-sm md:rounded-2xl border-e md:border border-[var(--border-color)] transition-all duration-300 overflow-y-auto md:overflow-visible`}>
          <div className="p-6 sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border-color)] flex justify-between items-center z-10">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-primary dark:text-secondary" />
              Filtres
            </h2>
            <button onClick={() => setShowFilters(false)} className="md:hidden p-2 text-[var(--text-muted)] hover:text-red-500 rounded-lg hover:bg-[var(--bg-muted)]">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-700 pb-6">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Localisation</label>
              <div className="relative">
                <MapPinIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Ex: Casablanca, Marrakech..."
                  className="w-full ps-10 pe-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-700 pb-6">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transaction</label>
              <div className="flex gap-2">
                {[
                  { value: '', label: 'Tout' },
                  { value: 'rent', label: 'Louer' },
                  { value: 'sale', label: 'Acheter' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, transaction_type: opt.value }));
                      setPagination(prev => ({ ...prev, currentPage: 1 }));
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${filters.transaction_type === opt.value ? 'bg-primary text-white border-primary shadow-md' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-700 pb-6">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type de bien</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all appearance-none cursor-pointer text-[var(--text-main)]"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-700 pb-6">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Budget (DH)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all"
                />
                <span className="text-slate-400 font-bold">-</span>
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-700 pb-6">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Surface (m²)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="min_surface"
                  value={filters.min_surface}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all"
                />
                <span className="text-slate-400 font-bold">-</span>
                <input
                  type="number"
                  name="max_surface"
                  value={filters.max_surface}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-700 pb-6">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pièces</label>
              <select
                name="rooms"
                value={filters.rooms}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all appearance-none cursor-pointer text-slate-700"
              >
                <option value="">Toutes</option>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n} pièce{n>1?'s':''}</option>)}
                <option value="5">5+ pièces</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button type="button" onClick={handleReset} className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 rounded-xl font-bold transition-all">
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </aside>

        {showFilters && (
          <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setShowFilters(false)} />
        )}

        {/* Properties Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {!loading && !error ? (
              <h2 className="text-slate-800 dark:text-white text-lg font-bold">
                <span className="text-primary dark:text-secondary text-2xl me-2">{pagination.total}</span>
                Résultat{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
              </h2>
            ) : <div className="h-8"></div>}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
              <ArrowPathIcon className="w-12 h-12 text-primary dark:text-secondary animate-spin mb-4" />
              <p className="font-semibold animate-pulse">Chargement des biens...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-red-50 dark:bg-red-900/10 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900/30 text-center px-4">
              <XMarkIcon className="w-16 h-16 text-red-400 mb-4" />
              <p className="text-red-600 dark:text-red-400 font-bold text-lg mb-4">{error}</p>
              <button onClick={fetchProperties} className="px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl font-semibold transition-colors">Réessayer</button>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] text-center px-4 shadow-sm">
              <div className="w-20 h-20 bg-[var(--bg-main)] rounded-full flex items-center justify-center mb-6">
                <MagnifyingGlassIcon className="w-10 h-10 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Aucun bien trouvé</h3>
              <p className="text-[var(--text-muted)] mb-6 max-w-sm">Nous n'avons trouvé aucun bien correspondant à vos critères de recherche actuels.</p>
              <button onClick={handleReset} className="px-6 py-3 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-md">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map(property => (
                  <div key={property.id} className="group flex flex-col bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-700">
                      <img 
                        src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : defaultImage} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                        <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-primary dark:text-secondary text-xs font-bold rounded-full shadow-lg hidden md:block">
                          {property.type_label}
                        </span>
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
                           <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">Prix</span>
                           <div className="text-xl font-black text-primary dark:text-white">
                             {property.price?.toLocaleString('fr-FR')} <span className="text-sm font-bold text-slate-400">DH{property.transaction_type === 'rent' ? '/ms' : ''}</span>
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 py-4 border-y border-slate-100 dark:border-slate-700 mb-4 mt-auto">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm font-medium">
                          <ArrowsRightLeftIcon className="w-4 h-4 text-slate-400" />
                          {property.surface} m²
                        </div>
                        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm font-medium">
                          <BuildingOfficeIcon className="w-4 h-4 text-slate-400" />
                          {property.rooms} p.
                        </div>
                      </div>

                      <Link to={`/properties/${property.id}`} className="block w-full py-3 bg-secondary text-primary hover:bg-secondary-hover text-center font-bold rounded-xl transition-all shadow-md">
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.lastPage > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 bg-[var(--card-bg)] p-2 rounded-2xl border border-[var(--border-color)] shadow-sm w-fit mx-auto">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Précédent
                  </button>
                  
                  <div className="px-4 py-2 text-sm font-bold text-slate-800 dark:text-white">
                    {pagination.currentPage} <span className="text-slate-400 font-medium mx-1">/</span> {pagination.lastPage}
                  </div>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.lastPage}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;