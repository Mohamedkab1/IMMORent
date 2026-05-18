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
  ClockIcon, 
  UserIcon, 
  HomeIcon, 
  CalendarIcon,
  DocumentTextIcon,
  FunnelIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from '../../components/Common/StatsCard';
import { requestService } from '../../services/requests';

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

const AdminRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await requestService.getAll();
      if (response.success) {
        setRequests(response.data.data || response.data);
      }
    } catch (error) {
      toast.error(t('dash.error_load', 'Erreur de chargement des demandes'));
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.request_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.property.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', label: t('req.status.pending', 'En attente'), icon: ClockIcon },
      approved: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', label: t('req.status.approved', 'Approuvée'), icon: CheckCircleIcon },
      rejected: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', label: t('req.status.rejected', 'Refusée'), icon: XCircleIcon },
      cancelled: { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20', label: t('req.status.cancelled', 'Annulée'), icon: XCircleIcon },
      finalized: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', label: t('common.status.finalized', 'Finalisée'), icon: CheckCircleIcon }
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return (
      <span className={`px-2 py-0.5 rounded-md border ${c.bg} ${c.text} ${c.border} text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
        <Icon className="w-3 h-3" />
        {c.label}
      </span>
    );
  };

  const handleApprove = async (id) => {
    try {
      const response = await requestService.process(id, { status: 'approved' });
      if (response.success) {
        setRequests(requests.map(r => 
          r.id === id ? { ...r, status: 'approved', processed_at: new Date().toISOString() } : r
        ));
        toast.success(t('admin.req.approved_success', 'Demande de location approuvée'));
      }
    } catch (error) {
      toast.error(t('common.error', 'Une erreur est survenue'));
    }
  };

  const handleReject = async (id) => {
    const reason = prompt(t('admin.req.reject_reason_prompt', 'Motif du refus :'));
    if (reason) {
      try {
        const response = await requestService.process(id, { status: 'rejected', rejection_reason: reason });
        if (response.success) {
          setRequests(requests.map(r => 
            r.id === id ? { ...r, status: 'rejected', rejection_reason: reason, processed_at: new Date().toISOString() } : r
          ));
          toast.success(t('admin.req.rejected_success', 'Demande de location refusée'));
        }
      } catch (error) {
        toast.error(t('common.error', 'Une erreur est survenue'));
      }
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-black uppercase tracking-widest text-text-muted">{t('common.loading', 'Chargement des flux de demandes...')}</p>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title={t('admin.req.total', 'Flux de Demandes')} value={stats.total} icon={DocumentTextIcon} color="blue" delay={0} />
        <StatsCard title={t('req.status.pending', 'En Attente')} value={stats.pending} icon={ClockIcon} color="amber" delay={100} />
        <StatsCard title={t('req.status.approved', 'Traitées / OK')} value={stats.approved} icon={CheckCircleIcon} color="emerald" delay={200} />
      </div>

      {/* Main Table Container */}
      <motion.div variants={itemVariants} className="bg-bg-card border border-border-main rounded-lg shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-border-main flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-main uppercase tracking-widest">{t('admin.req.title', 'Centre de Candidatures')}</h2>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">
              {filteredRequests.length} {t('admin.req.count', 'Dossiers en cours de révision')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder={t('admin.req.search_ph', 'Client, n° dossier...')}
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
                <option value="all">{t('common.all_status', 'Tous les dossiers')}</option>
                <option value="pending">{t('req.status.pending', 'En attente')}</option>
                <option value="approved">{t('req.status.approved', 'Approuvées')}</option>
                <option value="rejected">{t('req.status.rejected', 'Refusées')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-soft/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.req.req_num', 'Référence Dossier')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.req.client', 'Candidat')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.req.property', 'Bien Visé')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.req.date', 'Chronologie')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.edit.status', 'État')}</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.prop.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              <AnimatePresence>
                {filteredRequests.map((r, idx) => (
                  <motion.tr 
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-bg-soft/30 transition-colors"
                  >
                  <td className="px-8 py-6">
                    <div className="text-xs font-black text-text-main">{r.request_number}</div>
                    <div className="text-[9px] font-bold text-text-muted mt-0.5">{t('admin.req.type_rental', 'Demande de location')}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                        {r.user.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-black text-text-main group-hover:text-primary transition-colors">{r.user.name}</div>
                        <div className="text-[9px] font-bold text-text-muted lowercase tracking-tighter">{r.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-text-main">{r.property.title}</div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted mt-0.5">
                      <UserIcon className="w-3 h-3" />
                      Agent: {r.property.agent?.name || '-'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted w-14">Soumis:</span>
                        <span className="text-[10px] font-bold text-text-main">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted w-14">Période:</span>
                        <span className="text-[10px] font-bold text-text-muted">
                          {new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">{getStatusBadge(r.status)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-primary transition-all shadow-sm"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </motion.button>
                      {r.status === 'pending' && (
                        <>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleApprove(r.id)} 
                            className="p-2.5 rounded-lg bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleReject(r.id)} 
                            className="p-2.5 rounded-lg bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-primary transition-all shadow-sm"
                      >
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="py-20 text-center">
              <DocumentTextIcon className="w-16 h-16 text-text-muted opacity-10 mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-text-muted opacity-40">{t('admin.req.no_match', 'Aucun dossier de candidature trouvé')}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminRequests;