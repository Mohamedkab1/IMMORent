import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
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
  TrashIcon
} from '@heroicons/react/24/outline';
import { userService } from '../services/users';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
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

  React.useEffect(() => {
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
    <div className="min-h-screen bg-bg-soft py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-4xl font-black text-text-main tracking-tight">{t('profile.title')}</h1>
                <p className="text-text-sub font-medium mt-1">{t('profile.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheckIcon className="w-4 h-4" /> {t('profile.verified')}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sidebar: Profile Summary */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-bg-card rounded-3xl shadow-huge border border-border-main p-8 text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
                    
                    <div className="relative mx-auto w-32 h-32 mb-6">
                        {user?.profile_photo ? (
                            <div className="relative group/photo w-full h-full">
                                <img 
                                    src={`http://localhost:8000/storage/${user.profile_photo}?t=${new Date().getTime()}`} 
                                    alt={user.name} 
                                    className="w-full h-full rounded-3xl object-cover shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500 border-4 border-bg-card"
                                />
                                <button 
                                    onClick={handleDeletePhoto}
                                    className="absolute -top-2 -left-2 p-2 bg-rose-500 text-white rounded-xl shadow-lg opacity-0 group-hover/photo:opacity-100 transition-opacity hover:scale-110"
                                    title={t('common.delete')}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-5xl font-black text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
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
                            className="absolute -bottom-2 -right-2 p-3 bg-secondary text-primary rounded-xl shadow-lg border-4 border-bg-card hover:scale-110 transition-transform disabled:opacity-50"
                        >
                            <CameraIcon className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-text-main">{user?.name}</h2>
                    <p className="text-sm font-bold text-text-muted mt-1 uppercase tracking-widest">{user?.role?.name || 'Client'}</p>
                    
                    <div className="mt-8 pt-8 border-t border-border-main/50 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-text-sub font-medium">{t('profile.member_since')}</span>
                            <span className="text-text-main font-bold">{new Date(user?.created_at).toLocaleDateString(t('common.locale', 'fr-FR'), { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-text-sub font-medium">{t('profile.properties_rented')}</span>
                            <span className="text-text-main font-bold">
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

                {/* Account Status for Clients */}
                {user?.role?.slug === 'client' && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-primary/20 dark:to-primary/10 rounded-3xl p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
                        <BriefcaseIcon className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5" />
                        <h3 className="text-xl font-bold mb-2">{t('profile.become_agent')}</h3>
                        <p className="text-sm text-white/70 mb-6">{t('profile.become_agent_desc')}</p>
                        
                        {!user.agent_status ? (
                             <button 
                                onClick={handleBecomeAgent}
                                disabled={loading}
                                className="w-full py-3 bg-secondary text-primary rounded-xl font-black text-sm hover:bg-secondary-hover transition-all flex items-center justify-center gap-2"
                             >
                                {t('profile.apply_now')}
                             </button>
                        ) : (
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] font-black uppercase text-white/40 mb-1">{t('profile.status_req')}</p>
                                <p className="font-bold text-secondary">
                                    {user.agent_status === 'pending' ? t('profile.pending') : user.agent_status}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content: Form */}
            <div className="lg:col-span-2">
                <div className="bg-bg-card rounded-3xl shadow-huge border border-border-main p-8 md:p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <UserIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main">{t('profile.general_info')}</h3>
                        </div>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-bg-soft hover:bg-primary hover:text-white rounded-xl text-sm font-bold text-primary transition-all duration-300">
                                <PencilIcon className="w-4 h-4" /> {t('profile.edit')}
                            </button>
                        ) : (
                            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-sm font-bold transition-all duration-300">
                                <XMarkIcon className="w-4 h-4" /> {t('profile.cancel')}
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" /> {t('profile.name_label')}
                                </label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    disabled={!isEditing}
                                    className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 font-medium ${isEditing ? 'bg-bg-main border-primary shadow-lg shadow-primary/5 text-text-main' : 'bg-bg-soft border-border-main text-text-muted cursor-not-allowed'}`}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                                    <EnvelopeIcon className="w-4 h-4" /> {t('profile.email_label')}
                                </label>
                                <input 
                                    type="email" 
                                    value={user?.email} 
                                    disabled 
                                    className="w-full px-5 py-4 rounded-2xl border border-border-main bg-bg-soft text-text-muted cursor-not-allowed font-medium"
                                />
                                <p className="text-[10px] text-text-muted font-bold italic tracking-wide">{t('profile.email_desc')}</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                                    <PhoneIcon className="w-4 h-4" /> {t('profile.phone_label')}
                                </label>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    disabled={!isEditing}
                                    placeholder={t('profile.phone_placeholder', '06 XX XX XX XX')}
                                    className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 font-medium ${isEditing ? 'bg-bg-main border-primary shadow-lg shadow-primary/5 text-text-main' : 'bg-bg-soft border-border-main text-text-muted cursor-not-allowed'}`}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" /> {t('profile.created_at')}
                                </label>
                                <div className="w-full px-5 py-4 rounded-2xl border border-border-main bg-bg-soft text-text-muted font-medium flex items-center">
                                    {new Date(user?.created_at).toLocaleDateString(t('common.locale', 'fr-FR'))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                                <MapPinIcon className="w-4 h-4" /> {t('profile.address_label')}
                            </label>
                            <textarea 
                                name="address" 
                                value={formData.address} 
                                onChange={handleChange} 
                                disabled={!isEditing}
                                rows="3"
                                placeholder={t('profile.address_placeholder')}
                                className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 font-medium ${isEditing ? 'bg-bg-main border-primary shadow-lg shadow-primary/5 text-text-main' : 'bg-bg-soft border-border-main text-text-muted cursor-not-allowed'}`}
                            />
                        </div>

                        {isEditing && (
                            <div className="pt-6 animate-fade-in">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full md:w-auto px-12 py-4 bg-primary !text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary-light hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                >
                                    {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckIcon className="w-6 h-6" />}
                                    {t('profile.save')}
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="mt-12 pt-12 border-t border-border-main/50">
                         <div className="flex items-center gap-3 text-rose-500 mb-6">
                            <ShieldCheckIcon className="w-6 h-6" />
                            <h4 className="text-lg font-bold">{t('profile.security')}</h4>
                         </div>
                         <div className="pt-6 border-t border-border-main flex flex-wrap gap-4">
                             <button 
                                onClick={() => setShowPasswordModal(true)}
                                className="px-6 py-3 bg-bg-soft hover:bg-bg-main border border-border-main text-text-main rounded-xl text-sm font-bold transition-all"
                             >
                                 {t('profile.change_password')}
                             </button>
                         </div>

                         {/* Modal Changement Mot de Passe */}
                         {showPasswordModal && (
                             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                                 <div className="bg-bg-card w-full max-w-md rounded-3xl border border-border-main shadow-huge p-8 animate-scale-up">
                                     <h3 className="text-xl font-black text-text-main mb-6">{t('profile.change_password')}</h3>
                                     
                                     <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                         <div>
                                             <label className="block text-xs font-black uppercase tracking-widest text-text-sub mb-2">
                                                 {t('auth.login.password_label')} ({t('profile.current')})
                                             </label>
                                             <input 
                                                 type="password" 
                                                 required
                                                 className="w-full bg-bg-soft border border-border-main rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                 value={passwordData.current_password}
                                                 onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-xs font-black uppercase tracking-widest text-text-sub mb-2">
                                                 {t('auth.register.password_label')} ({t('profile.new')})
                                             </label>
                                             <input 
                                                 type="password" 
                                                 required
                                                 className="w-full bg-bg-soft border border-border-main rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                 value={passwordData.password}
                                                 onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                                             />
                                         </div>
                                         <div>
                                             <label className="block text-xs font-black uppercase tracking-widest text-text-sub mb-2">
                                                 {t('auth.register.password_confirm_label')}
                                             </label>
                                             <input 
                                                 type="password" 
                                                 required
                                                 className="w-full bg-bg-soft border border-border-main rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                 value={passwordData.password_confirmation}
                                                 onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                                             />
                                         </div>

                                         <div className="flex gap-4 pt-4">
                                             <button 
                                                 type="button"
                                                 onClick={() => setShowPasswordModal(false)}
                                                 className="flex-1 py-3 px-4 bg-bg-soft text-text-main font-bold rounded-xl hover:bg-border-main transition-all"
                                             >
                                                 {t('common.cancel')}
                                             </button>
                                             <button 
                                                 type="submit"
                                                 disabled={loading}
                                                 className="flex-1 py-3 px-4 bg-primary !text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                             >
                                                 {loading ? t('common.loading') : t('common.save')}
                                             </button>
                                         </div>
                                     </form>
                                 </div>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;