import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { useLanguage } from '../context/LanguageContext';
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
import StatsCard from '../components/Common/StatsCard';

const ClientDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { t, language } = useLanguage();
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
      if (response.success) {
        const data = response.data || [];
        setRequests(data);
        setStats(prev => ({ 
          ...prev, 
          activeRequests: data.filter(r => r.status === 'pending' || r.status === 'approved').length 
        }));
      } else {
        setRequestsError(response.message || 'Erreur lors du chargement des demandes');
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
      toast.error('Erreur lors de l\'annulation');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-500', label: t('En attente'), icon: ClockIcon },
      approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('Approuvée'), icon: CheckCircleIcon },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: t('Refusée'), icon: XCircleIcon },
      cancelled: { bg: 'bg-bg-card border border-border-main', text: 'text-text-muted', label: t('Annulée'), icon: XCircleIcon },
      active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('Actif'), icon: CheckCircleIcon },
      terminated: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: t('Résilié'), icon: XCircleIcon },
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
    <div className="min-h-screen bg-bg-soft transition-colors duration-300 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-light h-48 md:h-64 flex items-center justify-center text-white px-4">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl md:text-5xl font-black mb-2 animate-slide-up">
            {t('dashboard.welcome')}, <span className="text-secondary">{user?.name}</span>
          </h1>
          <p className="text-white/70 font-medium animate-slide-up animation-delay-100">
            {t('dashboard.client_desc', 'Gérez vos demandes et contrats depuis votre espace personnel.')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-16">
        {/* Navigation Tabs */}
        <div className="glass-panel rounded-3xl p-2 flex flex-wrap gap-2 mb-8 animate-fade-in rtl:flex-row-reverse">
          {[
            { id: 'dashboard', label: t('nav.dashboard'), icon: HomeIcon },
            { id: 'requests', label: t('request.title'), icon: ClipboardDocumentListIcon || BellIcon },
            { id: 'contracts', label: t('contract.my_contracts'), icon: DocumentTextIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg dark:bg-secondary dark:text-primary shadow-primary/20' 
                  : 'text-text-sub hover:bg-bg-soft hover:text-text-main'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
          <div className="ms-auto flex items-center gap-2 pr-2">
            <button 
              onClick={refreshData}
              disabled={refreshing}
              className={`p-3 text-text-sub hover:text-primary hover:bg-bg-soft rounded-2xl transition-all ${refreshing ? 'animate-spin' : ''}`}
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title={t('dashboard.active_requests')} value={stats.activeRequests} icon={BellIcon} color="blue" />
                <StatsCard title={t('dashboard.active_contracts')} value={stats.activeContracts} icon={DocumentTextIcon} color="green" />
                <StatsCard title={t('dashboard.total_payments')} value={`${stats.totalPayments.toLocaleString()} DH`} icon={CurrencyDollarIcon} color="amber" />
                <StatsCard title={t('dashboard.favorites')} value={stats.favoriteProperties} icon={HeartIcon} color="rose" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-bg-card rounded-3xl border border-border-main p-8 shadow-main">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-text-main">{t('client.requests.recent')}</h2>
                    <button onClick={() => setActiveTab('requests')} className="text-sm font-bold text-primary dark:text-secondary hover:underline">Voir tout</button>
                  </div>
                  <div className="space-y-4">
                    {requests.slice(0, 3).map(request => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-bg-soft rounded-2xl border border-border-main group hover:border-primary transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-bg-card rounded-xl flex items-center justify-center text-primary dark:text-secondary border border-border-main">
                            <HomeIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-text-main line-clamp-1">{request.property?.title}</p>
                            <p className="text-xs text-text-muted mt-0.5">{request.property?.city} • {getRequestTypeBadge(request.type).props.children[1]}</p>
                          </div>
                        </div>
                        <div className="text-end">
                           {getStatusBadge(request.status)}
                        </div>
                      </div>
                    ))}
                    {requests.length === 0 && <p className="text-center py-8 text-text-muted italic">{t('client.requests.no_data')}</p>}
                  </div>
                </div>

                <div className="bg-bg-card rounded-3xl border border-border-main p-8 shadow-main h-fit">
                   <h2 className="text-xl font-bold text-text-main mb-6">Support & Aide</h2>
                   <div className="space-y-4">
                      <Link to="/contact" className="flex items-center gap-4 p-4 bg-bg-soft rounded-2xl hover:bg-primary/5 transition-all group">
                         <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-text-main">Besoin d'aide ?</p>
                            <p className="text-xs text-text-muted">Contactez un conseiller</p>
                         </div>
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="bg-bg-card rounded-3xl border border-border-main shadow-main overflow-hidden">
               <div className="p-8 border-b border-border-main flex justify-between items-center">
                  <h2 className="text-2xl font-black text-text-main">{t('request.title')}</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-bg-soft border-b border-border-main text-xs uppercase font-black text-text-muted tracking-widest">
                       <th className="p-6">ID</th>
                       <th className="p-6">Bien</th>
                       <th className="p-6 text-center">Statut</th>
                       <th className="p-6 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border-main">
                     {requests.map(request => (
                       <tr key={request.id} className="hover:bg-bg-soft/50 transition-colors">
                         <td className="p-6 text-sm font-mono text-text-muted">#{request.id}</td>
                         <td className="p-6">
                           <p className="font-bold text-text-main">{request.property?.title}</p>
                           <p className="text-xs text-text-muted">{request.property?.city}</p>
                         </td>
                         <td className="p-6 text-center">{getStatusBadge(request.status)}</td>
                         <td className="p-6 text-right">
                            <Link to={`/properties/${request.property_id}`} className="text-primary dark:text-secondary font-bold text-sm hover:underline">Détails</Link>
                            {request.status === 'pending' && (
                              <button onClick={() => cancelRequest(request.id)} className="ms-4 text-rose-500 font-bold text-sm hover:underline">Annuler</button>
                            )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {contracts.map(contract => (
                 <div key={contract.id} className="bg-bg-card rounded-3xl border border-border-main p-8 shadow-main hover:border-primary transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">{contract.property?.title}</h3>
                        <p className="text-sm text-text-muted">{contract.property?.address}</p>
                      </div>
                      {getStatusBadge(contract.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="p-4 bg-bg-soft rounded-2xl">
                          <p className="text-[10px] font-black uppercase text-text-muted mb-1">Loyer Mensuel</p>
                          <p className="text-lg font-black text-text-main">{contract.monthly_rent?.toLocaleString()} DH</p>
                       </div>
                       <div className="p-4 bg-bg-soft rounded-2xl">
                          <p className="text-[10px] font-black uppercase text-text-muted mb-1">Date Signature</p>
                          <p className="text-lg font-black text-text-main">{new Date(contract.start_date).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <Link to={`/contracts/${contract.id}`} className="btn-primary w-full text-center block">Consulter le contrat</Link>
                 </div>
               ))}
               {contracts.length === 0 && (
                 <div className="col-span-full py-20 text-center bg-bg-card rounded-3xl border-2 border-dashed border-border-main">
                    <p className="text-text-muted font-bold italic">{t('client.contracts.no_data')}</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
