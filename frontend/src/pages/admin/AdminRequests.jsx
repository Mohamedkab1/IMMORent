import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { EyeIcon, CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon, ClockIcon } from '@heroicons/react/24/outline';

const AdminRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setRequests([
      { id: 1, request_number: 'REQ-001', user: { name: 'Pierre Durand', email: 'pierre@email.com' }, property: { title: 'Appartement Lyon Centre', city: 'Lyon' }, start_date: '2024-04-01', end_date: '2024-06-30', status: 'pending', created_at: '2024-03-20', message: 'Intéressé par le bien' },
      { id: 2, request_number: 'REQ-002', user: { name: 'Sophie Bernard', email: 'sophie@email.com' }, property: { title: 'Maison Caluire', city: 'Caluire' }, start_date: '2024-05-01', end_date: '2024-08-31', status: 'pending', created_at: '2024-03-18', message: 'Disponible pour une visite' },
      { id: 3, request_number: 'REQ-003', user: { name: 'Thomas Petit', email: 'thomas@email.com' }, property: { title: 'Studio Villeurbanne', city: 'Villeurbanne' }, start_date: '2024-04-15', end_date: '2024-07-15', status: 'approved', created_at: '2024-03-15', processed_at: '2024-03-16', processed_by: { name: 'Jean Dupont' } },
      { id: 4, request_number: 'REQ-004', user: { name: 'Marie Lambert', email: 'marie@email.com' }, property: { title: 'Local commercial Part-Dieu', city: 'Lyon' }, start_date: '2024-06-01', end_date: '2024-12-31', status: 'rejected', created_at: '2024-03-10', rejection_reason: 'Bien déjà réservé' },
    ]);
    setLoading(false);
  };

  const filteredRequests = requests.filter(r => 
    r.request_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.property.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: '#fef3c7', color: '#d97706', text: 'En attente', icon: ClockIcon },
      approved: { bg: '#dcfce7', color: '#059669', text: 'Approuvée', icon: CheckCircleIcon },
      rejected: { bg: '#fee2e2', color: '#dc2626', text: 'Refusée', icon: XCircleIcon },
      cancelled: { bg: '#f3f4f6', color: '#6b7280', text: 'Annulée', icon: XCircleIcon }
    };
    const c = config[status] || config.pending;
    return <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><c.icon style={{ width: '0.75rem' }} /> {c.text}</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <>
      <div className="admin-requests">
        <div className="header">
          <h1>Gestion des demandes</h1>
          <div className="search">
            <MagnifyingGlassIcon />
            <input type="text" placeholder="Rechercher par n° demande, client ou bien..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat"><span>Total demandes</span><strong>{requests.length}</strong></div>
          <div className="stat"><span>En attente</span><strong>{requests.filter(r => r.status === 'pending').length}</strong></div>
          <div className="stat"><span>Approuvées</span><strong>{requests.filter(r => r.status === 'approved').length}</strong></div>
          <div className="stat"><span>Refusées</span><strong>{requests.filter(r => r.status === 'rejected').length}</strong></div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr><th>N° Demande</th><th>Client</th><th>Bien</th><th>Période</th><th>Date demande</th><th>Statut</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredRequests.map(r => (
                <tr key={r.id}>
                  <td>{r.request_number}</td>
                  <td><strong>{r.user.name}</strong><br/>{r.user.email}</td>
                  <td><strong>{r.property.title}</strong><br/>{r.property.city}</td>
                  <td>{new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td className="actions">
                    <button title="Voir détails"><EyeIcon /></button>
                    {r.status === 'pending' && <><button title="Approuver"><CheckCircleIcon /></button><button title="Refuser" className="delete"><XCircleIcon /></button></>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-requests { padding: 1.5rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .header h1 { font-size: 1.5rem; color: #0f2b4d; }
        .search { display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
        .search svg { width: 1rem; height: 1rem; color: #9ca3af; }
        .search input { border: none; outline: none; width: 300px; }
        .stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat { background: white; padding: 1rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .stat span { display: block; font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem; }
        .stat strong { font-size: 1.25rem; color: #d4af37; }
        .table-container { background: white; border-radius: 0.75rem; overflow-x: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1rem; background: #f8f9fa; font-weight: 500; font-size: 0.75rem; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
        td { padding: 1rem; border-bottom: 1px solid #e5e7eb; font-size: 0.75rem; }
        .actions { display: flex; gap: 0.5rem; }
        .actions button { background: none; border: none; cursor: pointer; color: #6b7280; display: inline-flex; align-items: center; }
        .actions button:hover { color: #10b981; }
        .actions button.delete:hover { color: #dc2626; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; }
        @media (max-width: 768px) { .stats-cards { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </>
  );
};

export default AdminRequests;