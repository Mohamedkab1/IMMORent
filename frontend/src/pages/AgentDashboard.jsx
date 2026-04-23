import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { dashboardService } from '../services/dashboard';
import { useLanguage } from '../context/LanguageContext';
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

const AgentDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
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
    pendingReviews: 0
  });

  useEffect(() => {
    loadAllData();
    if (location.search.includes('refresh')) {
      setTimeout(() => loadAllData(), 500);
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
          monthlyRevenue: parseFloat(data.revenue_managed) || 0
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
    toast.success('Données actualisées');
  };

  const loadProperties = async () => {
    try {
      const response = await propertyService.getMyProperties();
      if (response.success) {
        const items = response.data.data || [];
        setProperties(items);
      }
    } catch (error) {
      console.error('Erreur chargement biens:', error);
      toast.error('Erreur lors du chargement des biens');
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
        let items = response.data.data || [];
        
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
      try {
        await propertyService.delete(id);
        toast.success('Bien supprimé avec succès');
        loadProperties();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleProcessRequest = async (requestId, status) => {
    const actionText = status === 'approved' ? 'approuver' : 'refuser';
    if (!window.confirm(`Êtes-vous sûr de vouloir ${actionText} cette demande ?`)) {
      return;
    }

    try {
      let rejectionReason = null;
      if (status === 'rejected') {
        rejectionReason = prompt('Motif du refus :');
        if (!rejectionReason) return;
      }

      const response = await requestService.process(requestId, {
        status,
        rejection_reason: rejectionReason
      });
      
      if (response.success) {
        toast.success(`Demande ${status === 'approved' ? 'approuvée' : 'refusée'} avec succès`);
        
        if (status === 'approved') {
          navigate(`/contracts/new?request=${requestId}`);
        } else {
          loadRequests();
        }
      } else {
        toast.error(response.message || 'Erreur lors du traitement');
      }
    } catch (error) {
      toast.error('Erreur lors du traitement de la demande');
    }
  };

  const handleProcessReview = async (reviewId, status) => {
    const actionText = status === 'approved' ? 'approuver' : 'rejeter';
    if (!window.confirm(`Voulez-vous vraiment ${actionText} cet avis ?`)) return;

    try {
      const response = await propertyService.processReview(reviewId, status);
      if (response.success) {
        toast.success(response.message);
        loadPendingReviews();
      }
    } catch (error) {
      toast.error('Erreur lors du traitement de l\'avis');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('status.available', 'Disponible'), icon: CheckCircleIcon },
      rented: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: t('status.rented', 'Loué'), icon: XCircleIcon },
      reserved: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-500', label: t('status.reserved', 'Réservé'), icon: ClockIcon },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-500', label: t('status.pending', 'En attente'), icon: ClockIcon },
      approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('status.approved', 'Approuvée'), icon: CheckCircleIcon },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: t('status.rejected', 'Refusée'), icon: XCircleIcon },
      active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('status.active', 'Actif'), icon: CheckCircleIcon },
      terminated: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: t('status.terminated', 'Résilié'), icon: XCircleIcon },
      completed: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-500', label: t('status.completed', 'Terminé'), icon: CheckCircleIcon }
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
          Location
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500">
          <TagIcon className="w-3.5 h-3.5" />
          Vente
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-text-muted">
        <div className="w-12 h-12 border-4 border-border-main border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-medium animate-pulse">Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-70px)] bg-bg-soft">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-bg-card border-e border-border-main flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-border-main text-center relative pt-12">
           <div className="w-20 h-20 absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-primary to-blue-400 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-huge border-4 border-bg-card">
            {user?.name?.charAt(0)}
          </div>
          <h3 className="text-xl font-bold text-text-main truncate mt-2">{user?.name}</h3>
          <p className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <UserIcon className="w-3 h-3" /> Agent Immobilier
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-main' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <BuildingOfficeIcon className="w-5 h-5" /> {t('Dashboard')}
          </button>
          
          <button 
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${activeTab === 'properties' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-main' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <HomeIcon className="w-5 h-5" /> {t('nav.properties')}
            {stats.totalProperties > 0 && <span className="absolute end-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-bg-soft text-text-main text-xs rounded-full font-bold">{stats.totalProperties}</span>}
          </button>

          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${activeTab === 'requests' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-main' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <DocumentTextIcon className="w-5 h-5" /> {t('dash.stats.pending_requests')}
            {stats.pendingRequests > 0 && <span className="absolute end-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-bold">{stats.pendingRequests}</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'contracts' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-main' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <DocumentDuplicateIcon className="w-5 h-5" /> {t('dash.stats.active_contracts')}
          </button>

          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${activeTab === 'reviews' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-main' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" /> Modération avis
            {stats.pendingReviews > 0 && <span className="absolute end-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-rose-500 text-white text-xs rounded-full font-bold">{stats.pendingReviews}</span>}
          </button>
        </nav>
        
        <div className="p-4 border-t border-border-main">
          <Link to="/properties/new" className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-md">
            <PlusIcon className="w-5 h-5" /> {t('common.save')}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-main tracking-tight">{t('dash.agent.welcome')}</h1>
            <p className="text-sm text-text-sub mt-1">{t('agent.dashboard.subtitle')}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshData} 
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-bg-card text-text-sub hover:text-primary border border-border-main rounded-lg text-sm font-medium transition-all shadow-main"
            >
              <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
               {refreshing ? t('common.loading') : t('agent.dashboard.refresh', 'Actualiser')}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dernières Demandes */}
              <section className="bg-bg-card rounded-2xl border border-border-main shadow-sm p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
                    <BellIcon className="w-5 h-5 text-amber-500" />
                    {t('dash.stats.pending_requests')}
                  </h2>
                  <button onClick={() => setActiveTab('requests')} className="text-sm font-semibold text-primary hover:underline">
                    {t('agent.dashboard.see_all', 'Tout voir')}
                  </button>
                </div>
                
                <div className="space-y-4">
                  {requests.filter(r => r.status?.toLowerCase() === 'pending').slice(0, 3).map(request => (
                    <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-bg-soft rounded-xl border border-border-main gap-4">
                       <div>
                         <h4 className="font-bold text-text-main text-sm">{request.user?.name || t('agent.requests.client_unknown', 'Client Inconnu')}</h4>
                         <p className="text-xs text-text-muted mb-1">{request.property?.title}</p>
                       </div>
                       <div className="flex gap-2 text-right">
                         <button onClick={() => handleProcessRequest(request.id, 'approved')} className="text-xs font-bold text-green-600 hover:underline">{t('common.approve')}</button>
                         <button onClick={() => handleProcessRequest(request.id, 'rejected')} className="text-xs font-bold text-red-600 hover:underline">{t('common.reject')}</button>
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

              {/* Derniers Contrats */}
              <section className="bg-bg-card rounded-2xl border border-border-main shadow-sm p-6 overflow-hidden">
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
                         <h4 className="font-bold text-text-main text-sm">{contract.property?.title}</h4>
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
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <section className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
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
                         <div className="font-bold text-text-main text-sm line-clamp-1">{property.title}</div>
                         <div className="text-xs text-text-muted mt-1 flex items-center gap-1">
                           <MapPinIcon className="w-3 h-3" /> {property.city}
                         </div>
                       </td>
                       <td className="p-4">
                         <div className="text-xs text-text-main bg-bg-soft px-2 py-1 rounded inline-block border border-border-main">
                           {property.surface} m² • {property.rooms} p.
                         </div>
                       </td>
                       <td className="p-4 text-sm font-bold text-text-main text-right">
                         {(property.price || 0).toLocaleString()} DH
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
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <section className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-main flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-soft">
              <h2 className="text-lg font-bold text-text-main">{t('agent.requests.title')}</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-full text-xs font-bold">
                  {t('agent.requests.pending_count', { count: requests.filter(r => r.status === 'pending').length })}
                </span>
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
                  {requests.map(request => (
                    <tr key={request.id} className="hover:bg-bg-soft/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-text-main text-sm">{request.user?.name}</div>
                        <div className="text-xs text-text-muted">{request.user?.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-text-main font-medium">{request.property?.title}</div>
                        <div className="text-xs text-text-muted">{request.property?.city}</div>
                      </td>
                      <td className="p-4 text-sm text-text-sub">
                        {new Date(request.created_at).toLocaleDateString(language)}
                      </td>
                      <td className="p-4 text-center">{getStatusBadge(request.status)}</td>
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
                              onClick={() => handleProcessRequest(request.id, 'rejected')}
                              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <XCircleIcon className="w-4 h-4" /> {t('common.reject')}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-text-muted italic">{t('agent.requests.processed_at', { date: new Date(request.processed_at || request.updated_at).toLocaleDateString(language) })}</span>
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
        )}
        {/* Contracts Tab - Full View */}
        {activeTab === 'contracts' && (
          <section className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden">
             <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-soft">
                <h2 className="text-lg font-bold text-text-main">{t('agent.contracts.title')}</h2>
                <span className="text-sm text-text-muted">{t('agent.contracts.active_count', { count: stats.activeContracts })}</span>
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
                         <div className="font-bold text-text-main text-sm">{contract.property?.title}</div>
                         <div className="text-xs text-text-muted mt-1">{contract.property?.city}</div>
                       </td>
                       <td className="p-4">
                         <div className="text-sm text-text-main">{contract.tenant?.name}</div>
                       </td>
                       <td className="p-4 text-sm font-bold text-text-main text-right">
                         {(contract.monthly_rent || 0).toLocaleString()} DH
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
        )}

        {/* Reviews Moderation Tab */}
        {activeTab === 'reviews' && (
          <section className="bg-bg-card rounded-2xl border border-border-main shadow-sm overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-soft">
              <h2 className="text-lg font-bold text-text-main">Modération des avis</h2>
              <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-500 rounded-full text-xs font-bold uppercase">
                {stats.pendingReviews} en attente
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
                            sur <span className="font-semibold text-primary">{review.property?.title}</span>
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
                        Posté le {new Date(review.created_at).toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                      <button 
                        onClick={() => handleProcessReview(review.id, 'approved')}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircleIcon className="w-4 h-4" /> Approuver
                      </button>
                      <button 
                        onClick={() => handleProcessReview(review.id, 'rejected')}
                        className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <XCircleIcon className="w-4 h-4" /> Rejeter
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
                  <h3 className="text-lg font-bold text-text-main mb-2">Tout est à jour !</h3>
                  <p className="text-text-muted italic">Aucun avis en attente de modération pour le moment.</p>
                </div>
              )}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default AgentDashboard;