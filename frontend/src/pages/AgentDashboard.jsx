import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { dashboardService } from '../services/dashboard';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  BellIcon, 
  UserIcon, 
  PlusIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  HomeIcon, 
  MapPinIcon, 
  CalendarIcon, 
  DocumentDuplicateIcon,
  ArrowPathIcon,
  KeyIcon,
  TagIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import StatsCard from '../components/Common/StatsCard';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import RevenueChart from '../components/Dashboard/RevenueChart';

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
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const AgentDashboard = () => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ 
    totalProperties: 0, 
    availableProperties: 0, 
    pendingRequests: 0, 
    activeContracts: 0, 
    monthlyRevenue: 0,
    pendingReviews: 0,
    revenueChartData: []
  });
  const [requestFilter, setRequestFilter] = useState('all'); // all, pending, processed
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Load on mount AND whenever coming back from contract creation
  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (location.search.includes('refresh')) {
      loadAllData();
    }
  }, [location.search]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadBackendStats(),
      loadProperties(),
      loadRequests(),
      loadContracts(),
      loadPendingReviews()
    ]);
    setLoading(false);
  };

  const loadBackendStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.success) {
        const data = response.data;
        setStats({
          totalProperties: data.my_properties?.total || 0,
          availableProperties: data.my_properties?.available || 0,
          pendingRequests: data.requests?.pending || 0,
          activeContracts: data.contracts?.managed || 0,
          monthlyRevenue: parseFloat(data.revenue_managed) || 0,
          revenueChartData: data.charts?.revenue_by_month || []
        });
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([
      loadBackendStats(),
      loadProperties(),
      loadRequests(),
      loadContracts(),
      loadPendingReviews()
    ]);
    setRefreshing(false);
    toast.success(t('agent.toast.data_refresh'));
  };

  const loadProperties = async () => {
    try {
      const response = await propertyService.getMyProperties();
      if (response.success) {
        // Le service renvoie déjà response.data, qui contient l'objet {success, data: [...]}
        // Donc response.data ici est le tableau
        const items = response.data || [];
        setProperties(items);
      }
    } catch (error) {
      console.error('Erreur chargement biens:', error);
      toast.error(t('agent.toast.prop_err'));
    }
  };

  const loadRequests = async () => {
    try {
      const response = await requestService.getAll();
      if (response.success) {
        const items = response.data || [];
        setRequests(items);
      }
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    }
  };

  const loadContracts = async () => {
    try {
      const response = await contractService.getAgentContracts();
      if (response.success) {
        let items = response.data || [];
        
        items = items.map(contract => ({
          ...contract,
          monthly_rent: parseFloat(contract.monthly_rent) || 0,
          charges: parseFloat(contract.charges) || 0
        }));
        
        setContracts(items);
      }
    } catch (error) {
      console.error('Erreur chargement contrats:', error);
    }
  };

  const loadPendingReviews = async () => {
    try {
      const response = await propertyService.getAgentPendingReviews();
      if (response.success) {
        setReviews(response.data || []);
        setStats(prev => ({ ...prev, pendingReviews: response.data?.length || 0 }));
      }
    } catch (error) {
      console.error('Erreur chargement avis:', error);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm(t('agent.toast.prop_del_conf'))) {
      try {
        await propertyService.delete(id);
        toast.success(t('agent.toast.prop_del_suc'));
        loadProperties();
      } catch (error) {
        toast.error(t('agent.toast.prop_del_err'));
      }
    }
  };

  const handleProcessRequest = async (requestId, status, reason = null) => {
    try {
      const response = await requestService.process(requestId, {
        status,
        rejection_reason: reason
      });
      
      if (response.success) {
        toast.success(status === 'approved' ? t('agent.toast.req_appr') : t('agent.toast.req_rej'));
        setShowRejectModal(false);
        setRejectionReason('');

        // Rafraîchir toutes les données pour garantir la cohérence (stats, listes, etc.)
        await loadAllData();
        
        if (status === 'approved') {
          // Attendre un court instant pour que l'utilisateur voie le changement avant de naviguer
          setTimeout(() => {
            navigate(`/contracts/new?request=${requestId}`);
          }, 1000);
        }
      } else {
        toast.error(response.message || t('agent.toast.req_err'));
      }
    } catch (error) {
      console.error('Erreur traitement demande:', error);
      toast.error(t('agent.toast.req_err_2'));
    }
  };

  const openRejectModal = (id) => {
    setSelectedRequestId(id);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleProcessReview = async (reviewId, status) => {
    if (!window.confirm(status === 'approved' ? t('agent.reviews.approve_confirm') : t('agent.reviews.reject_confirm'))) return;

    try {
      const response = await propertyService.processReview(reviewId, status);
      if (response.success) {
        toast.success(response.message);
        loadPendingReviews();
      }
    } catch (error) {
      toast.error(t('agent.toast.rev_err'));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('prop.status.available'), icon: CheckCircleIcon },
      rented: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: t('prop.status.rented'), icon: XCircleIcon },
      reserved: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-500', label: t('prop.status.reserved'), icon: ClockIcon },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-500', label: t('common.status.pending'), icon: ClockIcon },
      approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('common.status.approved'), icon: CheckCircleIcon },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: t('common.status.rejected'), icon: XCircleIcon },
      active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('common.status.active'), icon: CheckCircleIcon },
      terminated: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: t('common.status.terminated'), icon: XCircleIcon },
      completed: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-500', label: t('common.status.completed'), icon: CheckCircleIcon },
      finalized: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-500', label: t('common.status.finalized', 'Finalisée'), icon: CheckCircleIcon }
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

  const getContractTypeBadge = (type) => {
    if (type === 'rent') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500">
          <KeyIcon className="w-3.5 h-3.5" />
          {t('prop.filter.rent')}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500">
          <TagIcon className="w-3.5 h-3.5" />
          {t('prop.filter.sale')}
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-text-muted">
        <div className="w-12 h-12 border-4 border-border-main border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-medium animate-pulse">{t('agent.loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-70px)] bg-bg-soft">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-bg-card border-e border-border-main flex flex-col transition-colors duration-300 md:sticky md:top-[70px] md:h-[calc(100vh-70px)] overflow-y-auto shrink-0 shadow-sm z-10">
        <div className="p-6 border-b border-border-main flex flex-col items-center text-center">
           <div className="w-24 h-24 overflow-hidden bg-gradient-to-tr from-primary to-blue-400 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-lg border-4 border-bg-card mb-4">
            {user?.profile_photo ? (
                <img 
                    src={`http://localhost:8000/storage/${user.profile_photo}`} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                />
            ) : (
                user?.name?.charAt(0)
            )}
          </div>
          <h3 className="text-xl font-black text-text-main truncate w-full">{user?.name}</h3>
          <p className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-full text-[10px] font-black uppercase tracking-widest">
            <UserIcon className="w-3.5 h-3.5" /> {t('agent.badges.agent')}
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-primary dark:bg-secondary !text-white dark:!text-primary shadow-main' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <BuildingOfficeIcon className="w-5 h-5" /> <span className={activeTab === 'dashboard' ? '' : (theme === 'light' ? '!text-black' : 'text-text-sub')}>{t('nav.dashboard')}</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${activeTab === 'properties' ? 'bg-primary dark:bg-secondary !text-white dark:!text-primary shadow-main' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <HomeIcon className="w-5 h-5" /> {t('nav.properties')}
            {stats.totalProperties > 0 && <span className="absolute end-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-bg-soft text-text-main text-xs rounded-full font-bold">{stats.totalProperties}</span>}
          </button>

          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${activeTab === 'requests' ? 'bg-primary dark:bg-secondary !text-white dark:!text-primary shadow-main' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <DocumentTextIcon className="w-5 h-5" /> {t('dash.stats.pending_requests')}
            {stats.pendingRequests > 0 && <span className="absolute end-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-bold">{stats.pendingRequests}</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'contracts' ? 'bg-primary dark:bg-secondary !text-white dark:!text-primary shadow-main' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <DocumentDuplicateIcon className="w-5 h-5" /> {t('dash.stats.active_contracts')}
          </button>

          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${activeTab === 'reviews' ? 'bg-primary dark:bg-secondary !text-white dark:!text-primary shadow-main' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" /> {t('agent.reviews.title')}
            {stats.pendingReviews > 0 && <span className="absolute end-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-rose-500 text-white text-xs rounded-full font-bold">{stats.pendingReviews}</span>}
          </button>

          <button 
            onClick={() => navigate('/payments/history')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-text-sub hover:bg-bg-soft hover:text-text-main`}
          >
            <CurrencyDollarIcon className="w-5 h-5" /> {t('common.payments')}
          </button>
        </nav>
        
        <div className="p-4 border-t border-border-main">
          <Link to="/properties/new" className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary !text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-md">
            <PlusIcon className="w-5 h-5" /> {t('common.save')}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-main tracking-tight">{t('agent.dashboard.welcome')}</h1>
            <p className="text-sm text-text-sub mt-1">{t('agent.dashboard.subtitle')}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshData} 
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-bg-card text-text-sub hover:text-primary hover:bg-primary/5 border border-border-main rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow-md"
            >
              <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
               {refreshing ? t('common.loading') : t('agent.dashboard.refresh')}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <RevealOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatsCard 
            title={t('home.stats.properties')} 
            value={stats.totalProperties} 
            icon={BuildingOfficeIcon} 
            color="indigo"
          />
          <StatsCard 
            title={t('prop.status.available')} 
            value={stats.availableProperties} 
            icon={HomeIcon} 
            color="green"
          />
          <StatsCard 
            title={t('dash.stats.pending_requests')} 
            value={stats.pendingRequests} 
            icon={DocumentTextIcon} 
            color="amber"
          />
          <StatsCard 
            title={t('dash.stats.total_rent')} 
            value={`${stats.monthlyRevenue.toLocaleString()} DH`} 
            icon={CurrencyDollarIcon} 
            color="blue"
          />
          </div>
        </RevealOnScroll>

        {/* Dashboard Tab */}
        <div className="animate-fade-in relative z-10">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <RevealOnScroll delay={100}>
              <div className="h-96">
                <RevenueChart data={stats.revenueChartData || []} title={t('agent.dashboard.evolution', 'Evolution du travail')} />
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dernières Demandes */}
              <RevealOnScroll delay={200}>
                <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-all duration-500 p-6 overflow-hidden h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <BellIcon className="w-5 h-5 text-amber-500" />
                    {t('dash.stats.pending_requests')}
                  </h2>
                  <button onClick={() => setActiveTab('requests')} className="text-sm font-semibold text-primary hover:underline">
                    {t('agent.dashboard.see_all')}
                  </button>
                </div>
                
                <div className="space-y-4">
                  {requests.filter(r => r.status?.toLowerCase() === 'pending').slice(0, 3).map(request => (
                    <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-bg-soft rounded-xl border border-border-main gap-4">
                       <div>
                         <h4 className="font-bold text-text-main text-sm">{request.user?.name || t('agent.requests.client_unknown')}</h4>
                         <p className="text-xs text-text-muted mb-1">{request.property?.title ? t(request.property.title) : ''}</p>
                       </div>
                       <div className="flex gap-2 text-right">
                         <button onClick={() => handleProcessRequest(request.id, 'approved')} className="text-xs font-bold text-green-600 hover:underline">{t('common.approve')}</button>
                         <button onClick={() => openRejectModal(request.id)} className="text-xs font-bold text-red-600 hover:underline">{t('common.reject')}</button>
                       </div>
                    </div>
                  ))}
                  {requests.filter(r => r.status?.toLowerCase() === 'pending').length === 0 && (
                    <div className="p-6 text-center text-text-muted border-2 border-dashed border-border-main rounded-xl">
                      {t('agent.requests.no_data')}
                    </div>
                  )}
                </div>
              </section>
             </RevealOnScroll>

              {/* Derniers Contrats */}
              <RevealOnScroll delay={300}>
                <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-all duration-500 p-6 overflow-hidden h-full">
                 <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <DocumentDuplicateIcon className="w-5 h-5 text-blue-500" />
                    {t('dash.stats.active_contracts')}
                  </h2>
                </div>

                <div className="space-y-4">
                  {contracts.slice(0, 3).map(contract => (
                    <div key={contract.id} className="flex items-center justify-between p-4 bg-bg-soft rounded-xl border border-border-main">
                       <div>
                         <h4 className="font-bold text-text-main text-sm">{contract.property?.title ? t(contract.property.title) : ''}</h4>
                         <p className="text-xs text-text-muted mt-1">{t('agent.contracts.table.tenant')}: {contract.tenant?.name}</p>
                       </div>
                       <div className="text-right">
                         <div className="font-bold text-text-main text-sm">{contract.monthly_rent?.toLocaleString()} DH</div>
                         <div className="mt-1">{getStatusBadge(contract.status)}</div>
                       </div>
                    </div>
                  ))}
                  {contracts.length === 0 && (
                    <div className="p-6 text-center text-text-muted border-2 border-dashed border-border-main rounded-xl">
                      {t('agent.contracts.no_data')}
                    </div>
                  )}
                </div>
              </section>
             </RevealOnScroll>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
             <div className="p-6 border-b border-border-main flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-soft">
                <h2 className="text-lg font-bold text-text-main">{t('agent.properties.title')}</h2>
                <Link to="/properties/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-lg text-sm font-bold shadow-md transition-colors">
                  <PlusIcon className="w-4 h-4" /> {t('agent.properties.add')}
                </Link>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-bg-soft border-b border-border-main text-xs uppercase tracking-wider text-text-muted">
                      <th className="p-4 font-semibold">{t('agent.properties.table.title')}</th>
                      <th className="p-4 font-semibold">{t('agent.properties.table.attrs')}</th>
                      <th className="p-4 font-semibold text-right">{t('prop.details.price')}</th>
                      <th className="p-4 font-semibold text-center">{t('common.status')}</th>
                      <th className="p-4 font-semibold text-right">{t('common.actions')}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border-main">
                   {properties.map(property => (
                     <tr key={property.id} className="hover:bg-bg-soft/50 transition-colors">
                       <td className="p-4">
                         <div className="font-bold text-text-main text-sm line-clamp-1">{property.title ? t(property.title) : ''}</div>
                         <div className="text-xs text-text-muted mt-1 flex items-center gap-1">
                           <MapPinIcon className="w-3 h-3" /> {property.city}
                         </div>
                       </td>
                       <td className="p-4">
                          <div className="text-xs text-text-main bg-bg-soft px-2 py-1 rounded inline-block border border-border-main">
                            {property.surface} m² • {property.rooms} {t('prop.filter.rooms')}
                          </div>
                       </td>
                       <td className="p-4 text-sm font-bold text-text-main text-right">
                         {(property.price || 0).toLocaleString()} {t('prop.currency')}
                       </td>
                       <td className="p-4 text-center">{getStatusBadge(property.status)}</td>
                       <td className="p-4 text-right">
                         <div className="flex justify-end gap-2">
                           <Link to={`/properties/${property.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                             <EyeIcon className="w-5 h-5" />
                           </Link>
                           <Link to={`/properties/edit/${property.id}`} className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors">
                             <PencilIcon className="w-5 h-5" />
                           </Link>
                           <button onClick={() => handleDeleteProperty(property.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                             <TrashIcon className="w-5 h-5" />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                   {properties.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-text-muted">{t('agent.properties.no_data')}</td>
                      </tr>
                   )}
                 </tbody>
               </table>
             </div>
            </section>
          </RevealOnScroll>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
            <div className="p-6 border-b border-border-main flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-soft">
              <h2 className="text-lg font-bold text-text-main">{t('agent.requests.title')}</h2>
              <div className="flex bg-bg-card p-1 rounded-xl border border-border-main">
                {[
                  { id: 'all', label: t('agent.filters.all') },
                  { id: 'pending', label: t('agent.filters.pending') },
                  { id: 'processed', label: t('agent.filters.processed') }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setRequestFilter(filter.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      requestFilter === filter.id 
                        ? 'bg-primary !text-white' 
                        : 'text-text-sub hover:text-text-main'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-soft border-b border-border-main text-xs uppercase tracking-wider text-text-muted">
                    <th className="p-4 font-semibold">{t('agent.requests.table.client')}</th>
                    <th className="p-4 font-semibold">{t('agent.requests.table.property')}</th>
                    <th className="p-4 font-semibold">{t('agent.requests.table.date')}</th>
                    <th className="p-4 font-semibold text-center">{t('common.status')}</th>
                    <th className="p-4 font-semibold text-right">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  {requests
                    .filter(r => {
                      if (requestFilter === 'pending') return r.status === 'pending';
                      if (requestFilter === 'processed') return r.status === 'approved' || r.status === 'rejected';
                      return true;
                    })
                    .map(request => (
                    <tr key={request.id} className="hover:bg-bg-soft/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-text-main text-sm">{request.user?.name}</div>
                        <div className="text-xs text-text-muted">{request.user?.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-text-main font-medium">{request.property?.title ? t(request.property.title) : ''}</div>
                        <div className="text-xs text-text-muted">{request.property?.city}</div>
                      </td>
                      <td className="p-4 text-sm text-text-sub">
                        {new Date(request.created_at).toLocaleDateString(t('common.locale', 'fr-FR'))}
                      </td>
                      <td className="p-4 text-center">
                        {getStatusBadge(request.status)}
                        {request.status === 'rejected' && request.rejection_reason && (
                          <p className="text-[10px] text-red-500 mt-1 italic max-w-[150px] mx-auto line-clamp-1" title={request.rejection_reason}>
                            {request.rejection_reason}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {request.status === 'pending' ? (
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => handleProcessRequest(request.id, 'approved')}
                              className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                              <CheckCircleIcon className="w-4 h-4" /> {t('common.approve')}
                            </button>
                            <button 
                              onClick={() => openRejectModal(request.id)}
                              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <XCircleIcon className="w-4 h-4" /> {t('common.reject')}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-text-muted italic">{t('agent.requests.processed_at')}{new Date(request.processed_at || request.updated_at).toLocaleDateString(t('common.locale', 'fr-FR'))}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-text-muted">{t('agent.requests.no_data')}</td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </section>
          </RevealOnScroll>
        )}
        {/* Contracts Tab - Full View */}
        {activeTab === 'contracts' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
             <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-soft">
                <h2 className="text-lg font-bold text-text-main">{t('agent.contracts.title')}</h2>
                <span className="text-sm text-text-muted">{stats.activeContracts}{t('agent.contracts.active_count')}</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-bg-soft border-b border-border-main text-xs uppercase tracking-wider text-text-muted">
                    <th className="p-4 font-semibold">{t('agent.contracts.table.property')}</th>
                    <th className="p-4 font-semibold">{t('agent.contracts.table.tenant')}</th>
                    <th className="p-4 font-semibold text-right">{t('agent.contracts.table.rent')}</th>
                    <th className="p-4 font-semibold text-center">{t('common.status')}</th>
                    <th className="p-4 font-semibold text-right">{t('common.actions')}</th>
                  </tr>
                 </thead>
                 <tbody className="divide-y divide-border-main">
                   {contracts.map(contract => (
                     <tr key={contract.id} className="hover:bg-bg-soft/50 transition-colors">
                       <td className="p-4">
                         <div className="font-bold text-text-main text-sm">{contract.property?.title ? t(contract.property.title) : ''}</div>
                         <div className="text-xs text-text-muted mt-1">{contract.property?.city}</div>
                       </td>
                       <td className="p-4">
                         <div className="text-sm text-text-main">{contract.tenant?.name}</div>
                       </td>
                       <td className="p-4 text-sm font-bold text-text-main text-right">
                         {(contract.monthly_rent || 0).toLocaleString()} {t('prop.currency')}
                       </td>
                       <td className="p-4 text-center">{getStatusBadge(contract.status)}</td>
                       <td className="p-4 text-right">
                          <Link to={`/contracts/${contract.id}`} className="text-xs font-semibold text-primary hover:underline">
                            {t('admin.properties.table.details', 'Voir détails')}
                          </Link>
                       </td>
                     </tr>
                   ))}
                    {contracts.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-text-muted">{t('agent.contracts.no_data')}</td>
                      </tr>
                   )}
                  </tbody>
                </table>
              </div>
            </section>
          </RevealOnScroll>
        )}

        {/* Reviews Moderation Tab */}
        {activeTab === 'reviews' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-soft">
              <h2 className="text-lg font-bold text-text-main">{t('agent.reviews.title')}</h2>
              <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-500 rounded-full text-xs font-bold uppercase">
                {stats.pendingReviews}{t('agent.reviews.pending')}
              </span>
            </div>
            
            <div className="divide-y divide-border-main">
              {reviews.map(review => (
                <div key={review.id} className="p-6 hover:bg-bg-soft/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center font-bold text-text-sub border border-border-main">
                          {review.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-text-main">{review.user?.name}</div>
                          <div className="text-xs text-text-sub flex items-center gap-1">
                            {t('agent.reviews.on')} <span className="font-semibold text-primary">{review.property?.title ? t(review.property.title) : ''}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <StarIconSolid key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-amber-500' : 'text-border-main'}`} />
                          ))}
                        </div>
                        <p className="text-text-sub text-sm italic leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                      
                      <div className="text-xs text-text-muted">
                        {t('agent.reviews.posted_on')} {new Date(review.created_at).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                      <button 
                        onClick={() => handleProcessReview(review.id, 'approved')}
                        className="flex-1 px-4 py-2 bg-green-500 !text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircleIcon className="w-4 h-4" /> {t('common.approve')}
                      </button>
                      <button 
                        onClick={() => handleProcessReview(review.id, 'rejected')}
                        className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <XCircleIcon className="w-4 h-4" /> {t('common.reject')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-bg-soft rounded-full flex items-center justify-center mx-auto mb-6 text-text-muted border border-border-main">
                    <ChatBubbleLeftRightIcon className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-text-main mb-2">{t('agent.reviews.no_data.title')}</h3>
                  <p className="text-text-muted italic">{t('agent.reviews.no_data.desc')}</p>
                </div>
              )}
            </div>
          </section>
         </RevealOnScroll>
        )}

        </div>
      </main>

      {/* Modale de Refus */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card w-full max-w-md rounded-3xl border border-border-main shadow-huge p-8 animate-scale-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-600">
                <XCircleIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-text-main">{t('agent.modals.reject.title')}</h3>
                <p className="text-sm text-text-sub">{t('agent.modals.reject.desc')}</p>
              </div>
            </div>

            <textarea
              className="w-full bg-bg-soft border border-border-main rounded-2xl p-4 text-sm text-text-main focus:ring-2 focus:ring-red-500 outline-none min-h-[120px] mb-6 transition-all"
              placeholder={t('agent.modals.reject.placeholder')}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            ></textarea>

            <div className="flex gap-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 px-4 bg-bg-soft text-text-main font-bold rounded-xl hover:bg-border-main transition-all"
              >
                {t('agent.modals.reject.cancel')}
              </button>
              <button
                onClick={() => handleProcessRequest(selectedRequestId, 'rejected', rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('agent.modals.reject.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;