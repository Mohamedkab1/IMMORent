import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  BellIcon, 
  Cog6ToothIcon, 
  ArrowTrendingUpIcon, 
  UserIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  HomeIcon,
  KeyIcon,
  TagIcon,
  ClockIcon,
  ArchiveBoxIcon,
  StarIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { dashboardService } from '../services/dashboard';
import { userService } from '../services/users';
import { propertyService } from '../services/properties';
import { contractService } from '../services/contracts';
import { paymentService } from '../services/payments';
import { settingService } from '../services/settings';
import StatsCard from '../components/Common/StatsCard';
import RevenueChart from '../components/Dashboard/RevenueChart';

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/users')) return 'users';
    if (path.includes('/properties')) return 'properties';
    if (path.includes('/contracts')) return 'contracts';
    if (path.includes('/payments')) return 'payments';
    if (path.includes('/agent-requests')) return 'agent-requests';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTab();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- Users State ---
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // --- Properties State ---
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [propStatusFilter, setPropStatusFilter] = useState('');

  // --- Contracts State ---
  const [contracts, setContracts] = useState([]);
  const [loadingContracts, setLoadingContracts] = useState(false);

  // --- Payments State ---
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // --- Settings State ---
  const [settings, setSettings] = useState([]);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // --- Agent Requests State ---
  const [agentRequests, setAgentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // --- Data Loading ---
  const loadDashboardStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erreur stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await userService.getAll({ 
        search: userSearch, 
        role: userRoleFilter 
      });
      if (res.success) setUsers(res.data.data);
    } catch (error) {
      toast.error('Erreur chargement utilisateurs');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadProperties = async () => {
    setLoadingProperties(true);
    try {
      const res = await propertyService.getAdminAll({ 
        status: propStatusFilter 
      });
      if (res.success) setProperties(res.data.data);
    } catch (error) {
      toast.error('Erreur chargement biens');
    } finally {
      setLoadingProperties(false);
    }
  };

  const loadContracts = async () => {
    setLoadingContracts(true);
    try {
      const res = await contractService.getAll();
      if (res.success) setContracts(res.data.data);
    } catch (error) {
      toast.error('Erreur chargement contrats');
    } finally {
      setLoadingContracts(false);
    }
  };

  const loadPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await paymentService.getAll();
      if (res.success) setPayments(res.data.data);
    } catch (error) {
      toast.error('Erreur chargement paiements');
    } finally {
      setLoadingPayments(false);
    }
  };

  const loadSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await settingService.getAll();
      if (res.success) setSettings(res.data);
    } catch (error) {
      toast.error('Erreur chargement paramètres');
    } finally {
      setLoadingSettings(false);
    }
  };

  const loadAgentRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await userService.getAgentRequests();
      if (res.success) setAgentRequests(res.data);
    } catch (error) {
      console.error('Erreur chargement demandes agents:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') loadDashboardStats();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'properties') loadProperties();
    if (activeTab === 'contracts') loadContracts();
    if (activeTab === 'payments') loadPayments();
    if (activeTab === 'agent-requests') loadAgentRequests();
    if (activeTab === 'settings') loadSettings();
  }, [activeTab, userSearch, userRoleFilter, propStatusFilter]);

  // --- Handlers ---
  const handleToggleUserStatus = async (id) => {
    try {
      const res = await userService.toggleStatus(id);
      if (res.success) {
        toast.success(res.message);
        loadUsers();
      }
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Supprimer définitivement cet utilisateur ?')) {
      try {
        const res = await userService.delete(id);
        if (res.success) {
          toast.success(res.message);
          loadUsers();
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleApproveProperty = async (id) => {
    try {
      const res = await propertyService.approve(id);
      if (res.success) {
        toast.success(res.message);
        loadProperties();
      }
    } catch (error) {
      toast.error('Erreur approbation');
    }
  };

  const handleTogglePropertyArchive = async (id) => {
    try {
      const res = await propertyService.toggleArchive(id);
      if (res.success) {
        toast.success(res.message);
        loadProperties();
      }
    } catch (error) {
      toast.error('Erreur archivage');
    }
  };

  const handleTogglePropertyFeatured = async (id) => {
    try {
      const res = await propertyService.toggleFeatured(id);
      if (res.success) {
        toast.success(res.message);
        loadProperties();
      }
    } catch (error) {
      toast.error('Erreur mise en avant');
    }
  };

  const handleProcessAgentRequest = async (userId, status) => {
    if (window.confirm(`Êtes-vous sûr de vouloir ${status === 'approved' ? 'approuver' : 'refuser'} cette demande ?`)) {
      try {
        const res = await userService.processAgentRequest(userId, status);
        if (res.success) {
          toast.success(res.message);
          loadAgentRequests();
          loadDashboardStats();
        }
      } catch (error) {
        toast.error('Erreur lors du traitement');
      }
    }
  };

  const handleUpdateSetting = (key, value) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await settingService.updateBulk(settings.map(s => ({ key: s.key, value: s.value })));
      if (res.success) {
        toast.success(res.message);
        loadSettings();
      }
    } catch (error) {
      toast.error('Erreur sauvegarde paramètres');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdatePaymentStatus = async (id, status) => {
    try {
      const res = await paymentService.updateStatus(id, status);
      if (res.success) {
        toast.success(res.message);
        loadPayments();
      }
    } catch (error) {
      toast.error('Erreur mise à jour statut paiement');
    }
  };

  const handleDownloadContract = async (id) => {
    try {
      await contractService.download(id);
      toast.success('Téléchargement lancé');
    } catch (error) {
      toast.error('Erreur téléchargement');
    }
  };

  // --- Badges Helpers ---
  const getRoleBadge = (role) => {
    const slug = typeof role === 'object' ? role.slug : role;
    switch (slug) {
      case 'admin': return <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-md text-[10px] font-bold uppercase">Admin</span>;
      case 'agent': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold uppercase">Agent</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold uppercase">Client</span>;
    }
  };

  const getStatusBadge = (status) => {
    const isActive = status === 'active' || status === 1 || status === true;
    return isActive 
      ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">Actif</span>
      : <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded-full text-[10px] font-bold">Inactif</span>;
  };

  // --- Render Helpers ---
  if (!user || !user.role || user.role.slug !== 'admin') {
    return <div className="p-8 text-center">Accès restreint.</div>;
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-outfit">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8 sticky top-0 h-screen overflow-y-auto z-50 shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex items-center gap-3 px-2">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <BuildingOfficeIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">IMMORent</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Administration</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          <Link 
            to="/dashboard/admin" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <ChartBarIcon className="w-5 h-5" /> Vue d'ensemble
          </Link>
          <Link 
            to="/dashboard/admin/users" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'users' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <UserGroupIcon className="w-5 h-5" /> Utilisateurs
          </Link>
          <Link 
            to="/dashboard/admin/properties" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'properties' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <HomeIcon className="w-5 h-5" /> Biens Immobiliers
          </Link>
          <Link 
            to="/dashboard/admin/contracts" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'contracts' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <DocumentTextIcon className="w-5 h-5" /> Contrats
          </Link>
          <Link 
            to="/dashboard/admin/payments" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'payments' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <CurrencyDollarIcon className="w-5 h-5" /> Paiements
          </Link>
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-4 mx-4"></div>
          <Link 
            to="/dashboard/admin/agent-requests" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm relative ${activeTab === 'agent-requests' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <UserIcon className="w-5 h-5" /> Demandes Agents
            {stats?.requests?.pending > 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
                {stats.requests.pending}
              </span>
            )}
          </Link>
          <Link 
            to="/dashboard/admin/settings" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'settings' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'}`}
          >
            <Cog6ToothIcon className="w-5 h-5" /> Paramètres
          </Link>
        </nav>

        <div className="mt-auto p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
               {user.name.charAt(0)}
             </div>
             <div>
               <p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{user.name}</p>
               <p className="text-[10px] text-slate-500 dark:text-slate-400">Administrateur</p>
             </div>
           </div>
           <button 
             onClick={() => navigate('/')}
             className="w-full py-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
           >
             <HomeIcon className="w-3.5 h-3.5" /> Retour au site
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              {activeTab === 'dashboard' && "Tableau de Bord"}
              {activeTab === 'users' && "Gestion des Utilisateurs"}
              {activeTab === 'properties' && "Validation des Biens"}
              {activeTab === 'contracts' && "Suivi des Contrats"}
              {activeTab === 'payments' && "Historique des Paiements"}
              {activeTab === 'agent-requests' && "Candidatures Agents"}
              {activeTab === 'settings' && "Paramètres Système"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Bienvenue, {user.name}. Voici l'état actuel de votre plateforme.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (activeTab === 'users') loadUsers();
                else if (activeTab === 'properties') loadProperties();
                else if (activeTab === 'dashboard') loadDashboardStats();
                toast.info('Actualisation...');
              }}
              className="p-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            <div className="p-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative cursor-pointer hover:scale-105 transition-all">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </div>
          </div>
        </header>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-3xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                  title="Total Biens" 
                  value={stats?.properties?.total || 0} 
                  icon={BuildingOfficeIcon} 
                  trend="+12%" 
                  trendUp={true}
                  color="blue"
                />
                <StatsCard 
                  title="Utilisateurs" 
                  value={stats?.users?.total || 0} 
                  icon={UserGroupIcon} 
                  trend="+5%" 
                  trendUp={true}
                  color="purple"
                />
                <StatsCard 
                  title="Revenus" 
                  value={`${stats?.revenue?.total || 0} DH`} 
                  icon={CurrencyDollarIcon} 
                  trend="+18%" 
                  trendUp={true}
                  color="amber"
                />
                <StatsCard 
                  title="Demandes" 
                  value={stats?.requests?.total || 0} 
                  icon={DocumentTextIcon} 
                  trend="-2%" 
                  trendUp={false}
                  color="rose"
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Performance Financière</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-1">Évolution des revenus mensuels</p>
                  </div>
                  <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-600 px-4 py-2 outline-none">
                    <option>Année 2024</option>
                    <option>Année 2023</option>
                  </select>
                </div>
                <div className="h-80">
                  <RevenueChart data={stats?.revenue?.monthly || []} />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none p-8">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight mb-8">Alertes Système</h3>
                <div className="space-y-4">
                   <div className="p-5 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-3xl flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                        <XCircleIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-rose-800 dark:text-rose-400 text-sm">Paiements en retard</p>
                        <p className="text-rose-600 dark:text-rose-500/80 text-xs mt-1 leading-relaxed">4 paiements sont en attente depuis plus de 5 jours.</p>
                      </div>
                   </div>
                   <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                        <BellIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-800 dark:text-blue-400 text-sm">Nouveau rapport</p>
                        <p className="text-blue-600 dark:text-blue-500/80 text-xs mt-1 leading-relaxed">Le rapport d'activité mensuel est prêt à être téléchargé.</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Répertoire Utilisateurs</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{users.length} Comptes enregistrés</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                   <div className="relative flex-1 lg:w-64 lg:flex-none">
                      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:bg-white dark:focus:bg-slate-800 border-slate-100 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                      />
                   </div>
                   <select 
                     value={userRoleFilter}
                     onChange={(e) => setUserRoleFilter(e.target.value)}
                     className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 outline-none"
                   >
                     <option value="">Tous les rôles</option>
                     <option value="admin">Administrateurs</option>
                     <option value="agent">Agents</option>
                     <option value="client">Clients</option>
                   </select>
                   <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                     <PlusIcon className="w-4 h-4" /> Nouveau
                   </button>
                </div>
             </div>
             
             <div className="overflow-x-auto">
               {loadingUsers ? (
                 <div className="p-20 text-center text-slate-400 animate-pulse font-bold tracking-widest uppercase">Chargement des données...</div>
               ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">
                       <th className="px-8 py-5">Utilisateur</th>
                       <th className="px-8 py-5">Rôle</th>
                       <th className="px-8 py-5 text-center">Statut</th>
                       <th className="px-8 py-5">Date Inscription</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {users.map(u => (
                       <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                         <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                             <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-primary font-black shadow-sm group-hover:scale-110 transition-transform">
                               {u.name.charAt(0)}
                             </div>
                             <div>
                               <div className="font-bold text-slate-800 dark:text-white text-sm">{u.name}</div>
                               <div className="text-[11px] text-slate-400 font-medium mt-0.5">{u.email}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-8 py-5">{getRoleBadge(u.role)}</td>
                         <td className="px-8 py-5 text-center">{getStatusBadge(u.is_active)}</td>
                         <td className="px-8 py-5">
                           <div className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                             {new Date(u.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                           </div>
                         </td>
                         <td className="px-8 py-5 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               onClick={() => handleToggleUserStatus(u.id)}
                               className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                               title={u.is_active ? "Désactiver" : "Activer"}
                             >
                               <ArrowPathIcon className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => handleDeleteUser(u.id)}
                               className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-all"
                               title="Supprimer"
                             >
                               <TrashIcon className="w-4 h-4" />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                     {users.length === 0 && (
                       <tr>
                         <td colSpan="5" className="p-20 text-center text-slate-400 italic">Aucun utilisateur correspondant</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               )}
             </div>
          </section>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Gestion du Parc Immobilier</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{properties.length} Biens sous surveillance</p>
                </div>
                <select 
                  value={propStatusFilter}
                  onChange={(e) => setPropStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 outline-none"
                >
                  <option value="">Tous les statuts</option>
                  <option value="available">Disponible</option>
                  <option value="rented">Loué</option>
                  <option value="sold">Vendu</option>
                </select>
             </div>
             
             <div className="overflow-x-auto">
               {loadingProperties ? (
                 <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Chargement...</div>
               ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">
                       <th className="px-8 py-5">Bien / Référence</th>
                       <th className="px-8 py-5">Agent Responsable</th>
                       <th className="px-8 py-5 text-center">Approbation</th>
                       <th className="px-8 py-5 text-center">Flags</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {properties.map(p => (
                       <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                         <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                             <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                               {p.images && p.images[0] ? (
                                 <img src={p.images[0].startsWith('http') ? p.images[0] : `${import.meta.env.VITE_API_URL}/storage/${p.images[0]}`} className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-slate-400"><HomeIcon className="w-6 h-6" /></div>
                               )}
                             </div>
                             <div>
                               <div className="font-bold text-slate-800 dark:text-white text-sm truncate max-w-[200px]">{p.title}</div>
                               <div className="text-[11px] text-slate-400 font-bold mt-0.5">{p.city} • {p.price_display}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-8 py-5">
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{p.user?.name || 'Inconnu'}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">{p.user?.email}</div>
                         </td>
                         <td className="px-8 py-5 text-center">
                            {p.is_approved ? (
                              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-wider">Approuvé</span>
                            ) : (
                              <button 
                                onClick={() => handleApproveProperty(p.id)}
                                className="px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                              >
                                En attente
                              </button>
                            )}
                         </td>
                         <td className="px-8 py-5 text-center">
                            <div className="flex justify-center gap-2">
                               <button 
                                 onClick={() => handleTogglePropertyFeatured(p.id)}
                                 className={`p-1.5 rounded-lg transition-all ${p.is_featured ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-300 hover:text-amber-500'}`}
                               >
                                 <StarIcon className={`w-5 h-5 ${p.is_featured ? 'fill-current' : ''}`} />
                               </button>
                               <button 
                                 onClick={() => handleTogglePropertyArchive(p.id)}
                                 className={`p-1.5 rounded-lg transition-all ${p.is_archived ? 'text-slate-700 bg-slate-100 dark:bg-slate-800' : 'text-slate-300 hover:text-slate-600'}`}
                               >
                                 <ArchiveBoxIcon className={`w-5 h-5 ${p.is_archived ? 'fill-current' : ''}`} />
                               </button>
                            </div>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <Link to={`/properties/${p.id}`} className="text-primary font-black text-xs hover:underline tracking-tight">Voir Détails</Link>
                         </td>
                       </tr>
                     ))}
                     {properties.length === 0 && (
                       <tr>
                         <td colSpan="5" className="p-20 text-center text-slate-400 italic">Aucun bien à afficher</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               )}
             </div>
          </section>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Suivi des Contrats</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gérez les engagements juridiques de la plateforme</p>
             </div>
             
             <div className="overflow-x-auto">
               {loadingContracts ? (
                 <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Chargement des contrats...</div>
               ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">
                       <th className="px-8 py-5">N° Contrat</th>
                       <th className="px-8 py-5">Parties Prenantes</th>
                       <th className="px-8 py-5">Période</th>
                       <th className="px-8 py-5">Statut</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {contracts.map(c => (
                       <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                         <td className="px-8 py-5">
                           <div className="font-black text-slate-800 dark:text-white text-sm">{c.contract_number}</div>
                           <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{c.contract_type === 'sale' ? 'Vente' : 'Location'}</div>
                         </td>
                         <td className="px-8 py-5">
                            <div className="flex flex-col gap-1">
                               <div className="text-xs font-bold text-slate-700 dark:text-slate-300"><span className="text-slate-400 font-medium">C:</span> {c.tenant?.name || c.buyer?.name}</div>
                               <div className="text-xs font-bold text-slate-700 dark:text-slate-300"><span className="text-slate-400 font-medium">A:</span> {c.agent?.name}</div>
                            </div>
                         </td>
                         <td className="px-8 py-5">
                            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                               {c.start_date ? `Du ${new Date(c.start_date).toLocaleDateString()} au ${new Date(c.end_date).toLocaleDateString()}` : `Le ${new Date(c.sale_date).toLocaleDateString()}`}
                            </div>
                         </td>
                         <td className="px-8 py-5">
                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                               {c.status === 'active' ? 'Actif' : c.status}
                            </span>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <button 
                              onClick={() => handleDownloadContract(c.id)}
                              className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                               <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                         </td>
                       </tr>
                     ))}
                     {contracts.length === 0 && (
                       <tr>
                         <td colSpan="5" className="p-20 text-center text-slate-400 italic font-bold">Aucun contrat enregistré</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               )}
             </div>
          </section>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Historique des Flux Financiers</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Suivi des transactions et règlements clients</p>
             </div>
             
             <div className="overflow-x-auto">
               {loadingPayments ? (
                 <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Chargement des paiements...</div>
               ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">
                       <th className="px-8 py-5">Référence / Date</th>
                       <th className="px-8 py-5">Contrat / Client</th>
                       <th className="px-8 py-5">Montant</th>
                       <th className="px-8 py-5 text-center">Méthode</th>
                       <th className="px-8 py-5 text-center">Statut</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {payments.map(pay => (
                       <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                         <td className="px-8 py-5">
                            <div className="font-black text-slate-800 dark:text-white text-sm">{pay.payment_number}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(pay.payment_date).toLocaleDateString()}</div>
                         </td>
                         <td className="px-8 py-5">
                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Contrat: {pay.contract?.contract_number}</div>
                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{pay.tenant?.name}</div>
                         </td>
                         <td className="px-8 py-5">
                            <div className="text-sm font-black text-slate-800 dark:text-white">{number_format(pay.amount)} DH</div>
                         </td>
                         <td className="px-8 py-5 text-center">
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[9px] font-bold uppercase tracking-tighter">
                               {pay.payment_method === 'bank_transfer' ? 'Virement' : pay.payment_method}
                            </span>
                         </td>
                         <td className="px-8 py-5 text-center">
                            <select 
                              value={pay.status}
                              onChange={(e) => handleUpdatePaymentStatus(pay.id, e.target.value)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border-none outline-none ${pay.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                            >
                               <option value="pending">En attente</option>
                               <option value="paid">Payé</option>
                               <option value="late">Retard</option>
                               <option value="cancelled">Annulé</option>
                            </select>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <button className="text-primary hover:underline text-xs font-bold">Justificatif</button>
                         </td>
                       </tr>
                     ))}
                     {payments.length === 0 && (
                       <tr>
                         <td colSpan="6" className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Aucun flux financier enregistré</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               )}
             </div>
          </section>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-8">
            <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-10">
               <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Paramètres Généraux</h3>
                    <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">Configurez les règles métier de la plateforme</p>
                  </div>
                  <button 
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary/90 disabled:opacity-50 shadow-xl shadow-primary/30 transition-all flex items-center gap-2"
                  >
                    {savingSettings ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-5 h-5" />}
                    {savingSettings ? "Enregistrement..." : "Sauvegarder les modifications"}
                  </button>
               </div>

               {loadingSettings ? (
                 <div className="space-y-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl animate-pulse"></div>)}
                 </div>
               ) : (
                 <div className="space-y-8">
                    {/* Dynamic group rendering could be added here, currently just listing all */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {settings.map(setting => (
                         <div key={setting.key} className="flex flex-col gap-2">
                            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{setting.label || setting.key}</label>
                            <input 
                              type={setting.type === 'integer' ? 'number' : 'text'}
                              value={setting.value}
                              onChange={(e) => handleUpdateSetting(setting.key, e.target.value)}
                              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-800 transition-all"
                            />
                            {setting.description && <p className="text-[11px] text-slate-400 italic ml-1">{setting.description}</p>}
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </section>
            
            <section className="bg-rose-50/50 dark:bg-rose-900/5 border border-rose-100 dark:border-rose-900/20 rounded-[2.5rem] p-10">
               <h4 className="text-lg font-black text-rose-800 dark:text-rose-400 tracking-tight mb-4">Zone de Danger</h4>
               <p className="text-sm text-rose-600 dark:text-rose-500/70 mb-6 font-medium">Les actions suivantes sont irréversibles. Soyez prudent avant de procéder.</p>
               <button className="px-6 py-3 bg-white dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                  Réinitialiser la base de données
               </button>
            </section>
          </div>
        )}

        {/* Agent Requests Tab (kept for compatibility) */}
        {activeTab === 'agent-requests' && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Candidatures Agents</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Examinez les demandes de passage au rôle Agent</p>
             </div>
             
             <div className="overflow-x-auto">
               {loadingRequests ? (
                 <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Chargement des demandes...</div>
               ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">
                       <th className="px-8 py-5">Candidat</th>
                       <th className="px-8 py-5">Contact</th>
                       <th className="px-8 py-5">Date Demande</th>
                       <th className="px-8 py-5 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                     {agentRequests.map(req => (
                       <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                         <td className="px-8 py-5">
                            <div className="font-black text-slate-800 dark:text-white text-sm">{req.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">ID: #{req.id}</div>
                         </td>
                         <td className="px-8 py-5">
                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{req.email}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">{req.phone || 'Pas de téléphone'}</div>
                         </td>
                         <td className="px-8 py-5">
                            <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                               {new Date(req.updated_at).toLocaleDateString()}
                            </div>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2">
                               <button 
                                 onClick={() => handleProcessAgentRequest(req.id, 'approved')}
                                 className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                               >
                                 Approuver
                               </button>
                               <button 
                                 onClick={() => handleProcessAgentRequest(req.id, 'rejected')}
                                 className="px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                               >
                                 Refuser
                               </button>
                            </div>
                         </td>
                       </tr>
                     ))}
                     {agentRequests.length === 0 && (
                       <tr>
                         <td colSpan="4" className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Aucune candidature en attente</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               )}
             </div>
          </section>
        )}
      </main>
    </div>
  );
};

const number_format = (number) => {
  return new Intl.NumberFormat('fr-FR').format(number);
};
export default AdminDashboard;