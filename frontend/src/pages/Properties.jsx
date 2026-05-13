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

const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

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
      <div className="relative flex items-center justify-center min-h-[40vh] bg-slate-900 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-slate-900/90 z-10 transition-opacity duration-700 group-hover:opacity-80"></div>
        <img 
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80" 
          alt="Properties Background" 
          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-[15s] group-hover:scale-110" 
        />
        
        {/* Abstract Background patterns */}
        <div className="absolute inset-0 opacity-10 z-10 mix-blend-overlay">
          <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" width="600" height="600" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="600" height="600" fill="url(#pattern-circles)" />
          </svg>
        </div>

        <div className="relative z-20 max-w-3xl mx-auto text-center px-4 mt-8">
          <RevealOnScroll>
            <span className="inline-block py-1 px-4 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold mb-4 tracking-widest uppercase">
              {t('nav.properties')}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight !text-white drop-shadow-lg">
              {t('prop.hero.title_p1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">{t('prop.hero.title_p2')}</span>
            </h1>
            <p className="text-lg md:text-xl !text-white mb-8 max-w-2xl mx-auto drop-shadow-md font-medium leading-relaxed">
              {t('prop.hero.subtitle')}
            </p>
            <button 
              className="md:hidden inline-flex items-center gap-2 px-8 py-4 bg-secondary text-primary hover:bg-yellow-400 rounded-xl font-bold transition-all shadow-xl hover:-translate-y-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="w-5 h-5" />
              {showFilters ? t('prop.filter.hide') : t('prop.filter.show')}
            </button>
          </RevealOnScroll>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className={`fixed md:relative top-0 ${showFilters ? 'start-0' : '-start-full'} md:start-0 w-80 md:w-1/4 h-full md:h-auto bg-bg-card z-50 md:z-0 shadow-2xl md:shadow-main md:rounded-3xl border-e md:border border-border-main transition-all duration-500 overflow-y-auto md:overflow-visible`}>
          <div className="p-6 sticky top-0 bg-bg-card/95 backdrop-blur-xl border-b border-border-main flex justify-between items-center z-10">
            <h2 className="text-lg font-black text-text-main flex items-center gap-2 uppercase tracking-wide">
              <FunnelIcon className="w-5 h-5 text-primary dark:text-secondary" />
              {t('prop.filter.title')}
            </h2>
            <button onClick={() => setShowFilters(false)} className="md:hidden p-2 text-text-muted hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6">
            <div className="space-y-2 border-b border-border-main pb-6 group">
              <label className="text-xs font-bold text-text-sub uppercase tracking-wider group-focus-within:text-primary transition-colors">{t('prop.filter.location')}</label>
              <div className="relative">
                <MapPinIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.loc_placeholder')}
                  className="w-full ps-10 pe-4 py-3 bg-bg-soft hover:bg-bg-main border border-border-main rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2 border-b border-border-main pb-6 group">
              <label className="text-xs font-bold text-text-sub uppercase tracking-wider group-focus-within:text-primary transition-colors">{t('prop.filter.type')}</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-bg-soft hover:bg-bg-main border border-border-main rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all appearance-none cursor-pointer shadow-inner"
              >
                <option value="">{t('prop.filter.all_types', 'Tous les types')}</option>
                <option value="apartment">{t('prop.types.apartment', 'Appartement')}</option>
                <option value="house">{t('prop.types.house', 'Maison')}</option>
                <option value="villa">{t('prop.types.villa', 'Villa')}</option>
                <option value="studio">{t('prop.types.studio', 'Studio')}</option>
                <option value="office">{t('prop.types.office', 'Bureau')}</option>
                <option value="commercial">{t('prop.types.commercial', 'Local commercial')}</option>
                <option value="land">{t('prop.types.land', 'Terrain')}</option>
              </select>
            </div>

            <div className="space-y-2 border-b border-border-main pb-6 group">
              <label className="text-xs font-bold text-text-sub uppercase tracking-wider group-focus-within:text-primary transition-colors">{t('prop.filter.budget')}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.budget_min')}
                  className="w-full px-4 py-3 bg-bg-soft hover:bg-bg-main border border-border-main rounded-2xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-text-muted font-bold">-</span>
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.budget_max')}
                  className="w-full px-4 py-3 bg-bg-soft hover:bg-bg-main border border-border-main rounded-2xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="space-y-2 border-b border-border-main pb-6 group">
              <label className="text-xs font-bold text-text-sub uppercase tracking-wider group-focus-within:text-primary transition-colors">{t('prop.filter.surface_min')}</label>
              <div className="relative">
                <ArrowsRightLeftIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="number"
                  name="surface_min"
                  value={filters.surface_min}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.surface_placeholder')}
                  className="w-full ps-10 pe-4 py-3 bg-bg-soft hover:bg-bg-main border border-border-main rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="space-y-2 border-b border-border-main pb-6 group">
              <label className="text-xs font-bold text-text-sub uppercase tracking-wider group-focus-within:text-primary transition-colors">{t('prop.filter.rooms')}</label>
              <select
                name="rooms"
                value={filters.rooms}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-bg-soft hover:bg-bg-main border border-border-main rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main transition-all appearance-none cursor-pointer shadow-inner"
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
                className="w-full py-4 bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-primary rounded-2xl font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
              >
                <ArrowPathIcon className="w-5 h-5" /> {t('prop.filter.reset')}
              </button>
            </div>
          </form>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {showFilters && (
          <div className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-md transition-opacity" onClick={() => setShowFilters(false)} />
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
                {properties.map((property, index) => (
                  <RevealOnScroll key={property.id} delay={(index % 6) * 100}>
                    <div className="group flex flex-col bg-bg-card rounded-3xl border border-border-main overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/20 dark:hover:border-secondary/20 hover:-translate-y-2 transition-all duration-500 h-full">
                      <div className="relative aspect-[4/3] overflow-hidden bg-bg-soft">
                        <img 
                          src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : defaultImage} 
                          alt={property.title}
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${property.status !== 'available' ? 'brightness-75' : ''}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="absolute top-4 start-4 flex flex-col gap-2">
                          {property.transaction_type === 'sale' ? (
                            <span className="px-4 py-1.5 bg-rose-500 !text-white text-xs font-black uppercase tracking-wider rounded-full shadow-lg backdrop-blur-md">{t('prop.card.sale')}</span>
                          ) : (
                             <span className="px-4 py-1.5 bg-green-500 !text-white text-xs font-black uppercase tracking-wider rounded-full shadow-lg backdrop-blur-md">{t('prop.card.rent')}</span>
                          )}
                          {/* ✅ Badge statut sur la photo */}
                          {property.status === 'reserved' && (
                            <span className="px-4 py-1.5 bg-rose-700 !text-white text-xs font-black uppercase tracking-wider rounded-full shadow-lg">{t('prop.card.reserved')}</span>
                          )}
                          {property.status === 'rented' && (
                            <span className="px-4 py-1.5 bg-orange-600 !text-white text-xs font-black uppercase tracking-wider rounded-full shadow-lg">{t('prop.card.rented')}</span>
                          )}
                          {property.status === 'sold' && (
                            <span className="px-4 py-1.5 bg-gray-700 !text-white text-xs font-black uppercase tracking-wider rounded-full shadow-lg">{t('prop.card.sold')}</span>
                          )}
                        </div>
                        
                        <div className="absolute top-4 end-4">
                          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 !text-white text-xs font-bold rounded-full shadow-lg hidden md:block">
                            {t(`property.type.${property.type}`, property.type_label)}
                          </span>
                        </div>
                        
                        <div className="absolute bottom-4 inset-x-5 transform transition-transform duration-300 group-hover:-translate-y-1">
                           <h3 className="!text-white font-extrabold text-xl leading-tight line-clamp-1 drop-shadow-md mb-1">{t(property.title)}</h3>
                           <div className="!text-white text-sm flex items-center gap-1.5 font-medium">
                             <MapPinIcon className="w-4 h-4 text-secondary" />
                             {property.city}
                           </div>
                        </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col bg-bg-card relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex flex-col">
                             <span className="text-xs text-text-muted font-black uppercase tracking-widest mb-1">{t('prop.card.price')}</span>
                             <div className="text-2xl font-black text-primary dark:text-white">
                               {property.price?.toLocaleString(t('common.locale', 'fr-FR'))} <span className="text-base font-bold text-text-muted">{t('prop.card.dh')}{property.transaction_type === 'rent' ? t('prop.card.per_month') : ''}</span>
                             </div>
                          </div>
                          {/* ✅ Badge statut visible dans la carte */}
                          {property.status === 'reserved' && (
                            <span className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-100 dark:border-rose-800/30">
                              {t('prop.card.reserved')}
                            </span>
                          )}
                          {property.status === 'rented' && (
                            <span className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-xl border border-orange-100 dark:border-orange-800/30">
                              {t('prop.card.rented')}
                            </span>
                          )}
                          {property.status === 'sold' && (
                            <span className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-xl border border-gray-100 dark:border-gray-800/30">
                              {t('prop.card.sold')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-5 py-5 border-y border-border-main mb-6 mt-auto">
                          <div className="flex items-center gap-2 text-text-sub font-semibold bg-bg-soft px-3 py-1.5 rounded-lg">
                            <ArrowsRightLeftIcon className="w-4 h-4 text-primary dark:text-secondary" />
                            {property.surface} m²
                          </div>
                          <div className="flex items-center gap-2 text-text-sub font-semibold bg-bg-soft px-3 py-1.5 rounded-lg">
                            <BuildingOfficeIcon className="w-4 h-4 text-primary dark:text-secondary" />
                            {property.rooms} p.
                          </div>
                        </div>

                        <Link 
                          to={`/properties/${property.id}`}
                          className={`block w-full py-4 text-center font-black uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl ${
                            property.status === 'available'
                              ? 'bg-secondary text-primary hover:bg-yellow-400'
                              : 'bg-bg-soft text-text-muted hover:bg-border-main border border-border-main'
                          }`}
                        >
                          {property.status === 'available' ? t('prop.action.view_details') : t('prop.action.consult')}
                        </Link>
                      </div>
                    </div>
                  </RevealOnScroll>
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