import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  MagnifyingGlassIcon, 
  TrashIcon, 
  PencilIcon, 
  BuildingOfficeIcon, 
  HomeIcon, 
  MapPinIcon, 
  CurrencyEuroIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    setProperties([
      { id: 1, title: 'Bel appartement centre-ville', city: 'Lyon', price: 850, status: 'available', type: 'apartment', user: { name: 'Jean Dupont' }, created_at: '2024-03-20', verified: true },
      { id: 2, title: 'Maison familiale avec jardin', city: 'Caluire-et-Cuire', price: 1500, status: 'available', type: 'house', user: { name: 'Jean Dupont' }, created_at: '2024-03-18', verified: true },
      { id: 3, title: 'Studio proche université', city: 'Villeurbanne', price: 450, status: 'rented', type: 'studio', user: { name: 'Marie Martin' }, created_at: '2024-03-15', verified: true },
      { id: 4, title: 'Local commercial Part-Dieu', city: 'Lyon', price: 2000, status: 'pending', type: 'commercial', user: { name: 'Pierre Durand' }, created_at: '2024-03-10', verified: false },
    ]);
    setLoading(false);
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = { 
      available: { bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-700 dark:text-green-500', text: 'Disponible' }, 
      rented: { bg: 'bg-[var(--bg-muted)]', color: 'text-[var(--text-muted)]', text: 'Loué' }, 
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-700 dark:text-yellow-500', text: 'En attente' } 
    };
    const c = config[status] || config.available;
    return <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.color}`}>{c.text}</span>;
  };

  const getTypeLabel = (type) => {
    const types = { apartment: 'Appartement', house: 'Maison', studio: 'Studio', commercial: 'Commercial', land: 'Terrain' };
    return types[type] || type;
  };

  const handleVerify = (id) => { 
    setProperties(properties.map(p => p.id === id ? { ...p, verified: true, status: 'available' } : p)); 
    toast.success('Bien vérifié'); 
  };
  
  const handleReject = (id) => { 
    if (window.confirm('Refuser ce bien ?')) { 
      setProperties(properties.filter(p => p.id !== id)); 
      toast.success('Bien refusé'); 
    } 
  };
  
  const confirmDelete = (p) => { 
    setPropertyToDelete(p); 
    setShowDeleteConfirm(true); 
  };
  
  const handleDelete = () => { 
    if (propertyToDelete) { 
      setProperties(properties.filter(p => p.id !== propertyToDelete.id)); 
      toast.success('Bien supprimé'); 
      setShowDeleteConfirm(false); 
      setPropertyToDelete(null); 
    } 
  };

  const stats = { 
    total: properties.length, 
    available: properties.filter(p => p.status === 'available').length, 
    rented: properties.filter(p => p.status === 'rented').length, 
    pending: properties.filter(p => p.status === 'pending' || !p.verified).length 
  };

  if (loading) return <div className="loading"><div className="spinner"></div><p>Chargement...</p></div>;

  return (
    <>
      <div className="admin-properties">
        <div className="header">
          <h1>Gestion des biens</h1>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon"><BuildingOfficeIcon /></div>
            <div><span>Total</span><strong>{stats.total}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><HomeIcon /></div>
            <div><span>Disponibles</span><strong>{stats.available}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><HomeIcon /></div>
            <div><span>Loués</span><strong>{stats.rented}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><ClockIcon /></div>
            <div><span>En attente</span><strong>{stats.pending}</strong></div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-wrapper">
            <MagnifyingGlassIcon className="search-icon" />
            <input type="text" className="search-input" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tous</option>
            <option value="available">Disponibles</option>
            <option value="rented">Loués</option>
            <option value="pending">En attente</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Ville</th>
                <th>Type</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Agent</th>
                <th>Vérifié</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td><strong>{p.title}</strong></td>
                  <td><MapPinIcon className="inline-icon" /> {p.city}</td>
                  <td>{getTypeLabel(p.type)}</td>
                  <td><CurrencyEuroIcon className="inline-icon" /> {p.price.toLocaleString()}DH{p.type === 'rent' ? '/mois' : ''}</td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td>{p.user.name}</td>
                  <td>{p.verified ? <CheckCircleIcon className="text-success" /> : <XCircleIcon className="text-warning" />}</td>
                  <td className="actions">
                    <Link to={`/properties/${p.id}`} className="btn-icon" title="Voir"><EyeIcon /></Link>
                    {!p.verified && (
                      <>
                        <button className="btn-icon success" onClick={() => handleVerify(p.id)} title="Vérifier"><CheckCircleIcon /></button>
                        <button className="btn-icon warning" onClick={() => handleReject(p.id)} title="Refuser"><XCircleIcon /></button>
                      </>
                    )}
                    <button className="btn-icon delete" onClick={() => confirmDelete(p)} title="Supprimer"><TrashIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content confirm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmer la suppression</h2>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer le bien <strong>{propertyToDelete?.title}</strong> ?</p>
              <p className="warning">Cette action est irréversible.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Annuler</button>
              <button className="btn-delete" onClick={handleDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-properties { padding: 1.5rem; background: var(--bg-main); min-height: calc(100vh - 70px); }
        .header { margin-bottom: 1.5rem; }
        .header h1 { font-size: 1.5rem; color: var(--text-main); }
        .stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: var(--card-bg); padding: 1rem; border-radius: 0.75rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); border: 1px solid var(--border-color); }
        .stat-icon { width: 2.5rem; height: 2.5rem; background: var(--bg-muted); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .stat-card span { display: block; font-size: 0.75rem; color: var(--text-muted); }
        .stat-card strong { font-size: 1.25rem; color: var(--text-main); }
        .filters-section { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .search-wrapper { position: relative; flex: 1; max-width: 300px; }
        .search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: var(--text-muted); }
        .search-input { width: 100%; padding: 0.5rem 0.5rem 0.5rem 2rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: var(--card-bg); color: var(--text-main); }
        .status-filter { padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: var(--card-bg); color: var(--text-main); }
        .table-container { background: var(--card-bg); border-radius: 0.75rem; overflow-x: auto; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); border: 1px solid var(--border-color); }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 1rem; background: var(--bg-muted); font-size: 0.75rem; font-weight: 500; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
        .data-table td { padding: 1rem; border-bottom: 1px solid var(--border-color); font-size: 0.75rem; color: var(--text-main); }
        .inline-icon { width: 0.875rem; height: 0.875rem; display: inline; vertical-align: middle; margin-right: 0.25rem; }
        .text-success { color: #059669; }
        .text-warning { color: #d97706; }
        .actions { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
        .btn-icon { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 0.25rem; border-radius: 0.25rem; display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; transition: all 0.3s; }
        .btn-icon svg { width: 1rem; height: 1rem; }
        .btn-icon:hover { background: var(--bg-muted); color: var(--primary); }
        .btn-icon.success:hover { color: #059669; }
        .btn-icon.warning:hover { color: #d97706; }
        .btn-icon.delete:hover { color: #dc2626; background: rgba(220, 38, 38, 0.1); }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: var(--card-bg); border-radius: 0.75rem; width: 90%; max-width: 400px; border: 1px solid var(--border-color); }
        .modal-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); }
        .modal-header h2 { font-size: 1.125rem; color: var(--text-main); }
        .modal-body { padding: 1.5rem; color: var(--text-main); }
        .warning { color: #dc2626; font-size: 0.75rem; margin-top: 0.5rem; }
        .modal-actions { display: flex; gap: 1rem; padding: 1rem 1.5rem; border-top: 1px solid var(--border-color); }
        .btn-cancel { flex: 1; padding: 0.5rem; background: var(--bg-muted); border: none; border-radius: 0.5rem; cursor: pointer; color: var(--text-main); }
        .btn-delete { flex: 1; padding: 0.5rem; background: #dc2626; color: white; border: none; border-radius: 0.5rem; cursor: pointer; }
        .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; color: var(--text-muted); }
        .spinner { width: 2rem; height: 2rem; border: 2px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default AdminProperties;