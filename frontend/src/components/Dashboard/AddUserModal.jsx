import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { userService } from '../../services/users';
import { toast } from 'react-toastify';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userService.create(formData);
      if (res.success) {
        toast.success(res.message || 'Utilisateur créé avec succès');
        onSuccess();
        onClose();
        setFormData({ name: '', email: '', password: '', role: 'client' });
      }
    } catch (error) {
       toast.error(error.response?.data?.message || 'Erreur lors de la création d\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-bg-card border border-border-main rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-border-main flex justify-between items-center bg-bg-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex flex-shrink-0 items-center justify-center text-primary">
               <UserPlusIcon className="w-5 h-5" />
            </div>
            <div>
               <h3 className="text-lg font-black text-text-main tracking-tight">{t('admin.actions.new', 'Nouveau')} Utilisateur</h3>
               <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest mt-0.5">Création de compte</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-text-sub hover:text-text-main hover:bg-bg-card rounded-xl transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Nom Complet</label>
               <input 
                 type="text" 
                 name="name"
                 required
                 value={formData.name}
                 onChange={handleChange}
                 className="w-full px-4 py-3 bg-bg-soft border border-border-main rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
                 placeholder="ex: Jean Dupont"
               />
             </div>

             <div>
               <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Adresse Email</label>
               <input 
                 type="email" 
                 name="email"
                 required
                 value={formData.email}
                 onChange={handleChange}
                 className="w-full px-4 py-3 bg-bg-soft border border-border-main rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
                 placeholder="ex: jean@example.com"
               />
             </div>

             <div>
               <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Mot de Passe</label>
               <input 
                 type="password" 
                 name="password"
                 required
                 minLength="8"
                 value={formData.password}
                 onChange={handleChange}
                 className="w-full px-4 py-3 bg-bg-soft border border-border-main rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
                 placeholder="Min. 8 caractères"
               />
             </div>

             <div>
               <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Rôle</label>
               <select 
                 name="role"
                 required
                 value={formData.role}
                 onChange={handleChange}
                 className="w-full px-4 py-3 bg-bg-soft border border-border-main rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
               >
                 <option value="client">Client</option>
                 <option value="agent">Agent</option>
                 <option value="admin">Admin</option>
               </select>
             </div>
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-border-main">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-bg-soft text-text-main text-xs font-bold rounded-xl hover:bg-bg-card border border-border-main transition-all"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary !text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer l\'utilisateur'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddUserModal;
