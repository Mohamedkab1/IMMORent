import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  EyeIcon, 
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon, 
  TrashIcon, 
  ArrowDownTrayIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon, 
  HomeIcon, 
  CurrencyEuroIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdminContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setContracts([
      { id: 1, contract_number: 'CTR-2024-0001', property: { title: 'Appartement Lyon Centre', city: 'Lyon' }, tenant: { name: 'Pierre Durand', email: 'pierre@email.com' }, owner: { name: 'Jean Dupont' }, monthly_rent: 850, start_date: '2024-01-01', end_date: '2024-12-31', status: 'active', created_at: '2024-01-01' },
      { id: 2, contract_number: 'CTR-2024-0002', property: { title: 'Maison Caluire', city: 'Caluire' }, tenant: { name: 'Sophie Bernard', email: 'sophie@email.com' }, owner: { name: 'Marie Martin' }, monthly_rent: 1500, start_date: '2024-02-01', end_date: '2025-01-31', status: 'active', created_at: '2024-02-01' },
      { id: 3, contract_number: 'CTR-2024-0003', property: { title: 'Studio Villeurbanne', city: 'Villeurbanne' }, tenant: { name: 'Thomas Petit', email: 'thomas@email.com' }, owner: { name: 'Jean Dupont' }, monthly_rent: 450, start_date: '2023-09-01', end_date: '2024-08-31', status: 'expired', created_at: '2023-09-01' },
    ]);
    setLoading(false);
  };

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.tenant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      active: { bg: '#dcfce7', color: '#059669', text: 'Actif' },
      terminated: { bg: '#fee2e2', color: '#dc2626', text: 'Résilié' },
      expired: { bg: '#f3f4f6', color: '#6b7280', text: 'Expiré' }
    };
    const c = config[status] || config.active;
    return <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>{c.text}</span>;
  };

  const confirmDelete = (contract) => {
    setContractToDelete(contract);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (contractToDelete) {
      setContracts(contracts.filter(c => c.id !== contractToDelete.id));
      toast.success('Contrat supprimé');
      setShowDeleteConfirm(false);
      setContractToDelete(null);
    }
  };

  const handleDownload = (contract) => {
    toast.info(`Téléchargement du contrat ${contract.contract_number}...`);
  };

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    expired: contracts.filter(c => c.status === 'expired').length,
    terminated: contracts.filter(c => c.status === 'terminated').length
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Chargement des contrats...</p></div>;
  }

  return (
    <>
      <div className="admin-contracts">
        <div className="header">
          <h1>Gestion des contrats</h1>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon"><DocumentTextIcon /></div>
            <div><span>Total contrats</span><strong>{stats.total}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CheckCircleIcon /></div>
            <div><span>Contrats actifs</span><strong>{stats.active}</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CurrencyEuroIcon /></div>
            <div><span>CA mensuel</span><strong>{contracts.filter(c => c.status === 'active').reduce((s, c) => s + c.monthly_rent, 0).toLocaleString()}DH</strong></div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-wrapper">
            <MagnifyingGlassIcon className="search-icon" />
            <input type="text" className="search-input" placeholder="Rechercher par n° contrat, bien ou locataire..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="expired">Expirés</option>
            <option value="terminated">Résiliés</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Contrat</th>
                <th>Bien</th>
                <th>Locataire</th>
                <th>Propriétaire</th>
                <th>Loyer</th>
                <th>Période</th>
                <th>Statut</th>
                <th>Actions</th>
               </tr>
            </thead>
            <tbody>
              {filteredContracts.map(c => (
                <tr key={c.id}>
                  <td><Link to={`/contracts/${c.id}`} className="link">{c.contract_number}</Link></td>
                  <td><strong>{c.property.title}</strong><br/>{c.property.city}</td>
                  <td><strong>{c.tenant.name}</strong><br/>{c.tenant.email}</td>
                  <td>{c.owner.name}</td>
                  <td><CurrencyEuroIcon className="inline-icon" /> {c.monthly_rent}DH / mois</td>
                  <td><CalendarIcon className="inline-icon" /> {new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}</td>
                  <td>{getStatusBadge(c.status)}</td>
                  <td className="actions">
                    <Link to={`/contracts/${c.id}`} className="btn-icon" title="Voir"><EyeIcon /></Link>
                    <button className="btn-icon" onClick={() => handleDownload(c)} title="Télécharger PDF"><ArrowDownTrayIcon /></button>
                    <button className="btn-icon delete" onClick={() => confirmDelete(c)} title="Supprimer"><TrashIcon /></button>
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
              <p>Êtes-vous sûr de vouloir supprimer le contrat <strong>{contractToDelete?.contract_number}</strong> ?</p>
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
        .admin-contracts {
          padding: 1.5rem;
          background: #f8f9fa;
          min-height: calc(100vh - 70px);
        }

        .header {
          margin-bottom: 1.5rem;
        }

        .header h1 {
          font-size: 1.5rem;
          color: #0f2b4d;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: white;
          padding: 1rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .stat-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: #f3f4f6;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
        }

        .stat-card span {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .stat-card strong {
          font-size: 1.25rem;
          color: #0f2b4d;
        }

        .filters-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          max-width: 350px;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1rem;
          height: 1rem;
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 0.5rem 0.5rem 2rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .status-filter {
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
        }

        .table-container {
          background: white;
          border-radius: 0.75rem;
          overflow-x: auto;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 1rem;
          background: #f8f9fa;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.75rem;
        }

        .link {
          color: #d4af37;
          text-decoration: none;
        }

        .link:hover {
          text-decoration: underline;
        }

        .inline-icon {
          width: 0.875rem;
          height: 0.875rem;
          display: inline;
          vertical-align: middle;
          margin-right: 0.25rem;
        }

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
          border-radius: 0.75rem;
          width: 90%;
          max-width: 400px;
        }

        .modal-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          font-size: 1.125rem;
          color: #0f2b4d;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .warning {
          color: #dc2626;
          font-size: 0.75rem;
          margin-top: 0.5rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel {
          flex: 1;
          padding: 0.5rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        .btn-delete {
          flex: 1;
          padding: 0.5rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
        }

        .spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid #e5e7eb;
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default AdminContracts;