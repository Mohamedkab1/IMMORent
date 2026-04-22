import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  MagnifyingGlassIcon, 
  ClockIcon, 
  UserIcon, 
  HomeIcon, 
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AdminRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setRequests([
      { id: 1, request_number: 'REQ-001', user: { name: 'Pierre Durand', email: 'pierre@email.com' }, property: { title: 'Appartement Lyon Centre', city: 'Lyon', agent: { name: 'Jean Dupont' } }, start_date: '2024-04-01', end_date: '2024-06-30', status: 'pending', created_at: '2024-03-20', message: 'Intéressé par le bien' },
      { id: 2, request_number: 'REQ-002', user: { name: 'Sophie Bernard', email: 'sophie@email.com' }, property: { title: 'Maison Caluire', city: 'Caluire', agent: { name: 'Jean Dupont' } }, start_date: '2024-05-01', end_date: '2024-08-31', status: 'pending', created_at: '2024-03-18', message: 'Disponible pour une visite' },
      { id: 3, request_number: 'REQ-003', user: { name: 'Thomas Petit', email: 'thomas@email.com' }, property: { title: 'Studio Villeurbanne', city: 'Villeurbanne', agent: { name: 'Marie Martin' } }, start_date: '2024-04-15', end_date: '2024-07-15', status: 'approved', created_at: '2024-03-15', processed_at: '2024-03-16', processed_by: { name: 'Jean Dupont' } },
      { id: 4, request_number: 'REQ-004', user: { name: 'Marie Lambert', email: 'marie@email.com' }, property: { title: 'Local commercial Part-Dieu', city: 'Lyon', agent: { name: 'Pierre Durand' } }, start_date: '2024-06-01', end_date: '2024-12-31', status: 'rejected', created_at: '2024-03-10', rejection_reason: 'Bien déjà réservé' },
    ]);
    setLoading(false);
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.request_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.property.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-700 dark:text-yellow-500', text: 'En attente', icon: ClockIcon },
      approved: { bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-700 dark:text-green-500', text: 'Approuvée', icon: CheckCircleIcon },
      rejected: { bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-700 dark:text-red-500', text: 'Refusée', icon: XCircleIcon },
      cancelled: { bg: 'bg-[var(--bg-muted)]', color: 'text-[var(--text-muted)]', text: 'Annulée', icon: XCircleIcon }
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.color}`}>
        <Icon className="w-3 h-3" /> {c.text}
      </span>
    );
  };

  const handleApprove = (id) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: 'approved', processed_at: new Date().toISOString() } : r
    ));
    toast.success('Demande approuvée');
  };

  const handleReject = (id) => {
    const reason = prompt('Motif du refus :');
    if (reason) {
      setRequests(requests.map(r => 
        r.id === id ? { ...r, status: 'rejected', rejection_reason: reason, processed_at: new Date().toISOString() } : r
      ));
      toast.success('Demande refusée');
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Chargement des demandes...</p></div>;
  }

  return (
    <>
      <div className="admin-requests">
        <div className="header">
          <h1>Gestion des demandes</h1>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon"><DocumentTextIcon /></div>
            <div><span>Total demandes</span><strong>{stats.total}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><ClockIcon /></div>
            <div><span>En attente</span><strong>{stats.pending}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CheckCircleIcon /></div>
            <div><span>Approuvées</span><strong>{stats.approved}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><XCircleIcon /></div>
            <div><span>Refusées</span><strong>{stats.rejected}</strong></div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-wrapper">
            <MagnifyingGlassIcon className="search-icon" />
            <input type="text" className="search-input" placeholder="Rechercher par n° demande, client ou bien..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Refusées</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Demande</th>
                <th>Client</th>
                <th>Bien</th>
                <th>Agent</th>
                <th>Période</th>
                <th>Date demande</th>
                <th>Statut</th>
                <th>Actions</th>
               </tr>
            </thead>
            <tbody>
              {filteredRequests.map(r => (
                <tr key={r.id}>
                  <td>{r.request_number}</td>
                  <td><strong>{r.user.name}</strong><br/>{r.user.email}</td>
                  <td><strong>{r.property.title}</strong><br/>{r.property.city}</td>
                  <td>{r.property.agent?.name || '-'}</td>
                  <td><CalendarIcon className="inline-icon" /> {new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td className="actions">
                    <button className="btn-icon" title="Voir détails"><EyeIcon /></button>
                    {r.status === 'pending' && (
                      <>
                        <button className="btn-icon success" onClick={() => handleApprove(r.id)} title="Approuver"><CheckCircleIcon /></button>
                        <button className="btn-icon warning" onClick={() => handleReject(r.id)} title="Refuser"><XCircleIcon /></button>
                      </>
                    )}
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>

      <style>{`
        .admin-requests { padding: 1.5rem; background: var(--bg-main); min-height: calc(100vh - 70px); }
        .header { margin-bottom: 1.5rem; }
        .header h1 { font-size: 1.5rem; color: var(--text-main); }
        .stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: var(--card-bg); padding: 1rem; border-radius: 0.75rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); border: 1px solid var(--border-color); }
        .stat-icon { width: 2.5rem; height: 2.5rem; background: var(--bg-muted); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .stat-card span { display: block; font-size: 0.75rem; color: var(--text-muted); }
        .stat-card strong { font-size: 1.25rem; color: var(--text-main); }
        .filters-section { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .search-wrapper { position: relative; flex: 1; max-width: 350px; }
        .search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: var(--text-muted); }
        .search-input { width: 100%; padding: 0.5rem 0.5rem 0.5rem 2rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: var(--card-bg); color: var(--text-main); }
        .status-filter { padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: var(--card-bg); color: var(--text-main); }
        .table-container { background: var(--card-bg); border-radius: 0.75rem; overflow-x: auto; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); border: 1px solid var(--border-color); }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 1rem; background: var(--bg-muted); font-size: 0.75rem; font-weight: 500; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
        .data-table td { padding: 1rem; border-bottom: 1px solid var(--border-color); font-size: 0.75rem; color: var(--text-main); }
        .inline-icon { width: 0.875rem; height: 0.875rem; display: inline; vertical-align: middle; margin-right: 0.25rem; }
        .actions { display: flex; gap: 0.5rem; align-items: center; }
        .btn-icon { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 0.25rem; border-radius: 0.25rem; display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; transition: all 0.3s; }
        .btn-icon svg { width: 1rem; height: 1rem; }
        .btn-icon:hover { background: var(--bg-muted); color: var(--primary); }
        .btn-icon.success:hover { color: #059669; }
        .btn-icon.warning:hover { color: #d97706; }
        .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; color: var(--text-muted); }
        .spinner { width: 2rem; height: 2rem; border: 2px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default AdminRequests;