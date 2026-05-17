import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
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
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PaymentsHistory = () => {
  const { user, isAgent, isAdmin } = useAuth();
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
      console.error('Erreur:', error);
      toast.error(t('pay.error_msg', 'Impossible de charger l\'historique des paiements'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      paid: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-500', icon: CheckCircleIcon, label: t('payment.status.paid', 'Payé') },
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-500', icon: ClockIcon, label: t('payment.status.pending', 'En attente') },
      failed: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-500', icon: XCircleIcon, label: t('pay.status.failed', 'Échoué') },
      late: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-500', icon: ClockIcon, label: t('payment.status.late', 'En retard') }
    };
    const s = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
        <s.icon className="w-3.5 h-3.5" />
        {s.label}
      </span>
    );
  };

  const filteredPayments = payments.filter(p => 
    p.payment_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contract?.property?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-bg-soft pt-[120px] pb-12 px-4 sm:px-6 lg:px-8 font-outfit">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-text-sub hover:text-primary transition-colors mb-2 font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {t('common.prev', 'Retour')}
            </button>
            <h1 className="text-3xl font-black text-text-main tracking-tight">{t('pay.history.title', 'Historique des')} <span className="text-primary">{t('common.payments', 'Paiements')}</span></h1>
            <p className="text-text-sub mt-1">{t('pay.history.subtitle', 'Consultez et gérez tous les paiements effectués sur la plateforme.')}</p>
          </div>

          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder={t('pay.history.search', 'Rechercher un paiement...')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-bg-card border border-border-main rounded-xl focus:ring-2 focus:ring-primary focus:outline-none w-full md:w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-border-main border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-text-sub font-medium">{t('pay.history.loading', 'Chargement des transactions...')}</p>
          </div>
        ) : (
          <div className="bg-bg-card rounded-xl border border-border-main shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-soft border-b border-border-main text-xs uppercase tracking-widest font-black text-text-muted">
                    <th className="p-6">{t('pay.history.table.ref', 'Réf. Paiement')}</th>
                    <th className="p-6">{t('common.date', 'Date')}</th>
                    <th className="p-6">{t('pay.history.table.property', 'Bien Immobilier')}</th>
                    <th className="p-6">{t('common.amount', 'Montant')}</th>
                    <th className="p-6 text-center">{t('pay.history.table.method', 'Méthode')}</th>
                    <th className="p-6 text-center">{t('common.status', 'Statut')}</th>
                    <th className="p-6 text-right">{t('common.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <motion.tbody 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="divide-y divide-border-main"
                >
                  {filteredPayments.map((payment) => (
                    <motion.tr variants={itemVariants} key={payment.id} className="hover:bg-bg-soft/50 transition-colors group">
                      <td className="p-6">
                        <span className="font-mono text-sm font-bold text-text-main">{payment.payment_number}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-sm text-text-sub">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(payment.payment_date || payment.created_at).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR')}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <HomeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-main line-clamp-1">{payment.contract?.property?.title || t('pay.history.unknown_property', 'Bien non spécifié')}</p>
                            <p className="text-xs text-text-muted">{payment.contract?.property?.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-black text-text-main">{parseFloat(payment.amount).toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')} {t('prop.currency', 'DH')}</span>
                      </td>
                      <td className="p-6 text-center">
                        <span className="text-xs font-semibold text-text-sub bg-bg-soft px-2 py-1 rounded-lg border border-border-main">
                          {payment.payment_method === 'card' ? t('pay.card', 'Carte') : payment.payment_method === 'transfer' ? t('pay.transfer', 'Virement') : t('pay.agency', 'Agence')}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="p-6 text-right">
                        {payment.pdf_url ? (
                          <a 
                            href={payment.pdf_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:underline font-bold text-xs"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            {t('pay.history.invoice', 'Facture')}
                          </a>
                        ) : (
                          <span className="text-xs text-text-muted italic">{t('pay.history.unavailable', 'Indisponible')}</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-bg-soft rounded-full flex items-center justify-center text-text-muted">
                            <CurrencyDollarIcon className="w-10 h-10" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-text-main">{t('pay.history.no_data', 'Aucune transaction trouvée')}</p>
                            <p className="text-sm text-text-sub">{t('pay.history.no_data_desc', 'Les paiements apparaîtront ici une fois effectués.')}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </motion.tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentsHistory;
