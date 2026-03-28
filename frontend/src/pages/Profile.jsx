import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Appel API pour mettre à jour le profil
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>Mon profil</h1>
            <p>Gérez vos informations personnelles</p>
          </div>

          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
                <h2>{user?.name}</h2>
                <p className="role">{user?.role?.name || 'Client'}</p>
              </div>

              <div className="profile-info">
                <div className="info-header">
                  <h3>Informations personnelles</h3>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn-edit">
                      <PencilIcon className="icon-edit" /> Modifier
                    </button>
                  ) : (
                    <button onClick={() => setIsEditing(false)} className="btn-cancel">
                      <XMarkIcon className="icon-cancel" /> Annuler
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="info-list">
                    <div className="info-item">
                      <UserIcon className="info-icon" />
                      <div>
                        <span className="label">Nom complet</span>
                        <span className="value">{user?.name}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <EnvelopeIcon className="info-icon" />
                      <div>
                        <span className="label">Email</span>
                        <span className="value">{user?.email}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <PhoneIcon className="info-icon" />
                      <div>
                        <span className="label">Téléphone</span>
                        <span className="value">{user?.phone || 'Non renseigné'}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <MapPinIcon className="info-icon" />
                      <div>
                        <span className="label">Adresse</span>
                        <span className="value">{user?.address || 'Non renseignée'}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon-emoji">📅</span>
                      <div>
                        <span className="label">Membre depuis</span>
                        <span className="value">{new Date(user?.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                      <label>Nom complet</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" value={user?.email} disabled className="disabled" />
                    </div>
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="06 12 34 56 78" />
                    </div>
                    <div className="form-group">
                      <label>Adresse</label>
                      <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="Votre adresse complète" />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-save" disabled={loading}>
                        <CheckIcon className="icon-save" /> {loading ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
          padding: 2rem 1rem;
        }

        .profile-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .profile-header h1 {
          font-size: 2rem;
          color: #0f2b4d;
          margin-bottom: 0.5rem;
        }

        .profile-header p {
          color: #6b7280;
        }

        .profile-card {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .profile-avatar {
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%);
          padding: 2rem;
          text-align: center;
          color: white;
        }

        .avatar {
          width: 80px;
          height: 80px;
          background: #d4af37;
          color: #0f2b4d;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 auto 1rem;
        }

        .profile-avatar h2 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
          color: white;
        }

        .role {
          color: #e0e7ff;
          font-size: 0.875rem;
        }

        .profile-info {
          padding: 2rem;
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .info-header h3 {
          font-size: 1.125rem;
          color: #0f2b4d;
        }

        .btn-edit {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s;
        }

        .icon-edit {
          width: 0.875rem;
          height: 0.875rem;
        }

        .btn-edit:hover {
          background: #e5e7eb;
        }

        .btn-cancel {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .icon-cancel {
          width: 0.875rem;
          height: 0.875rem;
        }

        .info-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
          align-items: center;
        }

        .info-icon {
          width: 1rem;
          height: 1rem;
          color: #d4af37;
          flex-shrink: 0;
        }

        .info-icon-emoji {
          width: 1rem;
          height: 1rem;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-item .label {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .info-item .value {
          font-weight: 500;
          color: #0f2b4d;
          font-size: 0.875rem;
        }

        .profile-form .form-group {
          margin-bottom: 1rem;
        }

        .profile-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .profile-form input,
        .profile-form textarea {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .profile-form input:focus,
        .profile-form textarea:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .profile-form input.disabled {
          background: #f3f4f6;
          color: #6b7280;
          cursor: not-allowed;
        }

        .form-actions {
          margin-top: 1.5rem;
        }

        .btn-save {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: #d4af37;
          color: #0f2b4d;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.875rem;
        }

        .icon-save {
          width: 0.875rem;
          height: 0.875rem;
        }

        .btn-save:hover:not(:disabled) {
          background: #c4a52e;
        }

        .btn-save:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .profile-header h1 {
            font-size: 1.5rem;
          }

          .profile-info {
            padding: 1.5rem;
          }

          .info-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
};

export default Profile;