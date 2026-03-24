import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { CogIcon, ShieldCheckIcon, BellIcon, PaletteIcon, GlobeIcon, SaveIcon } from '@heroicons/react/24/outline';

const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    site_name: 'IMMORent',
    site_description: 'Plateforme de gestion immobilière et location en ligne',
    contact_email: 'contact@immorent.com',
    contact_phone: '+33 1 23 45 67 89',
    address: '123 rue de l\'Immobilier, 75001 Paris',
    maintenance_mode: false,
    registration_enabled: true,
    notifications_enabled: true
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success('Paramètres enregistrés avec succès');
      setSaving(false);
    }, 1000);
  };

  return (
    <>
      <div className="admin-settings">
        <div className="header">
          <h1>Paramètres généraux</h1>
          <p>Configurez les paramètres de la plateforme</p>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section">
            <h2><GlobeIcon /> Informations générales</h2>
            <div className="form-row"><div className="form-group"><label>Nom du site</label><input type="text" name="site_name" value={settings.site_name} onChange={handleChange} /></div>
            <div className="form-group"><label>Description</label><textarea name="site_description" rows="2" value={settings.site_description} onChange={handleChange} /></div></div>
          </div>

          <div className="settings-section">
            <h2><CogIcon /> Coordonnées</h2>
            <div className="form-row"><div className="form-group"><label>Email de contact</label><input type="email" name="contact_email" value={settings.contact_email} onChange={handleChange} /></div>
            <div className="form-group"><label>Téléphone</label><input type="tel" name="contact_phone" value={settings.contact_phone} onChange={handleChange} /></div></div>
            <div className="form-group"><label>Adresse</label><textarea name="address" rows="2" value={settings.address} onChange={handleChange} /></div>
          </div>

          <div className="settings-section">
            <h2><ShieldCheckIcon /> Sécurité</h2>
            <div className="toggle-group"><label>Mode maintenance</label><div><input type="checkbox" name="maintenance_mode" checked={settings.maintenance_mode} onChange={handleChange} /><span>Activer le mode maintenance (site inaccessible aux utilisateurs)</span></div></div>
            <div className="toggle-group"><label>Inscriptions</label><div><input type="checkbox" name="registration_enabled" checked={settings.registration_enabled} onChange={handleChange} /><span>Autoriser les nouvelles inscriptions</span></div></div>
          </div>

          <div className="settings-section">
            <h2><BellIcon /> Notifications</h2>
            <div className="toggle-group"><label>Notifications email</label><div><input type="checkbox" name="notifications_enabled" checked={settings.notifications_enabled} onChange={handleChange} /><span>Activer les notifications par email</span></div></div>
          </div>

          <div className="settings-section">
            <h2><PaletteIcon /> Apparence</h2>
            <div className="form-group"><label>Couleur principale</label><div className="color-preview"><div className="color-box" style={{ background: '#0f2b4d' }}></div><span>#0f2b4d</span></div></div>
            <div className="form-group"><label>Couleur secondaire</label><div className="color-preview"><div className="color-box" style={{ background: '#d4af37' }}></div><span>#d4af37</span></div></div>
          </div>

          <div className="form-actions"><button type="submit" className="btn-save" disabled={saving}><SaveIcon /> {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</button></div>
        </form>
      </div>

      <style>{`
        .admin-settings { padding: 1.5rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
        .header { margin-bottom: 2rem; }
        .header h1 { font-size: 1.5rem; color: #0f2b4d; margin-bottom: 0.25rem; }
        .header p { color: #6b7280; }
        .settings-form { background: white; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .settings-section { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; }
        .settings-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .settings-section h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #0f2b4d; margin-bottom: 1rem; }
        .settings-section h2 svg { width: 1.25rem; height: 1.25rem; color: #d4af37; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem; }
        .form-group input, .form-group textarea { width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
        .toggle-group { margin-bottom: 1rem; }
        .toggle-group label { font-weight: 500; margin-bottom: 0.5rem; display: block; font-size: 0.875rem; }
        .toggle-group div { display: flex; align-items: center; gap: 0.5rem; }
        .toggle-group input { width: 1rem; height: 1rem; }
        .color-preview { display: flex; align-items: center; gap: 0.5rem; }
        .color-box { width: 2rem; height: 2rem; border-radius: 0.25rem; }
        .form-actions { margin-top: 2rem; }
        .btn-save { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.75rem; background: #d4af37; color: #0f2b4d; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-save:hover:not(:disabled) { background: #c4a52e; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};

export default AdminSettings;