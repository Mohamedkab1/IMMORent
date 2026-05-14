import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon, 
  CalendarIcon, 
  BriefcaseIcon,
  ShieldCheckIcon,
  CameraIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { userService } from '../services/users';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Profile = () => {
  const { t, language } = useLanguage();
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.update(user.id, formData);
      if (res.success) {
        updateUser(res.data);
        toast.success(t('profile.update_success'));
        setIsEditing(false);
      }
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || t('profile.update_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('profile_photo', file);

    setLoading(true);
    try {
      const res = await userService.update(user.id, formDataUpload);
      if (res.success) {
        updateUser(res.data);
        toast.success(t('profile.update_success'));
      }
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || t('profile.update_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm(t('common.confirm_delete', 'Voulez-vous supprimer votre photo ?'))) return;
    
    setLoading(true);
    try {
      const res = await userService.update(user.id, { remove_photo: true });
      if (res.success) {
        updateUser(res.data);
        toast.success(t('profile.update_success'));
      }
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || t('profile.update_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      return toast.error(t('auth.register.error_password_match'));
    }

    setLoading(true);
    try {
      const res = await userService.update(user.id, passwordData);
      if (res.success) {
        toast.success(t('profile.update_success'));
        setShowPasswordModal(false);
        setPasswordData({ current_password: '', password: '', password_confirmation: '' });
      }
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || t('profile.update_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeAgent = async () => {
    if (window.confirm(t('profile.agent_confirm'))) {
      setLoading(true);
      try {
        const res = await userService.becomeAgent();
        if (res.success) {
          toast.success(t('profile.agent_success'));
          setTimeout(() => window.location.reload(), 2000);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || t('profile.agent_error'));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
      theme === 'light' ? 'bg-slate-50' : 'bg-[#050a1f]'
    }`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <RevealOnScroll>
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
              <div className="relative">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-lg mb-4">
                    {t('profile.title')}
                  </span>
                  <h1 className={`text-6xl font-black tracking-tighter ${
                    theme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    {t('profile.subtitle')}
                  </h1>
              </div>
              <div className="flex items-center gap-4">
                  <div className={`px-6 py-3 border rounded-lg text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-colors ${
                    theme === 'light' ? 'bg-white border-slate-100 text-emerald-600' : 'bg-white/5 border-white/10 text-emerald-400'
                  }`}>
                      <ShieldCheckIcon className="w-5 h-5" /> {t('profile.verified')}
                  </div>
              </div>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar: Profile Summary */}
            <div className="lg:col-span-4 space-y-10">
                <RevealOnScroll delay={100}>
                  <div className={`shadow-2xl border transition-all duration-500 rounded-lg p-10 text-center relative overflow-hidden group ${
                    theme === 'light' ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10'
                  }`}>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
                      
                      <div className="relative mx-auto w-40 h-40 mb-8">
                          {user?.profile_photo ? (
                              <div className="relative group/photo w-full h-full">
                                  <img 
                                      src={`http://localhost:8000/storage/${user.profile_photo}?t=${new Date().getTime()}`} 
                                      alt={user.name} 
                                      className="w-full h-full rounded-lg object-cover shadow-2xl transition-transform duration-700 border-4 border-white/5 group-hover:scale-105"
                                  />
                                  <button 
                                      onClick={handleDeletePhoto}
                                      className="absolute -top-3 -left-3 p-3 bg-red-600 text-white rounded-lg shadow-xl opacity-0 group-hover/photo:opacity-100 transition-all hover:scale-110"
                                      title={t('common.delete')}
                                  >
                                      <TrashIcon className="w-5 h-5" />
                                  </button>
                              </div>
                          ) : (
                              <div className="w-full h-full rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-6xl font-black text-white shadow-2xl transition-transform duration-700 group-hover:scale-105">
                                  {user?.name?.charAt(0) || 'U'}
                              </div>
                          )}
                          <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handlePhotoChange} 
                              className="hidden" 
                              accept="image/*"
                          />
                          <button 
                              onClick={handlePhotoClick}
                              disabled={loading}
                              className="absolute -bottom-3 -right-3 p-4 bg-blue-600 text-white rounded-lg shadow-xl border-4 border-[#050a1f] hover:scale-110 transition-transform disabled:opacity-50 active:scale-95"
                          >
                              <CameraIcon className="w-6 h-6" />
                          </button>
                      </div>
                      
                      <h2 className={`text-3xl font-black tracking-tight mb-2 ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}>{user?.name}</h2>
                      <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                        theme === 'light' ? 'text-slate-400' : 'text-white/30'
                      }`}>{t('auth.role.' + user?.role?.slug, user?.role?.name || 'Client')}</p>
                      
                      <div className="mt-12 pt-10 border-t border-white/5 space-y-6">
                          <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${
                                theme === 'light' ? 'text-slate-400' : 'text-white/40'
                              }`}>{t('profile.member_since')}</span>
                              <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                {new Date(user?.created_at).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', { month: 'long', year: 'numeric' })}
                              </span>
                          </div>
                          <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${
                                theme === 'light' ? 'text-slate-400' : 'text-white/40'
                              }`}>
                                {user?.role?.slug === 'client' ? t('profile.properties_rented') : t('profile.properties_managed')}
                              </span>
                              <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                  {user?.role?.slug === 'client' 
                                      ? (user?.contracts_as_tenant_count || 0) 
                                      : (user?.role?.slug === 'agent' 
                                          ? (user?.contracts_as_agent_count || 0) 
                                          : (user?.properties_count || 0))
                                  }
                              </span>
                          </div>
                      </div>
                  </div>
                </RevealOnScroll>

                {/* Account Status for Clients */}
                {user?.role?.slug === 'client' && (
                  <RevealOnScroll delay={200}>
                    <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg p-10 text-white shadow-2xl relative overflow-hidden group">
                        <BriefcaseIcon className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
                        <h3 className="text-2xl font-black tracking-tight mb-4">{t('profile.become_agent')}</h3>
                        <p className="text-sm text-white/70 mb-10 font-medium leading-relaxed">{t('profile.become_agent_desc')}</p>
                        
                        {!user.agent_status ? (
                             <button 
                                onClick={handleBecomeAgent}
                                disabled={loading}
                                className="w-full py-5 bg-white text-blue-900 rounded-lg font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                             >
                                {t('profile.apply_now')}
                             </button>
                        ) : (
                            <div className="p-6 bg-white/10 border border-white/20 rounded-lg backdrop-blur-md">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">{t('profile.status_req')}</p>
                                <p className="text-xl font-black text-white">
                                    {user.agent_status === 'pending' ? t('profile.pending') : user.agent_status}
                                </p>
                            </div>
                        )}
                    </div>
                  </RevealOnScroll>
                )}
            </div>

            {/* Main Content: Form */}
            <div className="lg:col-span-8">
                <RevealOnScroll delay={300}>
                  <div className={`shadow-2xl border transition-all duration-500 rounded-lg p-10 md:p-14 ${
                    theme === 'light' ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10'
                  }`}>
                      <div className="flex items-center justify-between mb-16 pb-8 border-b border-white/5">
                          <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-600/20">
                                  <UserIcon className="w-8 h-8" />
                              </div>
                              <div>
                                <h3 className={`text-2xl font-black tracking-tight ${
                                  theme === 'light' ? 'text-slate-900' : 'text-white'
                                }`}>{t('profile.general_info')}</h3>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${
                                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                                }`}>{t('profile.personal_details')}</p>
                              </div>
                          </div>
                          {!isEditing ? (
                              <button onClick={() => setIsEditing(true)} className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                  <PencilIcon className="w-4 h-4" /> {t('profile.edit')}
                              </button>
                          ) : (
                              <button onClick={() => setIsEditing(false)} className="flex items-center gap-3 px-8 py-4 bg-red-600/10 text-red-600 border border-red-600/20 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all active:scale-95">
                                  <XMarkIcon className="w-4 h-4" /> {t('profile.cancel')}
                              </button>
                          )}
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-12">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-4">
                                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                                    theme === 'light' ? 'text-slate-400' : 'text-white/30'
                                  }`}>
                                      <UserIcon className="w-4 h-4" /> {t('profile.name_label')}
                                  </label>
                                  <input 
                                      type="text" 
                                      name="name" 
                                      value={formData.name} 
                                      onChange={handleChange} 
                                      disabled={!isEditing}
                                      className={`w-full px-6 py-5 rounded-lg border transition-all duration-500 font-bold text-lg ${
                                        isEditing 
                                          ? 'bg-transparent border-blue-600/50 shadow-2xl shadow-blue-600/5 text-blue-600 focus:border-blue-600 outline-none' 
                                          : theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-900 cursor-not-allowed' : 'bg-white/5 border-white/5 text-white/50 cursor-not-allowed'
                                      }`}
                                  />
                              </div>

                              <div className="space-y-4">
                                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                                    theme === 'light' ? 'text-slate-400' : 'text-white/30'
                                  }`}>
                                      <EnvelopeIcon className="w-4 h-4" /> {t('profile.email_label')}
                                  </label>
                                  <input 
                                      type="email" 
                                      value={user?.email} 
                                      disabled 
                                      className={`w-full px-6 py-5 rounded-lg border font-bold text-lg cursor-not-allowed ${
                                        theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-white/5 border-white/5 text-white/20'
                                      }`}
                                  />
                                  <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest italic">{t('profile.email_desc')}</p>
                              </div>

                              <div className="space-y-4">
                                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                                    theme === 'light' ? 'text-slate-400' : 'text-white/30'
                                  }`}>
                                      <PhoneIcon className="w-4 h-4" /> {t('profile.phone_label')}
                                  </label>
                                  <input 
                                      type="tel" 
                                      name="phone" 
                                      value={formData.phone} 
                                      onChange={handleChange} 
                                      disabled={!isEditing}
                                      placeholder="06 XX XX XX XX"
                                      className={`w-full px-6 py-5 rounded-lg border transition-all duration-500 font-bold text-lg ${
                                        isEditing 
                                          ? 'bg-transparent border-blue-600/50 shadow-2xl shadow-blue-600/5 text-blue-600 focus:border-blue-600 outline-none' 
                                          : theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-900 cursor-not-allowed' : 'bg-white/5 border-white/5 text-white/50 cursor-not-allowed'
                                      }`}
                                  />
                              </div>

                              <div className="space-y-4">
                                  <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                                    theme === 'light' ? 'text-slate-400' : 'text-white/30'
                                  }`}>
                                      <CalendarIcon className="w-4 h-4" /> {t('profile.created_at')}
                                  </label>
                                  <div className={`w-full px-6 py-5 rounded-lg border font-bold text-lg ${
                                    theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-white/5 border-white/5 text-white/20'
                                  }`}>
                                      {new Date(user?.created_at).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR')}
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-4">
                              <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                                theme === 'light' ? 'text-slate-400' : 'text-white/30'
                              }`}>
                                  <MapPinIcon className="w-4 h-4" /> {t('profile.address_label')}
                              </label>
                              <textarea 
                                  name="address" 
                                  value={formData.address} 
                                  onChange={handleChange} 
                                  disabled={!isEditing}
                                  rows="3"
                                  placeholder={t('profile.address_placeholder')}
                                  className={`w-full px-6 py-5 rounded-lg border transition-all duration-500 font-bold text-lg resize-none ${
                                    isEditing 
                                      ? 'bg-transparent border-blue-600/50 shadow-2xl shadow-blue-600/5 text-blue-600 focus:border-blue-600 outline-none' 
                                      : theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-900 cursor-not-allowed' : 'bg-white/5 border-white/5 text-white/50 cursor-not-allowed'
                                  }`}
                              />
                          </div>

                          <AnimatePresence>
                            {isEditing && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 20 }}
                                  className="pt-6"
                                >
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full md:w-auto px-16 py-5 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                                    >
                                        {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckIcon className="w-6 h-6" />}
                                        {t('profile.save')}
                                    </button>
                                </motion.div>
                            )}
                          </AnimatePresence>
                      </form>

                      <div className="mt-20 pt-16 border-t border-white/5">
                           <div className="flex items-center gap-4 text-red-500 mb-10">
                              <ShieldCheckIcon className="w-8 h-8" />
                              <div>
                                <h4 className="text-xl font-black tracking-tight">{t('profile.security')}</h4>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t('profile.security_desc', 'Gérez votre mot de passe et vos paramètres de sécurité')}</p>
                              </div>
                           </div>
                           <div className="flex flex-wrap gap-6">
                               <button 
                                  onClick={() => setShowPasswordModal(true)}
                                  className={`px-8 py-4 border rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 active:scale-[0.98] ${
                                    theme === 'light' ? 'bg-white border-slate-200 text-slate-900 hover:border-blue-600 hover:text-blue-600' : 'bg-white/5 border-white/10 text-white hover:border-blue-600 hover:text-blue-600'
                                  }`}
                               >
                                   <KeyIcon className="w-4 h-4" /> {t('profile.change_password')}
                               </button>
                           </div>

                           {/* Modal Changement Mot de Passe */}
                           <AnimatePresence>
                            {showPasswordModal && (
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050a1f]/80 backdrop-blur-xl"
                                >
                                    <motion.div 
                                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                      animate={{ scale: 1, opacity: 1, y: 0 }}
                                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                      className={`w-full max-w-lg rounded-lg border shadow-huge p-12 ${
                                        theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'
                                      }`}
                                    >
                                        <h3 className={`text-3xl font-black tracking-tighter mb-10 ${
                                          theme === 'light' ? 'text-slate-900' : 'text-white'
                                        }`}>{t('profile.change_password')}</h3>
                                        
                                        <form onSubmit={handlePasswordSubmit} className="space-y-8">
                                            <div className="space-y-3">
                                                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                                                }`}>
                                                    {t('auth.login.password_label')} ({t('profile.current')})
                                                </label>
                                                <div className="relative">
                                                    <input 
                                                        type={showCurrentPassword ? "text" : "password"} 
                                                        required
                                                        className={`w-full rounded-lg pl-6 pr-14 py-5 text-lg font-bold border outline-none focus:border-blue-600 transition-all ${
                                                          theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-900' : 'bg-white/5 border-white/10 text-white'
                                                        }`}
                                                        value={passwordData.current_password}
                                                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute inset-y-0 right-0 flex items-center pr-5 text-white/30 hover:text-blue-600 transition-colors"
                                                    >
                                                        {showCurrentPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                                                }`}>
                                                    {t('auth.register.password_label')} ({t('profile.new')})
                                                </label>
                                                <div className="relative">
                                                    <input 
                                                        type={showNewPassword ? "text" : "password"} 
                                                        required
                                                        className={`w-full rounded-lg pl-6 pr-14 py-5 text-lg font-bold border outline-none focus:border-blue-600 transition-all ${
                                                          theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-900' : 'bg-white/5 border-white/10 text-white'
                                                        }`}
                                                        value={passwordData.password}
                                                        onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute inset-y-0 right-0 flex items-center pr-5 text-white/30 hover:text-blue-600 transition-colors"
                                                    >
                                                        {showNewPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                                                }`}>
                                                    {t('auth.register.password_confirm_label')}
                                                </label>
                                                <div className="relative">
                                                    <input 
                                                        type={showConfirmPassword ? "text" : "password"} 
                                                        required
                                                        className={`w-full rounded-lg pl-6 pr-14 py-5 text-lg font-bold border outline-none focus:border-blue-600 transition-all ${
                                                          theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-900' : 'bg-white/5 border-white/10 text-white'
                                                        }`}
                                                        value={passwordData.password_confirmation}
                                                        onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute inset-y-0 right-0 flex items-center pr-5 text-white/30 hover:text-blue-600 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex gap-6 pt-6">
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowPasswordModal(false)}
                                                    className={`flex-1 py-5 px-6 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] ${
                                                      theme === 'light' ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' : 'bg-white/5 text-white hover:bg-white/10'
                                                    }`}
                                                >
                                                    {t('common.cancel')}
                                                </button>
                                                <button 
                                                    type="submit"
                                                    disabled={loading}
                                                    className="flex-1 py-5 px-6 bg-blue-600 !text-white rounded-lg text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
                                                >
                                                    {loading ? t('common.loading') : t('common.save')}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </motion.div>
                            )}
                           </AnimatePresence>
                      </div>
                  </div>
                </RevealOnScroll>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;