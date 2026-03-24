import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { EyeIcon, CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const AdminProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    setProperties([
      { id: 1, title: 'Bel appartement centre-ville', city: 'Lyon', price: 850, status: 'available', type: 'apartment', user: { name: 'Jean Dupont' }, created_at: '2024-03-20' },
      { id: 2, title: 'Maison familiale avec jardin', city: 'Caluire-et-Cuire', price: 1500, status: 'available', type: 'house', user: { name: 'Jean Dupont' }, created_at: '2024-03-18' },
      { id: 3, title: 'Studio proche université', city: 'Villeurbanne', price: 450, status: 'rented', type: 'studio', user: { name: 'Marie Martin' }, created_at: '2024-03-15' },
      { id: 4, title: 'Local commercial Part-Dieu', city: 'Lyon', price: 2000, status: 'available', type: 'commercial', user: { name: 'Jean Dupont' }, created_at: '2024-03-10' },
    ]);
    setLoading(false);
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const config = {
      available: { bg: '#dcfce7', color: '#059669', text: 'Disponible' },
      rented: { bg: '#f3f4f6', color: '#6b7280', text: 'Loué' },
      reserved: { bg: '#fef3c7', color: '#d97706', text: 'Réservé' },
      sold: { bg: '#fee2e2', color: '#dc2626', text: 'Vendu' }
    };
    const c = config[status] || config.available;
    return <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>{c.text}</span>;
  };

  const getTypeLabel = (type) => {
    const types = { apartment: 'Appartement', house: 'Maison', studio: 'Studio', commercial: 'Local commercial', land: 'Terrain' };
    return types[type] || type;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <>
      <div className="admin-properties">
        <div className="header">
          <h1>Gestion des biens</h1>
          <div className="search">
            <MagnifyingGlassIcon />
            <input type="text" placeholder="Rechercher par titre, ville ou agent..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat"><span>Total biens</span><strong>{properties.length}</strong></div>
          <div className="stat"><span>Disponibles</span><strong>{properties.filter(p => p.status === 'available').length}</strong></div>
          <div className="stat"><span>Loués</span><strong>{properties.filter(p => p.status === 'rented').length}</strong></div>
          <div className="stat"><span>En attente</span><strong>{properties.filter(p => p.status === 'reserved').length}</strong></div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr><th>ID</th><th>Titre</th><th>Ville</th><th>Type</th><th>Prix</th><th>Statut</th><th>Agent</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredProperties.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td><strong>{p.title}</strong></td>
                  <td>{p.city}</td>
                  <td>{getTypeLabel(p.type)}</td>
                  <td>{p.price}€{p.type === 'rent' ? '/mois' : ''}</td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td>{p.user.name}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link to={`/properties/${p.id}`} title="Voir"><EyeIcon /></Link>
                    <button title="Approuver"><CheckCircleIcon /></button>
                    <button title="Refuser" className="delete"><XCircleIcon /></button>
                    <button title="Modifier"><PencilIcon /></button>
                    <button title="Supprimer" className="delete"><TrashIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-properties { padding: 1.5rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .header h1 { font-size: 1.5rem; color: #0f2b4d; }
        .search { display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; }
        .search svg { width: 1rem; height: 1rem; color: #9ca3af; }
        .search input { border: none; outline: none; width: 250px; }
        .stats-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat { background: white; padding: 1rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .stat span { display: block; font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem; }
        .stat strong { font-size: 1.5rem; color: #d4af37; }
        .table-container { background: white; border-radius: 0.75rem; overflow-x: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1rem; background: #f8f9fa; font-weight: 500; font-size: 0.75rem; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
        td { padding: 1rem; border-bottom: 1px solid #e5e7eb; font-size: 0.75rem; }
        .actions { display: flex; gap: 0.5rem; }
        .actions a, .actions button { background: none; border: none; cursor: pointer; color: #6b7280; display: inline-flex; align-items: center; }
        .actions a:hover, .actions button:hover { color: #d4af37; }
        .actions .delete:hover { color: #dc2626; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; }
        @media (max-width: 768px) { .stats-cards { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </>
  );
};

export default AdminProperties;