import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/payments';
import { toast } from 'react-toastify';
import { 
  CurrencyDollarIcon, 
  CalendarIcon, 
  ArrowDownTrayIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  HomeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
  }
};

const PaymentsHistory = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentService.getAll();
      if (response.success) {
        setPayments(response.data.data || []);
      }
    } catch (error) {
      toast.error(t('pay.history.error_load', 'Erreur de chargement'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'failed': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-bg-soft text-text-muted border-border-main';
    }
  };

  const filteredPayments = payments.filter(p => 
    p.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.property?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: t('pay.stats.total', 'Total Payé'), value: `${payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + parseFloat(p.amount), 0).toLocaleString()} DH`, icon: CheckCircleIcon, color: 'emerald' },
    { title: t('pay.stats.pending', 'En Attente'), value: `${payments.filter(p => p.status === 'pending').length}`, icon: ClockIcon, color: 'amber' },
    { title: t('pay.stats.count', 'Transactions'), value: `${payments.length}`, icon: ArrowsRightLeftIcon, color: 'primary' }
  ];

  return (
    <div className="min-h-screen bg-bg-soft pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border-main/50 pb-12"
        >
          <div className="space-y-4">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              {t('common.prev', 'Retour')}
            </button>
            <h1 className="text-5xl md:text-6xl font-black text-text-main tracking-tighter leading-none uppercase">
              {t('pay.history.title_p1', 'Historique')} <span className="text-primary">{t('pay.history.title_p2', 'Paiements')}</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted opacity-60">
              {t('pay.history.subtitle', 'Gestion & Suivi des Transactions')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('pay.history.search', 'Rechercher...')}
                className="bg-bg-card border border-border-main rounded-xl pl-12 pr-6 py-3.5 text-xs font-bold text-text-main outline-none focus:border-primary transition-all min-w-[300px]"
              />
            </div>
            <button onClick={fetchPayments} className="p-3.5 rounded-xl bg-bg-card border border-border-main text-text-muted hover:text-primary transition-all shadow-sm">
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((s, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="bg-bg-card border border-border-main p-8 rounded-xl shadow-xl flex items-center gap-6 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all`} />
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center border border-border-main bg-bg-soft text-${s.color === 'emerald' ? 'emerald-500' : s.color === 'amber' ? 'amber-500' : 'primary'} group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm`}>
                <s.icon className="w-7 h-7" />
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">{s.title}</p>
                <p className="text-2xl font-black text-text-main tracking-tight">{s.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Table Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-card border border-border-main rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-soft/50 border-b border-border-main">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{t('pay.table.id', 'ID')}</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{t('pay.table.property', 'Bien')}</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{t('pay.table.date', 'Date')}</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{t('pay.table.method', 'Méthode')}</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{t('pay.table.amount', 'Montant')}</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-center">{t('pay.table.status', 'Statut')}</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">{t('pay.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/50">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    [1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="7" className="px-8 py-6"><div className="h-4 bg-bg-soft rounded w-full" /></td>
                      </tr>
                    ))
                  ) : filteredPayments.length > 0 ? (
                    filteredPayments.map((p) => (
                      <motion.tr 
                        key={p.id}
                        variants={itemVariants}
                        className="hover:bg-bg-soft/30 transition-colors group"
                      >
                        <td className="px-8 py-6 text-[10px] font-black text-text-muted opacity-40 uppercase tracking-widest">{p.transaction_id?.slice(0, 12)}...</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-bg-soft border border-border-main flex items-center justify-center overflow-hidden shrink-0">
                               {p.property?.images?.[0] ? <img src={`http://localhost:8000/storage/${p.property.images[0]}`} className="w-full h-full object-cover" alt="" /> : <HomeIcon className="w-5 h-5 text-text-muted opacity-20" />}
                            </div>
                            <span className="text-xs font-black text-text-main tracking-tight line-clamp-1">{p.property?.title || 'Contrat Direct'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-text-sub">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-soft border border-border-main w-fit">
                             {p.payment_method === 'card' ? <CreditCardIcon className="w-4 h-4 text-primary" /> : p.payment_method === 'cash' ? <BanknotesIcon className="w-4 h-4 text-emerald-500" /> : <BuildingLibraryIcon className="w-4 h-4 text-amber-500" />}
                             <span className="text-[10px] font-black uppercase tracking-widest text-text-sub opacity-60">{p.payment_method}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-text-main tracking-tighter">{parseFloat(p.amount).toLocaleString()} DH</td>
                        <td className="px-8 py-6">
                          <div className={`mx-auto w-fit px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(p.status)}`}>
                            {t(`pay.status.${p.status}`, p.status)}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2.5 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-8 py-20 text-center space-y-4">
                        <CurrencyDollarIcon className="w-12 h-12 text-text-muted opacity-20 mx-auto" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted opacity-40">{t('pay.history.empty', 'Aucune transaction trouvée.')}</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentsHistory;
