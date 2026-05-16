import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { 
  PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, MagnifyingGlassIcon, XMarkIcon,
  UserIcon, EnvelopeIcon, PhoneIcon, ShieldCheckIcon, CheckCircleIcon, XCircleIcon,
  UserGroupIcon, MapPinIcon, ChevronRightIcon, LockClosedIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from '../../components/Common/StatsCard';
import { userService } from '../../services/users';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', password: '', password_confirmation: '', role_id: '3'
  });

  const roles = [
    { id: 1, name: t('admin.users.role_admin', 'Administrateur'), slug: 'admin' },
    { id: 2, name: t('admin.users.role_agent', 'Agent immobilier'), slug: 'agent' },
    { id: 3, name: t('admin.users.role_client', 'Client'), slug: 'client' }
  ];

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      toast.error(t('dash.error_load', 'Erreur de chargement des utilisateurs'));
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.id.toString().includes(searchTerm) ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const configs = {
      admin: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' },
      agent: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
      client: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' }
    };
    const c = configs[role?.slug] || configs.client;
    return (
      <span className={`px-2 py-0.5 rounded-md border ${c.bg} ${c.text} ${c.border} text-[10px] font-black uppercase tracking-widest`}>
        {role?.name}
      </span>
    );
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const resetForm = () => setFormData({ name: '', email: '', phone: '', address: '', password: '', password_confirmation: '', role_id: '3' });
  const openAddModal = () => { resetForm(); setEditingUser(null); setShowModal(true); };
  const openEditModal = (u) => { setEditingUser(u); setFormData({ name: u.name, email: u.email, phone: u.phone || '', address: u.address || '', password: '', password_confirmation: '', role_id: u.role.id.toString() }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); resetForm(); };
  const confirmDelete = (u) => { setUserToDelete(u); setShowDeleteConfirm(true); };
  const handleDelete = async () => { 
    if (userToDelete) { 
      try {
        await userService.delete(userToDelete.id);
        setUsers(users.filter(u => u.id !== userToDelete.id)); 
        toast.success(t('admin.users.deleted', 'Utilisateur supprimé')); 
      } catch (error) {
        toast.error(t('common.error', 'Une erreur est survenue'));
      } finally {
        setShowDeleteConfirm(false); 
        setUserToDelete(null); 
      }
    } 
  };

  const toggleUserStatus = async (userId) => { 
    try {
      const response = await userService.toggleStatus(userId);
      if (response.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u)); 
        toast.success(t('admin.users.status_changed', 'Statut modifié')); 
      }
    } catch (error) {
      toast.error(t('common.error', 'Une erreur est survenue'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser && !formData.password) { toast.error(t('admin.users.pwd_required', 'Mot de passe requis')); return; }
    if (!editingUser && formData.password !== formData.password_confirmation) { toast.error(t('admin.users.pwd_mismatch', 'Mots de passe différents')); return; }
    
    try {
      if (editingUser) {
        const response = await userService.update(editingUser.id, formData);
        if (response.success) {
          setUsers(users.map(u => u.id === editingUser.id ? response.data : u));
          toast.success(t('admin.users.updated', 'Utilisateur modifié'));
          closeModal();
        }
      } else {
        const response = await userService.create(formData);
        if (response.success) {
          setUsers([response.data, ...users]);
          toast.success(t('admin.users.added', 'Utilisateur ajouté'));
          closeModal();
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || t('common.error', 'Une erreur est survenue');
      toast.error(message);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-black uppercase tracking-widest text-text-muted">{t('common.loading', 'Chargement...')}</p>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title={t('admin.prop.total', 'Total Utilisateurs')} value={users.length} icon={UserGroupIcon} color="blue" delay={0} />
        <StatsCard title={t('admin.users.role_admin', 'Admins')} value={users.filter(u => u.role.slug === 'admin').length} icon={ShieldCheckIcon} color="rose" delay={100} />
        <StatsCard title={t('admin.users.role_agent', 'Agents')} value={users.filter(u => u.role.slug === 'agent').length} icon={UserIcon} color="amber" delay={200} />
        <StatsCard title={t('admin.users.role_client', 'Clients')} value={users.filter(u => u.role.slug === 'client').length} icon={UserGroupIcon} color="emerald" delay={300} />
      </div>

      {/* Main Table Container */}
      <motion.div variants={itemVariants} className="bg-bg-card border border-border-main rounded-lg shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-border-main flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-text-main uppercase tracking-widest">{t('admin.users.title', 'Gestion des Utilisateurs')}</h2>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">
              {filteredUsers.length} {t('admin.users.users_count', 'Comptes enregistrés')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder={t('admin.users.search_ph', 'Rechercher...')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-3 bg-bg-soft border border-border-main rounded-lg text-xs focus:border-primary outline-none transition-all w-64 font-bold"
              />
            </div>
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              <PlusIcon className="w-4 h-4" />
              {t('admin.add.add_btn', 'Ajouter')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-soft/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.prop.id', 'ID')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('auth.name', 'Utilisateur')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.users.role', 'Rôle')}</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.edit.status', 'Statut')}</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('admin.prop.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              <AnimatePresence>
                {filteredUsers.map((u, idx) => (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-bg-soft/30 transition-colors"
                  >
                  <td className="px-8 py-6 text-xs font-black text-text-muted">#{u.id}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-bg-soft flex items-center justify-center text-primary border border-border-main group-hover:border-primary/30 transition-all shadow-sm font-black uppercase">
                        {u.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-black text-text-main group-hover:text-primary transition-colors">{u.name}</div>
                        <div className="text-[10px] font-bold text-text-muted lowercase tracking-tighter">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">{getRoleBadge(u.role)}</td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all flex items-center gap-1.5 ${
                        u.is_active 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                      {u.is_active ? t('admin.users.active', 'Actif') : t('admin.users.inactive', 'Inactif')}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditModal(u)} 
                        className="p-2.5 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => confirmDelete(u)} 
                        className="p-2.5 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-rose-500 hover:border-rose-500 transition-all shadow-sm"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <UserGroupIcon className="w-16 h-16 text-text-muted opacity-10 mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-text-muted opacity-40">{t('admin.users.no_match', 'Aucun utilisateur trouvé')}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modern Modal Experience */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-bg-main/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-bg-card border border-border-main rounded-lg shadow-huge overflow-hidden"
            >
              <div className="p-8 border-b border-border-main flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-text-main uppercase tracking-widest">
                    {editingUser ? t('common.edit', 'Modifier') : t('admin.add.add_btn', 'Ajouter')} <span className="text-primary">{t('dash.users', 'Utilisateur')}</span>
                  </h3>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">
                    {editingUser ? t('admin.users.edit_desc', 'Mettre à jour les informations du compte') : t('admin.users.add_desc', 'Créer un nouvel accès à la plateforme')}
                  </p>
                </div>
                <button onClick={closeModal} className="p-3 rounded-lg bg-bg-soft border border-border-main text-text-muted hover:text-primary transition-all">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('auth.name', 'Nom Complet')}</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('auth.email', 'Email Professionnel')}</label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('admin.users.phone', 'Téléphone')}</label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('admin.users.role', 'Rôle Attribué')}</label>
                    <div className="relative">
                      <ShieldCheckIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <select name="role_id" value={formData.role_id} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all appearance-none">
                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('admin.users.address', 'Adresse Géo-localisée')}</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-4 top-4 w-4 h-4 text-text-muted" />
                    <textarea name="address" rows="2" value={formData.address} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
                  </div>
                </div>

                {!editingUser && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border-main/50 pt-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('auth.pwd', 'Mot de passe')}</label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="w-full pl-11 pr-11 py-3 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors">
                          {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('auth.pwd_confirm', 'Confirmation')}</label>
                      <div className="relative">
                        <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input type={showConfirmPassword ? "text" : "password"} name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required className="w-full pl-11 pr-11 py-3 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors">
                          {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={closeModal} className="flex-1 py-4 bg-bg-soft border border-border-main rounded-lg text-[10px] font-black uppercase tracking-widest text-text-sub hover:bg-bg-main transition-all">
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {editingUser ? t('common.save', 'Enregistrer') : t('admin.add.add_btn', 'Ajouter')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-bg-main/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-bg-card border border-border-main rounded-lg p-8 shadow-huge text-center"
            >
              <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-6">
                <TrashIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-text-main uppercase tracking-widest mb-4">{t('admin.prop.del_confirm_title', 'Confirmer')}</h3>
              <p className="text-sm font-bold text-text-sub opacity-60 mb-8 leading-relaxed">
                {t('common.delete_confirm', 'Êtes-vous sûr de vouloir supprimer')} <br />
                <span className="text-text-main font-black underline">{userToDelete?.name}</span> ?
                <br />
                <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-4 block">{t('admin.prop.del_warning', 'Action irréversible')}</span>
              </p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-bg-soft border border-border-main rounded-lg text-[10px] font-black uppercase tracking-widest text-text-sub transition-all">
                  {t('common.cancel', 'Annuler')}
                </button>
                <button onClick={handleDelete} className="flex-1 py-3 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all">
                  {t('common.delete', 'Supprimer')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminUsers;