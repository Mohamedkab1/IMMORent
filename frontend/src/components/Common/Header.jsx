import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/notifications';
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
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
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
    
    if (isAuthenticated) {
      loadNotifications();
      // Poll for notifications every 2 minutes
      const interval = setInterval(loadNotifications, 120000);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearInterval(interval);
      };
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setNotifOpen(false);
  }, [location]);

  const loadNotifications = async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        notificationService.getUnreadCount(),
        notificationService.getAll({ per_page: 5 })
      ]);
      if (countRes.success) setUnreadCount(countRes.count);
      if (listRes.success) setNotifications(listRes.data.data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-slate-200 dark:border-slate-800 py-2' : 'bg-white dark:bg-slate-900 py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-primary/20 transition-all duration-300">
               <img src={logo} alt="IMMORent Logo" className="w-10 h-10 object-cover group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl"></div>
            </div>
            <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">IMMO<span className="text-primary dark:text-secondary">Rent</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 rtl:gap-reverse">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${location.pathname === link.path ? 'text-primary dark:text-secondary bg-primary/5 dark:bg-secondary/10' : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'}`}
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
              className="p-2.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-secondary bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-md active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5 text-amber-500" /> : <MoonIcon className="w-5 h-5 text-primary" />}
            </button>

            {/* Language Switch */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all uppercase text-xs font-black tracking-widest leading-none">
                <LanguageIcon className="w-5 h-5" />
                {language}
              </button>
              <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 overflow-hidden ring-1 ring-black/5">
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

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-secondary bg-slate-50 dark:bg-slate-800 rounded-xl transition-all"
                  >
                    <BellIcon className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <div className={`absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 origin-top-right ring-1 ring-black/5 ${notifOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-4 scale-95'}`}>
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                       <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">{t('nav.notifications')}</h3>
                       {unreadCount > 0 && <button onClick={() => notificationService.markAllRead().then(loadNotifications)} className="text-[10px] font-bold text-primary hover:underline">{t('nav.mark_all_read')}</button>}
                    </div>
                    <div className="max-h-96 overflow-y-auto p-2">
                      {notifications.length > 0 ? notifications.map(notif => (
                        <div key={notif.id} className={`p-3 rounded-2xl mb-1 transition-colors ${notif.read_at ? 'opacity-60' : 'bg-primary/5 dark:bg-secondary/5'}`} onClick={() => markAsRead(notif.id)}>
                          <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{notif.data?.title || 'Notification'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.data?.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                        </div>
                      )) : (
                        <div className="py-8 text-center">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('nav.no_notifications')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)} 
                    className="flex items-center gap-2 p-1.5 pe-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-400 dark:from-secondary dark:to-yellow-200 flex items-center justify-center text-white dark:text-primary font-black text-sm shadow-md">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="hidden lg:block text-start">
                      <div className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[100px] leading-none mb-0.5">{user?.name}</div>
                      <div className="text-[10px] font-black uppercase tracking-tighter text-slate-400 leading-none">{user?.role?.name || 'User'}</div>
                    </div>
                  </button>

                  <div className={`absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 origin-top-right ring-1 ring-black/5 ${dropdownOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-4 scale-95'}`}>
                    <div className="p-5 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t('nav.personal_space')}</p>
                       <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to={dashboardLink} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white transition-all">
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
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300">
              {theme === 'dark' ? <SunIcon className="w-6 h-6 text-amber-500" /> : <MoonIcon className="w-6 h-6 text-primary" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300 transition-colors">
              {mobileMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav (Enhanced) */}
      <div className={`md:hidden absolute inset-x-0 top-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-all duration-300 origin-top shadow-2xl ${mobileMenuOpen ? 'opacity-100 visible scale-y-100' : 'opacity-0 invisible scale-y-0'}`}>
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