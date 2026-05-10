import React, { useState, useEffect, useRef } from 'react';
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
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { dashboardService } from '../services/dashboard';
import { userService } from '../services/users';
import { propertyService } from '../services/properties';
import { contractService } from '../services/contracts';
import { paymentService } from '../services/payments';
import { settingService } from '../services/settings';
import StatsCard from '../components/Common/StatsCard';
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // --- Properties State ---
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');
  const [debouncedPropertySearch, setDebouncedPropertySearch] = useState('');
  const [propStatusFilter, setPropStatusFilter] = useState('');

  // --- Contracts State ---
  const [contracts, setContracts] = useState([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [contractSearch, setContractSearch] = useState('');
  const [debouncedContractSearch, setDebouncedContractSearch] = useState('');

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

  const loadUsers = async (signal) => {
    setLoadingUsers(true);
    try {
      const res = await userService.getAll({ 
        search: debouncedSearch, 
        role: userRoleFilter 
      }, { signal });
      
      if (res.success) {
        // Handle paginated response correctly
        const userData = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setUsers(userData);
      }
    } catch (error) {
      if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
        console.error('Erreur loadUsers:', error);
        toast.error('Erreur chargement utilisateurs');
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadProperties = async () => {
    setLoadingProperties(true);
    try {
      const res = await propertyService.getAdminAll({ 
        status: propStatusFilter,
        search: debouncedPropertySearch
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
      const res = await contractService.getAll({
        search: debouncedContractSearch
      });
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
      if (res.success) {
        setAgentRequests(res.data);
        setStats(prev => prev ? {
          ...prev,
          requests: {
            ...(prev.requests || {}),
            pending: 0
          }
        } : prev);
      }
    } catch (error) {
      console.error('Erreur chargement demandes agents:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Debounce for user search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(userSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearch]);

  // Debounce for property search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPropertySearch(propertySearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [propertySearch]);

  // Debounce for contract search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedContractSearch(contractSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [contractSearch]);

  useEffect(() => {
    if (activeTab === 'dashboard') loadDashboardStats();
    
    let controller;
    if (activeTab === 'users') {
      controller = new AbortController();
      loadUsers(controller.signal);
    }

    if (activeTab === 'properties') loadProperties();
    if (activeTab === 'contracts') loadContracts();
    if (activeTab === 'payments') loadPayments();
    if (activeTab === 'agent-requests') loadAgentRequests();
    if (activeTab === 'settings') loadSettings();

    return () => {
      if (controller) controller.abort();
    };
  }, [activeTab, debouncedSearch, userRoleFilter, propStatusFilter, debouncedPropertySearch, debouncedContractSearch]);

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

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Supprimer définitivement ce bien ?')) {
      try {
        const res = await propertyService.delete(id);
        if (res.success) {
          toast.success(res.message || 'Bien supprimé avec succès');
          loadProperties();
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
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

  const handleUpdateContractStatus = async (id, status) => {
    try {
      const res = await contractService.updateStatus(id, status);
      if (res.success) {
        toast.success('Statut mis à jour');
        loadContracts();
      }
    } catch (error) {
      toast.error('Erreur mise à jour statut');
    }
  };

  // --- Badges Helpers ---
  const getRoleBadge = (role) => {
    const slug = typeof role === 'object' ? role.slug : role;
    switch (slug) {
      case 'admin': return <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-md text-[10px] font-bold uppercase">{t('auth.role.admin')}</span>;
      case 'agent': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold uppercase">{t('auth.role.agent')}</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold uppercase">{t('auth.role.client')}</span>;
    }
  };

  const getStatusBadge = (status) => {
    const isActive = status === 'active' || status === 1 || status === true;
    return isActive 
      ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">{t('common.status.active', 'Actif')}</span>
      : <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded-full text-[10px] font-bold">{t('common.status.inactive', 'Inactif')}</span>;
  };

  // --- Render Helpers ---
  if (!user || !user.role || user.role.slug !== 'admin') {
    return <div className="p-8 text-center">Accès restreint.</div>;
  }


  return (
    <div className="min-h-screen bg-bg-soft flex flex-col md:flex-row font-outfit">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-bg-card border-r border-border-main p-6 flex flex-col gap-8 sticky top-0 h-screen overflow-y-auto z-50 shadow-large shrink-0">
        <div className="flex items-center gap-3 px-2">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <BuildingOfficeIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-text-main tracking-tight">IMMORent</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Administration</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          <Link 
            to="/dashboard/admin" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-large scale-[1.02]' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <ChartBarIcon className="w-5 h-5" /> {t('admin.tabs.overview')}
          </Link>
          <Link 
            to="/dashboard/admin/users" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'users' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <UserGroupIcon className="w-5 h-5" /> {t('admin.tabs.users')}
          </Link>
          <Link 
            to="/dashboard/admin/properties" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'properties' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <HomeIcon className="w-5 h-5" /> {t('admin.tabs.properties')}
          </Link>
          <Link 
            to="/dashboard/admin/contracts" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'contracts' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <DocumentTextIcon className="w-5 h-5" /> {t('admin.tabs.contracts')}
          </Link>
          <Link 
            to="/dashboard/admin/payments" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'payments' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <CurrencyDollarIcon className="w-5 h-5" /> {t('admin.tabs.payments')}
          </Link>
          <button 
            onClick={() => navigate('/payments/history')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm text-text-sub hover:bg-bg-soft hover:text-text-main`}
          >
            <CurrencyDollarIcon className="w-5 h-5" /> Historique complet
          </button>
          <div className="h-px bg-border-main my-4 mx-4"></div>
          <Link 
            to="/dashboard/admin/agent-requests" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm relative ${activeTab === 'agent-requests' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <UserIcon className="w-5 h-5" /> {t('admin.tabs.agent_requests')}
            {stats?.requests?.pending > 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-bg-card animate-pulse">
                {stats.requests.pending}
              </span>
            )}
          </Link>
          <Link 
            to="/notifications" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm text-text-sub hover:bg-bg-soft hover:text-text-main`}
          >
            <BellIcon className="w-5 h-5" /> {t('nav.notifications')}
          </Link>
          <Link 
            to="/dashboard/admin/settings" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'settings' ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
          >
            <Cog6ToothIcon className="w-5 h-5" /> {t('admin.tabs.settings')}
          </Link>
        </nav>

        <div className="mt-auto p-5 bg-bg-soft rounded-3xl border border-border-main">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
               {user.name.charAt(0)}
             </div>
             <div>
               <p className="text-xs font-bold text-text-main truncate max-w-[120px]">{user.name}</p>
                <p className="text-[10px] text-text-sub">{t('auth.role.admin')}</p>
             </div>
           </div>
           <button 
             onClick={() => navigate('/')}
             className="w-full py-2 bg-bg-card text-text-sub text-xs font-bold rounded-xl border border-border-main hover:bg-bg-soft hover:text-text-main transition-all flex items-center justify-center gap-2"
           >
             <HomeIcon className="w-3.5 h-3.5" /> {t('admin.back_to_site')}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 md:p-10 max-w-[1600px] mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-text-main tracking-tight">
              {activeTab === 'dashboard' && t('admin.tabs.overview')}
              {activeTab === 'users' && t('admin.tabs.users')}
              {activeTab === 'properties' && t('admin.tabs.properties')}
              {activeTab === 'contracts' && t('admin.tabs.contracts')}
              {activeTab === 'payments' && t('admin.tabs.payments')}
              {activeTab === 'agent-requests' && t('admin.tabs.agent_requests')}
              {activeTab === 'settings' && t('admin.tabs.settings')}
            </h2>
            <p className="text-text-sub font-medium mt-1">
              {t('dash.client.welcome')}, {user.name}. {t('admin.welcome_subtitle')}
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
              className="p-3 bg-bg-card text-text-sub rounded-2xl border border-border-main shadow-sm hover:shadow-md hover:scale-105 active:scale-95 hover:text-primary transition-all"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="animate-fade-in relative z-10">
        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-bg-card rounded-3xl animate-pulse border border-border-main"></div>
                ))}
              </div>
            ) : (
              <RevealOnScroll>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard 
                    title={t('dash.stats.total_properties')} 
                    value={stats?.properties?.total || 0} 
                    icon={BuildingOfficeIcon} 
                    trend="+12%" 
                    trendUp={true}
                    color="blue"
                  />
                  <StatsCard 
                    title={t('admin.tabs.users')} 
                    value={stats?.users?.total || 0} 
                    icon={UserGroupIcon} 
                    trend="+5%" 
                    trendUp={true}
                    color="purple"
                  />
                  <StatsCard 
                    title={t('dash.stats.revenue')} 
                    value={`${stats?.revenue?.total || 0} DH`} 
                    icon={CurrencyDollarIcon} 
                    trend="+18%" 
                    trendUp={true}
                    color="amber"
                  />
                  <StatsCard 
                    title={t('admin.tabs.agent_requests')} 
                    value={stats?.requests?.total || 0} 
                    icon={DocumentTextIcon} 
                    trend="-2%" 
                    trendUp={false}
                    color="rose"
                  />
                </div>
              </RevealOnScroll>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <RevealOnScroll delay={100} className="lg:col-span-2">
                <div className="bg-bg-card rounded-[2.5rem] border border-border-main shadow-sm hover:shadow-xl transition-shadow duration-500 p-8 h-full">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-black text-text-main tracking-tight">{t('admin.overview.performance')}</h3>
                      <p className="text-sm text-text-muted font-bold uppercase tracking-wider mt-1">{t('admin.overview.evolution')}</p>
                    </div>
                    <select className="bg-bg-soft border-none rounded-xl text-xs font-bold text-text-sub px-4 py-2 outline-none">
                      <option value="2024">{t('admin.overview.year', 'Année')} 2024</option>
                      <option value="2023">{t('admin.overview.year', 'Année')} 2023</option>
                    </select>
                  </div>
                  <div className="h-80">
                    <RevenueChart data={stats?.revenue?.monthly || []} />
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <div className="bg-bg-card rounded-[2.5rem] border border-border-main shadow-sm hover:shadow-xl transition-shadow duration-500 p-8 h-full">
                  <h3 className="text-xl font-black text-text-main tracking-tight mb-8">{t('admin.overview.alerts')}</h3>
                  <div className="space-y-4">
                     <div className="p-5 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-3xl flex gap-4 hover:-translate-y-1 transition-transform">
                        <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                          <XCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-rose-800 dark:text-rose-400 text-sm">{t('admin.alerts.late_payments.title')}</p>
                          <p className="text-rose-600 dark:text-rose-500/80 text-xs mt-1 leading-relaxed">{t('admin.alerts.late_payments.desc')}</p>
                        </div>
                     </div>
                     <div className="p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl flex gap-4 hover:-translate-y-1 transition-transform">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                          <BellIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-blue-800 dark:text-blue-400 text-sm">{t('admin.alerts.new_report.title')}</p>
                          <p className="text-blue-600 dark:text-blue-500/80 text-xs mt-1 leading-relaxed">{t('admin.alerts.new_report.desc')}</p>
                        </div>
                     </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
             <div className="p-8 border-b border-border-main flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-black text-text-main tracking-tight">{t('admin.users.title')}</h3>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{users.length} {t('admin.users.count')}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64 lg:flex-none">
                       {loadingUsers ? (
                         <ArrowPathIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
                       ) : (
                         <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                       )}
                       <input 
                         type="text" 
                         placeholder={t('admin.users.search_placeholder', 'Rechercher par nom, email ou ID...')} 
                         value={userSearch}
                         onChange={(e) => setUserSearch(e.target.value)}
                         className="w-full pl-11 pr-4 py-3 bg-bg-soft border border-transparent focus:bg-bg-card border-border-main rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
                       />
                    </div>
                   <select 
                     value={userRoleFilter}
                     onChange={(e) => setUserRoleFilter(e.target.value)}
                     className="px-4 py-3 bg-bg-soft border-border-main border rounded-2xl text-xs font-bold text-text-sub outline-none"
                   >
                     <option value="">{t('admin.users.filter.all_roles')}</option>
                     <option value="admin">{t('auth.role.admin')}</option>
                     <option value="agent">{t('auth.role.agent')}</option>
                     <option value="client">{t('auth.role.client')}</option>
                   </select>
                   <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                     <PlusIcon className="w-4 h-4" /> {t('admin.actions.new')}
                   </button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-bg-soft border-b border-border-main text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">
                      <th className="px-4 py-5">{t('admin.users.table.user')}</th>
                      <th className="px-4 py-5">{t('admin.users.table.role')}</th>
                      <th className="px-4 py-5 text-center">{t('admin.users.table.status')}</th>
                      <th className="px-4 py-5">{t('admin.users.table.date')}</th>
                      <th className="px-4 py-5 text-right">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main">
                    {loadingUsers ? (
                      [1, 2, 3, 4, 5].map(i => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-2xl bg-bg-soft border border-border-main"></div>
                              <div className="space-y-2">
                                <div className="h-4 w-32 bg-bg-soft border border-border-main rounded"></div>
                                <div className="h-3 w-24 bg-bg-soft border border-border-main rounded"></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-5"><div className="h-6 w-16 bg-bg-soft border border-border-main rounded-md"></div></td>
                          <td className="px-4 py-5 text-center"><div className="mx-auto h-5 w-12 bg-bg-soft border border-border-main rounded-full"></div></td>
                          <td className="px-4 py-5"><div className="h-4 w-24 bg-bg-soft border border-border-main rounded"></div></td>
                          <td className="px-4 py-5 text-right"><div className="ml-auto h-8 w-16 bg-bg-soft border border-border-main rounded-xl"></div></td>
                        </tr>
                      ))
                    ) : (
                      <>
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-bg-soft/50 transition-colors group">
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-bg-card border border-border-main flex items-center justify-center text-primary font-black shadow-sm group-hover:scale-110 transition-transform">
                                  {u.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-text-main text-sm">{u.name}</div>
                                  <div className="text-[11px] text-text-muted font-medium mt-0.5">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-5">{getRoleBadge(u.role)}</td>
                            <td className="px-4 py-5 text-center">{getStatusBadge(u.is_active)}</td>
                            <td className="px-4 py-5">
                              <div className="text-xs text-text-sub font-bold">
                                {new Date(u.created_at).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            </td>
                            <td className="px-4 py-5 text-right">
                              <div className="flex justify-end gap-2 transition-opacity">
                                <button 
                                  onClick={() => handleToggleUserStatus(u.id)}
                                  className="p-2 bg-bg-soft text-text-sub rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                  title={u.is_active ? "Désactiver" : "Activer"}
                                >
                                  <ArrowPathIcon className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-2 bg-bg-soft text-text-sub rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-all"
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
                             <td colSpan="5" className="p-20 text-center text-text-muted italic">{t('admin.users.no_match', 'Aucun utilisateur correspondant')}</td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
             </div>          </section>
          </RevealOnScroll>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
             <div className="p-8 border-b border-border-main flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-bg-soft">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-black text-text-main tracking-tight">{t('admin.properties.title')}</h3>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{properties.length} {t('admin.properties.subtitle')}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64 lg:flex-none">
                       {loadingProperties ? (
                         <ArrowPathIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
                       ) : (
                         <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                       )}
                       <input 
                         type="text" 
                         placeholder={t('admin.properties.search_placeholder', 'Rechercher par titre, ville ou ID...')} 
                         value={propertySearch}
                         onChange={(e) => setPropertySearch(e.target.value)}
                         className="w-full pl-11 pr-4 py-3 bg-bg-card border border-border-main rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
                       />
                    </div>
                   <select 
                     value={propStatusFilter}
                     onChange={(e) => setPropStatusFilter(e.target.value)}
                     className="px-4 py-3 bg-bg-card border-border-main border rounded-2xl text-xs font-bold text-text-sub outline-none"
                   >
                     <option value="">{t('admin.properties.filter.all')}</option>
                     <option value="available">{t('prop.status.available')}</option>
                     <option value="rented">{t('prop.status.rented')}</option>
                     <option value="sold">{t('prop.status.sold')}</option>
                   </select>
                 </div>
              </div>
             
             <div className="overflow-x-auto">
               {loadingProperties ? (
                  <div className="p-20 text-center text-text-muted font-bold uppercase tracking-widest animate-pulse">{t('common.loading', 'Chargement...')}</div>
               ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-bg-soft border-b border-border-main text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">
                       <th className="px-4 py-5">{t('admin.properties.table.reference')}</th>
                       <th className="px-4 py-5">{t('admin.properties.table.agent')}</th>
                       <th className="px-4 py-5 text-center">{t('admin.properties.table.approval')}</th>
                       <th className="px-4 py-5 text-center">{t('admin.properties.table.flags')}</th>
                       <th className="px-4 py-5 text-right">{t('common.actions')}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border-main">
                     {properties.map(p => (
                       <tr key={p.id} className="hover:bg-bg-soft/50 transition-colors group">
                         <td className="px-4 py-5">
                           <div className="flex items-center gap-4">
                             <div className="w-14 h-14 rounded-2xl bg-bg-soft overflow-hidden shrink-0 border border-border-main">
                               {p.images && p.images[0] ? (
                                 <img 
                                   src={p.images[0].startsWith('http') ? p.images[0] : `${import.meta.env.VITE_API_URL || ''}/storage/${p.images[0]}`} 
                                   className="w-full h-full object-cover" 
                                   onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'; }}
                                 />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-text-muted"><HomeIcon className="w-6 h-6" /></div>
                               )}
                             </div>
                             <div>
                               <div className="font-bold text-text-main text-sm truncate max-w-[200px]">{p.title}</div>
                               <div className="text-[11px] text-text-muted font-bold mt-0.5">{p.city} • {p.price_display}</div>
                             </div>
                           </div>
                         </td>
                         <td className="px-4 py-5">
                             <div className="text-sm font-bold text-text-sub">{p.user?.name || t('common.unknown')}</div>
                             <div className="text-[10px] text-text-muted uppercase tracking-wider">{p.user?.email}</div>
                          </td>
                         <td className="px-4 py-5 text-center">
                            {p.is_approved ? (
                              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-wider">{t('common.status.approved', 'Approuvé')}</span>
                            ) : (
                              <button 
                                onClick={() => handleApproveProperty(p.id)}
                                className="px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                              >
                                {t('common.status.pending', 'En attente')}
                              </button>
                            )}
                         </td>
                         <td className="px-4 py-5 text-center">
                            <div className="flex justify-center gap-2">
                               <button 
                                 onClick={() => handleTogglePropertyFeatured(p.id)}
                                 className={`p-1.5 rounded-lg transition-all ${p.is_featured ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-text-sub hover:text-amber-500'}`}
                               >
                                 <StarIcon className={`w-5 h-5 ${p.is_featured ? 'fill-current' : ''}`} />
                               </button>
                               <button 
                                 onClick={() => handleTogglePropertyArchive(p.id)}
                                 className={`p-1.5 rounded-lg transition-all ${p.is_archived ? 'text-text-main bg-bg-soft' : 'text-text-sub hover:text-text-main'}`}
                               >
                                 <ArchiveBoxIcon className={`w-5 h-5 ${p.is_archived ? 'fill-current' : ''}`} />
                               </button>
                            </div>
                         </td>
                         <td className="px-4 py-5 text-right">
                             <div className="flex justify-end gap-2 transition-opacity">
                                <Link 
                                  to={`/properties/${p.id}`} 
                                  className="p-2 bg-bg-soft text-text-sub rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                  title="Voir"
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </Link>
                                <Link 
                                  to={`/properties/edit/${p.id}`} 
                                  className="p-2 bg-bg-soft text-text-sub rounded-xl hover:bg-amber-100 hover:text-amber-600 transition-all"
                                  title="Modifier"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </Link>
                                <button 
                                  onClick={() => handleDeleteProperty(p.id)}
                                  className="p-2 bg-bg-soft text-text-sub rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-all"
                                  title="Supprimer"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                             </div>
                         </td>
                       </tr>
                     ))}
                     {properties.length === 0 && (
                       <tr>
                         <td colSpan="5" className="p-20 text-center text-text-muted italic">{t('admin.properties.no_data')}</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               )}
             </div>
          </section>
          </RevealOnScroll>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
             <div className="p-8 border-b border-border-main flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-bg-soft">
                <div className="flex flex-col gap-1">
                   <h3 className="text-xl font-black text-text-main tracking-tight">{t('admin.contracts.title')}</h3>
                   <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">{t('admin.contracts.subtitle')}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-64 lg:flex-none">
                       {loadingContracts ? (
                         <ArrowPathIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
                       ) : (
                         <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                       )}
                       <input 
                         type="text" 
                         placeholder="Numéro, client ou agent..." 
                         value={contractSearch}
                         onChange={(e) => setContractSearch(e.target.value)}
                         className="w-full pl-11 pr-4 py-3 bg-bg-card border border-border-main rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
                       />
                    </div>
                </div>
             </div>
             
              <div className="overflow-x-auto">
                {loadingContracts ? (
                  <div className="p-20 text-center text-text-muted font-bold uppercase tracking-widest animate-pulse">{t('common.loading')}</div>
                ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-bg-soft border-b border-border-main text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">
                       <th className="px-4 py-5">{t('admin.contracts.table.number')}</th>
                       <th className="px-4 py-5">{t('admin.contracts.table.parties')}</th>
                       <th className="px-4 py-5">{t('admin.contracts.table.period')}</th>
                       <th className="px-4 py-5">{t('admin.contracts.table.status')}</th>
                       <th className="px-4 py-5 text-right">{t('common.actions')}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border-main">
                     {contracts.map(c => (
                       <tr key={c.id} className="hover:bg-bg-soft/50 transition-colors group">
                         <td className="px-4 py-5">
                            <div className="font-black text-text-main text-sm">{c.contract_number}</div>
                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{c.contract_type === 'sale' ? t('admin.contracts.type.sale') : t('admin.contracts.type.rent')}</div>
                             {c.property && <div className="text-[10px] text-text-muted font-bold mt-1 truncate max-w-[150px]">{c.property.title}</div>}
                          </td>
                         <td className="px-4 py-5">
                            <div className="flex flex-col gap-1">
                               <div className="text-xs font-bold text-text-main"><span className="text-text-muted font-medium">C:</span> {c.tenant?.name || c.buyer?.name}</div>
                               <div className="text-xs font-bold text-text-main"><span className="text-text-muted font-medium">A:</span> {c.agent?.name}</div>
                            </div>
                         </td>
                         <td className="px-4 py-5">
                             <div className="text-[11px] font-bold text-text-sub">
                                {c.start_date 
                                  ? `${t('common.from', 'Du')} ${new Date(c.start_date).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'en' ? 'en-US' : 'fr-FR')} ${t('common.to', 'au')} ${new Date(c.end_date).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'en' ? 'en-US' : 'fr-FR')}` 
                                  : `${t('common.on', 'Le')} ${new Date(c.sale_date).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'en' ? 'en-US' : 'fr-FR')}`}
                             </div>
                         </td>
                         <td className="px-4 py-5">
                             <select value={c.status} onChange={(e) => handleUpdateContractStatus(c.id, e.target.value)} className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border-none outline-none cursor-pointer bg-slate-100 dark:bg-slate-800 text-text-muted">
                               <option value="pending">{t('admin.contracts.status.pending')}</option>
                               <option value="active">{t('admin.contracts.status.active')}</option>
                               <option value="cancelled">{t('admin.contracts.status.cancelled')}</option>
                             </select>
                         </td>
                         <td className="px-4 py-5 text-right">
                            <button 
                              onClick={() => handleDownloadContract(c.id)}
                              className="p-2.5 bg-bg-soft text-text-sub rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                               <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                         </td>
                       </tr>
                     ))}
                     {contracts.length === 0 && (
                       <tr>
                         <td colSpan="5" className="p-20 text-center text-text-muted italic font-bold">{t('admin.contracts.no_data')}</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               )}
             </div>
          </section>
          </RevealOnScroll>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
             <div className="p-8 border-b border-border-main bg-bg-soft">
                <h3 className="text-xl font-black text-text-main tracking-tight">{t('admin.payments.title')}</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">{t('admin.payments.subtitle')}</p>
             </div>
             
              <div className="overflow-x-auto">
                {loadingPayments ? (
                  <div className="p-20 text-center text-text-muted font-bold uppercase tracking-widest animate-pulse">{t('common.loading')}</div>
                ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-bg-soft border-b border-border-main text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">
                       <th className="px-4 py-5">{t('admin.payments.table.ref')}</th>
                       <th className="px-4 py-5">{t('admin.contracts.table.parties')}</th>
                       <th className="px-4 py-5">{t('common.amount')}</th>
                       <th className="px-4 py-5 text-center">{t('admin.payments.table.method')}</th>
                       <th className="px-4 py-5 text-center">{t('common.status')}</th>
                       <th className="px-4 py-5 text-right">{t('common.actions')}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border-main">
                     {payments.map(pay => (
                       <tr key={pay.id} className="hover:bg-bg-soft/50 transition-colors group">
                         <td className="px-4 py-5">
                             <div className="font-black text-text-main text-sm">{pay.payment_number}</div>
                             <div className="text-[10px] font-bold text-text-muted mt-0.5">{new Date(pay.payment_date).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'en' ? 'en-US' : 'fr-FR')}</div>
                          </td>
                         <td className="px-4 py-5">
                            <div className="text-xs font-bold text-text-main">{t('admin.contracts.table.number')}: {pay.contract?.contract_number}</div>
                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{pay.tenant?.name}</div>
                         </td>
                          <td className="px-4 py-5">
                             <div className="text-sm font-black text-text-main">{number_format(pay.amount, language)} DH</div>
                          </td>
                         <td className="px-4 py-5 text-center">
                             <span className="px-2 py-1 bg-bg-soft text-text-sub rounded-lg text-[9px] font-bold uppercase tracking-tighter">
                                {pay.payment_method === 'bank_transfer' ? t('admin.payments.method.bank') : pay.payment_method}
                             </span>
                          </td>
                         <td className="px-4 py-5 text-center">
                            <select 
                              value={pay.status}
                              onChange={(e) => handleUpdatePaymentStatus(pay.id, e.target.value)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border-none outline-none ${pay.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                            >
                               <option value="pending">{t('admin.payments.status.pending')}</option>
                               <option value="paid">{t('admin.payments.status.paid')}</option>
                               <option value="late">{t('admin.payments.status.late')}</option>
                               <option value="cancelled">{t('admin.payments.status.cancelled')}</option>
                            </select>
                         </td>
                          <td className="px-4 py-5 text-right">
                             <button className="text-primary hover:underline text-xs font-bold">{t('admin.payments.receipt', 'Justificatif')}</button>
                          </td>
                       </tr>
                     ))}
                     {payments.length === 0 && (
                       <tr>
                         <td colSpan="6" className="p-20 text-center text-text-muted font-bold uppercase tracking-widest">{t('admin.payments.no_data')}</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               )}
             </div>
          </section>
          </RevealOnScroll>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <RevealOnScroll>
            <div className="max-w-4xl space-y-8">
              <section className="bg-bg-card rounded-[2.5rem] border border-border-main shadow-sm hover:shadow-xl transition-shadow duration-500 p-10">
               <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-text-main tracking-tight">{t('admin.tabs.settings')}</h3>
                    <p className="text-text-muted font-bold text-sm mt-1 uppercase tracking-widest">{t('admin.settings.subtitle')}</p>
                  </div>
                  <button 
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary/90 disabled:opacity-50 shadow-xl shadow-primary/30 transition-all flex items-center gap-2"
                  >
                    {savingSettings ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-5 h-5" />}
                    {savingSettings ? t('admin.settings.saving') : t('admin.settings.save')}
                  </button>
               </div>

                {loadingSettings ? (
                 <div className="space-y-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-bg-soft rounded-3xl animate-pulse"></div>)}
                 </div>
               ) : (
                 <div className="space-y-8">
                    {/* Dynamic group rendering could be added here, currently just listing all */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {settings.map(setting => (
                         <div key={setting.key} className="flex flex-col gap-2">
                            <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">{t(`admin.settings.keys.${setting.key}`, setting.label || setting.key)}</label>
                            <input 
                              type={setting.type === 'integer' ? 'number' : 'text'}
                              value={setting.value}
                              onChange={(e) => handleUpdateSetting(setting.key, e.target.value)}
                              className="w-full px-5 py-4 bg-bg-soft border border-border-main rounded-2xl text-sm font-bold text-text-main outline-none focus:ring-2 focus:ring-primary/20 focus:bg-bg-card transition-all"
                            />
                            {setting.description && <p className="text-[11px] text-text-sub italic ml-1">{t(`admin.settings.desc.${setting.key}`, setting.description)}</p>}
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </section>
            
            <section className="bg-rose-50/50 dark:bg-rose-900/5 border border-rose-100 dark:border-rose-900/20 rounded-[2.5rem] p-10">
               <h4 className="text-lg font-black text-rose-800 dark:text-rose-400 tracking-tight mb-4">{t('admin.settings.danger_zone')}</h4>
               <p className="text-sm text-rose-600 dark:text-rose-500/70 mb-6 font-medium">{t('admin.settings.danger_desc')}</p>
               <button className="px-6 py-3 bg-white dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                  {t('admin.settings.reset_db')}
               </button>
            </section>
          </div>
          </RevealOnScroll>
        )}

        {/* Agent Requests Tab (kept for compatibility) */}
        {activeTab === 'agent-requests' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-3xl border border-border-main shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden">
             <div className="p-8 border-b border-border-main bg-bg-soft">
                <h3 className="text-xl font-black text-text-main tracking-tight">{t('admin.agent_requests.title')}</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">{t('admin.agent_requests.subtitle')}</p>
             </div>
             
              <div className="overflow-x-auto">
                {loadingRequests ? (
                  <div className="p-20 text-center text-text-muted font-bold uppercase tracking-widest animate-pulse">{t('common.loading')}</div>
                ) : (
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-bg-soft border-b border-border-main text-[10px] uppercase font-black tracking-[0.2em] text-text-muted">
                       <th className="px-4 py-5">{t('admin.agent_requests.table.candidate')}</th>
                       <th className="px-4 py-5">{t('admin.agent_requests.table.contact')}</th>
                       <th className="px-4 py-5">{t('admin.agent_requests.table.date')}</th>
                       <th className="px-4 py-5 text-right">{t('common.actions')}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border-main">
                     {agentRequests.map(req => (
                       <tr key={req.id} className="hover:bg-bg-soft/50 transition-colors group">
                         <td className="px-4 py-5">
                            <div className="font-black text-text-main text-sm">{req.name}</div>
                            <div className="text-[10px] font-bold text-text-muted mt-0.5">ID: #{req.id}</div>
                         </td>
                          <td className="px-4 py-5">
                            <div className="text-xs font-bold text-text-main">{req.email}</div>
                            <div className="text-[10px] font-bold text-text-muted mt-0.5">{req.phone || t('common.no_phone')}</div>
                         </td>
                          <td className="px-4 py-5">
                             <div className="text-xs font-bold text-text-sub">
                                {new Date(req.updated_at).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'en' ? 'en-US' : 'fr-FR')}
                             </div>
                          </td>
                         <td className="px-4 py-5 text-right">
                            <div className="flex justify-end gap-2">
                               <button 
                                 onClick={() => handleProcessAgentRequest(req.id, 'approved')}
                                 className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                               >
                                 {t('common.approve')}
                               </button>
                               <button 
                                 onClick={() => handleProcessAgentRequest(req.id, 'rejected')}
                                 className="px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                               >
                                 {t('common.reject')}
                               </button>
                            </div>
                         </td>
                       </tr>
                     ))}
                     {agentRequests.length === 0 && (
                       <tr>
                         <td colSpan="4" className="p-20 text-center text-text-muted font-bold uppercase tracking-widest">{t('admin.agent_requests.no_data')}</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               )}
             </div>
          </section>
          </RevealOnScroll>
        )}
        </div>
      </main>
    </div>
  );
};

const number_format = (number, lang = 'fr') => {
  const locale = lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-US' : 'fr-FR';
  return new Intl.NumberFormat(locale).format(number);
};
export default AdminDashboard;
