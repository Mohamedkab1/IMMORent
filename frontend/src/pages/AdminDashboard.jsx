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
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { dashboardService } from '../services/dashboard';
import StatsCard from '../components/Common/StatsCard';
import RevenueChart from '../components/Dashboard/RevenueChart';
import AdminReviews from './admin/AdminReviews';

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getActiveTab = () => {
    if (location.pathname.includes('/users')) return 'users';
    if (location.pathname.includes('/properties')) return 'properties';
    if (location.pathname.includes('/contracts')) return 'contracts';
    if (location.pathname.includes('/payments')) return 'payments';
    if (location.pathname.includes('/requests')) return 'requests';
    if (location.pathname.includes('/settings')) return 'settings';
    if (location.pathname.includes('/reviews')) return 'reviews';
    return 'dashboard';
  };

  const activeTab = getActiveTab();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        console.warn('Stats response:', response);
        toast.error(response.message || 'Erreur lors du chargement des statistiques');
        // Fallback stats to prevent crash
        setStats({
          properties: { total: 0, available: 0, rented: 0, sold: 0 },
          users: { total: 0, clients: 0, agents: 0 },
          requests: { total: 0, pending: 0 },
          contracts: { active: 0 },
          revenue: { total: 0, monthly: [] },
          charts: { properties_by_type: [], registrations_by_month: [] }
        });
      }
    } catch (error) {
      console.error('Erreur stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
      // Set fallback stats on error
      setStats({
        properties: { total: 0, available: 0, rented: 0, sold: 0 },
        users: { total: 0, clients: 0, agents: 0 },
        requests: { total: 0, pending: 0 },
        contracts: { active: 0 },
        revenue: { total: 0, monthly: [] },
        charts: { properties_by_type: [], registrations_by_month: [] }
      });
    } finally {
      setLoading(false);
    }
  };
  
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: 'Pierre Durand', action: 'a fait une demande pour Appartement Lyon', time: 'Il y a 5 minutes', type: 'request' },
    { id: 2, user: 'Marie Martin', action: 'a validé un contrat pour Maison Caluire', time: 'Il y a 30 minutes', type: 'contract' },
    { id: 3, user: 'Sophie Bernard', action: 'a effectué un paiement de 850DH', time: 'Il y a 2 heures', type: 'payment' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Admin Principal', email: 'admin@immobilier.com', role: 'admin', status: 'active', created_at: '2024-01-01' },
    { id: 2, name: 'Agent Dupont', email: 'agent@immobilier.com', role: 'agent', status: 'active', created_at: '2024-01-15' },
    { id: 3, name: 'Client Martin', email: 'client@immobilier.com', role: 'client', status: 'active', created_at: '2024-02-01' },
  ]);


  const [properties, setProperties] = useState([
    { id: 1, title: 'Appartement Lyon', type: 'apartment', price: 1200, status: 'available', city: 'Lyon' },
    { id: 2, title: 'Maison Caluire', type: 'house', price: 2500, status: 'rented', city: 'Caluire' },
    { id: 3, title: 'Studio Villeurbanne', type: 'studio', price: 800, status: 'available', city: 'Villeurbanne' },
  ]);

  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardStats();
    setRefreshing(false);
    toast.success('Données système actualisées');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: 'Actif', icon: CheckCircleIcon },
      inactive: { bg: 'bg-[var(--bg-muted)]', text: 'text-[var(--text-muted)]', label: 'Inactif', icon: XCircleIcon },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-500', label: 'En attente', icon: ClockIcon },
      approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: 'Approuvé', icon: CheckCircleIcon },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: 'Refusé', icon: XCircleIcon },
      available: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: 'Disponible', icon: CheckCircleIcon },
      rented: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-500', label: 'Loué', icon: HomeIcon },
      paid: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: 'Payé', icon: CheckCircleIcon }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', label: 'Admin' },
      agent: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-500', label: 'Agent' },
      client: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', label: 'Client' }
    };
    const config = roleConfig[role] || roleConfig.client;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[var(--text-muted)]">
        <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-medium animate-pulse">Chargement système...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-70px)] bg-[var(--bg-main)]">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-[var(--border-color)] text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-pink-500 to-rose-400 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-pink-500/30 mb-4 rotate-3">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)] truncate">{user?.name || 'Administrateur'}</h3>
          <p className="text-xs font-semibold text-[var(--text-muted)] opacity-60 uppercase tracking-wider mt-1">Super Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', icon: ChartBarIcon, label: t('Dashboard'), path: '/dashboard/admin' },
            { id: 'users', icon: UserGroupIcon, label: 'Utilisateurs', path: '/dashboard/admin/users' },
            { id: 'properties', icon: BuildingOfficeIcon, label: t('nav.properties'), path: '/dashboard/admin/properties' },
            { id: 'contracts', icon: DocumentTextIcon, label: t('dash.stats.active_contracts'), path: '/dashboard/admin/contracts' },
            { id: 'payments', icon: CurrencyDollarIcon, label: 'Paiements', path: '/dashboard/admin/payments' },
            { id: 'reviews', icon: ChatBubbleLeftRightIcon, label: 'Avis clients', path: '/dashboard/admin/reviews' },
            { id: 'settings', icon: Cog6ToothIcon, label: 'Paramètres', path: '/dashboard/admin/settings' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === item.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-main)]'}`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'opacity-100' : 'opacity-70'}`} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">{t('dash.admin.welcome')}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Supervisez et contrôlez l'ensemble de la plateforme.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshData} 
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-primary dark:hover:text-white border border-[var(--border-color)] rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? t('common.loading') : 'Actualiser'}
            </button>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatsCard 
            title="Utilisateurs" 
            value={stats.users.total} 
            icon={UserGroupIcon} 
            color="indigo"
          />
          <StatsCard 
            title={t('home.stats.properties')} 
            value={stats.properties.total} 
            icon={BuildingOfficeIcon} 
            color="blue"
          />
          <StatsCard 
            title={t('dash.stats.active_contracts')} 
            value={stats.contracts.active} 
            icon={DocumentTextIcon} 
            color="green"
          />
          <StatsCard 
            title={t('dash.stats.total_rent')} 
            value={`${stats.revenue.total?.toLocaleString()} DH`} 
            icon={CurrencyDollarIcon} 
            color="rose"
          />
        </div>

        {/* Dashboard Tab Default */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-8">
              {stats.revenue.monthly?.length > 0 ? (
                <RevenueChart data={stats.revenue.monthly} title="Évolution des Revenus (DH)" />
              ) : (
                <div className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--border-color)] shadow-sm h-full">
                  <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">Évolution des Revenus (DH)</h3>
                  <div className="h-64 flex items-center justify-center text-[var(--text-muted)]">
                    <p className="text-sm">Aucune donnée de revenus disponible</p>
                  </div>
                </div>
              )}
              
              <div className="bg-[var(--card-bg)] rounded-3xl border border-[var(--border-color)] shadow-sm p-6">
                <h2 className="text-lg font-bold text-[var(--text-main)] mb-6">Activité Récente</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-[var(--bg-muted)] rounded-2xl border border-[var(--border-color)]">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--card-bg)] shadow-sm border border-[var(--border-color)]">
                        {activity.type === 'request' ? <DocumentTextIcon className="w-5 h-5 text-blue-500" /> : activity.type === 'contract' ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <CurrencyDollarIcon className="w-5 h-5 text-amber-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-bold text-[var(--text-main)] text-sm">{activity.user}</span>
                          <span className="text-xs text-[var(--text-muted)]">{activity.time}</span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">{activity.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
               <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6">
                 <h2 className="text-lg font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
                   <BellIcon className="w-5 h-5 text-rose-500" />
                   Alertes Système
                 </h2>
                 <div className="space-y-4">
                   <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-xl text-sm">
                      <p className="font-bold text-orange-800 dark:text-orange-400">Paiements en retard</p>
                      <p className="text-orange-600 dark:text-orange-500 mt-1">4 paiements sont en attente depuis plus de 5 jours.</p>
                   </div>
                   <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl text-sm">
                      <p className="font-bold text-blue-800 dark:text-blue-400">Rapport généré</p>
                      <p className="text-blue-600 dark:text-blue-500 mt-1">Le rapport mensuel de mars est disponible.</p>
                   </div>
                 </div>
               </div>
            </section>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <section className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden">
             <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--bg-muted)]">
                <h2 className="text-lg font-bold text-[var(--text-main)]">Annuaire Utilisateurs</h2>
                <div className="relative w-full md:w-64">
                   <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                   <input 
                     type="text" 
                     placeholder="Rechercher par nom..." 
                     value={userSearch}
                     onChange={(e) => setUserSearch(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] transition-all shadow-sm"
                   />
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-[var(--bg-muted)] border-b border-[var(--border-color)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
                     <th className="p-4 font-semibold">Identité</th>
                     <th className="p-4 font-semibold">Rôle</th>
                     <th className="p-4 font-semibold">Inscription</th>
                     <th className="p-4 font-semibold text-center">Statut</th>
                     <th className="p-4 font-semibold text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[var(--border-color)]">
                   {filteredUsers.map(u => (
                     <tr key={u.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                       <td className="p-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-main)] font-bold text-xs border border-[var(--border-color)]">
                             {u.name.charAt(0)}
                           </div>
                           <div>
                             <div className="font-bold text-[var(--text-main)] text-sm">{u.name}</div>
                             <div className="text-xs text-[var(--text-muted)] mt-0.5">{u.email}</div>
                           </div>
                         </div>
                       </td>
                       <td className="p-4">{getRoleBadge(u.role)}</td>
                       <td className="p-4 text-sm text-[var(--text-muted)]">
                         {new Date(u.created_at).toLocaleDateString()}
                       </td>
                       <td className="p-4 text-center">{getStatusBadge(u.status)}</td>
                       <td className="p-4 text-right">
                         <button className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline transition-colors">Gérer</button>
                       </td>
                     </tr>
                   ))}
                   {filteredUsers.length === 0 && (
                     <tr>
                       <td colSpan="5" className="p-8 text-center text-[var(--text-muted)]">Aucun utilisateur correspondant</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </section>
        )}

        {activeTab === 'reviews' && (
          <section className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-sm p-6">
            <AdminReviews />
          </section>
        )}
        
        {/* Other tabs can be similarly added using standard Tailwind structures */}
        {!['dashboard', 'users', 'reviews'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center p-12 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-sm">
            <Cog6ToothIcon className="w-16 h-16 text-[var(--bg-muted)] mb-4 animate-[spin_4s_linear_infinite]" />
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Module en développement</h3>
            <p className="text-sm text-[var(--text-muted)] max-w-md text-center">La section <strong>{activeTab}</strong> sera entièrement disponible dans la prochaine mise à jour de l'interface.</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;