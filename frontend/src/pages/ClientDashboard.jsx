import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { toast } from 'react-toastify';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  BellIcon, 
  HeartIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  KeyIcon,
  TagIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import StatsCard from '../components/Common/StatsCard';

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

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { favoritesCount } = useFavorites();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ 
    activeRequests: 0, 
    activeContracts: 0, 
    totalPayments: 0, 
    favoriteProperties: 0 
  });
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState(null);

  useEffect(() => {
    loadAllData();
    
    // Polling toutes les 15 secondes pour rafraichir les statuts
    const interval = setInterval(() => {
      loadRequests();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadRequests(),
      loadContracts()
    ]);
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([
      loadRequests(),
      loadContracts()
    ]);
    setRefreshing(false);
    toast.success(t('common.data_refreshed', 'Données actualisées'));
  };

  const loadRequests = async () => {
    setRequestsLoading(true);
    setRequestsError(null);
    try {
      const response = await requestService.getMyRequests();
      // The service returns response.data (axios), which is the JSON body { success, data }
      const body = response?.data ?? response;
      if (body?.success) {
        const data = body.data || [];
        setRequests(data);
        setStats(prev => ({ 
          ...prev, 
          activeRequests: data.filter(r => r.status === 'pending').length 
        }));
      } else if (response?.success) {
        // Fallback: service already unwrapped response.data
        const data = response.data || [];
        setRequests(data);
        setStats(prev => ({ 
          ...prev, 
          activeRequests: data.filter(r => r.status === 'pending').length 
        }));
      } else {
        setRequestsError((body || response)?.message || 'Erreur lors du chargement des demandes');
      }
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
      setRequestsError('Erreur de chargement');
    } finally {
      setRequestsLoading(false);
    }
  };

  const loadContracts = async () => {
    try {
      const response = await contractService.getMyContracts();
      if (response.success) {
        const data = response.data.data || [];
        setContracts(data);
        const activeContracts = data.filter(c => c.status === 'active');
        const total = activeContracts.reduce((sum, c) => sum + (parseFloat(c.monthly_rent) || 0), 0);
        setStats(prev => ({ 
          ...prev, 
          activeContracts: activeContracts.length,
          totalPayments: total
        }));
      }
    } catch (error) {
      console.error('Erreur chargement contrats:', error);
    }
  };

  const cancelRequest = async (id) => {
    if (!window.confirm(t('client.requests.cancel_confirm'))) return;
    try {
      const response = await requestService.cancel(id);
      if (response.success) {
        toast.success(t('client.requests.cancelled_success'));
        loadRequests();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(t('profile.update_error', 'Erreur'));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-500', label: t('common.status.pending'), icon: ClockIcon },
      approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('common.status.approved'), icon: CheckCircleIcon },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: t('common.status.rejected'), icon: XCircleIcon },
      cancelled: { bg: 'bg-bg-card border border-border-main', text: 'text-text-muted', label: t('common.status.cancelled'), icon: XCircleIcon },
      finalized: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-500', label: t('common.status.finalized', 'Finalisée'), icon: CheckCircleIcon },
      active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('common.status.active'), icon: CheckCircleIcon },
      terminated: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: t('common.status.terminated'), icon: XCircleIcon },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const getRequestTypeBadge = (type) => {
    if (type === 'rent') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500">
          <KeyIcon className="w-3.5 h-3.5" />
          {t('prop.filter.rent')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500">
        <TagIcon className="w-3.5 h-3.5" />
        {t('prop.filter.sale')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-border-main border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-text-sub font-medium animate-pulse">{t('client.dashboard.loading')}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-20 ${
      theme === 'light' ? 'bg-slate-50' : 'bg-[#050a1f]'
    }`}>
      {/* Top Banner with Luxury Gradient */}
      <div className="relative h-[300px] md:h-[400px] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`absolute top-0 left-0 w-full h-full ${
            theme === 'light' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700' 
              : 'bg-gradient-to-r from-blue-900 to-[#050a1f]'
          }`}></div>
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L100 0 L100 100 Z" fill="currentColor" className="text-white" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <RevealOnScroll>
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
              {t('dash.client.portal', 'Portail Client')}
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">
              {t('dash.client.welcome')}, <span className="text-blue-400">{user?.name}</span>
            </h1>
            <p className="text-white/60 text-lg font-light max-w-2xl leading-relaxed">
              {t('client.dashboard.subtitle', 'Gérez vos demandes et contrats depuis votre espace personnel.')}
            </p>
          </RevealOnScroll>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        {/* Navigation Tabs - Sleeker Underlined Style */}
        <div className={`mb-12 border-b transition-colors duration-500 ${
          theme === 'light' ? 'border-slate-200' : 'border-white/10'
        }`}>
          <div className="flex flex-wrap gap-8 rtl:flex-row-reverse">
            {[
              { id: 'dashboard', label: t('nav.dashboard'), icon: HomeIcon },
              { id: 'requests', label: t('client.requests.history'), icon: ClipboardDocumentListIcon || BellIcon },
              { id: 'contracts', label: t('client.contracts.active_title'), icon: DocumentTextIcon },
              { id: 'payments', label: t('common.payments', 'Paiements'), icon: CurrencyDollarIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'payments') {
                    navigate('/payments/history');
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`relative pb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  activeTab === tab.id 
                    ? (theme === 'light' ? 'text-blue-600' : 'text-blue-400') 
                    : (theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-white/40 hover:text-white')
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-current"
                  />
                )}
              </button>
            ))}
            
            <div className="ms-auto flex items-center gap-4 pb-4">
              <button 
                onClick={refreshData}
                disabled={refreshing}
                className={`p-2 transition-all ${
                  refreshing ? 'animate-spin' : ''
                } ${theme === 'light' ? 'text-slate-400 hover:text-blue-600' : 'text-white/40 hover:text-blue-400'}`}
                title={t('common.refresh')}
              >
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in relative z-10">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <RevealOnScroll>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title={t('dash.stats.pending_requests')} value={stats.activeRequests} icon={BellIcon} color="blue" />
                <StatsCard title={t('dash.stats.active_contracts')} value={stats.activeContracts} icon={DocumentTextIcon} color="green" />
                <StatsCard title={t('client.dashboard.stats.expenses')} value={`${stats.totalPayments.toLocaleString()} DH`} icon={CurrencyDollarIcon} color="amber" />
                <StatsCard title={t('client.dashboard.stats.favorites')} value={favoritesCount} icon={HeartIcon} color="rose" />
                </div>
              </RevealOnScroll>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <RevealOnScroll delay={100} className="lg:col-span-2">
                  <div className={`p-8 shadow-2xl border transition-all duration-500 rounded-lg ${
                    theme === 'light' ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10 backdrop-blur-xl'
                  }`}>
                    <div className="flex justify-between items-center mb-10">
                      <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                        theme === 'light' ? 'text-slate-400' : 'text-white/30'
                      }`}>
                        {t('client.requests.recent')}
                      </h2>
                      <button 
                        onClick={() => setActiveTab('requests')} 
                        className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline"
                      >
                        {t('client.requests.view_all')}
                      </button>
                    </div>
                    <div className="space-y-4">
                      {requests.slice(0, 3).map(request => (
                        <div key={request.id} className={`flex items-center justify-between p-6 border transition-all group hover:border-blue-500/50 rounded-lg ${
                          theme === 'light' ? 'bg-slate-50/50 border-slate-100' : 'bg-white/5 border-white/5'
                        }`}>
                          <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 flex items-center justify-center border transition-colors rounded-lg ${
                              theme === 'light' ? 'bg-white border-slate-100 text-blue-600' : 'bg-white/5 border-white/10 text-blue-400'
                            }`}>
                              <HomeIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <p className={`font-bold tracking-tight mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                {request.property?.title ? t(request.property.title) : ''}
                              </p>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${
                                theme === 'light' ? 'text-slate-400' : 'text-white/30'
                              }`}>
                                {request.property?.city} • {getRequestTypeBadge(request.type).props.children[1]}
                              </p>
                            </div>
                          </div>
                          <div className="text-end">
                             {getStatusBadge(request.status)}
                          </div>
                        </div>
                      ))}
                      {requests.length === 0 && (
                        <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-white/5">
                          <p className="text-sm text-slate-400 italic">{t('client.requests.no_data')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll delay={200}>
                  <div className={`p-8 shadow-2xl border transition-all duration-500 h-full rounded-lg ${
                    theme === 'light' ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10 backdrop-blur-xl'
                  }`}>
                    <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-10 ${
                      theme === 'light' ? 'text-slate-400' : 'text-white/30'
                    }`}>
                      {t('client.support.title')}
                    </h2>
                    <div className="space-y-4">
                      <Link to="/contact" className={`flex items-center gap-4 p-6 border transition-all group rounded-lg ${
                        theme === 'light' ? 'bg-slate-50/50 border-slate-100 hover:border-blue-500/50' : 'bg-white/5 border-white/5 hover:border-blue-500/50'
                      }`}>
                         <div className={`w-12 h-12 flex items-center justify-center transition-colors rounded-lg ${
                           theme === 'light' ? 'bg-white border-slate-100 text-blue-600' : 'bg-white/5 border-white/10 text-blue-400'
                         }`}>
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
                         </div>
                         <div>
                            <p className={`text-sm font-bold tracking-tight mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                              {t('client.support.need_help')}
                            </p>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${
                              theme === 'light' ? 'text-slate-400' : 'text-white/30'
                            }`}>
                              {t('client.support.contact')}
                            </p>
                         </div>
                      </Link>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <RevealOnScroll>
              <div className={`shadow-2xl border transition-all duration-500 rounded-lg overflow-hidden ${
                theme === 'light' ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10 backdrop-blur-xl'
              }`}>
               <div className={`p-8 border-b transition-colors ${
                 theme === 'light' ? 'border-slate-100' : 'border-white/5'
               }`}>
                  <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                    theme === 'light' ? 'text-slate-400' : 'text-white/30'
                  }`}>
                    {t('request.title')}
                  </h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className={`border-b transition-colors ${
                       theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'
                     }`}>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('client.table.id')}</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('client.table.property')}</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">{t('client.table.status')}</th>
                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t('client.table.actions')}</th>
                     </tr>
                   </thead>
                   <tbody className={`divide-y transition-colors ${
                     theme === 'light' ? 'divide-slate-100' : 'divide-white/5'
                   }`}>
                     {requests.map(request => (
                       <tr key={request.id} className={`transition-colors ${
                         theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/5'
                       }`}>
                         <td className="p-8 text-[10px] font-black tracking-tighter text-slate-400">#{request.id}</td>
                         <td className="p-8">
                           <p className={`font-bold tracking-tight mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                             {request.property?.title ? t(request.property.title) : ''}
                           </p>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${
                             theme === 'light' ? 'text-slate-400' : 'text-white/30'
                           }`}>
                             {request.property?.city}
                           </p>
                         </td>
                          <td className="p-8 text-center">
                             {getStatusBadge(request.status)}
                             {request.status === 'rejected' && request.rejection_reason && (
                               <p className="text-[10px] text-red-500 mt-2 font-light italic max-w-[200px] mx-auto line-clamp-2" title={request.rejection_reason}>
                                 "{request.rejection_reason}"
                               </p>
                             )}
                          </td>
                          <td className="p-8 text-right">
                             <div className="flex flex-col items-end gap-3">
                                <div className="flex gap-6">
                                  <Link to={`/properties/${request.property_id}`} className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline">{t('client.requests.details')}</Link>
                                  {request.status === 'pending' && (
                                    <button onClick={() => cancelRequest(request.id)} className="text-rose-500 text-[10px] font-black uppercase tracking-widest hover:underline">{t('client.requests.cancel')}</button>
                                  )}
                                </div>
                                {request.status === 'approved' && (
                                   <Link 
                                     to={`/properties/${request.property_id}/payment`} 
                                     state={{ property: request.property, request: request }}
                                     className="px-6 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                   >
                                     {t('client.requests.pay_now')}
                                   </Link>
                                 )}
                             </div>
                          </td>
                        </tr>
                     ))}
                   </tbody>
                  </table>
                </div>
              </div>
            </RevealOnScroll>
          )}

          {activeTab === 'contracts' && (
            <RevealOnScroll>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {contracts.map((contract, i) => (
                   <RevealOnScroll key={contract.id} delay={i * 100}>
                     <div className={`shadow-2xl border transition-all duration-500 group h-full rounded-lg p-8 ${
                       theme === 'light' ? 'bg-white border-slate-100 hover:border-blue-500/50' : 'bg-white/5 border-white/10 hover:border-blue-500/50'
                     }`}>
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className={`text-xl font-bold tracking-tight mb-1 transition-colors group-hover:text-blue-500 ${
                          theme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}>
                          {contract.property?.title ? t(contract.property.title) : ''}
                        </h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${
                          theme === 'light' ? 'text-slate-400' : 'text-white/30'
                        }`}>
                          {contract.property?.address}
                        </p>
                      </div>
                      {getStatusBadge(contract.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-10">
                       <div className={`p-6 border transition-colors rounded-lg ${
                         theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'
                       }`}>
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
                            theme === 'light' ? 'text-slate-400' : 'text-white/30'
                          }`}>
                            {t('client.contracts.monthly_rent')}
                          </p>
                          <p className={`text-xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            {contract.monthly_rent?.toLocaleString()} <span className="text-xs">DH</span>
                          </p>
                       </div>
                       <div className={`p-6 border transition-colors rounded-lg ${
                         theme === 'light' ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'
                       }`}>
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
                            theme === 'light' ? 'text-slate-400' : 'text-white/30'
                          }`}>
                            {t('client.contracts.sign_date')}
                          </p>
                          <p className={`text-xl font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                            {new Date(contract.start_date).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                    <Link 
                      to={`/contracts/${contract.id}`} 
                      className="block w-full py-4 bg-blue-600 text-white text-center text-[10px] font-black uppercase tracking-[0.3em] rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                    >
                      {t('client.contracts.view')}
                    </Link>
                   </div>
                 </RevealOnScroll>
               ))}
               {contracts.length === 0 && (
                  <div className={`col-span-full py-24 text-center border-2 border-dashed rounded-lg ${
                    theme === 'light' ? 'border-slate-100' : 'border-white/5'
                  }`}>
                     <p className="text-slate-400 font-light italic">{t('client.contracts.no_data')}</p>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
