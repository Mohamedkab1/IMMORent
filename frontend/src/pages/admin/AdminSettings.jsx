import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { 
  CogIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  PaintBrushIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  LockClosedIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

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

const AdminSettings = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: 'IMMORent',
    site_description: 'Plateforme de gestion immobilière et location de luxe au Maroc',
    contact_email: 'admin@immorent.ma',
    contact_phone: '+212 5 24 00 11 22',
    address: 'Avenue Mohammed VI, Marrakech, Maroc',
    maintenance_mode: false,
    registration_enabled: true,
    notifications_enabled: true,
    auto_approve_properties: false,
    max_images_per_property: 15,
    max_file_size_mb: 10
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success(t('admin.settings.saved_success', 'Configuration mise à jour avec succès'));
      setSaving(false);
    }, 1200);
  };

  const SectionHeader = ({ icon: Icon, title, desc }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-black text-text-main uppercase tracking-widest">{title}</h2>
      </div>
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60 ml-11">{desc}</p>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-12 pb-20"
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-black text-text-main uppercase tracking-[0.2em]">{t('admin.settings.title', 'Paramètres Système')}</h1>
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest opacity-60">{t('admin.settings.subtitle', 'Contrôle global et configuration de la plateforme')}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Info */}
        <motion.div variants={itemVariants} className="bg-bg-card border border-border-main rounded-lg p-10 shadow-huge">
          <SectionHeader 
            icon={GlobeAltIcon} 
            title={t('admin.settings.general_info', 'Identité de Plateforme')} 
            desc={t('admin.settings.general_desc', 'Nom du site et SEO global')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('admin.settings.site_name', 'Nom du Site')}</label>
              <input type="text" name="site_name" value={settings.site_name} onChange={handleChange} className="w-full px-5 py-4 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('common.description', 'Slogan / Description')}</label>
              <input type="text" name="site_description" value={settings.site_description} onChange={handleChange} className="w-full px-5 py-4 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
            </div>
          </div>
        </motion.div>

        {/* Contact & Geography */}
        <motion.div variants={itemVariants} className="bg-bg-card border border-border-main rounded-lg p-10 shadow-huge">
          <SectionHeader 
            icon={MapPinIcon} 
            title={t('admin.settings.contact_info', 'Canaux de Communication')} 
            desc={t('admin.settings.contact_desc', 'Emails administratifs et coordonnées physiques')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('admin.settings.contact_email', 'Email Administratif')}</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="email" name="contact_email" value={settings.contact_email} onChange={handleChange} className="w-full pl-11 pr-5 py-4 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('admin.users.phone', 'Ligne Directe')}</label>
              <div className="relative">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="tel" name="contact_phone" value={settings.contact_phone} onChange={handleChange} className="w-full pl-11 pr-5 py-4 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('admin.users.address', 'Siège Social')}</label>
            <textarea name="address" rows="2" value={settings.address} onChange={handleChange} className="w-full px-5 py-4 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all resize-none" />
          </div>
        </motion.div>

        {/* Security & Access */}
        <motion.div variants={itemVariants} className="bg-bg-card border border-border-main rounded-lg p-10 shadow-huge">
          <SectionHeader 
            icon={ShieldCheckIcon} 
            title={t('admin.settings.security_reg', 'Gouvernance & Sécurité')} 
            desc={t('admin.settings.security_desc', 'Gestion des accès et protocoles système')}
          />
          <div className="space-y-6">
            <div className="flex items-center justify-between p-5 bg-bg-soft/50 rounded-lg border border-border-main/50">
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-widest text-text-main">{t('admin.settings.maintenance_mode', 'Mode Maintenance')}</div>
                <div className="text-[10px] font-bold text-text-muted opacity-60">{t('admin.settings.maintenance_desc', 'Restreindre l\'accès public pendant les mises à jour')}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="maintenance_mode" checked={settings.maintenance_mode} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-5 bg-bg-soft/50 rounded-lg border border-border-main/50">
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-widest text-text-main">{t('admin.settings.registrations', 'Inscriptions Publiques')}</div>
                <div className="text-[10px] font-bold text-text-muted opacity-60">{t('admin.settings.reg_desc', 'Autoriser de nouveaux utilisateurs à créer des comptes')}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="registration_enabled" checked={settings.registration_enabled} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-5 bg-bg-soft/50 rounded-lg border border-border-main/50">
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-widest text-text-main">{t('admin.settings.auto_approve', 'Audit Automatique')}</div>
                <div className="text-[10px] font-bold text-text-muted opacity-60">{t('admin.settings.auto_approve_desc', 'Publier les biens sans validation manuelle préalable')}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="auto_approve_properties" checked={settings.auto_approve_properties} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Media & Quotas */}
        <motion.div variants={itemVariants} className="bg-bg-card border border-border-main rounded-lg p-10 shadow-huge">
          <SectionHeader 
            icon={PhotoIcon} 
            title={t('admin.settings.media', 'Gestion des Médias')} 
            desc={t('admin.settings.media_desc', 'Quotas d\'upload et restrictions serveurs')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('admin.settings.max_images', 'Photos par Bien')}</label>
              <div className="relative">
                <PhotoIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="number" name="max_images_per_property" value={settings.max_images_per_property} onChange={handleChange} className="w-full pl-11 pr-5 py-4 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">{t('admin.settings.max_size', 'Poids Max (MB)')}</label>
              <div className="relative">
                <ArrowPathIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="number" name="max_file_size_mb" value={settings.max_file_size_mb} onChange={handleChange} className="w-full pl-11 pr-5 py-4 bg-bg-soft border border-border-main rounded-lg text-xs font-bold outline-none focus:border-primary transition-all" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appearance Control */}
        <motion.div variants={itemVariants} className="bg-bg-card border border-border-main rounded-lg p-10 shadow-huge">
          <SectionHeader 
            icon={PaintBrushIcon} 
            title={t('admin.settings.appearance', 'Design & Identité Visuelle')} 
            desc={t('admin.settings.appearance_desc', 'Couleurs de marque et thématique système')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-bg-soft/50 rounded-lg border border-border-main/50 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">{t('admin.settings.primary_color', 'Couleur Principale')}</div>
                <div className="text-xs font-black text-text-main font-mono">#0F2B4D</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#0F2B4D] shadow-lg shadow-[#0F2B4D]/20 border border-white/10" />
            </div>
            <div className="p-6 bg-bg-soft/50 rounded-lg border border-border-main/50 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">{t('admin.settings.accent_color', 'Couleur d\'Accent')}</div>
                <div className="text-xs font-black text-text-main font-mono">#D4AF37</div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 border border-white/10" />
            </div>
          </div>
        </motion.div>

        {/* Sticky Save Button */}
        <div className="sticky bottom-8 z-20 flex justify-center">
          <motion.button 
            type="submit" 
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-5 bg-primary text-white rounded-lg text-[11px] font-black uppercase tracking-[0.2em] shadow-huge shadow-primary/30 flex items-center gap-3 disabled:opacity-50 transition-all"
          >
            {saving ? (
              <WrenchScrewdriverIcon className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircleIcon className="w-5 h-5" />
            )}
            {saving ? t('admin.settings.saving', 'Sauvegarde...') : t('admin.edit.save', 'Appliquer les configurations')}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminSettings;