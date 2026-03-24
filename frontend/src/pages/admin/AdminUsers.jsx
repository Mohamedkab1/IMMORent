import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
    role_id: '3'
  });

  // Rôles disponibles
  const roles = [
    { id: 1, name: 'Administrateur', slug: 'admin' },
    { id: 2, name: 'Agent immobilier', slug: 'agent' },
    { id: 3, name: 'Client', slug: 'client' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Simuler des données
      setUsers([
        { id: 1, name: 'Admin User', email: 'admin@immobilier.com', phone: '0123456789', address: '1 rue de l\'Administration, Paris', role: { id: 1, name: 'Administrateur', slug: 'admin' }, is_active: true, created_at: '2024-01-01' },
        { id: 2, name: 'Jean Dupont', email: 'jean.dupont@agence.com', phone: '0123456780', address: '10 rue des Agents, Lyon', role: { id: 2, name: 'Agent immobilier', slug: 'agent' }, is_active: true, created_at: '2024-01-02' },
        { id: 3, name: 'Marie Martin', email: 'marie.martin@agence.com', phone: '0123456781', address: '20 avenue des Pros, Marseille', role: { id: 2, name: 'Agent immobilier', slug: 'agent' }, is_active: true, created_at: '2024-01-03' },
        { id: 4, name: 'Pierre Durand', email: 'pierre.durand@email.com', phone: '0623456789', address: '5 rue des Clients, Bordeaux', role: { id: 3, name: 'Client', slug: 'client' }, is_active: true, created_at: '2024-01-04' },
        { id: 5, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', phone: '0634567890', address: '15 rue des Locataires, Lille', role: { id: 3, name: 'Client', slug: 'client' }, is_active: false, created_at: '2024-01-05' },
      ]);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Fonction de recherche par ID, nom ou email
  const filteredUsers = users.filter(u => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    return (
      u.id.toString().includes(search) ||
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      password_confirmation: '',
      role_id: '3'
    });
    setEditingUser(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      password: '',
      password_confirmation: '',
      role_id: user.role.id.toString()
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      toast.error('Le nom et l\'email sont requis');
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 8)) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (!editingUser && formData.password !== formData.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      if (editingUser) {
        // Mise à jour de l'utilisateur
        const updatedUser = {
          ...editingUser,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          role: roles.find(r => r.id.toString() === formData.role_id)
        };
        
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
        toast.success('Utilisateur modifié avec succès');
      } else {
        // Création d'un nouvel utilisateur
        const newUser = {
          id: users.length + 1,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          role: roles.find(r => r.id.toString() === formData.role_id),
          is_active: true,
          created_at: new Date().toISOString().split('T')[0]
        };
        
        setUsers([...users, newUser]);
        toast.success('Utilisateur ajouté avec succès');
      }
      
      closeModal();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, is_active: !u.is_active } : u
    ));
    toast.success('Statut utilisateur modifié');
  };

  const deleteUser = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success('Utilisateur supprimé');
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: { bg: '#fee2e2', color: '#dc2626' },
      agent: { bg: '#dbeafe', color: '#2563eb' },
      client: { bg: '#dcfce7', color: '#059669' }
    };
    const config = colors[role?.slug] || colors.client;
    return (
      <span style={{ 
        padding: '4px 10px', 
        borderRadius: '20px', 
        fontSize: '12px',
        background: config.bg,
        color: config.color
      }}>
        {role?.name}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <h1>Gestion des utilisateurs</h1>
        <button className="btn-add" onClick={openAddModal}>
          <PlusIcon className="h-5 w-5" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Barre de recherche améliorée */}
      <div className="search-section">
        <div className="search-wrapper">
          <MagnifyingGlassIcon className="search-icon" />
          <input 
            type="text" 
            className="search-input"
            placeholder="Rechercher par ID, nom ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="search-info">
          {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Date création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>{u.phone || '-'}</td>
                <td className="address-cell">{u.address || '-'}</td>
                <td>{getRoleBadge(u.role)}</td>
                <td>
                  <button 
                    className={`status-toggle ${u.is_active ? 'active' : 'inactive'}`}
                    onClick={() => toggleUserStatus(u.id)}
                    title={u.is_active ? 'Désactiver' : 'Activer'}
                  >
                    {u.is_active ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                <td className="actions">
                  <button className="btn-icon" title="Voir détails" onClick={() => openEditModal(u)}>
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="btn-icon" title="Modifier" onClick={() => openEditModal(u)}>
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button className="btn-icon delete" title="Supprimer" onClick={() => deleteUser(u.id)}>
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h2>
              <button className="close-modal" onClick={closeModal}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">
                  <UserIcon className="input-icon" />
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Jean Dupont"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <EnvelopeIcon className="input-icon" />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jean.dupont@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <PhoneIcon className="input-icon" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  <ShieldCheckIcon className="input-icon" />
                  Adresse
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Adresse complète"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role_id">
                  <ShieldCheckIcon className="input-icon" />
                  Rôle *
                </label>
                <select
                  id="role_id"
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  required
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {!editingUser && (
                <>
                  <div className="form-group">
                    <label htmlFor="password">
                      <ShieldCheckIcon className="input-icon" />
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Au moins 8 caractères"
                      required={!editingUser}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password_confirmation">
                      <ShieldCheckIcon className="input-icon" />
                      Confirmer le mot de passe *
                    </label>
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      placeholder="Confirmer le mot de passe"
                      required={!editingUser}
                    />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  {editingUser ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-users-page {
          padding: 30px;
          background: #f8fafc;
          min-height: calc(100vh - 70px);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .page-header h1 {
          color: #1f2937;
          font-size: 24px;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .btn-add:hover {
          background: #059669;
        }

        /* Search Section */
        .search-section {
          margin-bottom: 20px;
        }

        .search-wrapper {
          position: relative;
          max-width: 400px;
          margin-bottom: 10px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .clear-search:hover {
          color: #6b7280;
        }

        .search-info {
          font-size: 13px;
          color: #6b7280;
        }

        /* Table */
        .table-container {
          background: white;
          border-radius: 10px;
          overflow-x: auto;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 15px;
          background: #f9fafb;
          color: #6b7280;
          font-weight: 500;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }

        .data-table td {
          padding: 15px;
          border-bottom: 1px solid #e5e7eb;
          color: #1f2937;
          font-size: 14px;
        }

        .data-table tr:hover {
          background: #f9fafb;
        }

        .address-cell {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Status Toggle */
        .status-toggle {
          padding: 4px 12px;
          border: none;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .status-toggle.active {
          background: #dcfce7;
          color: #059669;
        }

        .status-toggle.active:hover {
          background: #bbf7d0;
        }

        .status-toggle.inactive {
          background: #fee2e2;
          color: #dc2626;
        }

        .status-toggle.inactive:hover {
          background: #fecaca;
        }

        /* Actions */
        .actions {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          padding: 6px;
          border: none;
          background: none;
          cursor: pointer;
          color: #6b7280;
          border-radius: 5px;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
        }

        .btn-icon:hover {
          background: #f3f4f6;
          color: #2563eb;
        }

        .btn-icon.delete:hover {
          color: #dc2626;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          color: #1f2937;
          font-size: 20px;
          font-weight: 600;
        }

        .close-modal {
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .close-modal:hover {
          color: #6b7280;
        }

        .modal-form {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #374151;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .input-icon {
          width: 16px;
          height: 16px;
          color: #6b7280;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-cancel {
          flex: 1;
          padding: 10px;
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        .btn-submit {
          flex: 1;
          padding: 10px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-submit:hover {
          background: #1d4ed8;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .flex {
          display: flex;
        }

        .justify-center {
          justify-content: center;
        }

        .items-center {
          align-items: center;
        }

        .h-64 {
          height: 16rem;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;