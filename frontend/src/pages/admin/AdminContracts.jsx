import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const AdminContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      // Simuler des données
      setContracts([
        { id: 1, contract_number: 'CTR-2024-0001', property: { title: 'Appartement Lyon' }, tenant: { name: 'Pierre Durand' }, monthly_rent: 850, status: 'active' },
        { id: 2, contract_number: 'CTR-2024-0002', property: { title: 'Maison Caluire' }, tenant: { name: 'Sophie Bernard' }, monthly_rent: 1500, status: 'active' },
      ]);
    } catch (error) {
      toast.error('Erreur lors du chargement des contrats');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { color: '#10b981', text: 'Actif' },
      terminated: { color: '#ef4444', text: 'Résilié' },
      expired: { color: '#6b7280', text: 'Expiré' }
    };
    const c = config[status] || config.active;
    return (
      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: c.color + '20', color: c.color }}>
        {c.text}
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Gestion des contrats</h1>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>N° Contrat</th><th>Bien</th><th>Locataire</th><th>Loyer</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.id}>
                <td><Link to={`/contracts/${c.id}`} style={{ color: '#2563eb' }}>{c.contract_number}</Link></td>
                <td>{c.property?.title}</td><td>{c.tenant?.name}</td><td>{c.monthly_rent}€</td>
                <td>{getStatusBadge(c.status)}</td>
                <td><Link to={`/contracts/${c.id}`} className="btn-icon"><EyeIcon className="h-5 w-5" /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        .admin-page { padding: 30px; background: #f8fafc; min-height: calc(100vh - 70px); }
        .page-header { margin-bottom: 30px; }
        .page-header h1 { color: #1f2937; font-size: 24px; }
        .table-container { background: white; border-radius: 10px; overflow-x: auto; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 15px; background: #f9fafb; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
        .data-table td { padding: 15px; border-bottom: 1px solid #e5e7eb; }
        .btn-icon { padding: 5px; border: none; background: none; cursor: pointer; color: #6b7280; display: inline-block; }
        .btn-icon:hover { color: #2563eb; }
        .spinner { width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .flex { display: flex; } .justify-center { justify-content: center; } .items-center { align-items: center; } .h-64 { height: 16rem; }
      `}</style>
    </div>
  );
};

export default AdminContracts;