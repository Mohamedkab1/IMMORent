import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  PlusIcon, PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon, XMarkIcon,
  UserIcon, EnvelopeIcon, PhoneIcon, ShieldCheckIcon, CheckCircleIcon, XCircleIcon
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', password: '', password_confirmation: '', role_id: '3'
  });

  const roles = [
    { id: 1, name: 'Administrateur', slug: 'admin' },
    { id: 2, name: 'Agent immobilier', slug: 'agent' },
    { id: 3, name: 'Client', slug: 'client' }
  ];

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setUsers([
      { id: 1, name: 'Admin User', email: 'admin@immorent.com', phone: '0123456789', address: '1 rue Admin, Paris', role: { id: 1, name: 'Administrateur', slug: 'admin' }, is_active: true, created_at: '2024-01-01', last_login: '2024-03-24' },
      { id: 2, name: 'Jean Dupont', email: 'jean.dupont@agence.com', phone: '0123456780', address: '10 rue des Agents, Lyon', role: { id: 2, name: 'Agent immobilier', slug: 'agent' }, is_active: true, created_at: '2024-01-02', last_login: '2024-03-23' },
      { id: 4, name: 'Pierre Durand', email: 'pierre.durand@email.com', phone: '0623456789', address: '5 rue des Clients, Bordeaux', role: { id: 3, name: 'Client', slug: 'client' }, is_active: true, created_at: '2024-01-04', last_login: '2024-03-24' },
      { id: 5, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', phone: '0634567890', address: '15 rue des Locataires, Lille', role: { id: 3, name: 'Client', slug: 'client' }, is_active: false, created_at: '2024-01-05', last_login: '2024-02-15' },
    ]);
    setLoading(false);
  };

  const filteredUsers = users.filter(u => 
    u.id.toString().includes(searchTerm) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const colors = { admin: { bg: '#fee2e2', color: '#dc2626' }, agent: { bg: '#dbeafe', color: '#2563eb' }, client: { bg: '#dcfce7', color: '#059669' } };
    const c = colors[role?.slug] || colors.client;
    return <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>{role?.name}</span>;
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const resetForm = () => setFormData({ name: '', email: '', phone: '', address: '', password: '', password_confirmation: '', role_id: '3' });
  const openAddModal = () => { resetForm(); setEditingUser(null); setShowModal(true); };
  const openEditModal = (u) => { setEditingUser(u); setFormData({ name: u.name, email: u.email, phone: u.phone || '', address: u.address || '', password: '', password_confirmation: '', role_id: u.role.id.toString() }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); resetForm(); };
  const confirmDelete = (u) => { setUserToDelete(u); setShowDeleteConfirm(true); };
  const handleDelete = () => { if (userToDelete) { setUsers(users.filter(u => u.id !== userToDelete.id)); toast.success('Utilisateur supprimé'); setShowDeleteConfirm(false); setUserToDelete(null); } };
  const toggleUserStatus = (userId) => { setUsers(users.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u)); toast.success('Statut modifié'); };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser && !formData.password) { toast.error('Mot de passe requis'); return; }
    if (!editingUser && formData.password !== formData.password_confirmation) { toast.error('Mots de passe différents'); return; }
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, name: formData.name, email: formData.email, phone: formData.phone, address: formData.address, role: roles.find(r => r.id.toString() === formData.role_id) } : u));
      toast.success('Utilisateur modifié');
    } else {
      setUsers([...users, { id: users.length + 1, name: formData.name, email: formData.email, phone: formData.phone, address: formData.address, role: roles.find(r => r.id.toString() === formData.role_id), is_active: true, created_at: new Date().toISOString().split('T')[0] }]);
      toast.success('Utilisateur ajouté');
    }
    closeModal();
  };

  if (loading) return <div className="loading"><div className="spinner"></div><p>Chargement...</p></div>;

  return (
    <>
      <div className="admin-users">
        <div className="header"><h1>Gestion des utilisateurs</h1><button className="btn-add" onClick={openAddModal}><PlusIcon /> Ajouter</button></div>
        <div className="stats-cards">
          <div className="stat-card"><div className="stat-icon"><UserIcon /></div><div><span>Total</span><strong>{users.length}</strong></div></div>
          <div className="stat-card"><div className="stat-icon"><ShieldCheckIcon /></div><div><span>Admin</span><strong>{users.filter(u => u.role.slug === 'admin').length}</strong></div></div>
          <div className="stat-card"><div className="stat-icon"><UserIcon /></div><div><span>Agents</span><strong>{users.filter(u => u.role.slug === 'agent').length}</strong></div></div>
          <div className="stat-card"><div className="stat-icon"><UserIcon /></div><div><span>Clients</span><strong>{users.filter(u => u.role.slug === 'client').length}</strong></div></div>
        </div>
        <div className="search-section"><div className="search-wrapper"><MagnifyingGlassIcon className="search-icon" /><input type="text" className="search-input" placeholder="Rechercher par ID, nom ou email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />{searchTerm && <button className="clear-search" onClick={() => setSearchTerm('')}><XMarkIcon /></button>}</div><div className="search-info">{filteredUsers.length} utilisateur(s)</div></div>
        <div className="table-container"><table className="data-table"><thead><tr><th>ID</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{filteredUsers.map(u => (<tr key={u.id}><td>{u.id}</td><td><strong>{u.name}</strong></td><td>{u.email}</td><td>{u.phone || '-'}</td><td>{getRoleBadge(u.role)}</td><td><button className={`status-toggle ${u.is_active ? 'active' : 'inactive'}`} onClick={() => toggleUserStatus(u.id)}>{u.is_active ? 'Actif' : 'Inactif'}</button></td><td className="actions"><button className="btn-icon" onClick={() => openEditModal(u)}><PencilIcon /></button><button className="btn-icon delete" onClick={() => confirmDelete(u)}><TrashIcon /></button></td></tr>))}</tbody></table></div>
      </div>
      {showModal && (<div className="modal-overlay" onClick={closeModal}><div className="modal-content" onClick={e => e.stopPropagation()}><div className="modal-header"><h2>{editingUser ? 'Modifier' : 'Ajouter'}</h2><button className="close-modal" onClick={closeModal}><XMarkIcon /></button></div><form onSubmit={handleSubmit} className="modal-form"><div className="form-group"><label><UserIcon /> Nom</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div><div className="form-group"><label><EnvelopeIcon /> Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div><div className="form-group"><label><PhoneIcon /> Téléphone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} /></div><div className="form-group"><label>Adresse</label><textarea name="address" rows="2" value={formData.address} onChange={handleChange} /></div><div className="form-group"><label><ShieldCheckIcon /> Rôle</label><select name="role_id" value={formData.role_id} onChange={handleChange}>{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>{!editingUser && (<><div className="form-group"><label>Mot de passe</label><input type="password" name="password" value={formData.password} onChange={handleChange} required /></div><div className="form-group"><label>Confirmation</label><input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required /></div></>)}<div className="modal-actions"><button type="button" className="btn-cancel" onClick={closeModal}>Annuler</button><button type="submit" className="btn-submit">{editingUser ? 'Modifier' : 'Ajouter'}</button></div></form></div></div>)}
      {showDeleteConfirm && (<div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}><div className="modal-content confirm" onClick={e => e.stopPropagation()}><div className="modal-header"><h2>Confirmer</h2></div><div className="modal-body"><p>Supprimer <strong>{userToDelete?.name}</strong> ?</p><p className="warning">Action irréversible</p></div><div className="modal-actions"><button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Annuler</button><button className="btn-delete" onClick={handleDelete}>Supprimer</button></div></div></div>)}
      <style>{`
        .admin-users { padding: 1.5rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .header h1 { font-size: 1.5rem; color: #0f2b4d; }
        .btn-add { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #d4af37; color: #0f2b4d; border: none; border-radius: 0.5rem; cursor: pointer; }
        .stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: white; padding: 1rem; border-radius: 0.75rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .stat-icon { width: 2.5rem; height: 2.5rem; background: #f3f4f6; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #d4af37; }
        .stat-card span { display: block; font-size: 0.75rem; color: #6b7280; }
        .stat-card strong { font-size: 1.25rem; color: #0f2b4d; }
        .search-section { margin-bottom: 1rem; }
        .search-wrapper { position: relative; max-width: 300px; margin-bottom: 0.5rem; }
        .search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: #9ca3af; }
        .search-input { width: 100%; padding: 0.5rem 0.5rem 0.5rem 2rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
        .clear-search { position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #9ca3af; }
        .search-info { font-size: 0.75rem; color: #6b7280; }
        .table-container { background: white; border-radius: 0.75rem; overflow-x: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 1rem; background: #f8f9fa; font-size: 0.75rem; font-weight: 500; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
        .data-table td { padding: 1rem; border-bottom: 1px solid #e5e7eb; font-size: 0.75rem; }
        .status-toggle { padding: 0.25rem 0.5rem; border: none; border-radius: 1rem; font-size: 0.625rem; cursor: pointer; }
        .status-toggle.active { background: #dcfce7; color: #059669; }
        .status-toggle.inactive { background: #fee2e2; color: #dc2626; }
        .actions {
            display: flex;
            gap: 0.5rem;
            align-items: center;
          }

        .btn-icon {
            background: none;
            border: none;
            cursor: pointer;
            color: #6b7280;
            padding: 0.25rem;
            border-radius: 0.25rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            transition: all 0.3s;
          }

        .btn-icon svg {
            width: 1rem;
            height: 1rem;
          }

        .btn-icon:hover {
            background: #f3f4f6;
            color: #d4af37;
          }

        .btn-icon.delete:hover {
            color: #dc2626;
          }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 0.75rem; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
        .modal-content.confirm { max-width: 400px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb; }
        .modal-header h2 { font-size: 1.125rem; color: #0f2b4d; }
        .close-modal { background: none; border: none; cursor: pointer; color: #9ca3af; }
        .modal-body { padding: 1.5rem; }
        .warning { color: #dc2626; font-size: 0.75rem; margin-top: 0.5rem; }
        .modal-form { padding: 1.5rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: flex; align-items: center; gap: 0.25rem; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
        .modal-actions { display: flex; gap: 1rem; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; }
        .btn-cancel { flex: 1; padding: 0.5rem; background: #f3f4f6; border: none; border-radius: 0.5rem; cursor: pointer; }
        .btn-submit, .btn-delete { flex: 1; padding: 0.5rem; background: #d4af37; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; }
        .btn-delete { background: #dc2626; color: white; }
        .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default AdminUsers;