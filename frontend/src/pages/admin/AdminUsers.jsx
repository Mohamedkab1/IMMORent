import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', password: '', password_confirmation: '', role_id: '3' });
  const roles = [{ id: 1, name: 'Administrateur', slug: 'admin' }, { id: 2, name: 'Agent immobilier', slug: 'agent' }, { id: 3, name: 'Client', slug: 'client' }];

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setUsers([
      { id: 1, name: 'Admin', email: 'admin@immorent.com', phone: '0123456789', address: '1 rue Admin, Paris', role: { id: 1, name: 'Administrateur', slug: 'admin' }, is_active: true, created_at: '2024-01-01' },
      { id: 2, name: 'Jean Dupont', email: 'jean.dupont@agence.com', phone: '0123456780', address: '10 rue des Agents, Lyon', role: { id: 2, name: 'Agent immobilier', slug: 'agent' }, is_active: true, created_at: '2024-01-02' },
      { id: 4, name: 'Pierre Durand', email: 'pierre.durand@email.com', phone: '0623456789', address: '5 rue des Clients, Bordeaux', role: { id: 3, name: 'Client', slug: 'client' }, is_active: true, created_at: '2024-01-04' },
    ]);
    setLoading(false);
  };

  const filteredUsers = users.filter(u => u.id.toString().includes(searchTerm) || u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const getRoleBadge = (role) => {
    const colors = { admin: { bg: '#fee2e2', color: '#dc2626' }, agent: { bg: '#dbeafe', color: '#2563eb' }, client: { bg: '#dcfce7', color: '#059669' } };
    const c = colors[role?.slug] || colors.client;
    return <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>{role?.name}</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <>
      <div className="admin-users">
        <div className="header"><h1>Gestion des utilisateurs</h1><button className="btn-add" onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', phone: '', address: '', password: '', password_confirmation: '', role_id: '3' }); setShowModal(true); }}><PlusIcon /> Ajouter</button></div>
        <div className="search"><MagnifyingGlassIcon /><input type="text" placeholder="Rechercher par ID, nom ou email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
        <div className="table-container"><table><thead><tr><th>ID</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>{filteredUsers.map(u => (<tr key={u.id}><td>{u.id}</td><td><strong>{u.name}</strong></td><td>{u.email}</td><td>{u.phone || '-'}</td><td>{getRoleBadge(u.role)}</td><td><span className={`status ${u.is_active ? 'active' : 'inactive'}`}>{u.is_active ? 'Actif' : 'Inactif'}</span></td><td className="actions"><button><EyeIcon /></button><button><PencilIcon /></button><button className="delete"><TrashIcon /></button></td></tr>))}</tbody></table></div>
      </div>
      <style>{`
        .admin-users { padding: 1.5rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .header h1 { font-size: 1.5rem; color: #0f2b4d; }
        .btn-add { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #d4af37; color: #0f2b4d; border: none; border-radius: 0.5rem; cursor: pointer; }
        .search { position: relative; margin-bottom: 1rem; }
        .search svg { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: #9ca3af; }
        .search input { width: 300px; padding: 0.5rem 0.5rem 0.5rem 2rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
        .table-container { background: white; border-radius: 0.75rem; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1rem; background: #f8f9fa; font-weight: 500; font-size: 0.75rem; color: #6b7280; }
        td { padding: 1rem; border-bottom: 1px solid #e5e7eb; font-size: 0.75rem; }
        .status { padding: 0.25rem 0.5rem; border-radius: 1rem; font-size: 0.625rem; }
        .status.active { background: #dcfce7; color: #059669; }
        .status.inactive { background: #fee2e2; color: #dc2626; }
        .actions { display: flex; gap: 0.5rem; }
        .actions button { background: none; border: none; cursor: pointer; color: #6b7280; }
        .actions button.delete:hover { color: #dc2626; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; }
      `}</style>
    </>
  );
};

export default AdminUsers;