import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enGB, arMA } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  BuildingOfficeIcon,
  CheckCircleIcon,
  TrashIcon,
  InboxIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { notificationService } from '../services/notifications';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import LoadingSkeleton from '../components/Common/LoadingSkeleton';

const Notifications = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    loadNotifications();
  }, []);

  const getLocale = () => {
    if (language === 'ar') return arMA;
    if (language === 'en') return enGB;
    return fr;
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll({ per_page: 50 });
      if (res.data?.success) {
        const rawNotifications = res.data?.data?.data || [];
        setNotifications(rawNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error(t('notif.load_error', 'Erreur lors du chargement des notifications'));
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, link) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
    );

    try {
      await notificationService.markRead(id);
      if (link) {
        navigate(link);
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      loadNotifications();
    }
  };

  const markAllRead = async () => {
    const previousNotifs = [...notifications];
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    
    try {
      await notificationService.markAllRead();
      toast.success(t('notif.mark_all_success', 'Toutes les notifications sont marquées comme lues'));
    } catch (error) {
      setNotifications(previousNotifs);
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success(t('notif.delete_success', 'Notification supprimée'));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'message':
        return <ChatBubbleLeftRightIcon className="w-5 h-5 !text-blue-500" />;
      case 'rental_request':
      case 'agent_request':
        return <DocumentTextIcon className="w-5 h-5 !text-purple-500" />;
      case 'property_status':
      case 'agent_request_processed':
        return <BuildingOfficeIcon className="w-5 h-5 !text-amber-500" />;
      case 'contract':
        return <CheckCircleIcon className="w-5 h-5 !text-emerald-500" />;
      case 'payment':
        return <BanknotesIcon className="w-5 h-5 !text-green-500" />;
      default:
        return <BellIcon className="w-5 h-5 !text-primary" />;
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read_at);

  const translateNotification = (msg) => {
    if (!msg) return '';
    
    if (msg.includes('Votre demande pour') && msg.includes('a été approuvée')) {
       const title = msg.replace('Votre demande pour ', '').replace(' a été approuvée', '');
       return t('notif.msg.req_approved', 'Votre demande pour {{title}} a été approuvée').replace('{{title}}', title);
    }

    if (msg.includes('Votre demande pour') && msg.includes('a été refusée')) {
       const title = msg.replace('Votre demande pour ', '').replace(' a été refusée', '');
       return t('notif.msg.req_rejected', 'Votre demande pour {{title}} a été refusée').replace('{{title}}', title);
    }
    
    if (msg.includes('Un nouveau contrat a été créé pour le bien : ')) {
       const title = msg.replace('Un nouveau contrat a été créé pour le bien : ', '');
       return t('notif.msg.contract_created', 'Un nouveau contrat a été créé pour le bien : {{title}}').replace('{{title}}', title);
    }

    if (msg.includes('Un contrat a été généré pour votre demande sur : ')) {
       const title = msg.split('Un contrat a été généré pour votre demande sur : ')[1].split('.')[0];
       return t('notif.msg.contract_generated_for_req', 'Un contrat a été généré pour votre demande sur : {{title}}').replace('{{title}}', title);
    }

    if (msg.includes('Félicitations ! Vous êtes maintenant agent sur IMMORent.')) {
       return t('notif.msg.agent_req_approved_welcome', 'Félicitations ! Vous êtes maintenant agent sur IMMORent.');
    }

    if (msg.includes('Désolé, votre demande pour devenir agent a été refusée.')) {
       return t('notif.msg.agent_req_rejected_sorry', 'Désolé, votre demande pour devenir agent a été refusée.');
    }

    if (msg.includes(' a envoyé une demande pour ')) {
       const parts = msg.split(' a envoyé une demande pour ');
       const name = parts[0];
       const title = parts[1];
       return t('notif.msg.new_rental_req', '{{name}} a envoyé une demande pour {{title}}')
              .replace('{{name}}', name)
              .replace('{{title}}', title);
    }

    if (msg.includes('Le client ') && msg.includes(' a annulé sa demande pour ')) {
       const parts = msg.replace('Le client ', '').split(' a annulé sa demande pour ');
       const name = parts[0];
       const title = parts[1];
       return t('notif.msg.rental_req_cancelled', 'Le client {{name}} a annulé sa demande pour {{title}}')
              .replace('{{name}}', name)
              .replace('{{title}}', title);
    }

    if (msg.includes("L'utilisateur ") && msg.includes(" souhaite devenir agent.")) {
       const name = msg.replace("L'utilisateur ", "").replace(" souhaite devenir agent.", "");
       return t('notif.msg.user_wants_agent', "L'utilisateur {{name}} souhaite devenir agent.")
              .replace('{{name}}', name);
    }

    if (msg.includes('Nouvelle demande de visite pour le bien : ')) {
       const title = msg.replace('Nouvelle demande de visite pour le bien : ', '');
       return t('notif.msg.new_visit_req', 'Nouvelle demande de visite pour le bien : {{title}}')
              .replace('{{title}}', title);
    }

    if (msg.includes('Un nouveau paiement de ') && msg.includes(' a été effectué pour le bien ')) {
       const parts = msg.replace('Un nouveau paiement de ', '').split(' a été effectué pour le bien ');
       const amount = parts[0];
       const title = parts[1];
       return t('notif.msg.payment_received_amount', 'Un nouveau paiement de {{amount}} a été effectué pour le bien {{title}}')
              .replace('{{amount}}', amount)
              .replace('{{title}}', title);
    }

    if (msg.includes('Un paiement de ') && msg.includes(' a été reçu pour le bien : ')) {
       const parts = msg.replace('Un paiement de ', '').split(' a été reçu pour le bien : ');
       const amount = parts[0];
       const title = parts[1];
       return t('notif.msg.payment_received_p1', 'Un paiement de {{amount}} a été reçu pour le bien : {{title}}')
              .replace('{{amount}}', amount)
              .replace('{{title}}', title);
    }

    if (msg.includes('Un paiement de ') && msg.includes(' a été enregistré pour votre contrat.')) {
       const amount = msg.replace('Un paiement de ', '').split(' a été enregistré pour votre contrat.')[0];
       return t('notif.msg.payment_registered_p1', 'Un paiement de {{amount}} a été enregistré pour votre contrat.')
              .replace('{{amount}}', amount);
    }

    if (msg.includes('Le statut de votre paiement de ') && msg.includes(' est désormais : ')) {
       const amount = msg.replace('Le statut de votre paiement de ', '').split(' est désormais : ')[0];
       const statusFr = msg.split(' est désormais : ')[1].replace('.', '');
       const statusKey = statusFr === 'reçu' ? 'notif.msg.payment_status_paid' : 
                         statusFr === 'en retard' ? 'notif.msg.payment_status_late' : 'notif.msg.payment_status_pending';
       return t('notif.msg.payment_status_update_p1', 'Le statut de votre paiement de {{amount}} est désormais : {{status}}')
              .replace('{{amount}}', amount)
              .replace('{{status}}', t(statusKey, statusFr));
    }

    if (msg.includes('Votre bien "') && msg.includes('" a été approuvé par l\'administrateur.')) {
       const title = msg.split('Votre bien "')[1].split('" a été approuvé par l\'administrateur.')[0];
       return t('notif.msg.prop_approved_by_admin', 'Votre annonce pour {{title}} a été approuvée par l\'administrateur.')
              .replace('{{title}}', title);
    }

    if (msg.includes('Votre bien "') && msg.includes('" a été rejeté par l\'administrateur.')) {
       const title = msg.split('Votre bien "')[1].split('" a été rejeté par l\'administrateur.')[0];
       return t('notif.msg.prop_rejected_by_admin', 'Votre bien "{{title}}" a été rejeté par l\'administrateur.')
              .replace('{{title}}', title);
    }

    if (msg.includes('Vous avez reçu un message de ')) {
       const name = msg.replace('Vous avez reçu un message de ', '');
       return t('notif.msg.received_message_from', 'Vous avez reçu un message de {{name}}')
              .replace('{{name}}', name);
    }

    return t(msg, msg);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-bg-main pt-[120px] pb-12 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10"
        >
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">{t('nav.notifications')}</h1>
            <p className="text-text-muted font-bold text-sm mt-1 uppercase tracking-widest">{t('notif.subtitle', 'Gérez vos alertes et communications en temps réel.')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={markAllRead}
              className="flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border-main text-text-sub text-xs font-black uppercase tracking-widest rounded-xl hover:bg-bg-soft hover:text-text-main transition-all shadow-sm"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {t('nav.mark_all_read', 'Tout marquer comme lu')}
            </button>
          </div>
        </motion.div>

        {/* Notifications Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-card rounded-xl border border-border-main shadow-sm overflow-hidden"
        >
          {/* Navbar/Filters */}
          <div className="p-4 sm:p-6 border-b border-border-main flex gap-2 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setFilter('all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs uppercase tracking-widest shrink-0 ${filter === 'all' ? 'bg-primary !text-white shadow-lg shadow-primary/20' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
            >
              {t('notif.all', 'Toutes')}
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 font-bold text-xs uppercase tracking-widest shrink-0 ${filter === 'unread' ? 'bg-primary !text-white shadow-lg shadow-primary/20' : 'text-text-sub hover:bg-bg-soft hover:text-text-main'}`}
            >
              {t('notif.unread', 'Non lues')}
              {notifications.filter(n => !n.read_at).length > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-xl ${filter === 'unread' ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                  {notifications.filter(n => !n.read_at).length}
                </span>
              )}
            </button>
          </div>

          {/* List */}
          <div className="divide-y divide-border-main">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <LoadingSkeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredNotifications.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {filteredNotifications.map(notif => (
                    <motion.div 
                      key={notif.id} 
                      variants={itemVariants}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-6 flex gap-5 transition-all cursor-pointer hover:bg-bg-soft/50 group ${!notif.read_at ? (theme === 'light' ? 'bg-primary/5' : 'bg-primary/10') : ''}`}
                      onClick={() => markAsRead(notif.id, notif.data?.link)}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${!notif.read_at ? (theme === 'light' ? 'bg-white border-primary/20' : 'bg-slate-800 border-primary/20') : 'bg-bg-soft border-border-main'}`}>
                        {getNotifIcon(notif.data?.type_notif || notif.data?.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className={`text-sm leading-relaxed ${!notif.read_at ? 'text-text-main font-bold' : 'text-text-sub font-medium'}`}>
                              {translateNotification(notif.data?.message)}
                            </p>
                            <p className={`text-[10px] font-black mt-2 uppercase tracking-widest ${!notif.read_at ? 'text-primary' : 'text-text-muted'}`}>
                              {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: getLocale() })}
                            </p>
                          </div>
                          <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notif.read_at && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notif.id);
                                }}
                                className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                                title={t('nav.mark_all_read', 'Marquer comme lu')}
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                              className="p-2 text-text-sub hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                              title={t('common.delete', 'Supprimer')}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-24 text-center"
              >
                <div className="w-20 h-20 bg-bg-soft rounded-xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-border-main">
                  <InboxIcon className="w-10 h-10 text-text-muted" />
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-text-main">{t('notif.none', 'Aucune notification')}</p>
                <p className="text-xs font-bold text-text-muted mt-2">{t('notif.up_to_date', 'Vous êtes à jour !')}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
