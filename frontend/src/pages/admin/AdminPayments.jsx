import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CurrencyDollarIcon, 
  CalendarIcon, 
  UserIcon, 
  HomeIcon, 
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  ChevronRightIcon,
  BanknotesIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from '../../components/Common/StatsCard';
import { paymentService } from '../../services/payments';

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

const AdminPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentService.getAll();
      if (response.success) {
        setPayments(response.data.data || response.data);
      }
    } catch (error) {
      toast.error(t('dash.error_load', 'Erreur de chargement des paiements'));
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      paid: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', label: t('payment.status.paid', 'Payé') },
      pending: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', label: t('payment.status.pending', 'En attente') },
      late: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', label: t('payment.status.late', 'En retard') },
      cancelled: { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20', label: t('payment.status.cancelled', 'Annulé') }
    };
    const c = config[status] || config.pending;
    return (
      <span className={`px-2 py-0.5 rounded-md border ${c.bg} ${c.text} ${c.border} text-[10px] font-black uppercase tracking-widest`}>
        {c.label}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    const methods = { 
      cash: BanknotesIcon, 
      bank_transfer: HomeIcon, 
      card: CreditCardIcon, 
      check: DocumentTextIcon 
    };
    const Icon = methods[method] || ClockIcon;
    return <Icon className="w-3.5 h-3.5" />;
  };

  const handleMarkAsPaid = async (id) => {
    try {
      const response = await paymentService.updateStatus(id, 'paid');
      if (response.success) {
        setPayments(payments.map(p => 
          p.id === id ? { ...p, status: 'paid', payment_date: new Date().toISOString() } : p
        ));
        toast.success(t('admin.payments.marked_paid', 'Paiement validé avec succès'));
      }
    } catch (error) {
      toast.error(t('common.error', 'Une erreur est survenue'));
    }
  };

  const stats = {
    paid: payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0),
    late: payments.filter(p => p.status === 'late').reduce((s, p) => s + p.amount, 0)
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-black uppercase tracking-widest text-text-muted">{t('common.loading', 'Chargement des flux financiers...')}</p>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title={t('admin.payments.total_collected', 'Total Encaissé')} value={`${stats.paid.toLocaleString()} DH`} icon={CurrencyDollarIcon} color="emerald" delay={0} />
        <StatsCard title={t('payment.status.pending', 'En Attente')} value={`${stats.pending.toLocaleString()} DH`} icon={ClockIcon} color="amber" delay={100} />
        <StatsCard title={t('payment.status.late', 'Impayés / Retards')} value={`${stats.late.toLocaleString()} DH`} icon={ExclamationTriangleIcon} color="rose" delay={200} />
      </div>

      {/* Main Table Container */}
      <motion.div variants={itemVariants} className="bg-bg-card border border-border-main rounded-lg shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-border-main flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-main uppercase tracking-widest">{t('admin.payments.title', 'Transactions Financières')}</h2>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">
              {filteredPayments.length} {t('admin.payments.count', 'Écritures comptables')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder={t('admin.payments.search_ph', 'Locataire, n° paiement...')}
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
                <option value="paid">{t('payment.status.paid', 'Payés')}</option>
                <option value="pending">{t('payment.status.pending', 'En attente')}</option>
                <option value="late">{t('payment.status.late', 'Retards')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-soft/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.payments.pay_num', 'Référence')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.contracts.tenant', 'Client / Locataire')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.payments.amount', 'Montant')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.payments.dates', 'Échéancier')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.edit.status', 'État')}</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.prop.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              <AnimatePresence>
                {filteredPayments.map((p, idx) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-bg-soft/30 transition-colors"
                  >
                  <td className="px-8 py-6">
                    <div className="text-xs font-black text-text-main">{p.payment_number}</div>
                    <div className="text-[9px] font-bold text-text-muted mt-0.5">{p.contract.contract_number}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-text-main group-hover:text-primary transition-colors">{p.tenant.name}</div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                      <HomeIcon className="w-3 h-3" />
                      {p.contract.property.title}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-text-main">{p.amount.toLocaleString()} DH</div>
                    {p.payment_method && (
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-text-muted mt-1">
                        {getPaymentMethodIcon(p.payment_method)}
                        {t(`payment.method.${p.payment_method}`, p.payment_method)}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted w-16">Échéance:</span>
                        <span className={`text-[10px] font-bold ${new Date(p.due_date) < new Date() && p.status !== 'paid' ? 'text-rose-500 animate-pulse' : 'text-text-main'}`}>
                          {new Date(p.due_date).toLocaleDateString()}
                        </span>
                      </div>
                      {p.payment_date && (
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted w-16">Règlement:</span>
                          <span className="text-[10px] font-bold text-emerald-500">{new Date(p.payment_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">{getStatusBadge(p.status)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      {p.status === 'pending' || p.status === 'late' ? (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMarkAsPaid(p.id)} 
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all"
                        >
                          {t('admin.payments.mark_paid', 'Valider')}
                        </motion.button>
                      ) : (
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2.5 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-primary transition-all"
                        >
                          <DocumentTextIcon className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <div className="py-20 text-center">
              <CurrencyDollarIcon className="w-16 h-16 text-text-muted opacity-10 mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-text-muted opacity-40">{t('admin.payments.no_match', 'Aucun flux financier détecté')}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPayments;