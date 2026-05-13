import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { useLanguage } from '../context/LanguageContext';
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
    <div className="min-h-screen bg-[#0c122b] text-white font-sans pt-32 pb-20 selection:bg-indigo-500/30 w-full overflow-x-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
            <span className="text-white/20">/</span>
            <span className="text-white/40">{t('nav.properties')}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
                {t('prop.hero.title_p1')} <span className="text-indigo-400">{t('prop.hero.title_p2')}</span>
              </h1>
              <p className="text-white/40 text-sm font-light tracking-wide">{pagination.total} {t('prop.hero.subtitle')}</p>
            </div>
            {Object.values(filters).some(v => v !== '') && (
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-[10px] font-black text-white/30 hover:text-indigo-400 transition-colors uppercase tracking-widest border-b border-white/10 pb-1 w-fit"
              >
                <ArrowPathIcon className="w-3 h-3" />
                {t('prop.filter.reset')}
              </button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-xl p-6 sm:p-8 mb-16 shadow-2xl shadow-indigo-950/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-8 items-end">
            {/* Location */}
            <div className="space-y-3 group">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">
                {t('prop.filter.location')}
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder={t('prop.filter.loc_placeholder')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-3 group">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">
                {t('prop.filter.type')}
              </label>
              <div className="relative">
                <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0c122b]">{t('prop.filter.indifferent')}</option>
                  {['apartment', 'house', 'villa', 'studio', 'office', 'commercial', 'land'].map(type => (
                    <option key={type} value={type} className="bg-[#0c122b]">{t(`prop.types.${type}`)}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
              </div>
            </div>

            {/* Price Min */}
            <div className="space-y-3 group">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">{t('prop.filter.budget_min')}</label>
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-white/10"
              />
            </div>

            {/* Price Max */}
            <div className="space-y-3 group">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">{t('prop.filter.budget_max')}</label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleFilterChange}
                placeholder={t('prop.filter.max_ph')}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-white/10"
              />
            </div>

            {/* Surface Min */}
            <div className="space-y-3 group">
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">{t('prop.filter.surface_min')}</label>
              <input
                type="number"
                name="surface_min"
                value={filters.surface_min}
                onChange={handleFilterChange}
                placeholder={t('prop.filter.surface_ph')}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-indigo-400 outline-none transition-all placeholder:text-white/10"
              />
            </div>

            {/* Search Action */}
            <button 
              onClick={fetchProperties}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-3.5 flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              {t('prop.filter.submit')}
            </button>
          </div>
        </div>

        {/* Sorting and Results count bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 px-2 gap-4">
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
             <span className="text-indigo-400 text-lg mr-2">{pagination.total}</span> {t('prop.list.results')}
           </div>
           <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/40">
             {t('prop.list.sort_by')}
             <select className="bg-transparent border-none outline-none text-white font-black cursor-pointer hover:text-indigo-400 transition-colors">
               <option className="bg-[#0c122b]">{t('prop.sort.newest')}</option>
               <option className="bg-[#0c122b]">{t('prop.sort.price_asc')}</option>
               <option className="bg-[#0c122b]">{t('prop.sort.price_desc')}</option>
             </select>
           </div>
        </div>

        {/* Results Area */}
        <main className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <div key={i} className="aspect-[4/5] bg-white/5 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="py-32 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">{t('prop.list.no_results')}</p>
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
                    <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden hover:border-indigo-400/40 transition-all duration-300 hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-indigo-500/10">
                      {/* Image Area */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : defaultImage} 
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c122b]/90 via-transparent to-transparent"></div>
                        
                        {/* Transaction Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest backdrop-blur-md border ${
                            property.transaction_type === 'sale' 
                              ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' 
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {property.transaction_type === 'sale' ? t('prop.card.sale') : t('prop.card.rent')}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-2">
                          <MapPinIcon className="w-3 h-3" />
                          {t(property.city)}
                        </div>
                        
                        <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1 mb-4 group-hover:text-indigo-400 transition-colors">
                          {t(property.title)}
                        </h3>

                        <div className="flex items-center gap-5 text-white/30 text-[10px] font-medium mb-6">
                          <div className="flex items-center gap-1.5">
                            <ArrowsRightLeftIcon className="w-3.5 h-3.5 text-indigo-400/40" />
                            {property.surface} m²
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BuildingOfficeIcon className="w-3.5 h-3.5 text-indigo-400/40" />
                            {property.rooms} p.
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="text-lg font-black text-white">
                            {property.price?.toLocaleString()} <span className="text-[10px] text-white/30 ml-0.5">{t('prop.card.price_unit')}</span>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300">
                            <ChevronDownIcon className="w-3.5 h-3.5 text-indigo-500 group-hover:text-white -rotate-90" />
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
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white hover:border-indigo-500 disabled:opacity-10 transition-all"
              >
                &larr;
              </button>
              <div className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black tracking-widest uppercase">
                {t('common.page')} {pagination.currentPage} / {pagination.lastPage}
              </div>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.lastPage}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white hover:border-indigo-500 disabled:opacity-10 transition-all"
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