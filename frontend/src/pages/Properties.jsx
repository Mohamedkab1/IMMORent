import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ArrowsRightLeftIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  HeartIcon as HeartIconOutline
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useFavorites } from '../context/FavoritesContext';

const Properties = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const debouncedFilters = useDebounce(filters, 500);

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
        per_page: 15
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
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
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
    <div className="min-h-screen font-outfit bg-bg-main text-text-main transition-colors duration-500 pt-32 pb-20 selection:bg-primary/30 w-full overflow-x-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 animate-pulse bg-primary/10"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 animate-pulse delay-1000 bg-blue-500/10"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Link to="/" className="text-text-muted hover:text-primary transition-colors">{t('nav.home')}</Link>
            <span className="text-text-muted/20">/</span>
            <span className="text-text-main/40">{t('nav.properties')}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
                {t('prop.hero.title_p1')} <span className="text-primary">{t('prop.hero.title_p2')}</span>
              </h1>
              <p className="text-sm font-light tracking-wide text-text-muted">{pagination.total} {t('prop.hero.subtitle')}</p>
            </div>
            {Object.values(filters).some(v => v !== '') && (
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-[10px] font-black transition-colors uppercase tracking-widest border-b pb-1 w-fit text-text-muted border-border-main hover:text-primary"
              >
                <ArrowPathIcon className="w-3 h-3" />
                {t('prop.filter.reset')}
              </button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="backdrop-blur-3xl border border-border-main bg-bg-soft rounded-xl p-6 sm:p-8 mb-16 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-8 items-end">
            {/* Location */}
            <div className="space-y-3 group">
              <label className="block text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within:text-primary text-text-muted">
                {t('prop.filter.location')}
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors text-text-muted group-focus-within:text-primary" />
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.loc_placeholder')}
                  className="w-full border border-border-main rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all bg-bg-main focus:border-primary placeholder:text-text-muted/30"
                />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-3 group">
              <label className="block text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within:text-primary text-text-muted">
                {t('prop.filter.type')}
              </label>
              <div className="relative">
                <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors text-text-muted group-focus-within:text-primary" />
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full border border-border-main rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all appearance-none cursor-pointer bg-bg-main focus:border-primary"
                >
                  <option value="" className="bg-bg-main">{t('prop.filter.indifferent')}</option>
                  {['apartment', 'house', 'villa', 'studio', 'office', 'commercial', 'land'].map(type => (
                    <option key={type} value={type} className="bg-bg-main">{t(`prop.types.${type}`)}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted" />
              </div>
            </div>

            {/* Price Min */}
            <div className="space-y-3 group">
              <label className="block text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within:text-primary text-text-muted">{t('prop.filter.budget_min')}</label>
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full border border-border-main rounded-xl px-4 py-3 text-sm outline-none transition-all bg-bg-main focus:border-primary placeholder:text-text-muted/30"
              />
            </div>

            {/* Price Max */}
            <div className="space-y-3 group">
              <label className="block text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within:text-primary text-text-muted">{t('prop.filter.budget_max')}</label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                placeholder={t('prop.filter.max_ph')}
                className="w-full border border-border-main rounded-xl px-4 py-3 text-sm outline-none transition-all bg-bg-main focus:border-primary placeholder:text-text-muted/30"
              />
            </div>

            {/* Surface Min */}
            <div className="space-y-3 group">
              <label className="block text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within:text-primary text-text-muted">{t('prop.filter.surface_min')}</label>
              <input
                type="number"
                name="surface_min"
                value={filters.surface_min}
                onChange={handleFilterChange}
                placeholder={t('prop.filter.surface_ph')}
                className="w-full border border-border-main rounded-xl px-4 py-3 text-sm outline-none transition-all bg-bg-main focus:border-primary placeholder:text-text-muted/30"
              />
            </div>

            {/* Search Action */}
            <button 
              onClick={fetchProperties}
              className={`w-full bg-primary hover:bg-primary/90 rounded-xl py-3.5 flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-primary/20 active:scale-95 text-white ${theme === 'light' ? '!text-white' : ''}`}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              {t('prop.filter.submit')}
            </button>
          </div>
        </div>

        {/* Sorting and Results count bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 px-2 gap-4">
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
             <span className="text-primary text-lg mr-2">{pagination.total}</span> {t('prop.list.results')}
           </div>
           <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-text-muted">
             {t('prop.list.sort_by')}
             <select className="bg-transparent border-none outline-none font-black cursor-pointer transition-colors text-text-main hover:text-primary">
               <option className="bg-bg-main">{t('prop.sort.newest')}</option>
               <option className="bg-bg-main">{t('prop.sort.price_asc')}</option>
               <option className="bg-bg-main">{t('prop.sort.price_desc')}</option>
             </select>
           </div>
        </div>

        {/* Results Area */}
        <main className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <div key={i} className="aspect-[4/5] rounded-xl animate-pulse bg-bg-soft"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="py-32 text-center border border-dashed rounded-xl border-border-main bg-bg-soft">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-text-muted">{t('prop.list.no_results')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
              {properties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link to={`/properties/${property.id}`} className="block">
                    <div className="backdrop-blur-2xl border border-border-main bg-bg-soft rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40">
                      {/* Image Area */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : defaultImage} 
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-main/90 via-transparent to-transparent"></div>
                        
                        {/* Transaction Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] bg-slate-950/75 text-white backdrop-blur-md border border-white/10 shadow-lg select-none ${theme === 'light' ? '!text-white' : ''}`}>
                            <span className={`w-2 h-2 rounded-full ${
                              property.transaction_type === 'sale' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            }`} />
                            {property.transaction_type === 'sale' ? t('prop.card.sale') : t('prop.card.rent')}
                          </span>
                        </div>

                        {/* Favorite Toggle Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(property);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
                            isFavorite(property.id) 
                              ? 'bg-rose-500 text-white scale-110' 
                              : 'bg-white/20 text-white hover:bg-white/40 border border-white/20'
                          }`}
                        >
                          {isFavorite(property.id) ? (
                            <HeartIconSolid className="w-3.5 h-3.5" />
                          ) : (
                            <HeartIconOutline className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Content Area */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mb-2 text-primary">
                          <MapPinIcon className="w-3 h-3" />
                          {t(property.city)}
                        </div>
                        
                        <h3 className="text-sm font-bold tracking-tight line-clamp-1 mb-4 group-hover:text-primary transition-colors text-text-main">
                          {t(property.title)}
                        </h3>

                        <div className="flex items-center gap-5 text-[10px] font-medium mb-6 text-text-muted">
                          <div className="flex items-center gap-1.5">
                            <ArrowsRightLeftIcon className="w-3.5 h-3.5 text-primary/40" />
                            {property.surface} m²
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BuildingOfficeIcon className="w-3.5 h-3.5 text-primary/40" />
                            {property.rooms} p.
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border-main">
                          <div className="text-lg font-black text-text-main">
                            {property.price?.toLocaleString()} <span className="text-[10px] ml-0.5 text-text-muted">{t('prop.card.price_unit')}</span>
                          </div>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-primary bg-primary/10 border border-primary/20">
                            <ChevronDownIcon className="w-3.5 h-3.5 -rotate-90 group-hover:text-white transition-colors text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.lastPage > 1 && (
            <div className="mt-16 flex justify-center items-center gap-3">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main text-text-muted disabled:opacity-10 transition-all hover:border-primary hover:text-primary"
              >
                &larr;
              </button>
              <div className="px-5 py-2.5 rounded-xl border border-border-main text-text-muted text-[10px] font-black tracking-widest uppercase">
                {t('common.page')} {pagination.currentPage} / {pagination.lastPage}
              </div>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.lastPage}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main text-text-muted disabled:opacity-10 transition-all hover:border-primary hover:text-primary"
              >
                &rarr;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Properties;