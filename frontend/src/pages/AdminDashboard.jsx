import React, { useState, useEffect, useRef } from 'react';
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
  EyeIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardService } from '../services/dashboard';
import { userService } from '../services/users';
import { propertyService } from '../services/properties';
import { contractService } from '../services/contracts';
import { paymentService } from '../services/payments';
import { settingService } from '../services/settings';
import StatsCard from '../components/Common/StatsCard';
import RevenueChart from '../components/Dashboard/RevenueChart';

// Admin Sub-pages
import AdminUsers from './admin/AdminUsers';
import AdminProperties from './admin/AdminProperties';
import AdminContracts from './admin/AdminContracts';
import AdminPayments from './admin/AdminPayments';
import AdminRequests from './admin/AdminRequests';
import AdminSettings from './admin/AdminSettings';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  }
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await dashboardService.getAdminStats();
      if (response.success) setStats(response.data);
    } catch (error) {
      toast.error(t('dash.error_load', 'Erreur de chargement'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: t('nav.dashboard', 'Vue d\'ensemble'), icon: Squares2X2Icon, path: '/dashboard/admin' },
    { id: 'users', label: t('dash.users', 'Utilisateurs'), icon: UserGroupIcon, path: '/dashboard/admin/users' },
    { id: 'properties', label: t('nav.properties', 'Biens'), icon: BuildingOfficeIcon, path: '/dashboard/admin/properties' },
    { id: 'contracts', label: t('dash.contracts', 'Contrats'), icon: DocumentTextIcon, path: '/dashboard/admin/contracts' },
    { id: 'payments', label: t('dash.payments', 'Paiements'), icon: CurrencyDollarIcon, path: '/dashboard/admin/payments' },
    { id: 'agent-requests', label: t('dash.requests', 'Demandes Agents'), icon: ShieldCheckIcon, path: '/dashboard/admin/agent-requests' },
    { id: 'settings', label: t('dash.settings', 'Configuration'), icon: Cog6ToothIcon, path: '/dashboard/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-bg-soft pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border-main pb-12"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-rose-500/20">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              {t('dash.admin_auth', 'Contrôle Administrateur')}
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-text-main tracking-tighter uppercase leading-none">
              {t('dash.admin_title', 'Dashboard')} <span className="text-primary">{t('dash.admin_subtitle', 'Admin')}</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted opacity-60">
              {t('dash.admin_desc', 'Supervision globale de la plateforme IMMORent.')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => loadDashboardData(true)} className="p-4 rounded-lg bg-bg-card border border-border-main text-text-muted hover:text-primary transition-all shadow-sm">
              <ArrowPathIcon className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex -space-x-3 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="inline-block h-10 w-10 rounded-lg ring-2 ring-bg-card bg-bg-soft flex items-center justify-center border border-border-main">
                  <UserIcon className="w-5 h-5 text-text-muted" />
                </div>
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-[10px] font-black text-white ring-2 ring-bg-card">
                +12
              </div>
            </div>
          </div>
        </motion.div>

        {/* Horizontal Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4"
        >
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`px-6 py-4 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${
                activeTab === item.id 
                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                  : 'bg-bg-card border-border-main text-text-sub hover:border-primary/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard title={t('dash.stats.users')} value={stats?.totalUsers || 0} icon={UserGroupIcon} color="blue" delay={0} />
                <StatsCard title={t('dash.stats.properties')} value={stats?.totalProperties || 0} icon={BuildingOfficeIcon} color="indigo" delay={100} />
                <StatsCard title={t('dash.stats.revenue')} value={`${stats?.totalRevenue?.toLocaleString() || 0} DH`} icon={CurrencyDollarIcon} color="emerald" delay={200} />
                <StatsCard title={t('dash.stats.active_contracts')} value={stats?.totalContracts || 0} icon={DocumentTextIcon} color="amber" delay={300} />
              </div>

              {/* Charts & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 bg-bg-card border border-border-main rounded-lg p-10 shadow-2xl">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-text-main uppercase tracking-widest">{t('dash.platform_growth', 'Croissance de la Plateforme')}</h3>
                    <div className="flex items-center gap-2 text-primary font-black text-xs">
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                      {t('dash.updated_now', 'Mis à jour')}
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <RevenueChart data={stats?.revenueData || []} theme={theme} />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-bg-card border border-border-main rounded-lg p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-6">{t('dash.quick_controls', 'Contrôles Rapides')}</h3>
                    <div className="space-y-4">
                      <Link to="/dashboard/admin/users" className="w-full p-5 bg-bg-soft border border-border-main rounded-lg flex items-center justify-between group hover:border-primary transition-all">
                        <div className="flex items-center gap-4">
                          <UserGroupIcon className="w-6 h-6 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-main">{t('dash.manage_users', 'Gérer les Utilisateurs')}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link to="/dashboard/admin/settings" className="w-full p-5 bg-bg-soft border border-border-main rounded-lg flex items-center justify-between group hover:border-primary transition-all">
                        <div className="flex items-center gap-4">
                          <Cog6ToothIcon className="w-6 h-6 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-main">{t('dash.system_config', 'Configuration Système')}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  <div className="bg-bg-card border border-border-main rounded-lg p-8 shadow-2xl">
                    <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-6">{t('dash.recent_logs', 'Activités Récentes')}</h3>
                    <div className="space-y-6">
                       {stats?.recentActivity?.slice(0, 5).map((log, i) => (
                         <div key={i} className="flex gap-4 border-l-2 border-primary/20 pl-4 py-1">
                           <div className="space-y-1">
                             <p className="text-xs font-bold text-text-main">{log.description}</p>
                             <p className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-40">{new Date(log.created_at).toLocaleString()}</p>
                           </div>
                         </div>
                       )) || <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40 text-center py-4">{t('dash.no_activity', 'Aucune activité récente')}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AdminUsers />
            </motion.div>
          )}

          {activeTab === 'properties' && (
            <motion.div key="properties" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AdminProperties />
            </motion.div>
          )}

          {activeTab === 'contracts' && (
            <motion.div key="contracts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AdminContracts />
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AdminPayments />
            </motion.div>
          )}

          {activeTab === 'agent-requests' && (
            <motion.div key="agent-requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AdminRequests />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AdminSettings />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
