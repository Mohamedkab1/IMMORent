import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { EyeIcon, CurrencyEuroIcon, MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const AdminPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    setPayments([
      { id: 1, payment_number: 'PAY-001', contract: { contract_number: 'CTR-2024-0001', property: { title: 'Appartement Lyon Centre' } }, tenant: { name: 'Pierre Durand' }, amount: 850, payment_date: '2024-03-01', due_date: '2024-03-05', status: 'paid', payment_method: 'bank_transfer' },
      { id: 2, payment_number: 'PAY-002', contract: { contract_number: 'CTR-2024-0001', property: { title: 'Appartement Lyon Centre' } }, tenant: { name: 'Pierre Durand' }, amount: 850, payment_date: '2024-02-01', due_date: '2024-02-05', status: 'paid', payment_method: 'bank_transfer' },
      { id: 3, payment_number: 'PAY-003', contract: { contract_number: 'CTR-2024-0002', property: { title: 'Maison Caluire' } }, tenant: { name: 'Sophie Bernard' }, amount: 1500, payment_date: null, due_date: '2024-03-05', status: 'pending', payment_method: null },
      { id: 4, payment_number: 'PAY-004', contract: { contract_number: 'CTR-2024-0002', property: { title: 'Maison Caluire' } }, tenant: { name: 'Sophie Bernard' }, amount: 1500, payment_date: '2024-02-01', due_date: '2024-02-05', status: 'paid', payment_method: 'card' },
    ]);
    setLoading(false);
  };

  const filteredPayments = payments.filter(p => 
    p.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const config = {
      paid: { bg: '#dcfce7', color: '#059669', text: 'Payé' },
      pending: { bg: '#fef3c7', color: '#d97706', text: 'En attente' },
      late: { bg: '#fee2e2', color: '#dc2626', text: 'En retard' },
      cancelled: { bg: '#f3f4f6', color: '#6b7280', text: 'Annulé' }
    };
    const c = config[status] || config.pending;
    return <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>{c.text}</span>;
  };

  const getPaymentMethodLabel = (method) => {
    const methods = { cash: 'Espèces', bank_transfer: 'Virement', card: 'Carte bancaire', check: 'Chèque' };
    return methods[method] || '-';
  };

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <>
      <div className="admin-payments">
        <div className="header">
          <h1>Gestion des paiements</h1>
          <div className="search">
            <MagnifyingGlassIcon />
            <input type="text" placeholder="Rechercher par n° paiement, locataire ou contrat..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat"><span>Total payé</span><strong>{totalPaid.toLocaleString()}€</strong></div>
          <div className="stat"><span>En attente</span><strong>{totalPending.toLocaleString()}€</strong></div>
          <div className="stat"><span>Paiements</span><strong>{payments.length}</strong></div>
          <div className="stat"><span>Taux recouvrement</span><strong>{Math.round((totalPaid / (totalPaid + totalPending)) * 100)}%</strong></div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr><th>N° Paiement</th><th>Contrat</th><th>Bien</th><th>Locataire</th><th>Montant</th><th>Date paiement</th><th>Échéance</th><th>Statut</th><th>Moyen</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.id}>
                  <td>{p.payment_number}</td>
                  <td><Link to={`/contracts/${p.contract.contract_number}`} className="link">{p.contract.contract_number}</Link></td>
                  <td>{p.contract.property.title}</td>
                  <td>{p.tenant.name}</td>
                  <td>{p.amount}€</td>
                  <td>{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : '-'}</td>
                  <td className={new Date(p.due_date) < new Date() && p.status !== 'paid' ? 'late' : ''}>{new Date(p.due_date).toLocaleDateString()}</td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td>{getPaymentMethodLabel(p.payment_method)}</td>
                  <td className="actions">
                    <button title="Marquer payé"><CheckCircleIcon /></button>
                    <button title="Annuler" className="delete"><XCircleIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-payments { padding: 1.5rem; background: #f8f9fa; min-height: calc(100vh - 70px); }
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
        .late { color: #dc2626; font-weight: 500; }
        .link { color: #d4af37; text-decoration: none; }
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

export default AdminPayments;