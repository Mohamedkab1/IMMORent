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
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Properties = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
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
    <div className={`min-h-screen transition-colors duration-500 font-sans pt-32 pb-20 selection:bg-indigo-500/30 w-full overflow-x-hidden ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#0c122b] text-white'
    }`}>
      {/* Background glow effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 animate-pulse ${
          theme === 'light' ? 'bg-indigo-200/30' : 'bg-indigo-600/10'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 animate-pulse delay-1000 ${
          theme === 'light' ? 'bg-blue-100/30' : 'bg-indigo-900/10'
        }`}></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Link to="/" className={`transition-colors ${theme === 'light' ? 'text-slate-400 hover:text-indigo-600' : 'text-indigo-400 hover:text-white'}`}>{t('nav.home')}</Link>
            <span className={theme === 'light' ? 'text-slate-200' : 'text-white/20'}>/</span>
            <span className={theme === 'light' ? 'text-slate-400' : 'text-white/40'}>{t('nav.properties')}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
                {t('prop.hero.title_p1')} <span className="text-indigo-600 dark:text-indigo-400">{t('prop.hero.title_p2')}</span>
              </h1>
              <p className={`text-sm font-light tracking-wide ${theme === 'light' ? 'text-slate-500' : 'text-white/40'}`}>{pagination.total} {t('prop.hero.subtitle')}</p>
            </div>
            {Object.values(filters).some(v => v !== '') && (
              <button 
                onClick={handleReset}
                className={`flex items-center gap-2 text-[10px] font-black transition-colors uppercase tracking-widest border-b pb-1 w-fit ${
                  theme === 'light' ? 'text-slate-400 border-slate-200 hover:text-indigo-600' : 'text-white/30 border-white/10 hover:text-indigo-400'
                }`}
              >
                <ArrowPathIcon className="w-3 h-3" />
                {t('prop.filter.reset')}
              </button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className={`backdrop-blur-3xl border rounded-xl p-6 sm:p-8 mb-16 shadow-2xl transition-all duration-500 ${
          theme === 'light' 
            ? 'bg-white border-slate-100 shadow-slate-200/50' 
            : 'bg-white/[0.04] border-white/10 shadow-indigo-950/20'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-8 items-end">
            {/* Location */}
            <div className="space-y-3 group">
              <label className={`block text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 ${
                theme === 'light' ? 'text-slate-400' : 'text-white/30'
              }`}>
                {t('prop.filter.location')}
              </label>
              <div className="relative">
                <MapPinIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                  theme === 'light' ? 'text-slate-300 group-focus-within:text-indigo-600' : 'text-white/20 group-focus-within:text-indigo-400'
                }`} />
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.loc_placeholder')}
                  className={`w-full border rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-all ${
                    theme === 'light' 
                      ? 'bg-slate-50 border-slate-100 focus:border-indigo-500 placeholder:text-slate-300' 
                      : 'bg-white/5 border-white/10 focus:border-indigo-500 placeholder:text-white/10'
                  }`}
                />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-3 group">
              <label className={`block text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 ${
                theme === 'light' ? 'text-slate-400' : 'text-white/30'
              }`}>
                {t('prop.filter.type')}
              </label>
              <div className="relative">
                <HomeIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                  theme === 'light' ? 'text-slate-300 group-focus-within:text-indigo-600' : 'text-white/20 group-focus-within:text-indigo-400'
                }`} />
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className={`w-full border rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition-all appearance-none cursor-pointer ${
                    theme === 'light' 
                      ? 'bg-slate-50 border-slate-100 focus:border-indigo-500' 
                      : 'bg-white/5 border-white/10 focus:border-indigo-500'
                  }`}
                >
                  <option value="" className={theme === 'light' ? 'bg-white' : 'bg-[#0c122b]'}>{t('prop.filter.indifferent')}</option>
                  {['apartment', 'house', 'villa', 'studio', 'office', 'commercial', 'land'].map(type => (
                    <option key={type} value={type} className={theme === 'light' ? 'bg-white' : 'bg-[#0c122b]'}>{t(`prop.types.${type}`)}</option>
                  ))}
                </select>
                <ChevronDownIcon className={`absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 ${theme === 'light' ? 'text-slate-300' : 'text-white/20'}`} />
              </div>
            </div>

            {/* Price Min */}
            <div className="space-y-3 group">
              <label className={`block text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 ${
                theme === 'light' ? 'text-slate-400' : 'text-white/30'
              }`}>{t('prop.filter.budget_min')}</label>
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleFilterChange}
                placeholder="0"
                className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${
                  theme === 'light' 
                    ? 'bg-slate-50 border-slate-100 focus:border-indigo-500 placeholder:text-slate-300' 
                    : 'bg-white/5 border-white/10 focus:border-indigo-500 placeholder:text-white/10'
                }`}
              />
            </div>

            {/* Price Max */}
            <div className="space-y-3 group">
              <label className={`block text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 ${
                theme === 'light' ? 'text-slate-400' : 'text-white/30'
              }`}>{t('prop.filter.budget_max')}</label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                placeholder={t('prop.filter.max_ph')}
                className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${
                  theme === 'light' 
                    ? 'bg-slate-50 border-slate-100 focus:border-indigo-500 placeholder:text-slate-300' 
                    : 'bg-white/5 border-white/10 focus:border-indigo-500 placeholder:text-white/10'
                }`}
              />
            </div>

            {/* Surface Min */}
            <div className="space-y-3 group">
              <label className={`block text-[10px] font-black uppercase tracking-widest transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 ${
                theme === 'light' ? 'text-slate-400' : 'text-white/30'
              }`}>{t('prop.filter.surface_min')}</label>
              <input
                type="number"
                name="surface_min"
                value={filters.surface_min}
                onChange={handleFilterChange}
                placeholder={t('prop.filter.surface_ph')}
                className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${
                  theme === 'light' 
                    ? 'bg-slate-50 border-slate-100 focus:border-indigo-500 placeholder:text-slate-300' 
                    : 'bg-white/5 border-white/10 focus:border-indigo-500 placeholder:text-white/10'
                }`}
              />
            </div>

            {/* Search Action */}
            <button 
              onClick={fetchProperties}
              className={`w-full bg-indigo-600 hover:bg-indigo-500 rounded-lg py-3.5 flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 ${theme === 'light' ? '!text-white' : 'text-white'}`}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              {t('prop.filter.submit')}
            </button>
          </div>
        </div>

        {/* Sorting and Results count bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 px-2 gap-4">
           <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'text-slate-300' : 'text-white/20'}`}>
             <span className="text-indigo-600 dark:text-indigo-400 text-lg mr-2">{pagination.total}</span> {t('prop.list.results')}
           </div>
           <div className={`flex items-center gap-6 text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>
             {t('prop.list.sort_by')}
             <select className={`bg-transparent border-none outline-none font-black cursor-pointer transition-colors ${
               theme === 'light' ? 'text-slate-900 hover:text-indigo-600' : 'text-white hover:text-indigo-400'
             }`}>
               <option className={theme === 'light' ? 'bg-white' : 'bg-[#0c122b]'}>{t('prop.sort.newest')}</option>
               <option className={theme === 'light' ? 'bg-white' : 'bg-[#0c122b]'}>{t('prop.sort.price_asc')}</option>
               <option className={theme === 'light' ? 'bg-white' : 'bg-[#0c122b]'}>{t('prop.sort.price_desc')}</option>
             </select>
           </div>
        </div>

        {/* Results Area */}
        <main className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <div key={i} className={`aspect-[4/5] rounded-xl animate-pulse ${theme === 'light' ? 'bg-slate-100' : 'bg-white/5'}`}></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className={`py-32 text-center border border-dashed rounded-xl ${
              theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/10'
            }`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${theme === 'light' ? 'text-slate-300' : 'text-white/20'}`}>{t('prop.list.no_results')}</p>
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
                    <div className={`backdrop-blur-2xl border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 group-hover:shadow-2xl ${
                      theme === 'light' 
                        ? 'bg-white border-slate-100 shadow-slate-200/50 hover:border-indigo-200' 
                        : 'bg-white/[0.04] border-white/10 hover:border-indigo-400/40 group-hover:shadow-indigo-500/10'
                    }`}>
                      {/* Image Area */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : defaultImage} 
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${
                          theme === 'light' ? 'from-white/80' : 'from-[#0c122b]/90'
                        }`}></div>
                        
                        {/* Transaction Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest backdrop-blur-md border ${
                            property.transaction_type === 'sale' 
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          }`}>
                            {property.transaction_type === 'sale' ? t('prop.card.sale') : t('prop.card.rent')}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5">
                        <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mb-2 ${
                          theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                        }`}>
                          <MapPinIcon className="w-3 h-3" />
                          {t(property.city)}
                        </div>
                        
                        <h3 className={`text-sm font-bold tracking-tight line-clamp-1 mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${
                          theme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>
                          {t(property.title)}
                        </h3>

                        <div className={`flex items-center gap-5 text-[10px] font-medium mb-6 ${
                          theme === 'light' ? 'text-slate-400' : 'text-white/30'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <ArrowsRightLeftIcon className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-indigo-200' : 'text-indigo-400/40'}`} />
                            {property.surface} m²
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BuildingOfficeIcon className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-indigo-200' : 'text-indigo-400/40'}`} />
                            {property.rooms} p.
                          </div>
                        </div>

                        <div className={`flex items-center justify-between pt-4 border-t ${
                          theme === 'light' ? 'border-slate-50' : 'border-white/5'
                        }`}>
                          <div className={`text-lg font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            {property.price?.toLocaleString()} <span className={`text-[10px] ml-0.5 ${theme === 'light' ? 'text-slate-300' : 'text-white/30'}`}>{t('prop.card.price_unit')}</span>
                          </div>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-600 ${
                            theme === 'light' ? 'bg-indigo-50 border border-indigo-100' : 'bg-indigo-600/10 border border-indigo-500/20'
                          }`}>
                            <ChevronDownIcon className={`w-3.5 h-3.5 -rotate-90 group-hover:text-white transition-colors ${
                              theme === 'light' ? 'text-indigo-600' : 'text-indigo-500'
                            }`} />
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
                className={`w-10 h-10 flex items-center justify-center rounded-lg border disabled:opacity-10 transition-all ${
                  theme === 'light' ? 'bg-white border-slate-200 text-slate-400 hover:border-indigo-500' : 'bg-white/5 border-white/10 text-white hover:border-indigo-500'
                }`}
              >
                &larr;
              </button>
              <div className={`px-5 py-2.5 rounded-lg border text-[10px] font-black tracking-widest uppercase ${
                theme === 'light' ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-white'
              }`}>
                {t('common.page')} {pagination.currentPage} / {pagination.lastPage}
              </div>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.lastPage}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border disabled:opacity-10 transition-all ${
                  theme === 'light' ? 'bg-white border-slate-200 text-slate-400 hover:border-indigo-500' : 'bg-white/5 border-white/10 text-white hover:border-indigo-500'
                }`}
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