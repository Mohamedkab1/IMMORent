import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { EyeIcon, DocumentTextIcon, MagnifyingGlassIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const AdminContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchContracts(); }, []);

  const fetchContracts = async () => {
    setContracts([
      { id: 1, contract_number: 'CTR-2024-0001', property: { title: 'Appartement Lyon Centre', city: 'Lyon' }, tenant: { name: 'Pierre Durand' }, owner: { name: 'Jean Dupont' }, monthly_rent: 850, start_date: '2024-01-01', end_date: '2024-12-31', status: 'active', created_at: '2024-01-01' },
      { id: 2, contract_number: 'CTR-2024-0002', property: { title: 'Maison Caluire', city: 'Caluire' }, tenant: { name: 'Sophie Bernard' }, owner: { name: 'Marie Martin' }, monthly_rent: 1500, start_date: '2024-02-01', end_date: '2025-01-31', status: 'active', created_at: '2024-02-01' },
      { id: 3, contract_number: 'CTR-2024-0003', property: { title: 'Studio Villeurbanne', city: 'Villeurbanne' }, tenant: { name: 'Thomas Petit' }, owner: { name: 'Jean Dupont' }, monthly_rent: 450, start_date: '2023-09-01', end_date: '2024-08-31', status: 'expired', created_at: '2023-09-01' },
    ]);
    setLoading(false);
  };

  const filteredContracts = contracts.filter(c => 
    c.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const config = {
      active: { bg: '#dcfce7', color: '#059669', text: 'Actif' },
      terminated: { bg: '#fee2e2', color: '#dc2626', text: 'Résilié' },
      expired: { bg: '#f3f4f6', color: '#6b7280', text: 'Expiré' }
    };
    const c = config[status] || config.active;
    return <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>{c.text}</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <>
      <div className="admin-contracts">
        <div className="header">
          <h1>Gestion des contrats</h1>
          <div className="search">
            <MagnifyingGlassIcon />
            <input type="text" placeholder="Rechercher par n° contrat, bien ou locataire..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat"><span>Total contrats</span><strong>{contracts.length}</strong></div>
          <div className="stat"><span>Contrats actifs</span><strong>{contracts.filter(c => c.status === 'active').length}</strong></div>
          <div className="stat"><span>Revenus mensuels</span><strong>{contracts.filter(c => c.status === 'active').reduce((s, c) => s + c.monthly_rent, 0)}€</strong></div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr><th>N° Contrat</th><th>Bien</th><th>Locataire</th><th>Propriétaire</th><th>Loyer</th><th>Période</th><th>Statut</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredContracts.map(c => (
                <tr key={c.id}>
                  <td><Link to={`/contracts/${c.id}`} className="link">{c.contract_number}</Link></td>
                  <td><strong>{c.property.title}</strong><br/>{c.property.city}</td>
                  <td>{c.tenant.name}</td>
                  <td>{c.owner.name}</td>
                  <td>{c.monthly_rent}€ / mois</td>
                  <td>{new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}</td>
                  <td>{getStatusBadge(c.status)}</td>
                  <td className="actions">
                    <Link to={`/contracts/${c.id}`} title="Voir"><EyeIcon /></Link>
                    <button title="Télécharger PDF"><ArrowDownTrayIcon /></button>
                    <button title="Supprimer" className="delete"><TrashIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-contracts { padding: 1.5rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .header h1 { font-size: 1.5rem; color: #0f2b4d; }
        .search { display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
        .search svg { width: 1rem; height: 1rem; color: #9ca3af; }
        .search input { border: none; outline: none; width: 300px; }
        .stats-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat { background: white; padding: 1rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .stat span { display: block; font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem; }
        .stat strong { font-size: 1.5rem; color: #d4af37; }
        .table-container { background: white; border-radius: 0.75rem; overflow-x: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1rem; background: #f8f9fa; font-weight: 500; font-size: 0.75rem; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
        td { padding: 1rem; border-bottom: 1px solid #e5e7eb; font-size: 0.75rem; }
        .link { color: #d4af37; text-decoration: none; }
        .link:hover { text-decoration: underline; }
        .actions { display: flex; gap: 0.5rem; }
        .actions a, .actions button { background: none; border: none; cursor: pointer; color: #6b7280; display: inline-flex; align-items: center; }
        .actions a:hover, .actions button:hover { color: #d4af37; }
        .actions .delete:hover { color: #dc2626; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; }
      `}</style>
    </>
  );
};

export default AdminContracts;