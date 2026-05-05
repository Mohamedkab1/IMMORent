import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { useLanguage } from '../context/LanguageContext';
import { useDebounce } from '../hooks/useDebounce';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const Properties = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Initialisation des filtres depuis l'URL ou valeurs par défaut
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    surface_min: searchParams.get('surface_min') || '',
    rooms: searchParams.get('rooms') || ''
  });

  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    lastPage: 1,
    total: 0
  });

  // Version debouncée des filtres pour éviter trop d'appels API
  const debouncedFilters = useDebounce(filters, 500);



  // Effet pour charger les biens quand les filtres ou la page changent
  useEffect(() => {
    fetchProperties();
    updateUrlParams();
  }, [debouncedFilters, pagination.currentPage]);

  const updateUrlParams = () => {
    const params = {};
    if (pagination.currentPage > 1) params.page = pagination.currentPage;
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    
    setSearchParams(params, { replace: true });
  };

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
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
    // On remet à la page 1 si on change un filtre
    if (pagination.currentPage !== 1) {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  };

  const handleReset = () => {
    setFilters({
      city: '',
      type: '',
      min_price: '',
      max_price: '',
      surface_min: '',
      rooms: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary-hover to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-6 py-20 text-center overflow-hidden">
        {/* Abstract Background patterns */}
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
            {t('prop.hero.title_p1')} <span className="text-secondary">{t('prop.hero.title_p2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto drop-shadow-sm font-medium">
            {t('prop.hero.subtitle')}
          </p>
          <button 
            className="md:hidden inline-flex items-center gap-2 px-6 py-3 bg-secondary text-primary hover:bg-secondary-hover rounded-xl font-bold transition-all shadow-xl hover:-translate-y-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="w-5 h-5" />
            {showFilters ? t('prop.filter.hide') : t('prop.filter.show')}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className={`fixed md:relative top-0 ${showFilters ? 'start-0' : '-start-full'} md:start-0 w-80 md:w-1/4 h-full md:h-auto bg-bg-card z-50 md:z-0 shadow-huge md:shadow-main md:rounded-2xl border-e md:border border-border-main transition-all duration-300 overflow-y-auto md:overflow-visible`}>
          <div className="p-6 sticky top-0 bg-bg-card border-b border-border-main flex justify-between items-center z-10">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-primary dark:text-secondary" />
              {t('prop.filter.title')}
            </h2>
            <button onClick={() => setShowFilters(false)} className="md:hidden p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-bg-soft">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6">
            <div className="space-y-1.5 border-b border-border-main pb-6">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('prop.filter.location')}</label>
              <div className="relative">
                <MapPinIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.loc_placeholder')}
                  className="w-full ps-10 pe-4 py-2.5 bg-bg-soft border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all"
                />
              </div>
            </div>



            <div className="space-y-1.5 border-b border-border-main pb-6">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('prop.filter.budget')}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.budget_min')}
                  className="w-full px-4 py-2.5 bg-bg-soft border border-border-main rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-text-muted font-bold">-</span>
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.budget_max')}
                  className="w-full px-4 py-2.5 bg-bg-soft border border-border-main rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="space-y-1.5 border-b border-border-main pb-6">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('prop.filter.surface_min')}</label>
              <div className="relative">
                <ArrowsRightLeftIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="number"
                  name="surface_min"
                  value={filters.surface_min}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.surface_placeholder')}
                  className="w-full ps-10 pe-4 py-2.5 bg-bg-soft border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="space-y-1.5 border-b border-border-main pb-6">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t('prop.filter.rooms')}</label>
              <select
                name="rooms"
                value={filters.rooms}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-bg-soft border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all appearance-none cursor-pointer"
              >
                <option value="">{t('prop.filter.all_rooms')}</option>
                {[1,2,3,4].map(n => <option key={n} value={n}>{n} {t('prop.filter.room_unit')}{n>1?'s':''}</option>)}
                <option value="5">{t('prop.filter.rooms_5_plus')}</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button 
                type="button" 
                onClick={handleReset} 
                className="w-full py-3 bg-bg-soft text-text-main hover:bg-border-main active:scale-95 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <ArrowPathIcon className="w-5 h-5" /> {t('prop.filter.reset')}
              </button>
            </div>
          </form>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {showFilters && (
          <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setShowFilters(false)} />
        )}

        {/* Properties Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {!loading && !error ? (
              <h2 className="text-text-main text-lg font-bold">
                <span className="text-primary dark:text-secondary text-2xl me-2">{pagination.total}</span>
                {t('prop.list.results_found')}
              </h2>
            ) : <div className="h-8"></div>}
            
            {/* Optional Sorting here */}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <ArrowPathIcon className="w-12 h-12 text-primary dark:text-secondary animate-spin mb-4" />
              <p className="font-semibold animate-pulse">{t('prop.list.searching')}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-red-50 dark:bg-red-900/10 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900/30 text-center px-4">
              <XMarkIcon className="w-16 h-16 text-red-400 mb-4" />
              <p className="text-red-600 dark:text-red-400 font-bold text-lg mb-4">{error}</p>
              <button onClick={fetchProperties} className="px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl font-semibold transition-colors">
                {t('prop.filter.reset', 'Réessayer')}
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-bg-card rounded-2xl border border-border-main text-center px-4 shadow-sm">
              <div className="w-20 h-20 bg-bg-soft rounded-full flex items-center justify-center mb-6">
                <MagnifyingGlassIcon className="w-10 h-10 text-text-muted" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">{t('prop.list.no_results')}</h3>
              <p className="text-text-sub mb-6 max-w-sm">{t('prop.list.no_results_desc')}</p>
              <button onClick={handleReset} className="px-6 py-3 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-md">
                {t('prop.filter.reset')}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map(property => (
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
                          <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full shadow-lg">{t('prop.card.sale')}</span>
                        ) : (
                           <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">{t('prop.card.rent')}</span>
                        )}
                        {/* ✅ Badge statut sur la photo */}
                        {property.status === 'reserved' && (
                          <span className="px-3 py-1 bg-rose-700 text-white text-xs font-bold rounded-full shadow-lg">{t('prop.card.reserved')}</span>
                        )}
                        {property.status === 'rented' && (
                          <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full shadow-lg">{t('prop.card.rented')}</span>
                        )}
                        {property.status === 'sold' && (
                          <span className="px-3 py-1 bg-gray-700 text-white text-xs font-bold rounded-full shadow-lg">{t('prop.card.sold')}</span>
                        )}
                      </div>
                      
                      <div className="absolute top-4 end-4">
                        <span className="px-3 py-1 bg-bg-glass backdrop-blur-sm text-text-main text-xs font-bold rounded-full shadow-large hidden md:block">
                          {t(`property.type.${property.type}`, property.type_label)}
                        </span>
                      </div>
                      
                      <div className="absolute bottom-4 inset-x-4">
                         <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 drop-shadow-md">{t(property.title)}</h3>
                         <div className="text-slate-200 text-xs mt-1 flex items-center gap-1 opacity-90">
                           <MapPinIcon className="w-3.5 h-3.5" />
                           {property.city}
                         </div>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                           <span className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">{t('prop.card.price')}</span>
                           <div className="text-xl font-black text-primary dark:text-white">
                             {property.price?.toLocaleString(t('common.locale', 'fr-FR'))} <span className="text-sm font-bold text-text-muted">{t('prop.card.dh')}{property.transaction_type === 'rent' ? t('prop.card.per_month') : ''}</span>
                           </div>
                        </div>
                        {/* ✅ Badge statut visible dans la carte */}
                        {property.status === 'reserved' && (
                          <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold rounded-full border border-rose-200 dark:border-rose-800/40 whitespace-nowrap">
                            {t('prop.card.reserved')}
                          </span>
                        )}
                        {property.status === 'rented' && (
                          <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold rounded-full border border-orange-200 dark:border-orange-800/40 whitespace-nowrap">
                            {t('prop.card.rented')}
                          </span>
                        )}
                        {property.status === 'sold' && (
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full border border-gray-200 dark:border-gray-800/40 whitespace-nowrap">
                            {t('prop.card.sold')}
                          </span>
                        )}
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
                        className={`block w-full py-3 text-center font-bold rounded-xl transition-all shadow-md ${
                          property.status === 'available'
                            ? 'bg-secondary text-primary hover:bg-secondary-hover'
                            : 'bg-bg-soft text-text-muted hover:bg-border-main border border-border-main'
                        }`}
                      >
                        {property.status === 'available' ? t('prop.action.view_details') : t('prop.action.consult')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.lastPage > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 bg-bg-card p-2 rounded-2xl border border-border-main shadow-sm w-fit mx-auto">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-border-main rounded-xl text-sm font-semibold text-text-sub hover:bg-bg-soft disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {t('common.previous')}
                  </button>
                  
                  <div className="px-4 py-2 text-sm font-bold text-text-main">
                    {pagination.currentPage} <span className="text-text-muted font-medium mx-1">/</span> {pagination.lastPage}
                  </div>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.lastPage}
                    className="px-4 py-2 border border-border-main rounded-xl text-sm font-semibold text-text-sub hover:bg-bg-soft disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {t('common.next')}
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