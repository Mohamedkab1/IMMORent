import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { 
  EyeIcon, 
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon, 
  TrashIcon, 
  ArrowDownTrayIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon, 
  HomeIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  FunnelIcon,
  MapPinIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from '../../components/Common/StatsCard';
import { contractService } from '../../services/contracts';

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

const AdminContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await contractService.getAll();
      if (response.success) {
        setContracts(response.data.data || response.data);
      }
    } catch (error) {
      toast.error(t('dash.error_load', 'Erreur de chargement des contrats'));
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.tenant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      active: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', label: t('contract.status.active', 'Actif') },
      terminated: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', label: t('contract.status.terminated', 'Résilié') },
      expired: { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20', label: t('contract.status.expired', 'Expiré') }
    };
    const c = config[status] || config.active;
    return (
      <span className={`px-2 py-0.5 rounded-md border ${c.bg} ${c.text} ${c.border} text-[10px] font-black uppercase tracking-widest`}>
        {c.label}
      </span>
    );
  };

  const confirmDelete = (contract) => {
    setContractToDelete(contract);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (contractToDelete) {
      try {
        await contractService.delete(contractToDelete.id);
        setContracts(contracts.filter(c => c.id !== contractToDelete.id));
        toast.success(t('admin.contracts.deleted_success', 'Contrat supprimé avec succès'));
      } catch (error) {
        toast.error(t('common.error', 'Une erreur est survenue'));
      } finally {
        setShowDeleteConfirm(false);
        setContractToDelete(null);
      }
    }
  };

  const handleDownload = async (contract) => {
    toast.info(t('admin.contracts.downloading', 'Génération du PDF pour le contrat {{num}}...', { num: contract.contract_number }).replace('{{num}}', contract.contract_number));
    try {
      await contractService.download(contract.id);
    } catch (error) {
      toast.error(t('common.error', 'Erreur lors du téléchargement'));
    }
  };

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    revenue: contracts.filter(c => c.status === 'active').reduce((s, c) => s + c.monthly_rent, 0)
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-black uppercase tracking-widest text-text-muted">{t('common.loading', 'Chargement des contrats...')}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title={t('admin.contracts.total', 'Total Contrats')} value={stats.total} icon={DocumentTextIcon} color="blue" delay={0} />
        <StatsCard title={t('admin.contracts.active', 'Contrats Actifs')} value={stats.active} icon={CheckCircleIcon} color="emerald" delay={100} />
        <StatsCard title={t('admin.contracts.monthly_rev', 'Volume d\'Affaires')} value={`${stats.revenue.toLocaleString()} DH`} icon={CurrencyDollarIcon} color="amber" delay={200} />
      </div>

      {/* Main Table Container */}
      <motion.div variants={itemVariants} className="bg-bg-card border border-border-main rounded-lg shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-border-main flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-main uppercase tracking-widest">{t('admin.contracts.title', 'Registre des Contrats')}</h2>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">
              {filteredContracts.length} {t('admin.contracts.count', 'Baux actifs ou archivés')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder={t('admin.contracts.search_ph', 'N° Contrat, bien, locataire...')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-3 bg-bg-soft border border-border-main rounded-lg text-xs focus:border-primary outline-none transition-all w-72 font-bold"
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
                <option value="all">{t('common.all_status', 'Tous les statuts')}</option>
                <option value="active">{t('contract.status.active', 'Actifs')}</option>
                <option value="expired">{t('contract.status.expired', 'Expirés')}</option>
                <option value="terminated">{t('contract.status.terminated', 'Résiliés')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-soft/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.contracts.contract_num', 'N° Référence')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.req.property', 'Bien Immobilier')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.contracts.parties', 'Parties Contractantes')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.contracts.rent', 'Loyer / Période')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.edit.status', 'État')}</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.prop.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              <AnimatePresence>
                {filteredContracts.map((c, idx) => (
                  <motion.tr 
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-bg-soft/30 transition-colors"
                  >
                  <td className="px-8 py-6">
                    <Link to={`/contracts/${c.id}`} className="text-xs font-black text-primary hover:underline underline-offset-4">
                      {c.contract_number}
                    </Link>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-text-main">{c.property.title}</div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted mt-0.5">
                      <MapPinIcon className="w-3 h-3" />
                      {c.property.city}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted w-16">Locataire:</span>
                        <span className="text-xs font-bold text-text-main">{c.tenant.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted w-16">Bailleur:</span>
                        <span className="text-xs font-bold text-text-main">{c.owner.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-text-main">{c.monthly_rent.toLocaleString()} DH</div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted mt-0.5">
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">{getStatusBadge(c.status)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Link to={`/contracts/${c.id}`} className="p-2.5 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm block">
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                      </motion.div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDownload(c)} 
                        className="p-2.5 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => confirmDelete(c)} 
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
          {filteredContracts.length === 0 && (
            <div className="py-20 text-center">
              <DocumentTextIcon className="w-16 h-16 text-text-muted opacity-10 mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-text-muted opacity-40">{t('admin.contracts.no_match', 'Aucun contrat ne correspond à votre recherche')}</p>
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
              <h3 className="text-xl font-black text-text-main uppercase tracking-widest mb-4">{t('admin.prop.del_confirm_title', 'Archiver le Contrat')}</h3>
              <p className="text-sm font-bold text-text-sub opacity-60 mb-8 leading-relaxed">
                {t('admin.contracts.del_confirm_msg', 'Souhaitez-vous définitivement supprimer le contrat n°')} <br />
                <span className="text-text-main font-black underline">{contractToDelete?.contract_number}</span> ?
                <br />
                <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-4 block">{t('admin.prop.del_warning', 'Cette action est irréversible et effacera les données associées.')}</span>
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

export default AdminContracts;