import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  MagnifyingGlassIcon, 
  TrashIcon, 
  PencilIcon, 
  BuildingOfficeIcon, 
  HomeIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from '../../components/Common/StatsCard';
import { propertyService } from '../../services/properties';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getAdminAll();
      if (response.success) {
        setProperties(response.data);
      }
    } catch (error) {
      toast.error(t('dash.error_load', 'Erreur de chargement des biens'));
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = { 
      available: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', label: t('prop.status.available', 'Disponible') }, 
      rented: { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20', label: t('prop.status.rented', 'Loué') }, 
      pending: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', label: t('prop.status.pending', 'En attente') } 
    };
    const c = config[status] || config.available;
    return (
      <span className={`px-2 py-0.5 rounded-md border ${c.bg} ${c.text} ${c.border} text-[10px] font-black uppercase tracking-widest`}>
        {c.label}
      </span>
    );
  };

  const handleVerify = async (id) => { 
    try {
      const response = await propertyService.approve(id);
      if (response.success) {
        setProperties(properties.map(p => p.id === id ? { ...p, verified: true, status: 'available' } : p)); 
        toast.success(t('admin.prop.verified_success', 'Bien vérifié avec succès')); 
      }
    } catch (error) {
      toast.error(t('common.error', 'Une erreur est survenue'));
    }
  };
  
  const handleReject = async (id) => { 
    try {
      const response = await propertyService.reject(id);
      if (response.success) {
        setProperties(properties.filter(p => p.id !== id)); 
        toast.success(t('admin.prop.rejected_success', 'Publication refusée')); 
      }
    } catch (error) {
      toast.error(t('common.error', 'Une erreur est survenue'));
    }
  };
  
  const confirmDelete = (p) => { 
    setPropertyToDelete(p); 
    setShowDeleteConfirm(true); 
  };
  
  const handleDelete = async () => { 
    if (propertyToDelete) { 
      try {
        await propertyService.delete(propertyToDelete.id);
        setProperties(properties.filter(p => p.id !== propertyToDelete.id)); 
        toast.success(t('admin.prop.deleted_success', 'Bien supprimé du catalogue')); 
      } catch (error) {
        toast.error(t('common.error', 'Une erreur est survenue'));
      } finally {
        setShowDeleteConfirm(false); 
        setPropertyToDelete(null); 
      }
    } 
  };

  const stats = { 
    total: properties.length, 
    available: properties.filter(p => p.status === 'available').length, 
    rented: properties.filter(p => p.status === 'rented').length, 
    pending: properties.filter(p => p.status === 'pending' || !p.verified).length 
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-black uppercase tracking-widest text-text-muted">{t('common.loading', 'Chargement...')}</p>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title={t('admin.prop.total', 'Total Biens')} value={stats.total} icon={BuildingOfficeIcon} color="blue" delay={0} />
        <StatsCard title={t('prop.status.available', 'Disponibles')} value={stats.available} icon={HomeIcon} color="emerald" delay={100} />
        <StatsCard title={t('prop.status.rented', 'Loués')} value={stats.rented} icon={CheckCircleIcon} color="indigo" delay={200} />
        <StatsCard title={t('prop.status.pending', 'En Attente')} value={stats.pending} icon={ClockIcon} color="amber" delay={300} />
      </div>

      {/* Main Table Container */}
      <motion.div variants={itemVariants} className="bg-bg-card border border-border-main rounded-lg shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-border-main flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-main uppercase tracking-widest">{t('admin.prop.title', 'Parc Immobilier')}</h2>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">
              {filteredProperties.length} {t('admin.prop.count', 'Annonces répertoriées')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder={t('common.search', 'Filtrer par titre, ville...')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-3 bg-bg-soft border border-border-main rounded-lg text-xs focus:border-primary outline-none transition-all w-64 font-bold"
              />
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-hover:text-primary transition-colors">
                <FunnelIcon className="w-4 h-4" />
              </div>
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)}
                className="pl-11 pr-8 py-3 bg-bg-soft border border-border-main rounded-lg text-xs font-black uppercase tracking-widest outline-none focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="all">{t('common.all', 'Tous les statuts')}</option>
                <option value="available">{t('prop.status.available', 'Disponibles')}</option>
                <option value="rented">{t('prop.status.rented', 'Loués')}</option>
                <option value="pending">{t('prop.status.pending', 'En attente')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-soft/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.prop.table_title', 'Bien Immobilier')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.add.price', 'Prix Mensuel')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.edit.status', 'État')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.prop.agent', 'Propriétaire/Agent')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.prop.verified', 'Audit')}</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.prop.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              <AnimatePresence>
                {filteredProperties.map((p, idx) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-bg-soft/30 transition-colors"
                  >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-bg-soft border border-border-main flex items-center justify-center text-primary group-hover:border-primary/30 transition-all shadow-sm">
                        <BuildingOfficeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-text-main group-hover:text-primary transition-colors">{p.title}</div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted mt-0.5">
                          <MapPinIcon className="w-3 h-3" />
                          {p.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-text-main">{p.price.toLocaleString()} DH</div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('prop.per_month', 'Par mois')}</div>
                  </td>
                  <td className="px-8 py-6">{getStatusBadge(p.status)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                        {p.user.name[0]}
                      </div>
                      <span className="text-xs font-bold text-text-main">{p.user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {p.verified ? (
                      <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircleIcon className="w-4 h-4" />
                        {t('admin.prop.verified', 'Certifié')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                        <XCircleIcon className="w-4 h-4" />
                        {t('admin.prop.not_verified', 'Non audité')}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Link to={`/properties/${p.id}`} className="p-2.5 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm block">
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                      </motion.div>
                      {!p.verified && (
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVerify(p.id)} 
                          className="p-2.5 rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => confirmDelete(p)} 
                        className="p-2.5 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-rose-500 hover:border-rose-500 transition-all shadow-sm"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
          </table>
          {filteredProperties.length === 0 && (
            <div className="py-20 text-center">
              <BuildingOfficeIcon className="w-16 h-16 text-text-muted opacity-10 mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-text-muted opacity-40">{t('admin.prop.no_match', 'Aucun bien ne correspond à votre recherche')}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-bg-main/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-bg-card border border-border-main rounded-lg p-8 shadow-huge text-center"
            >
              <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-6">
                <TrashIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-text-main uppercase tracking-widest mb-4">{t('admin.prop.del_confirm_title', 'Retrait du Bien')}</h3>
              <p className="text-sm font-bold text-text-sub opacity-60 mb-8 leading-relaxed">
                {t('admin.prop.del_confirm_msg', 'Souhaitez-vous définitivement retirer')} <br />
                <span className="text-text-main font-black underline">{propertyToDelete?.title}</span> ?
                <br />
                <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-4 block">{t('admin.prop.del_warning', 'Cette annonce sera supprimée pour tous les utilisateurs.')}</span>
              </p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-bg-soft border border-border-main rounded-lg text-[10px] font-black uppercase tracking-widest text-text-sub transition-all">
                  {t('common.cancel', 'Annuler')}
                </button>
                <button onClick={handleDelete} className="flex-1 py-3 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all">
                  {t('common.delete', 'Supprimer')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminProperties;