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
  ClockIcon
} from '@heroicons/react/24/outline';
import StatsCard from '../components/Common/StatsCard';

const AgentDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ 
    totalProperties: 0, 
    availableProperties: 0, 
    pendingRequests: 0, 
    activeContracts: 0, 
    monthlyRevenue: 0 
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
      loadContracts()
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
      loadContracts()
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
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 text-center relative pt-12">
           <div className="w-20 h-20 absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-primary to-blue-400 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/30 border-4 border-white dark:border-slate-800">
            {user?.name?.charAt(0)}
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate mt-2">{user?.name}</h3>
          <p className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <UserIcon className="w-3 h-3" /> Agent Immobilier
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <BuildingOfficeIcon className="w-5 h-5" /> {t('Dashboard')}
          </button>
          
          <button 
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${activeTab === 'properties' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <HomeIcon className="w-5 h-5" /> {t('nav.properties')}
            {stats.totalProperties > 0 && <span className="absolute end-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full font-bold">{stats.totalProperties}</span>}
          </button>

          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative ${activeTab === 'requests' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <DocumentTextIcon className="w-5 h-5" /> {t('dash.stats.pending_requests')}
            {stats.pendingRequests > 0 && <span className="absolute end-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-bold">{stats.pendingRequests}</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'contracts' ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <DocumentDuplicateIcon className="w-5 h-5" /> {t('dash.stats.active_contracts')}
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <Link to="/properties/new" className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-md">
            <PlusIcon className="w-5 h-5" /> {t('common.save')}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{t('dash.agent.welcome')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Supervisez votre portfolio immobilier en temps réel.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshData} 
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? t('common.loading') : 'Actualiser'}
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
              <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BellIcon className="w-5 h-5 text-amber-500" />
                    {t('dash.stats.pending_requests')}
                  </h2>
                  <button onClick={() => setActiveTab('requests')} className="text-sm font-semibold text-primary hover:underline">
                    Tout voir
                  </button>
                </div>
                
                <div className="space-y-4">
                  {requests.filter(r => r.status?.toLowerCase() === 'pending').slice(0, 3).map(request => (
                    <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700 gap-4">
                       <div>
                         <h4 className="font-bold text-slate-800 dark:text-white text-sm">{request.user?.name || 'Client Inconnu'}</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{request.property?.title}</p>
                       </div>
                       <div className="flex gap-2 text-right">
                         <button onClick={() => handleProcessRequest(request.id, 'approved')} className="text-xs font-bold text-green-600 hover:underline">Approuver</button>
                         <button onClick={() => handleProcessRequest(request.id, 'rejected')} className="text-xs font-bold text-red-600 hover:underline">Refuser</button>
                       </div>
                    </div>
                  ))}
                  {requests.filter(r => r.status?.toLowerCase() === 'pending').length === 0 && (
                    <div className="p-6 text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                      Aucune demande en attente
                    </div>
                  )}
                </div>
              </section>

              {/* Derniers Contrats */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 overflow-hidden">
                 <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <DocumentDuplicateIcon className="w-5 h-5 text-blue-500" />
                    {t('dash.stats.active_contracts')}
                  </h2>
                </div>

                <div className="space-y-4">
                  {contracts.slice(0, 3).map(contract => (
                    <div key={contract.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                       <div>
                         <h4 className="font-bold text-slate-800 dark:text-white text-sm">{contract.property?.title}</h4>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Locataire: {contract.tenant?.name}</p>
                       </div>
                       <div className="text-right">
                         <div className="font-bold text-slate-800 dark:text-white text-sm">{contract.monthly_rent?.toLocaleString()} DH</div>
                         <div className="mt-1">{getStatusBadge(contract.status)}</div>
                       </div>
                    </div>
                  ))}
                  {contracts.length === 0 && (
                    <div className="p-6 text-center text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                      Aucun contrat actif
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}

{/* Properties Tab */}
        {activeTab === 'properties' && (
          <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Gestion de mes biens</h2>
                <Link to="/properties/new" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-lg text-sm font-bold shadow-md transition-colors">
                  <PlusIcon className="w-4 h-4" /> Ajouter
                </Link>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                     <th className="p-4 font-semibold">Titre & Ville</th>
                     <th className="p-4 font-semibold">Attributs</th>
                     <th className="p-4 font-semibold text-right">Tarif</th>
                     <th className="p-4 font-semibold text-center">Statut</th>
                     <th className="p-4 font-semibold text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                   {properties.map(property => (
                     <tr key={property.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                       <td className="p-4">
                         <div className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{property.title}</div>
                         <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                           <MapPinIcon className="w-3 h-3" /> {property.city}
                         </div>
                       </td>
                       <td className="p-4">
                         <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded inline-block">
                           {property.surface} m² • {property.rooms} p.
                         </div>
                       </td>
                       <td className="p-4 text-sm font-bold text-slate-800 dark:text-slate-200 text-right">
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
                       <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">Aucun bien enregistré</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
                      </section>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Gestion des demandes</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-full text-xs font-bold">
                  {requests.filter(r => r.status === 'pending').length} en attente
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="p-4 font-semibold">Client</th>
                    <th className="p-4 font-semibold">Bien concerné</th>
                    <th className="p-4 font-semibold">Date demande</th>
                    <th className="p-4 font-semibold text-center">Statut</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {requests.map(request => (
                    <tr key={request.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-white text-sm">{request.user?.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{request.user?.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">{request.property?.title}</div>
                        <div className="text-xs text-slate-500">{request.property?.city}</div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4 text-center">{getStatusBadge(request.status)}</td>
                      <td className="p-4 text-right">
                        {request.status === 'pending' ? (
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => handleProcessRequest(request.id, 'approved')}
                              className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                              <CheckCircleIcon className="w-4 h-4" /> Approuver
                            </button>
                            <button 
                              onClick={() => handleProcessRequest(request.id, 'rejected')}
                              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <XCircleIcon className="w-4 h-4" /> Refuser
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Traitée le {new Date(request.processed_at || request.updated_at).toLocaleDateString('fr-FR')}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">Aucune demande reçue</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {/* Contracts Tab - Full View */}
        {activeTab === 'contracts' && (
          <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Mes Contrats</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">{stats.activeContracts} actif(s)</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                     <th className="p-4 font-semibold">Propriété</th>
                     <th className="p-4 font-semibold">Locataire</th>
                     <th className="p-4 font-semibold text-right">Loyer</th>
                     <th className="p-4 font-semibold text-center">Statut</th>
                     <th className="p-4 font-semibold text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                   {contracts.map(contract => (
                     <tr key={contract.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                       <td className="p-4">
                         <div className="font-bold text-slate-800 dark:text-white text-sm">{contract.property?.title}</div>
                         <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{contract.property?.city}</div>
                       </td>
                       <td className="p-4">
                         <div className="text-sm text-slate-800 dark:text-white">{contract.tenant?.name}</div>
                       </td>
                       <td className="p-4 text-sm font-bold text-slate-800 dark:text-slate-200 text-right">
                         {(contract.monthly_rent || 0).toLocaleString()} DH
                       </td>
                       <td className="p-4 text-center">{getStatusBadge(contract.status)}</td>
                       <td className="p-4 text-right">
                         <Link to={`/contracts/${contract.id}`} className="text-xs font-semibold text-primary hover:underline">
                           Voir détails
                         </Link>
                       </td>
                     </tr>
                   ))}
                   {contracts.length === 0 && (
                     <tr>
                       <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">Aucun contrat trouvé</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </section>
        )}

      </main>
    </div>
  );
};

export default AgentDashboard;