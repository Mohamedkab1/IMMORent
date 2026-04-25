import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
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
import { toast } from 'react-toastify';
import LoadingSkeleton from '../components/Common/LoadingSkeleton';

const Notifications = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll({ per_page: 50 });
      if (res.success) {
        setNotifications(res.data.data || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, link) => {
    // 1. Mise à jour optimiste
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
    // Optimistic
    const previousNotifs = [...notifications];
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    
    try {
      await notificationService.markAllRead();
      toast.success('Toutes les notifications sont marquées comme lues');
    } catch (error) {
      setNotifications(previousNotifs);
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification supprimée');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'message':
        return <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500" />;
      case 'rental_request':
      case 'agent_request':
        return <DocumentTextIcon className="w-6 h-6 text-purple-500" />;
      case 'property_status':
      case 'agent_request_processed':
        return <BuildingOfficeIcon className="w-6 h-6 text-amber-500" />;
      case 'contract':
        return <CheckCircleIcon className="w-6 h-6 text-emerald-500" />;
      case 'payment':
        return <BanknotesIcon className="w-6 h-6 text-green-500" />;
      default:
        return <BellIcon className="w-6 h-6 text-primary" />;
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read_at);

  return (
    <div className="min-h-screen bg-bg-soft py-12 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">{t('nav.notifications')}</h1>
            <p className="text-text-sub font-medium mt-1">Gérez vos alertes et communications en temps réel.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={markAllRead}
              className="flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border-main text-text-sub text-sm font-bold rounded-2xl hover:bg-bg-soft transition-all"
            >
              <CheckCircleIcon className="w-5 h-5" />
              Tout marquer comme lu
            </button>
          </div>
        </div>

        <div className="bg-bg-card rounded-[2.5rem] border border-border-main shadow-large overflow-hidden">
          <div className="p-6 border-b border-border-main bg-bg-soft/30 flex gap-4">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-primary text-white shadow-lg' : 'text-text-sub hover:bg-bg-soft'}`}
            >
              Toutes
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'unread' ? 'bg-primary text-white shadow-lg' : 'text-text-sub hover:bg-bg-soft'}`}
            >
              Non lues
              {notifications.filter(n => !n.read_at).length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 text-xs rounded-full">
                  {notifications.filter(n => !n.read_at).length}
                </span>
              )}
            </button>
          </div>

          <div className="divide-y divide-border-main">
            {loading ? (
              <div className="p-10 space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <LoadingSkeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`p-6 flex gap-5 transition-all cursor-pointer hover:bg-bg-soft/50 group ${!notif.read_at ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                  onClick={() => markAsRead(notif.id, notif.data?.link)}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${!notif.read_at ? 'bg-white dark:bg-slate-800' : 'bg-bg-soft'}`}>
                    {getNotifIcon(notif.data?.type_notif || notif.data?.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className={`text-base leading-tight ${!notif.read_at ? 'text-text-main font-bold' : 'text-text-sub font-medium'}`}>
                          {notif.data?.message}
                        </p>
                        <p className="text-xs font-bold text-text-muted mt-2">
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.read_at && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            className="p-2 text-text-sub hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                            title="Marquer comme lu"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="p-2 text-text-sub hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center">
                <div className="w-24 h-24 bg-bg-soft rounded-full flex items-center justify-center mx-auto mb-6">
                  <InboxIcon className="w-12 h-12 text-text-muted opacity-20" />
                </div>
                <p className="text-lg font-bold text-text-main">Aucune notification</p>
                <p className="text-text-sub mt-1">Vous êtes à jour !</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
