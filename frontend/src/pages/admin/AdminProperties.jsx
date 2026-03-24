import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  MapPinIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // Simuler des données
      setProperties([
        { id: 1, title: 'Bel appartement centre-ville', city: 'Lyon', price: 850, status: 'available', user: { name: 'Jean Dupont' } },
        { id: 2, title: 'Maison familiale avec jardin', city: 'Caluire-et-Cuire', price: 1500, status: 'available', user: { name: 'Jean Dupont' } },
        { id: 3, title: 'Studio proche université', city: 'Villeurbanne', price: 450, status: 'rented', user: { name: 'Marie Martin' } },
      ]);
    } catch (error) {
      toast.error('Erreur lors du chargement des biens');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { color: '#10b981', text: 'Disponible' },
      rented: { color: '#6b7280', text: 'Loué' },
      reserved: { color: '#f59e0b', text: 'Réservé' },
      unavailable: { color: '#ef4444', text: 'Indisponible' }
    };
    const config = statusConfig[status] || statusConfig.available;
    return (
      <span style={{ 
        padding: '4px 10px', 
        borderRadius: '20px', 
        fontSize: '12px',
        background: config.color + '20',
        color: config.color
      }}>
        {config.text}
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
    <div className="admin-page">
      <div className="page-header">
        <h1>Gestion des biens</h1>
        <div className="search-bar">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <input 
            type="text" 
            placeholder="Rechercher un bien..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Ville</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Agent</th>
              <th>Actions</th>
             </tr>
          </thead>
          <tbody>
            {filteredProperties.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td><strong>{p.title}</strong></td>
                <td>{p.city}</td>
                <td>{p.price}€</td>
                <td>{getStatusBadge(p.status)}</td>
                <td>{p.user?.name || '-'}</td>
                <td className="actions">
                  <Link to={`/properties/${p.id}`} className="btn-icon" title="Voir">
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <button className="btn-icon" title="Approuver">
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                  <button className="btn-icon delete" title="Refuser">
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-page {
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

        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 8px 15px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .search-bar input {
          border: none;
          outline: none;
          font-size: 14px;
          width: 200px;
        }

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
        }

        .data-table td {
          padding: 15px;
          border-bottom: 1px solid #e5e7eb;
          color: #1f2937;
        }

        .data-table tr:hover {
          background: #f9fafb;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .btn-icon {
          padding: 5px;
          border: none;
          background: none;
          cursor: pointer;
          color: #6b7280;
          border-radius: 5px;
          transition: all 0.3s;
          text-decoration: none;
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

export default AdminProperties;