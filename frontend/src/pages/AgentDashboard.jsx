import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  BuildingOfficeIcon, 
  HomeIcon, 
  DocumentTextIcon, 
  DocumentDuplicateIcon, 
  ChatBubbleLeftRightIcon, 
  UserIcon, 
  CurrencyDollarIcon, 
  PlusIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  MapPinIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  KeyIcon, 
  TagIcon, 
  BellIcon,
  ChevronRightIcon,
  StarIcon as StarIconOutline,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { dashboardService } from '../services/dashboard';
import { propertyService } from '../services/properties';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import StatsCard from '../components/Common/StatsCard';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import RevenueChart from '../components/Dashboard/RevenueChart';

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
  const [requestFilter, setRequestFilter] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);
    
    try {
      const [statsRes, propsRes, reqsRes, contractsRes, reviewsRes] = await Promise.all([
        dashboardService.getAgentStats(),
        propertyService.getAgentProperties(),
        requestService.getAgentRequests(),
        contractService.getAgentContracts(),
        propertyService.getAgentReviews()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (propsRes.success) setProperties(propsRes.data.data || []);
      if (reqsRes.success) setRequests(reqsRes.data.data || []);
      if (contractsRes.success) setContracts(contractsRes.data.data || []);
      if (reviewsRes.success) setReviews(reviewsRes.data.data || []);
    } catch (error) {
      toast.error(t('dash.error_load', 'Erreur de chargement'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: t('nav.dashboard', 'Vue d\'ensemble'), icon: Squares2X2Icon },
    { id: 'properties', label: t('nav.properties', 'Mes Annonces'), icon: BuildingOfficeIcon },
    { id: 'requests', label: t('dash.requests', 'Demandes'), icon: DocumentTextIcon },
    { id: 'contracts', label: t('dash.contracts', 'Contrats'), icon: DocumentDuplicateIcon },
    { id: 'reviews', label: t('dash.reviews', 'Avis Clients'), icon: StarIconOutline }
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md border border-primary/30">
              <KeyIcon className="w-3.5 h-3.5" />
              {t('dash.agent_portal', 'Portail Agent Certifié')}
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-text-main tracking-tighter uppercase leading-none">
              {t('dash.welcome_p1', 'Bonjour,')} <span className="text-primary">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted opacity-60">
              {t('dash.agent_subtitle', 'Gérez votre empire immobilier avec précision.')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => loadAllData(true)} className="p-4 rounded-xl bg-bg-card border border-border-main text-text-muted hover:text-primary transition-all shadow-sm">
              <ArrowPathIcon className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link to="/properties/add" className="px-8 py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-3">
              <PlusIcon className="w-5 h-5" />
              {t('admin.add.title', 'Nouveau Bien')}
            </Link>
          </div>
        </motion.div>

        {/* Horizontal Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${
                activeTab === item.id 
                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                  : 'bg-bg-card border-border-main text-text-sub hover:border-primary/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
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
              className="space-y-12"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard title={t('dash.stats.total_props')} value={stats.totalProperties} icon={BuildingOfficeIcon} color="blue" delay={0} />
                <StatsCard title={t('dash.stats.pending_reqs')} value={stats.pendingRequests} icon={DocumentTextIcon} color="amber" delay={100} />
                <StatsCard title={t('dash.stats.active_contracts')} value={stats.activeContracts} icon={DocumentDuplicateIcon} color="emerald" delay={200} />
                <StatsCard title={t('dash.stats.revenue')} value={`${stats.monthlyRevenue?.toLocaleString()} DH`} icon={CurrencyDollarIcon} color="indigo" delay={300} />
              </div>

              {/* Charts & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 bg-bg-card border border-border-main rounded-xl p-10 shadow-2xl">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-text-main uppercase tracking-widest">{t('dash.revenue_overview', 'Performance des Revenus')}</h3>
                    <div className="flex items-center gap-2 text-emerald-500 font-black text-xs">
                      <ArrowPathIcon className="w-4 h-4" />
                      {t('dash.real_time', 'Temps Réel')}
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <RevenueChart data={stats.revenueChartData} theme={theme} />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-bg-card border border-border-main rounded-xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-6">{t('dash.quick_actions', 'Actions Rapides')}</h3>
                    <div className="space-y-4">
                      <button onClick={() => navigate('/properties/add')} className="w-full p-5 bg-bg-soft border border-border-main rounded-xl flex items-center justify-between group hover:border-primary transition-all">
                        <div className="flex items-center gap-4">
                          <PlusIcon className="w-6 h-6 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-main">{t('admin.add.title', 'Publier un Bien')}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button onClick={() => setActiveTab('requests')} className="w-full p-5 bg-bg-soft border border-border-main rounded-xl flex items-center justify-between group hover:border-primary transition-all">
                        <div className="flex items-center gap-4">
                          <DocumentTextIcon className="w-6 h-6 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-main">{t('dash.view_requests', 'Voir les Demandes')}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-bg-card border border-border-main rounded-xl p-8 shadow-2xl">
                    <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-6">{t('dash.recent_reviews', 'Avis Récents')}</h3>
                    <div className="space-y-6">
                      {reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-sub">{review.user?.name}</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <StarIconSolid key={i} className={`w-3 h-3 ${i < review.rating ? 'text-primary' : 'text-text-muted opacity-20'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs font-bold text-text-main line-clamp-2 italic opacity-60">"{review.comment}"</p>
                        </div>
                      ))}
                      {reviews.length === 0 && <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40 text-center py-4">{t('dash.no_reviews', 'Aucun avis récent')}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'properties' && (
            <motion.div 
              key="properties"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-bg-card border border-border-main rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-border-main bg-bg-soft flex justify-between items-center">
                 <h3 className="text-xl font-black text-text-main uppercase tracking-widest">{t('dash.my_listings', 'Mes Annonces')}</h3>
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary">{properties.length} {t('common.results', 'biens')}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-bg-soft/30 border-b border-border-main">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{t('prop.title', 'Bien')}</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{t('prop.card.price', 'Prix')}</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{t('common.status', 'Statut')}</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">{t('common.actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main/50">
                    {properties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-bg-soft/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-border-main bg-bg-soft shrink-0">
                               {prop.images?.[0] && <img src={`http://localhost:8000/storage/${prop.images[0]}`} className="w-full h-full object-cover" alt="" />}
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-black text-text-main uppercase tracking-widest line-clamp-1">{prop.title}</p>
                              <div className="flex items-center gap-1.5 text-[9px] font-black text-text-muted uppercase tracking-widest opacity-60">
                                <MapPinIcon className="w-3 h-3" />
                                {prop.city}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 font-black text-sm text-text-main">{prop.price?.toLocaleString()} DH</td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${prop.is_available ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                             {prop.is_available ? t('prop.status.available') : t('prop.status.occupied')}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex justify-end gap-3">
                             <Link to={`/properties/${prop.id}`} className="p-3 bg-bg-soft border border-border-main rounded-xl text-text-muted hover:text-primary transition-all shadow-sm">
                               <EyeIcon className="w-5 h-5" />
                             </Link>
                             <button className="p-3 bg-bg-soft border border-border-main rounded-xl text-text-muted hover:text-amber-500 transition-all shadow-sm">
                               <PencilIcon className="w-5 h-5" />
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Additional tabs (Requests, Contracts, Reviews) would follow same patterns */}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AgentDashboard;