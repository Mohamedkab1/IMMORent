import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
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
import AddUserModal from '../components/Dashboard/AddUserModal';

const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { theme } = useTheme();

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
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
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
        toast.error(t('admin.err.load_users', 'Erreur chargement utilisateurs'));
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
      toast.error(t('admin.err.load_props', 'Erreur chargement biens'));
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
      toast.error(t('admin.err.load_contracts', 'Erreur chargement contrats'));
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
      toast.error(t('admin.err.load_payments', 'Erreur chargement paiements'));
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
      toast.error(t('admin.err.load_settings', 'Erreur chargement paramètres'));
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
      toast.error(t('admin.err.toggle_status', 'Erreur lors du changement de statut'));
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm(t('admin.users.del_confirm'))) {
      try {
        const res = await userService.delete(id);
        if (res.success) {
          toast.success(res.message);
          loadUsers();
        }
      } catch (error) {
        toast.error(t('admin.err.delete', 'Erreur lors de la suppression'));
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
      toast.error(t('admin.err.approve', 'Erreur approbation'));
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm(t('admin.prop.del_confirm_title'))) {
      try {
        const res = await propertyService.delete(id);
        if (res.success) {
          toast.success(res.message || 'Bien supprimé avec succès');
          loadProperties();
        }
      } catch (error) {
        toast.error(t('admin.err.delete', 'Erreur lors de la suppression'));
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
      toast.error(t('admin.err.archive', 'Erreur archivage'));
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
      toast.error(t('admin.err.featured', 'Erreur mise en avant'));
    }
  };

  const handleProcessAgentRequest = async (userId, status) => {
    if (window.confirm(t('admin.req.process_confirm'))) {
      try {
        const res = await userService.processAgentRequest(userId, status);
        if (res.success) {
          toast.success(res.message);
          loadAgentRequests();
          loadDashboardStats();
        }
      } catch (error) {
        toast.error(t('admin.err.process', 'Erreur lors du traitement'));
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
      toast.error(t('admin.err.save_settings', 'Erreur sauvegarde paramètres'));
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
      toast.error(t('admin.err.update_payment_status', 'Erreur mise à jour statut paiement'));
    }
  };

  const handleDownloadContract = async (id) => {
    try {
      await contractService.download(id, language);
      toast.success(t('admin.contracts.downloading'));
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
      case 'admin': return <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-xl text-[10px] font-bold uppercase">{t('auth.role.admin')}</span>;
      case 'agent': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-xl text-[10px] font-bold uppercase">{t('auth.role.agent')}</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-bold uppercase">{t('auth.role.client')}</span>;
    }
  };

  const getStatusBadge = (status) => {
    const isActive = status === 'active' || status === 1 || status === true;
    return isActive 
      ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-xl text-[10px] font-bold">{t('common.status.active', 'Actif')}</span>
      : <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-bold">{t('common.status.inactive', 'Inactif')}</span>;
  };

  // --- Render Helpers ---
  if (!user || !user.role || user.role.slug !== 'admin') {
    return <div className="p-8 text-center">{t('common.restricted')}</div>;
  }


  return (
    <div className="flex-1 bg-bg-soft flex font-outfit pt-[120px]">
      {/* Sidebar Background Wrapper */}
      <div className="w-full md:w-[280px] bg-bg-card border-r border-border-main shrink-0">
        {/* Sticky Sidebar Navigation */}
        <aside className="flex flex-col sticky top-[120px] h-[calc(100vh-120px)] z-40">
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-sm">
            <BuildingOfficeIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-text-main tracking-tight leading-none">IMMORent</h1>
            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          <div className="mb-4">
            <p className="px-4 text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{t('admin.menu.main', 'Menu Principal')}</p>
            <div className="space-y-1">
              <Link 
                to="/dashboard/admin" 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs ${activeTab === 'dashboard' ? 'bg-primary shadow-lg shadow-primary/20 ' + (theme === 'light' ? '!text-white' : 'text-white') : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
              >
                <ChartBarIcon className="w-4 h-4" /> {t('admin.tabs.overview')}
              </Link>
              <Link 
                to="/dashboard/admin/users" 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs ${activeTab === 'users' ? 'bg-primary shadow-lg shadow-primary/20 ' + (theme === 'light' ? '!text-white' : 'text-white') : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
              >
                <UserGroupIcon className="w-4 h-4" /> {t('admin.tabs.users')}
              </Link>
              <Link 
                to="/dashboard/admin/properties" 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs ${activeTab === 'properties' ? 'bg-primary shadow-lg shadow-primary/20 ' + (theme === 'light' ? '!text-white' : 'text-white') : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
              >
                <HomeIcon className="w-4 h-4" /> {t('admin.tabs.properties')}
              </Link>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="px-4 text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{t('admin.menu.management', 'Gestion')}</p>
            <div className="space-y-1">
              <Link 
                to="/dashboard/admin/contracts" 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs ${activeTab === 'contracts' ? 'bg-primary shadow-lg shadow-primary/20 ' + (theme === 'light' ? '!text-white' : 'text-white') : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
              >
                <DocumentTextIcon className="w-4 h-4" /> {t('admin.tabs.contracts')}
              </Link>
              <Link 
                to="/dashboard/admin/payments" 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs ${activeTab === 'payments' ? 'bg-primary shadow-lg shadow-primary/20 ' + (theme === 'light' ? '!text-white' : 'text-white') : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
              >
                <CurrencyDollarIcon className="w-4 h-4" /> {t('admin.tabs.payments')}
              </Link>
            </div>
          </div>
          
          <div>
            <p className="px-4 text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{t('admin.menu.others', 'Autres')}</p>
            <div className="space-y-1">
              <Link 
                to="/dashboard/admin/agent-requests" 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs relative ${activeTab === 'agent-requests' ? 'bg-primary shadow-lg shadow-primary/20 ' + (theme === 'light' ? '!text-white' : 'text-white') : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
              >
                <UserIcon className="w-4 h-4" /> {t('admin.tabs.agent_requests')}
                {stats?.requests?.pending > 0 && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-rose-500 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-bg-card animate-pulse">
                    {stats.requests.pending}
                  </span>
                )}
              </Link>
              <Link 
                to="/notifications" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs text-text-sub hover:bg-bg-soft hover:text-text-main"
              >
                <BellIcon className="w-4 h-4" /> {t('nav.notifications')}
              </Link>
              <Link 
                to="/dashboard/admin/settings" 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs ${activeTab === 'settings' ? 'bg-primary shadow-lg shadow-primary/20 ' + (theme === 'light' ? '!text-white' : 'text-white') : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
              >
                <Cog6ToothIcon className="w-4 h-4" /> {t('admin.tabs.settings')}
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-6 mt-auto">
           <div className="bg-bg-soft rounded-xl border border-border-main p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-text-main truncate">{user.name}</p>
                  <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">{t('auth.role.admin')}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="w-full py-2 bg-bg-card text-text-sub text-[10px] font-black uppercase tracking-widest rounded-lg border border-border-main hover:bg-bg-soft hover:text-text-main transition-all flex items-center justify-center gap-2"
              >
                <HomeIcon className="w-3.5 h-3.5" /> {t('admin.back_to_site')}
              </button>
           </div>
        </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 md:p-12 max-w-[1600px] mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-text-main tracking-tight"
            >
              {activeTab === 'dashboard' && t('admin.tabs.overview')}
              {activeTab === 'users' && t('admin.tabs.users')}
              {activeTab === 'properties' && t('admin.tabs.properties')}
              {activeTab === 'contracts' && t('admin.tabs.contracts')}
              {activeTab === 'payments' && t('admin.tabs.payments')}
              {activeTab === 'agent-requests' && t('admin.tabs.agent_requests')}
              {activeTab === 'settings' && t('admin.tabs.settings')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-text-sub font-bold mt-2 uppercase tracking-[0.2em] text-[10px]"
            >
              {t('dash.admin.welcome')}, {user.name} • {new Date().toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </motion.p>
          </div>
          <div className="flex items-center gap-4">
             <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (activeTab === 'users') loadUsers();
                else if (activeTab === 'properties') loadProperties();
                else if (activeTab === 'dashboard') loadDashboardStats();
                toast.info(t('common.refreshing'));
              }}
              className="p-4 bg-bg-card text-text-sub rounded-2xl border border-border-main shadow-sm hover:shadow-xl hover:text-primary transition-all group"
            >
              <ArrowPathIcon className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
            </motion.button>
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
                    color="indigo"
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
                <div className="bg-bg-card rounded-xl border border-border-main shadow-sm p-8 h-full">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-black text-text-main tracking-tight">{t('admin.overview.performance')}</h3>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">{t('admin.overview.evolution')}</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-4 py-2 bg-bg-soft text-text-sub text-[10px] font-bold rounded-lg border border-border-main hover:bg-primary hover:text-white transition-all">
                         {t('admin.overview.year', 'Année')} 2024
                       </button>
                    </div>
                  </div>
                  <div className="h-[320px]">
                    <RevenueChart data={stats?.revenue?.monthly || []} />
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <div className="bg-bg-card rounded-xl border border-border-main shadow-sm p-8 h-full flex flex-col">
                  <h3 className="text-xl font-black text-text-main tracking-tight mb-8">{t('admin.overview.alerts')}</h3>
                  <div className="space-y-4 flex-1">
                     <motion.div 
                        whileHover={{ x: 5 }}
                        className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-xl flex gap-4 hover:bg-rose-500/10 transition-all group"
                     >
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                          <XCircleIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-rose-900 dark:text-rose-400 text-sm">{t('admin.alerts.late_payments.title')}</p>
                          <p className="text-rose-600/70 dark:text-rose-500/60 text-[11px] mt-1 leading-relaxed">{t('admin.alerts.late_payments.desc')}</p>
                        </div>
                     </motion.div>
                     <motion.div 
                        whileHover={{ x: 5 }}
                        className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-4 hover:bg-blue-500/10 transition-all group"
                     >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                          <BellIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-blue-900 dark:text-blue-400 text-sm">{t('admin.alerts.new_report.title')}</p>
                          <p className="text-blue-600/70 dark:text-blue-500/60 text-[11px] mt-1 leading-relaxed">{t('admin.alerts.new_report.desc')}</p>
                        </div>
                     </motion.div>
                  </div>
                  <button className="w-full py-3 mt-6 bg-bg-soft text-text-sub text-[10px] font-bold rounded-lg border border-border-main hover:text-primary transition-all">
                    {t('admin.overview.view_all_alerts', 'Voir toutes les alertes')}
                  </button>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-xl border border-border-main shadow-sm overflow-hidden">
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
                         className="w-full pl-11 pr-4 py-3 bg-bg-soft border border-transparent focus:bg-bg-card border-border-main rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
                       />
                    </div>
                   <select 
                     value={userRoleFilter}
                     onChange={(e) => setUserRoleFilter(e.target.value)}
                     className="px-4 py-3 bg-bg-soft border-border-main border rounded-xl text-xs font-bold text-text-sub outline-none"
                   >
                     <option value="">{t('admin.users.filter.all_roles')}</option>
                     <option value="admin">{t('auth.role.admin')}</option>
                     <option value="agent">{t('auth.role.agent')}</option>
                     <option value="client">{t('auth.role.client')}</option>
                   </select>
                   <button 
                     onClick={() => setIsAddUserModalOpen(true)}
                     className="flex items-center gap-2 px-6 py-3 bg-primary !text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                   >
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
                              <div className="w-11 h-11 rounded-xl bg-bg-soft border border-border-main"></div>
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
                                <div className="w-11 h-11 rounded-xl bg-bg-card border border-border-main flex items-center justify-center text-primary font-black shadow-sm group-hover:scale-110 transition-transform">
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
            <section className="bg-bg-card rounded-xl border border-border-main shadow-sm overflow-hidden">
             <div className="p-8 border-b border-border-main flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
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
                         className="w-full pl-11 pr-4 py-3 bg-bg-soft border border-transparent focus:bg-bg-card border-border-main rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
                       />
                    </div>
                   <select 
                     value={propStatusFilter}
                     onChange={(e) => setPropStatusFilter(e.target.value)}
                     className="px-4 py-3 bg-bg-soft border-border-main border rounded-xl text-xs font-bold text-text-sub outline-none"
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
                       <th className="px-4 py-5 text-right">{t('common.actions')}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border-main">
                     {properties.map(p => (
                       <tr key={p.id} className="hover:bg-bg-soft/50 transition-colors group">
                         <td className="px-4 py-5">
                           <div className="flex items-center gap-4">
                             <div className="w-14 h-14 rounded-xl bg-bg-soft overflow-hidden shrink-0 border border-border-main">
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
                         <td className="px-4 py-5 text-right">
                             <div className="flex justify-end gap-2 transition-opacity">
                                <Link 
                                  to={`/properties/${p.id}`} 
                                  className="p-2 bg-bg-soft text-text-sub rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                                  title="Voir"
                                >
                                  <EyeIcon className="w-4 h-4" />
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
                         <td colSpan="4" className="p-20 text-center text-text-muted italic">{t('admin.properties.no_data')}</td>
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
            <section className="bg-bg-card rounded-xl border border-border-main shadow-sm overflow-hidden">
             <div className="p-8 border-b border-border-main flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
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
                         className="w-full pl-11 pr-4 py-3 bg-bg-soft border border-transparent focus:bg-bg-card border-border-main rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
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
                         <td className="px-4 py-5 text-right">
                            <div className="flex justify-end gap-2 transition-opacity">
                               <button 
                                 onClick={() => toast.info(t('admin.contracts.view_not_implemented', 'Affichage du contrat non encore implémenté'))}
                                 className="p-2.5 bg-bg-soft text-text-sub rounded-xl hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                                 title="Voir"
                               >
                                 <EyeIcon className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => handleDownloadContract(c.id)}
                                 className="p-2.5 bg-bg-soft text-text-sub rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                 title="Télécharger"
                               >
                                  <ArrowDownTrayIcon className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                       </tr>
                     ))}
                     {contracts.length === 0 && (
                       <tr>
                         <td colSpan="4" className="p-20 text-center text-text-muted italic font-bold">{t('admin.contracts.no_data')}</td>
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
            <section className="bg-bg-card rounded-xl border border-border-main shadow-sm overflow-hidden">
             <div className="p-8 border-b border-border-main">
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
                             <span className="px-2 py-1 bg-bg-soft text-text-sub rounded-xl text-[9px] font-bold uppercase tracking-tighter">
                                {pay.payment_method === 'bank_transfer' ? t('admin.payments.method.bank') : pay.payment_method}
                             </span>
                          </td>
                         <td className="px-4 py-5 text-center">
                            <span className={`px-2 py-1 rounded-xl text-[10px] font-black uppercase ${pay.status === 'paid' ? 'bg-green-100 text-green-700' : pay.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                               {t(`admin.payments.status.${pay.status}`)}
                            </span>
                         </td>
                          <td className="px-4 py-5 text-right">
                            <div className="flex justify-end transition-opacity">
                               <button 
                                 onClick={() => toast.info(t('admin.payments.download_invoice_not_implemented', 'Téléchargement de la facture non encore implémenté'))}
                                 className="p-2.5 bg-bg-soft text-text-sub rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                 title="Télécharger Facture"
                               >
                                  <ArrowDownTrayIcon className="w-4 h-4" />
                               </button>
                            </div>
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
              <section className="bg-bg-card rounded-xl border border-border-main shadow-sm p-10">
               <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-text-main tracking-tight">{t('admin.tabs.settings')}</h3>
                    <p className="text-text-muted font-bold text-sm mt-1 uppercase tracking-widest">{t('admin.settings.subtitle')}</p>
                  </div>
                  <button 
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="px-8 py-3 bg-primary !text-white !opacity-100 text-sm font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 shadow-xl shadow-primary/30 transition-all flex items-center gap-2"
                  >
                    {savingSettings ? <ArrowPathIcon className="w-4 h-4 animate-spin !text-white" /> : <CheckCircleIcon className="w-5 h-5 !text-white" />}
                    <span className="!text-white !opacity-100">{savingSettings ? t('admin.settings.saving') : t('admin.settings.save')}</span>
                  </button>
               </div>

                {loadingSettings ? (
                 <div className="space-y-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-bg-soft rounded-xl animate-pulse"></div>)}
                 </div>
               ) : (
                 <div className="space-y-8">
                    {/* Dynamic group rendering could be added here, currently just listing all */}
                    <motion.div 
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                      }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                       {settings.map(setting => (
                         <motion.div 
                           key={setting.key} 
                           variants={{
                             hidden: { opacity: 0, y: 15 },
                             show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                           }}
                           className="flex flex-col gap-3 p-6 bg-bg-main/30 rounded-xl border border-border-main/60 focus-within:border-primary/40 focus-within:bg-bg-soft/50 transition-all hover:shadow-sm group"
                         >
                            <label className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-focus-within:bg-primary transition-colors"></span>
                              {t(`admin.settings.keys.${setting.key}`, setting.label || setting.key)}
                            </label>
                            <input 
                              type={setting.type === 'integer' ? 'number' : 'text'}
                              value={setting.value}
                              onChange={(e) => handleUpdateSetting(setting.key, e.target.value)}
                              className="w-full px-5 py-3.5 bg-bg-card border border-border-main rounded-xl text-sm font-bold text-text-main outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
                            />
                            {setting.description && <p className="text-[11px] text-text-muted font-medium italic mt-1">{t(`admin.settings.desc.${setting.key}`, setting.description)}</p>}
                         </motion.div>
                       ))}
                    </motion.div>
                 </div>
               )}
            </section>
            
            <section className="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-200/50 dark:border-rose-900/30 rounded-xl p-8 relative overflow-hidden">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
               <div className="flex items-start justify-between gap-4">
                 <div>
                   <h4 className="text-lg font-black text-rose-800 dark:text-rose-400 tracking-tight flex items-center gap-2">
                     <TrashIcon className="w-5 h-5" />
                     {t('admin.settings.danger_zone')}
                   </h4>
                   <p className="text-sm text-rose-600/80 dark:text-rose-400/70 mt-2 font-medium max-w-lg">{t('admin.settings.danger_desc')}</p>
                 </div>
                 <button className="px-6 py-3 bg-white dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all flex items-center gap-2 shadow-sm shrink-0">
                    <ArrowPathIcon className="w-4 h-4" />
                    {t('admin.settings.reset_db')}
                 </button>
               </div>
            </section>
          </div>
          </RevealOnScroll>
        )}

        {/* Agent Requests Tab (kept for compatibility) */}
        {activeTab === 'agent-requests' && (
          <RevealOnScroll>
            <section className="bg-bg-card rounded-xl border border-border-main shadow-sm overflow-hidden">
             <div className="p-8 border-b border-border-main">
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
        <AnimatePresence>
          <AddUserModal 
             isOpen={isAddUserModalOpen} 
             onClose={() => setIsAddUserModalOpen(false)} 
             onSuccess={() => loadUsers()} 
          />
        </AnimatePresence>
      </main>
    </div>
  );
};

const number_format = (number, lang = 'fr') => {
  const locale = lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-US' : 'fr-FR';
  return new Intl.NumberFormat(locale).format(number);
};
export default AdminDashboard;
