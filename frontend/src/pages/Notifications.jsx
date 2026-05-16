import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enGB, arMA } from 'date-fns/locale';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BellIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  BuildingOfficeIcon,
  CheckCircleIcon,
  TrashIcon,
  InboxIcon,
  BanknotesIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { notificationService } from '../services/notifications';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
  }
};

const Notifications = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
        setNotifications(res.data?.data?.data || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
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
      if (link) navigate(link);
    } catch (error) {
      loadNotifications();
    }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    try {
      await notificationService.markAllRead();
      toast.success(t('nav.mark_all_read_success', 'Toutes les notifications lues'));
    } catch (error) {
      loadNotifications();
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const getNotifIcon = (type) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case 'message': return <ChatBubbleLeftRightIcon className={`${iconClass} text-blue-500`} />;
      case 'rental_request':
      case 'agent_request': return <DocumentTextIcon className={`${iconClass} text-amber-500`} />;
      case 'property_status': return <BuildingOfficeIcon className={`${iconClass} text-primary`} />;
      case 'contract': return <CheckCircleIcon className={`${iconClass} text-emerald-500`} />;
      case 'payment': return <BanknotesIcon className={`${iconClass} text-green-500`} />;
      default: return <BellIcon className={`${iconClass} text-primary`} />;
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read_at);

  const translateNotification = (msg) => {
    if (!msg) return '';
    // Simplification for translation purposes, assuming t() handles common keys
    return t(msg, msg);
  };

  return (
    <div className="min-h-screen bg-bg-soft pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16"
        >
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
              <ArrowLeftIcon className="w-3 h-3" />
              {t('common.prev', 'Retour')}
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">
              {t('nav.notifications_p1', 'Centre de')} <span className="text-primary">{t('nav.notifications_p2', 'Notifications')}</span>
            </h1>
            <p className="text-xs text-text-sub font-bold uppercase tracking-[0.3em] opacity-60">
              {t('notif.subtitle', 'Gérez vos alertes et communications en temps réel.')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={markAllRead}
              className="flex items-center gap-2 px-6 py-3 bg-bg-card border border-border-main text-[10px] font-black uppercase tracking-widest text-text-sub hover:text-primary hover:border-primary transition-all rounded-xl shadow-sm"
            >
              <CheckIcon className="w-4 h-4" />
              {t('nav.mark_all_read', 'Tout marquer')}
            </motion.button>
          </div>
        </motion.div>

        {/* Content Card */}
        <div className="bg-bg-card border border-border-main rounded-xl shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Filters */}
          <div className="p-4 border-b border-border-main/50 bg-bg-soft/20 flex gap-2">
            {[
              { id: 'all', label: t('notif.all', 'Toutes') },
              { id: 'unread', label: t('notif.unread', 'Non lues') }
            ].map((f) => (
              <button 
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-text-sub hover:bg-bg-soft'
                }`}
              >
                {f.label}
                {f.id === 'unread' && notifications.filter(n => !n.read_at).length > 0 && (
                  <span className="ms-2 opacity-60">{notifications.filter(n => !n.read_at).length}</span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-border-main/50"
          >
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map(notif => (
                <motion.div 
                  key={notif.id}
                  variants={itemVariants}
                  onClick={() => markAsRead(notif.id, notif.data?.link)}
                  className={`p-6 flex gap-6 items-start hover:bg-bg-soft/30 transition-all cursor-pointer group relative ${!notif.read_at ? 'bg-primary/5' : ''}`}
                >
                  {!notif.read_at && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                    !notif.read_at ? 'bg-white border-primary/20' : 'bg-bg-soft border-border-main/50'
                  }`}>
                    {getNotifIcon(notif.data?.type_notif || notif.data?.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className={`text-sm tracking-tight leading-relaxed ${!notif.read_at ? 'text-text-main font-black' : 'text-text-sub font-bold'}`}>
                      {translateNotification(notif.data?.message)}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted opacity-60">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: getLocale() })}
                      </span>
                      {notif.read_at && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 opacity-60">
                          {t('notif.read', 'Lue')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                      className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-32 text-center space-y-4">
                <div className="w-20 h-20 bg-bg-soft rounded-full flex items-center justify-center mx-auto mb-6">
                  <InboxIcon className="w-10 h-10 text-text-muted opacity-20" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-text-main">{t('notif.none', 'Aucune notification')}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-60">{t('notif.up_to_date', 'Vous êtes à jour !')}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Back link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            ← {t('nav.back_dashboard', 'Retour au tableau de bord')}
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default Notifications;
