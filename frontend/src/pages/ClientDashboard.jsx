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
  CalendarIcon, 
  MagnifyingGlassIcon, 
  HeartIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  KeyIcon,
  TagIcon
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

  useEffect(() => {
    loadAllData();
    if (location.search.includes('refresh')) {
      setTimeout(() => loadAllData(), 500);
    }
  }, [location.search]);

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
    toast.success('Données actualisées');
  };

  const loadRequests = async () => {
    try {
      const response = await requestService.getMyRequests();
      if (response.success) {
        const data = response.data || [];
        setRequests(data);
        setStats(prev => ({ 
          ...prev, 
          activeRequests: data.filter(r => r.status === 'pending' || r.status === 'approved').length 
        }));
      }
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    }
  };

  const loadContracts = async () => {
    try {
      const response = await contractService.getMyContracts();
      if (response.success) {
        const data = response.data.data || [];
        setContracts(data);
        
        const activeContracts = data.filter(c => c.status === 'active');
        const total = activeContracts.reduce((sum, c) => {
          const monthlyRent = parseFloat(c.monthly_rent) || 0;
          return sum + monthlyRent;
        }, 0);
        
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
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette demande ?')) {
      return;
    }
    try {
      const response = await requestService.cancel(id);
      if (response.success) {
        toast.success('Demande annulée avec succès');
        loadRequests();
      } else {
        toast.error(response.message || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'annulation de la demande');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-500', label: t('En attente', 'En attente'), icon: ClockIcon },
      approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('Approuvée', 'Approuvée'), icon: CheckCircleIcon },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: t('Refusée', 'Refusée'), icon: XCircleIcon },
      cancelled: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: t('Annulée', 'Annulée'), icon: XCircleIcon },
      active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: t('Actif', 'Actif'), icon: CheckCircleIcon },
      terminated: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: t('Résilié', 'Résilié'), icon: XCircleIcon },
      expired: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: t('Expiré', 'Expiré'), icon: ClockIcon },
      completed: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-500', label: t('Terminé', 'Terminé'), icon: CheckCircleIcon }
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
          Location
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-500">
          <TagIcon className="w-3.5 h-3.5" />
          Achat
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 dark:text-slate-400">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-medium animate-pulse">Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-70px)] bg-slate-50 dark:bg-slate-900">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white dark:bg-slate-800 border-e border-slate-200 dark:border-slate-700 flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-secondary to-yellow-200 rounded-full flex items-center justify-center text-primary text-2xl font-black shadow-lg shadow-secondary/30 mb-4">
            {user?.name?.charAt(0)}
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate">{user?.name}</h3>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">Client</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-md shadow-primary/20 dark:shadow-secondary/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <HomeIcon className="w-5 h-5" /> {t('Dashboard')}
          </button>
          
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${activeTab === 'requests' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <DocumentTextIcon className="w-5 h-5" /> {t('dash.stats.pending_requests')}
            {stats.activeRequests > 0 && (
              <span className="absolute end-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold leading-none min-w-[1.25rem] text-center">
                {stats.activeRequests}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'contracts' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <DocumentTextIcon className="w-5 h-5" /> {t('dash.stats.active_contracts')}
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <Link to="/properties" className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-secondary text-primary hover:bg-secondary-hover rounded-xl font-bold transition-all shadow-md">
            <MagnifyingGlassIcon className="w-5 h-5" /> {t('nav.properties')}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{t('dash.client.welcome')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gérez vos demandes et vos suivis en toute simplicité.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshData} 
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? t('common.loading') : 'Actualiser'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatsCard 
            title={t('dash.stats.pending_requests')} 
            value={stats.activeRequests} 
            icon={DocumentTextIcon} 
            color="amber" 
          />
          <StatsCard 
            title={t('dash.stats.active_contracts')} 
            value={stats.activeContracts} 
            icon={CheckCircleIcon} 
            color="green" 
          />
          <StatsCard 
            title="Dépenses mensuelles" 
            value={`${stats.totalPayments.toLocaleString('fr-FR')} DH`} 
            icon={CurrencyDollarIcon} 
            color="blue" 
          />
          <StatsCard 
            title="Biens favoris" 
            value={stats.favoriteProperties} 
            icon={HeartIcon} 
            color="rose" 
          />
        </div>

        {/* Dynamic Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Demandes Récentes</h2>
                <button onClick={() => setActiveTab('requests')} className="text-sm font-semibold text-primary dark:text-secondary hover:underline">
                  Voir tout ({requests.length})
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.slice(0, 3).map(request => (
                  <div key={request.id} className="group border border-slate-100 dark:border-slate-700 rounded-xl p-5 hover:border-secondary dark:hover:border-secondary/50 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-slate-800 dark:text-white line-clamp-2 pr-2">{request.property?.title}</h3>
                      <div className="flex-shrink-0">{getRequestTypeBadge(request.type)}</div>
                    </div>
                    {request.type === 'rent' && (
                      <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                        <ClockIcon className="w-4 h-4 text-slate-400" />
                        {new Date(request.start_date).toLocaleDateString()}
                      </p>
                    )}
                    <p className="flex items-center gap-2 text-lg font-bold text-primary dark:text-slate-200 mb-6">
                      <CurrencyDollarIcon className="w-5 h-5 text-secondary" />
                      {(request.property?.price || 0).toLocaleString()} DH {request.type === 'rent' ? '/ mois' : ''}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
                       {getStatusBadge(request.status)}
                    </div>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    <p className="text-slate-500 dark:text-slate-400 mb-3">Aucune demande en cours</p>
                    <Link to="/properties" className="inline-flex items-center text-primary font-semibold hover:text-secondary">Découvrir les biens ➔</Link>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Historique des demandes</h2>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                     <th className="p-4 font-semibold">Bien ciblé</th>
                     <th className="p-4 font-semibold text-center">Statut</th>
                     <th className="p-4 font-semibold text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                   {requests.map(request => (
                     <tr key={request.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                       <td className="p-4">
                         <div className="font-bold text-slate-800 dark:text-white text-sm">{request.property?.title}</div>
                         <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{request.property?.city}</div>
                       </td>
                       <td className="p-4 text-center">{getStatusBadge(request.status)}</td>
                       <td className="p-4 text-right">
                         {request.status === 'pending' && (
                           <button onClick={() => cancelRequest(request.id)} className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">
                             {t('common.delete')}
                           </button>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </section>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Mes Contrats Actifs</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {contracts.map(contract => (
                  <div key={contract.id} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-bold text-slate-800 dark:text-white">{contract.property?.title}</h3>
                      {getStatusBadge(contract.status)}
                    </div>
                    <div className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
                      <p className="flex justify-between"><span>Loyer:</span> <span className="font-bold text-primary dark:text-white">{contract.monthly_rent?.toLocaleString()} DH</span></p>
                      <p className="flex justify-between"><span>Début:</span> <span>{new Date(contract.start_date).toLocaleDateString()}</span></p>
                      <p className="flex justify-between"><span>Fin:</span> <span>{new Date(contract.end_date).toLocaleDateString()}</span></p>
                    </div>
                    <Link to={`/contracts/${contract.id}`} className="block w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-750 transition-all">
                      Voir les détails
                    </Link>
                  </div>
                ))}
                {contracts.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    <p className="text-slate-500 dark:text-slate-400">Aucun contrat actif</p>
                  </div>
                )}
             </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default ClientDashboard;
