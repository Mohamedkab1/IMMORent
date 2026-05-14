import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr, enGB, arMA } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { notificationService } from '../../services/notifications';
import echo, { updateEchoToken } from '../../services/echo';
import logo from '../../assets/IMMORent.jpeg';
import { toast } from 'react-toastify';
import {
  SunIcon,
  MoonIcon,
  LanguageIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  UserCircleIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CheckCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [hoveredLink, setHoveredLink] = useState(null);

  const getLocale = () => {
    if (language === 'ar') return arMA;
    if (language === 'en') return enGB;
    return fr;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    if (isAuthenticated && user) {
      loadNotifications();

      // Polling fallback to ensure notifications work even without WebSockets
      const pollInterval = setInterval(() => {
        loadNotifications();
      }, 60000); // Every 60 seconds (optimized for production)

      const token = localStorage.getItem('token');
      if (token) updateEchoToken(token);

      const channel = echo.private(`App.Models.User.${user.id}`);

      const handleNewNotification = (notification) => {
        console.log('New notification received:', notification);
        
        // Normalize data from both custom events and standard Laravel notifications
        const data = notification.notification || notification;
        const normalized = {
          id: data.id || Math.random().toString(36).substr(2, 9),
          data: {
            title: data.title || (notification.data?.title),
            message: data.message || (notification.data?.message),
            type: data.type || (notification.data?.type) || 'info',
            link: data.link || (notification.data?.link),
            icon: data.icon || (notification.data?.icon)
          },
          read_at: null,
          created_at: data.created_at || new Date().toISOString()
        };

        // Show toast notification
        toast.info(
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <div className="font-bold">{t(normalized.data.title, normalized.data.title) || t('nav.new_notification', 'Nouvelle notification')}</div>
            <div className="text-xs opacity-90">{t(normalized.data.message, normalized.data.message)}</div>
          </div>,
          {
            icon: getNotifIcon(normalized.data.type),
            onClick: () => {
               if (normalized.data.link) navigate(normalized.data.link);
            }
          }
        );

        // Update local state
        setUnreadCount(prev => prev + 1);
        setNotifications(prev => [normalized, ...prev.slice(0, 9)]);
      };

      // Listen for explicit custom event
      channel.listen('.notification.received', handleNewNotification);
      
      // Listen for standard Laravel notifications
      channel.notification(handleNewNotification);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearInterval(pollInterval);
        channel.stopListening('.notification.received');
        // Standard Laravel notification listener cleanup
        channel.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
      };
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setNotifOpen(false);
  }, [location]);

  const loadNotifications = async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        notificationService.getUnreadCount(),
        notificationService.getAll({ per_page: 10 })
      ]);
      
      if (countRes.data?.success) {
        setUnreadCount(countRes.data.count);
      }
      
      if (listRes.data?.success) {
        // Laravel pagination returns the items in the 'data' property of the response 'data'
        const rawNotifications = listRes.data.data.data || [];
        setNotifications(rawNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const normalizeNotification = (notif) => {
    return {
      id: notif.id,
      data: {
        message: notif.message || notif.data?.message || '',
        link: notif.link || notif.data?.link || null,
        type: notif.type_notif || notif.type || notif.data?.type_notif || notif.data?.type || 'info',
        title: notif.title || notif.data?.title || t('nav.notification', 'Notification')
      },
      created_at: notif.created_at || new Date().toISOString(),
      read_at: notif.read_at || null
    };
  };

  const markAsRead = async (id, link) => {
    const targetNotif = notifications.find(n => n.id === id);
    if (targetNotif && !targetNotif.read_at) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    try {
      await notificationService.markRead(id);
      if (link) {
        setNotifOpen(false);
        navigate(link);
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      loadNotifications(); 
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    setUnreadCount(0);
    try {
      await notificationService.markAllRead();
    } catch (error) {
      loadNotifications();
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'message':
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-500" />;
      case 'rental_request':
      case 'agent_request':
        return <DocumentTextIcon className="w-5 h-5 text-purple-500" />;
      case 'property_status':
      case 'agent_request_processed':
        return <BuildingOfficeIcon className="w-5 h-5 text-amber-500" />;
      case 'contract':
        return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
      case 'payment':
        return <BanknotesIcon className="w-5 h-5 text-green-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-primary" />;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dashboardLink = user?.role?.slug === 'admin'
    ? '/dashboard/admin'
    : user?.role?.slug === 'agent'
      ? '/dashboard/agent'
      : '/dashboard/client';

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
       return t('notif.msg.payment_registered_p1', 'Un paiement de {{amount}} a été enregistré for your contract.')
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

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.properties'), path: '/properties' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isAuthPage = ['/login', '/register', '/register/role'].includes(location.pathname);
  const isTransparentNav = location.pathname === '/' || location.pathname.startsWith('/properties/') || location.pathname === '/about' || location.pathname === '/contact' || isAuthPage;
  const isLightText = !scrolled && isTransparentNav;

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-bg-main/95 backdrop-blur-md shadow-lg border-b border-border-main py-2' 
        : isTransparentNav 
          ? 'bg-transparent py-6' 
          : 'bg-bg-main py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 md:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <img src={logo} alt="IMMORent" className="h-10 w-10 object-cover rounded-xl shadow-sm" />
            <span className={`text-3xl font-black tracking-tighter transition-colors ${isLightText ? 'text-white' : 'text-text-main'}`}>
              IMMO<span className="text-yellow-400">Rent</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 rtl:gap-reverse uppercase tracking-widest text-[11px] font-black">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onMouseEnter={() => setHoveredLink(link.path)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative py-2 focus:outline-none transition-colors duration-300 ${
                    isActive ? 'text-primary dark:text-yellow-400' : scrolled ? 'text-text-sub hover:text-yellow-400' : isLightText ? 'text-white/80 hover:text-yellow-400' : 'text-text-sub hover:text-yellow-400'
                  }`}
                >
                  {link.name}
                  {hoveredLink === link.path && (
                    <motion.div
                      layoutId="navHoverIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3 rtl:gap-reverse">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group/theme relative p-2.5 text-text-sub hover:text-primary dark:hover:text-secondary rounded-full bg-bg-secondary/50 hover:bg-primary/10 dark:hover:bg-secondary/10 border border-transparent hover:border-primary/20 dark:hover:border-secondary/20 transition-all duration-300 active:scale-95"
              aria-label="Toggle Theme"
            >
              <div className="relative z-10 transition-transform duration-500 group-hover/theme:rotate-[360deg] group-hover/theme:scale-110">
                {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </div>
            </button>

            {/* Language Switch */}
            <div className="relative group/lang">
              <button className="flex items-center gap-2 px-4 py-2 text-text-sub hover:text-text-main rounded-full bg-bg-secondary/50 hover:bg-bg-soft transition-all duration-300 uppercase text-xs font-bold tracking-widest">
                <LanguageIcon className="w-5 h-5" />
                <span>{language}</span>
              </button>
              
              <div className="absolute top-full right-0 mt-3 w-32 bg-bg-main/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border-main opacity-0 invisible translate-y-4 scale-95 group-hover/lang:opacity-100 group-hover/lang:visible group-hover/lang:translate-y-0 group-hover/lang:scale-100 transition-all duration-300 origin-top-right overflow-hidden p-1.5">
                {['fr', 'en', 'ar'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`block w-full text-center px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-200 ${
                      language === lang 
                        ? 'bg-primary text-white dark:bg-secondary dark:text-slate-900 shadow-md' 
                        : 'text-text-sub hover:bg-bg-soft hover:text-text-main'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-border-main mx-1"></div>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">

                {/* Favoris */}
                <Link 
                  to="/favoris"
                  className="relative p-2.5 text-text-sub hover:text-rose-500 rounded-full bg-bg-secondary/50 hover:bg-rose-500/10 transition-all duration-300 hover:scale-110"
                  title={t('nav.favorites', 'Mes Favoris')}
                >
                  <HeartIcon className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-bg-main">
                      {favoritesCount > 9 ? '9+' : favoritesCount}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setNotifOpen(!notifOpen);
                      setDropdownOpen(false);
                    }}
                    className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${
                      notifOpen ? 'bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary' : 'text-text-sub bg-bg-secondary/50 hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    <BellIcon className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-bg-main animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <div className={`absolute right-0 mt-3 w-96 bg-bg-main rounded-xl shadow-xl border border-border-main transition-all duration-300 origin-top-right ring-1 ring-black/5 ${notifOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-4 scale-95'}`}>
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                       <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">{t('nav.notifications')}</h3>
                       {unreadCount > 0 && <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-primary hover:underline">{t('nav.mark_all_read')}</button>}
                    </div>
                    <div className="max-h-96 overflow-y-auto p-2 space-y-1">
                      {notifications.length > 0 ? notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-lg transition-all cursor-pointer flex gap-3 group/item ${notif.read_at ? 'hover:bg-bg-soft' : 'bg-primary/5 dark:bg-secondary/5 hover:bg-primary/10 dark:hover:bg-secondary/10 border border-primary/10 dark:border-secondary/10'}`}
                          onClick={() => markAsRead(notif.id, notif.data?.link)}
                        >
                          <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${notif.read_at ? 'bg-bg-soft' : 'bg-white dark:bg-slate-800 shadow-sm'}`}>
                            {getNotifIcon(notif.data?.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-tight ${notif.read_at ? 'text-text-sub font-medium' : 'text-text-main font-bold'}`}>
                              {translateNotification(notif.data?.message)}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-bold text-text-muted">
                                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: getLocale() })}
                              </span>
                              {!notif.read_at && <span className="w-1.5 h-1.5 bg-primary dark:bg-secondary rounded-full"></span>}
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 bg-bg-soft rounded-full flex items-center justify-center mx-auto mb-4">
                            <BellIcon className="w-8 h-8 text-text-muted opacity-20" />
                          </div>
                          <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('nav.no_notifications')}</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-border-main bg-bg-soft/30 rounded-b-xl">
                        <Link to="/notifications" className="block w-full py-2 text-center text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                          {t('nav.view_all_notifications', 'Voir toutes les notifications')}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">

                  <button 
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                      setNotifOpen(false);
                    }} 
                    className="flex items-center gap-2 p-1.5 pe-3 bg-bg-secondary rounded-xl border border-transparent hover:border-border-main transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-tr from-primary to-blue-400 dark:from-secondary dark:to-yellow-200 flex items-center justify-center text-white dark:text-primary font-black text-sm shadow-sm border border-white/10">
                      {user?.profile_photo ? (
                        <img 
                          src={`http://localhost:8000/storage/${user.profile_photo}`} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.name?.[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="hidden lg:block text-start">
                      <div className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[100px] leading-none mb-0.5">{user?.name}</div>
                      <div className="text-[10px] font-black uppercase tracking-tighter text-slate-400 leading-none">{user?.role?.name || 'User'}</div>
                    </div>
                  </button>


                  <div className={`absolute right-0 mt-3 w-64 bg-bg-main rounded-xl shadow-xl border border-border-main transition-all duration-300 origin-top-right ring-1 ring-black/5 ${dropdownOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-4 scale-95'}`}>
                    <div className="p-5 border-b border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t('nav.personal_space')}</p>
                       <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to={dashboardLink} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-text-sub hover:bg-bg-secondary hover:text-primary dark:hover:text-white transition-all">
                        <ChartBarIcon className="w-5 h-5 opacity-70" /> {t('nav.dashboard')}
                      </Link>
                      <Link to="/messages" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-all">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 opacity-70" /> {t('nav.messages')}
                      </Link>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-all">
                        <UserCircleIcon className="w-5 h-5 opacity-70" /> {t('nav.profile')}
                      </Link>
                    </div>
                    <div className="p-2 border-t border-slate-50 dark:border-slate-800">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 rtl:gap-reverse uppercase tracking-widest text-[10px] font-black">
                <Link to="/login" className={`transition-colors ${!scrolled && location.pathname === '/' ? 'text-white/80 hover:text-white' : 'text-text-sub hover:text-text-main'}`}>{t('nav.login')}</Link>
                <Link to="/register" className={`px-5 py-2 border-2 transition-all ${!scrolled && location.pathname === '/' ? 'border-white text-white hover:bg-white hover:text-black' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}>{t('nav.register')}</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className={`p-2 transition-colors ${!scrolled && location.pathname === '/' ? 'text-white/80' : 'text-text-sub'}`}>
              {theme === 'dark' ? <SunIcon className="w-6 h-6 text-amber-500" /> : <MoonIcon className="w-6 h-6" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 transition-colors ${!scrolled && location.pathname === '/' ? 'text-white' : 'text-text-sub'}`}>
              {mobileMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav (Enhanced) */}
      <div className={`md:hidden absolute inset-x-0 top-full bg-bg-main border-b border-border-main transition-all duration-300 origin-top shadow-2xl ${mobileMenuOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-0'}`}>
        <div className="p-4 space-y-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`px-4 py-3 rounded-2xl text-base font-bold transition-all ${location.pathname === link.path ? 'bg-primary/5 text-primary dark:bg-secondary/10 dark:text-secondary' : 'text-slate-600 dark:text-slate-400'}`}>
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

          <div className="flex justify-between items-center px-4">
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('nav.theme')}</span>
            <button onClick={toggleTheme} className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'bg-amber-100/10 text-amber-500' : 'bg-primary/5 text-primary'}`}>
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-between items-center px-4">
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('nav.language')}</span>
            <div className="flex gap-2">
              {['fr', 'en', 'ar'].map(lang => (
                <button key={lang} onClick={() => changeLanguage(lang)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${language === lang ? 'bg-primary dark:bg-secondary text-white dark:text-primary shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

          {isAuthenticated ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 px-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-primary dark:bg-secondary flex items-center justify-center text-white dark:text-primary font-black text-xl shadow-lg border-2 border-white/10">
                  {user?.profile_photo ? (
                    <img 
                      src={`http://localhost:8000/storage/${user.profile_photo}`} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.[0]?.toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-lg">{user?.name}</p>
                  <p className="text-xs font-black uppercase text-slate-400 tracking-wider font-mono">{user?.role?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link to={dashboardLink} className="flex items-center justify-center gap-2 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white">
                  <ChartBarIcon className="w-5 h-5 opacity-60" /> {t('nav.dashboard')}
                </Link>
                <Link to="/profile" className="flex items-center justify-center gap-2 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white">
                  <UserCircleIcon className="w-5 h-5 opacity-60" /> {t('nav.profile')}
                </Link>
              </div>
              <button onClick={handleLogout} className="w-full py-4 text-rose-500 font-black text-sm uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all">
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login" className="w-full py-4 text-center text-slate-800 dark:text-white font-bold bg-slate-50 dark:bg-slate-800 rounded-2xl transition-all hover:bg-slate-100">{t('nav.login')}</Link>
              <Link to="/register" className="w-full py-4 text-center text-primary dark:text-primary font-black bg-secondary dark:bg-secondary rounded-2xl shadow-xl shadow-secondary/20 active:scale-95 transition-all">{t('nav.register')}</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;