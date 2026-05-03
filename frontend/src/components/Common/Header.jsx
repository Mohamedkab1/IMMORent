import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import { notificationService } from '../../services/notifications';
import echo, { updateEchoToken } from '../../services/echo';
import logo from '../../assets/IMMORent.jpeg';
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    if (isAuthenticated && user) {
      loadNotifications();

      const token = localStorage.getItem('token');
      if (token) updateEchoToken(token);

      const channel = echo.private(`App.Models.User.${user.id}`);

      const handleNewNotification = (notification) => {
        console.log('New notification received:', notification);
        const normalized = normalizeNotification(notification);
        setUnreadCount(prev => prev + 1);
        setNotifications(prev => [normalized, ...prev.slice(0, 9)]);
      };

      channel.notification(handleNewNotification);
      channel.listen('.notification', handleNewNotification);
      channel.listen('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', handleNewNotification);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        channel.stopListening('.notification');
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
      if (countRes.success) setUnreadCount(countRes.count);
      if (listRes.success) setNotifications(listRes.data.data || []);
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
        title: notif.title || notif.data?.title || 'Notification'
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

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.properties'), path: '/properties' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-glass backdrop-blur-xl shadow-large border-b border-border-main py-2' : 'bg-bg-main py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-primary/20 transition-all duration-300">
              <img src={logo} alt="IMMORent Logo" className="w-10 h-10 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl"></div>
            </div>
            <span className="text-2xl font-black text-text-main tracking-tighter">IMMO<span className="text-primary dark:text-secondary">Rent</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 rtl:gap-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${location.pathname === link.path ? 'text-primary dark:text-secondary bg-primary/5 dark:bg-secondary/10' : 'text-text-sub hover:text-primary dark:hover:text-white hover:bg-bg-secondary'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2 rtl:gap-reverse">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group/theme relative p-2.5 bg-bg-soft hover:bg-bg-main rounded-xl border border-border-main transition-all shadow-main hover:shadow-large active:scale-95 overflow-hidden"
              aria-label="Toggle Theme"
            >
              <div className="relative z-10 transition-transform duration-500 group-hover/theme:rotate-[360deg]">
                {theme === 'dark' ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5 text-primary" />}
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-0 group-hover/theme:opacity-100 transition-opacity"></div>
            </button>

            {/* Language Switch */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2.5 text-text-sub hover:text-text-main bg-bg-secondary rounded-xl border border-transparent group-hover:border-border-main transition-all uppercase text-xs font-black tracking-widest leading-none">
                <LanguageIcon className="w-5 h-5" />
                {language}
              </button>
              <div className="absolute top-full right-0 mt-2 w-32 bg-bg-main rounded-2xl shadow-2xl border border-border-main opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 overflow-hidden ring-1 ring-black/5">
                {['fr', 'en', 'ar'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`block w-full text-center px-4 py-3 text-sm font-bold transition-colors ${language === lang ? 'bg-primary/5 text-primary dark:bg-secondary/10 dark:text-secondary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-border-main mx-2"></div>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">

                {/* Favoris */}
                <Link 
                  to="/favoris"
                  className="relative p-2.5 text-text-sub hover:text-rose-500 bg-bg-secondary rounded-xl transition-all"
                  title={t('nav.favorites', 'Mes Favoris')}
                >
                  <HeartIcon className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
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
                    className="relative p-2.5 text-text-sub hover:text-primary dark:hover:text-secondary bg-bg-secondary rounded-xl transition-all"
                  >
                    <BellIcon className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <div className={`absolute right-0 mt-3 w-80 bg-bg-main rounded-3xl shadow-2xl border border-border-main transition-all duration-300 origin-top-right ring-1 ring-black/5 ${notifOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-4 scale-95'}`}>
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                       <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">{t('nav.notifications')}</h3>
                       {unreadCount > 0 && <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-primary hover:underline">{t('nav.mark_all_read')}</button>}
                    </div>
                    <div className="max-h-96 overflow-y-auto p-2 space-y-1">
                      {notifications.length > 0 ? notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-2xl transition-all cursor-pointer flex gap-3 group/item ${notif.read_at ? 'hover:bg-bg-soft' : 'bg-primary/5 dark:bg-secondary/5 hover:bg-primary/10 dark:hover:bg-secondary/10 border border-primary/10 dark:border-secondary/10'}`}
                          onClick={() => markAsRead(notif.id, notif.data?.link)}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.read_at ? 'bg-bg-soft' : 'bg-white dark:bg-slate-800 shadow-sm'}`}>
                            {getNotifIcon(notif.data?.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-tight line-clamp-2 ${notif.read_at ? 'text-text-sub font-medium' : 'text-text-main font-bold'}`}>
                              {notif.data?.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-bold text-text-muted">
                                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
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
                      <div className="p-3 border-t border-border-main bg-bg-soft/30 rounded-b-3xl">
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
                    className="flex items-center gap-2 p-1.5 pe-3 bg-bg-secondary rounded-2xl border border-transparent hover:border-border-main transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-400 dark:from-secondary dark:to-yellow-200 flex items-center justify-center text-white dark:text-primary font-black text-sm shadow-md">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-start">
                      <div className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[100px] leading-none mb-0.5">{user?.name}</div>
                      <div className="text-[10px] font-black uppercase tracking-tighter text-slate-400 leading-none">{user?.role?.name || 'User'}</div>
                    </div>
                  </button>


                  <div className={`absolute right-0 mt-3 w-64 bg-bg-main rounded-3xl shadow-2xl border border-border-main transition-all duration-300 origin-top-right ring-1 ring-black/5 ${dropdownOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-4 scale-95'}`}>
                    <div className="p-5 border-b border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t('nav.personal_space')}</p>
                       <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to={dashboardLink} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-text-sub hover:bg-bg-secondary hover:text-primary dark:hover:text-white transition-all">
                        <ChartBarIcon className="w-5 h-5 opacity-70" /> {t('nav.dashboard')}
                      </Link>
                      <Link to="/messages" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-all">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 opacity-70" /> {t('nav.messages')}
                      </Link>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-all">
                        <UserCircleIcon className="w-5 h-5 opacity-70" /> {t('nav.profile')}
                      </Link>
                    </div>
                    <div className="p-2 border-t border-slate-50 dark:border-slate-800">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rtl:gap-reverse">
                <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-all underline-offset-4 hover:underline">{t('nav.login')}</Link>
                <Link to="/register" className="px-6 py-2.5 text-sm font-black bg-primary dark:bg-secondary text-white dark:text-primary rounded-xl shadow-lg shadow-primary/20 dark:shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">{t('nav.register')}</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-text-sub">
              {theme === 'dark' ? <SunIcon className="w-6 h-6 text-amber-500" /> : <MoonIcon className="w-6 h-6 text-primary" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-text-sub transition-colors">
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
                <div className="w-14 h-14 rounded-2xl bg-primary dark:bg-secondary flex items-center justify-center text-white dark:text-primary font-black text-xl shadow-lg">
                  {user?.name?.[0]?.toUpperCase()}
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