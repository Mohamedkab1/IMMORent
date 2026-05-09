import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr, enGB, arMA } from 'date-fns/locale';
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
  const { t, language } = useLanguage();
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

  const translateNotification = (msg) => {
    if (!msg) return '';
    
    // Pattern: "Votre demande pour [Title] a été approuvée"
    if (msg.includes('Votre demande pour') && msg.includes('a été approuvée')) {
       const title = msg.replace('Votre demande pour ', '').replace(' a été approuvée', '');
       return t('notif.msg.req_approved', 'Votre demande pour {{title}} a été approuvée').replace('{{title}}', title);
    }

    // Pattern: "Votre demande pour [Title] a été refusée"
    if (msg.includes('Votre demande pour') && msg.includes('a été refusée')) {
       const title = msg.replace('Votre demande pour ', '').replace(' a été refusée', '');
       return t('notif.msg.req_rejected', 'Votre demande pour {{title}} a été refusée').replace('{{title}}', title);
    }
    
    // Pattern: "Un nouveau contrat a été créé pour le bien : [Title]"
    if (msg.includes('Un nouveau contrat a été créé pour le bien : ')) {
       const title = msg.replace('Un nouveau contrat a été créé pour le bien : ', '');
       return t('notif.msg.contract_created', 'Un nouveau contrat a été créé pour le bien : {{title}}').replace('{{title}}', title);
    }

    // Pattern: "[Name] a envoyé une demande pour [Title]"
    if (msg.includes(' a envoyé une demande pour ')) {
       const parts = msg.split(' a envoyé une demande pour ');
       const name = parts[0];
       const title = parts[1];
       return t('notif.msg.new_rental_req', '{{name}} a envoyé une demande pour {{title}}')
              .replace('{{name}}', name)
              .replace('{{title}}', title);
    }

    // Pattern: "Le client [Name] a annulé sa demande pour [Title]"
    if (msg.includes('Le client ') && msg.includes(' a annulé sa demande pour ')) {
       const parts = msg.replace('Le client ', '').split(' a annulé sa demande pour ');
       const name = parts[0];
       const title = parts[1];
       return t('notif.msg.rental_req_cancelled', 'Le client {{name}} a annulé sa demande pour {{title}}')
              .replace('{{name}}', name)
              .replace('{{title}}', title);
    }

    // Pattern: "L'utilisateur [Name] souhaite devenir agent."
    if (msg.includes("L'utilisateur ") && msg.includes(" souhaite devenir agent.")) {
       const name = msg.replace("L'utilisateur ", "").replace(" souhaite devenir agent.", "");
       return t('notif.msg.user_wants_agent', "L'utilisateur {{name}} souhaite devenir agent.")
              .replace('{{name}}', name);
    }

    // Pattern: "Nouvelle demande de visite pour le bien : [Title]"
    if (msg.includes('Nouvelle demande de visite pour le bien : ')) {
       const title = msg.replace('Nouvelle demande de visite pour le bien : ', '');
       return t('notif.msg.new_visit_req', 'Nouvelle demande de visite pour le bien : {{title}}')
              .replace('{{title}}', title);
    }

    // Pattern: "Un nouveau paiement de [Amount] a été effectué pour le bien [Title]"
    if (msg.includes('Un nouveau paiement de ') && msg.includes(' a été effectué pour le bien ')) {
       const parts = msg.replace('Un nouveau paiement de ', '').split(' a été effectué pour le bien ');
       const amount = parts[0];
       const title = parts[1];
       return t('notif.msg.payment_received_amount', 'Un nouveau paiement de {{amount}} a été effectué pour le bien {{title}}')
              .replace('{{amount}}', amount)
              .replace('{{title}}', title);
    }

    // Pattern: "Un paiement de [Amount] a été reçu pour le bien : [Title]"
    if (msg.includes('Un paiement de ') && msg.includes(' a été reçu pour le bien : ')) {
       const parts = msg.replace('Un paiement de ', '').split(' a été reçu pour le bien : ');
       const amount = parts[0];
       const title = parts[1];
       return t('notif.msg.payment_received_p1', 'Un paiement de {{amount}} a été reçu pour le bien : {{title}}')
              .replace('{{amount}}', amount)
              .replace('{{title}}', title);
    }

    // Pattern: "Un paiement de [Amount] a été enregistré pour votre contrat."
    if (msg.includes('Un paiement de ') && msg.includes(' a été enregistré pour votre contrat.')) {
       const amount = msg.replace('Un paiement de ', '').split(' a été enregistré pour votre contrat.')[0];
       return t('notif.msg.payment_registered_p1', 'Un paiement de {{amount}} a été enregistré pour votre contrat.')
              .replace('{{amount}}', amount);
    }

    // Pattern: "Le statut de votre paiement de [Amount] est désormais : [Status]"
    if (msg.includes('Le statut de votre paiement de ') && msg.includes(' est désormais : ')) {
       const amount = msg.replace('Le statut de votre paiement de ', '').split(' est désormais : ')[0];
       const statusFr = msg.split(' est désormais : ')[1].replace('.', '');
       const statusKey = statusFr === 'reçu' ? 'notif.msg.payment_status_paid' : 
                         statusFr === 'en retard' ? 'notif.msg.payment_status_late' : 'notif.msg.payment_status_pending';
       return t('notif.msg.payment_status_update_p1', 'Le statut de votre paiement de {{amount}} est désormais : {{status}}')
              .replace('{{amount}}', amount)
              .replace('{{status}}', t(statusKey, statusFr));
    }

    // Pattern: "Votre bien "[Title]" a été approuvé par l'administrateur."
    if (msg.includes('Votre bien "') && msg.includes('" a été approuvé par l\'administrateur.')) {
       const title = msg.split('Votre bien "')[1].split('" a été approuvé par l\'administrateur.')[0];
       return t('notif.msg.prop_approved_by_admin', 'Votre annonce pour {{title}} a été approuvée par l\'administrateur.')
              .replace('{{title}}', title);
    }

    // Pattern: "Votre bien "[Title]" a été rejeté par l'administrateur."
    if (msg.includes('Votre bien "') && msg.includes('" a été rejeté par l\'administrateur.')) {
       const title = msg.split('Votre bien "')[1].split('" a été rejeté par l\'administrateur.')[0];
       return t('notif.msg.prop_rejected_by_admin', 'Votre bien "{{title}}" a été rejeté par l\'administrateur.')
              .replace('{{title}}', title);
    }

    // Pattern: "Vous avez reçu un message de [Name]"
    if (msg.includes('Vous avez reçu un message de ')) {
       const name = msg.replace('Vous avez reçu un message de ', '');
       return t('notif.msg.received_message_from', 'Vous avez reçu un message de {{name}}')
              .replace('{{name}}', name);
    }

    return t(msg, msg);
  };

  return (
    <div className="min-h-screen bg-bg-soft py-12 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">{t('nav.notifications')}</h1>
            <p className="text-text-sub font-medium mt-1">{t('notif.subtitle', 'Gérez vos alertes et communications en temps réel.')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={markAllRead}
              className="flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border-main text-text-sub text-sm font-bold rounded-2xl hover:bg-bg-soft transition-all"
            >
              <CheckCircleIcon className="w-5 h-5" />
              {t('nav.mark_all_read', 'Tout marquer comme lu')}
            </button>
          </div>
        </div>

        <div className="bg-bg-card rounded-[2.5rem] border border-border-main shadow-large overflow-hidden">
          <div className="p-6 border-b border-border-main bg-bg-soft/30 flex gap-4">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-primary text-white shadow-lg' : 'text-text-sub hover:bg-bg-soft'}`}
            >
              {t('notif.all', 'Toutes')}
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'unread' ? 'bg-primary text-white shadow-lg' : 'text-text-sub hover:bg-bg-soft'}`}
            >
              {t('notif.unread', 'Non lues')}
              {notifications.filter(n => !n.read_at).length > 0 && (
                <span className="ms-2 px-2 py-0.5 bg-white/20 text-xs rounded-full">
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
                          {translateNotification(notif.data?.message)}
                        </p>
                        <p className="text-xs font-bold text-text-muted mt-2 uppercase tracking-tighter">
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: getLocale() })}
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
                            title={t('nav.mark_all_read', 'Marquer comme lu')}
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
                          title={t('common.delete', 'Supprimer')}
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
                <p className="text-lg font-bold text-text-main">{t('notif.none', 'Aucune notification')}</p>
                <p className="text-text-sub mt-1">{t('notif.up_to_date', 'Vous êtes à jour !')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

