import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
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
  CurrencyEuroIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const AdminSettings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: 'IMMORent',
    site_description: 'Plateforme de gestion immobilière et location en ligne au Maroc',
    contact_email: 'contact@immorent.ma',
    contact_phone: '+212 5 24 12 34 56',
    address: 'Avenue Mohammed VI, Guéliz, Marrakech 40000, Maroc',
    maintenance_mode: false,
    registration_enabled: true,
    notifications_enabled: true,
    auto_approve_properties: false,
    max_images_per_property: 10,
    max_file_size_mb: 5
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success(t('admin.settings.saved_success', 'Paramètres enregistrés avec succès'));
      setSaving(false);
    }, 1000);
  };

  return (
    <>
      <div className="admin-settings">
        <div className="header">
          <h1>{t('admin.settings.title', 'Paramètres généraux')}</h1>
          <p>{t('admin.settings.subtitle', 'Configurez les paramètres de la plateforme IMMORent Maroc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section">
            <h2><GlobeAltIcon className="section-icon" /> {t('admin.settings.general_info', 'Informations générales')}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{t('admin.settings.site_name', 'Nom du site')}</label>
                <input type="text" name="site_name" value={settings.site_name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>{t('common.description', 'Description')}</label>
                <textarea name="site_description" rows="2" value={settings.site_description} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2><CogIcon className="section-icon" /> {t('admin.settings.contact_info', 'Coordonnées')}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{t('admin.settings.contact_email', 'Email de contact')}</label>
                <input type="email" name="contact_email" value={settings.contact_email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>{t('admin.users.phone', 'Téléphone')}</label>
                <input type="tel" name="contact_phone" value={settings.contact_phone} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>{t('admin.users.address', 'Adresse')}</label>
              <textarea name="address" rows="2" value={settings.address} onChange={handleChange} />
            </div>
          </div>

          <div className="settings-section">
            <h2><ShieldCheckIcon className="section-icon" /> {t('admin.settings.security_reg', 'Sécurité et inscriptions')}</h2>
            <div className="toggle-group">
              <label>{t('admin.settings.maintenance_mode', 'Mode maintenance')}</label>
              <div>
                <input type="checkbox" name="maintenance_mode" checked={settings.maintenance_mode} onChange={handleChange} />
                <span>{t('admin.settings.maintenance_desc', 'Activer le mode maintenance (site inaccessible aux utilisateurs)')}</span>
              </div>
            </div>
            <div className="toggle-group">
              <label>{t('admin.settings.registrations', 'Inscriptions')}</label>
              <div>
                <input type="checkbox" name="registration_enabled" checked={settings.registration_enabled} onChange={handleChange} />
                <span>{t('admin.settings.reg_desc', 'Autoriser les nouvelles inscriptions')}</span>
              </div>
            </div>
            <div className="toggle-group">
              <label>{t('admin.settings.auto_approve', 'Validation automatique')}</label>
              <div>
                <input type="checkbox" name="auto_approve_properties" checked={settings.auto_approve_properties} onChange={handleChange} />
                <span>{t('admin.settings.auto_approve_desc', 'Approuver automatiquement les nouveaux biens (sinon validation manuelle)')}</span>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2><BellIcon className="section-icon" /> {t('admin.settings.notifications', 'Notifications')}</h2>
            <div className="toggle-group">
              <label>{t('admin.settings.email_notif', 'Notifications email')}</label>
              <div>
                <input type="checkbox" name="notifications_enabled" checked={settings.notifications_enabled} onChange={handleChange} />
                <span>{t('admin.settings.email_notif_desc', 'Activer les notifications par email')}</span>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2><PhotoIcon className="section-icon" /> {t('admin.settings.media', 'Médias')}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{t('admin.settings.max_images', 'Nombre max d\'images par bien')}</label>
                <input type="number" name="max_images_per_property" value={settings.max_images_per_property} onChange={handleChange} min="1" max="20" />
              </div>
              <div className="form-group">
                <label>{t('admin.settings.max_size', 'Taille max des images (MB)')}</label>
                <input type="number" name="max_file_size_mb" value={settings.max_file_size_mb} onChange={handleChange} min="1" max="20" step="1" />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2><PaintBrushIcon className="section-icon" /> {t('admin.settings.appearance', 'Apparence')}</h2>
            <div className="form-row">
              <div className="form-group">
                <label>{t('admin.settings.primary_color', 'Couleur principale')}</label>
                <div className="color-preview">
                  <div className="color-box" style={{ background: '#0f2b4d' }}></div>
                  <span>#0f2b4d</span>
                </div>
              </div>
              <div className="form-group">
                <label>{t('admin.settings.secondary_color', 'Couleur secondaire')}</label>
                <div className="color-preview">
                  <div className="color-box" style={{ background: '#d4af37' }}></div>
                  <span>#d4af37</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={saving}>
              <CheckCircleIcon className="btn-icon" /> {saving ? t('admin.settings.saving', 'Enregistrement...') : t('admin.edit.save', 'Enregistrer les modifications')}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .admin-settings {
          padding: 1.5rem;
          background: #f8f9fa;
          min-height: calc(100vh - 70px);
        }

        .header {
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 1.5rem;
          color: #0f2b4d;
          margin-bottom: 0.25rem;
        }

        .header p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .settings-form {
          background: white;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .settings-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .settings-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .settings-section h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          color: #0f2b4d;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .section-icon {
          width: 1rem;
          height: 1rem;
          color: #d4af37;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .toggle-group {
          margin-bottom: 1rem;
        }

        .toggle-group label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: block;
          font-size: 0.875rem;
          color: #374151;
        }

        .toggle-group div {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .toggle-group input {
          width: 1rem;
          height: 1rem;
          cursor: pointer;
        }

        .toggle-group span {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .color-preview {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .color-box {
          width: 2rem;
          height: 2rem;
          border-radius: 0.25rem;
          border: 1px solid #e5e7eb;
        }

        .color-preview span {
          font-size: 0.875rem;
          color: #6b7280;
          font-family: monospace;
        }

        .form-actions {
          margin-top: 2rem;
        }

        .btn-save {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: #d4af37;
          color: #ffffff !important;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.875rem;
        }

        .btn-icon {
          width: 1rem;
          height: 1rem;
        }

        .btn-save:hover:not(:disabled) {
          background: #c4a52e;
          transform: translateY(-1px);
        }

        .btn-save:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .admin-settings {
            padding: 1rem;
          }
          
          .settings-form {
            padding: 1.5rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default AdminSettings;