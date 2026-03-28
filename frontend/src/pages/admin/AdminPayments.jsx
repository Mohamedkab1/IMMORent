import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CurrencyEuroIcon, 
  CalendarIcon, 
  UserIcon, 
  HomeIcon, 
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setPayments([
      { id: 1, payment_number: 'PAY-001', contract: { contract_number: 'CTR-2024-0001', property: { title: 'Appartement Lyon Centre' } }, tenant: { name: 'Pierre Durand' }, amount: 850, payment_date: '2024-03-01', due_date: '2024-03-05', status: 'paid', payment_method: 'bank_transfer' },
      { id: 2, payment_number: 'PAY-002', contract: { contract_number: 'CTR-2024-0001', property: { title: 'Appartement Lyon Centre' } }, tenant: { name: 'Pierre Durand' }, amount: 850, payment_date: '2024-02-01', due_date: '2024-02-05', status: 'paid', payment_method: 'bank_transfer' },
      { id: 3, payment_number: 'PAY-003', contract: { contract_number: 'CTR-2024-0002', property: { title: 'Maison Caluire' } }, tenant: { name: 'Sophie Bernard' }, amount: 1500, payment_date: null, due_date: '2024-03-05', status: 'pending', payment_method: null },
      { id: 4, payment_number: 'PAY-004', contract: { contract_number: 'CTR-2024-0002', property: { title: 'Maison Caluire' } }, tenant: { name: 'Sophie Bernard' }, amount: 1500, payment_date: '2024-02-01', due_date: '2024-02-05', status: 'paid', payment_method: 'card' },
      { id: 5, payment_number: 'PAY-005', contract: { contract_number: 'CTR-2024-0003', property: { title: 'Studio Villeurbanne' } }, tenant: { name: 'Thomas Petit' }, amount: 450, payment_date: null, due_date: '2024-03-10', status: 'late', payment_method: null },
    ]);
    setLoading(false);
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleMarkAsPaid = (id) => {
    setPayments(payments.map(p => 
      p.id === id ? { ...p, status: 'paid', payment_date: new Date().toISOString().split('T')[0] } : p
    ));
    toast.success('Paiement marqué comme payé');
  };

  const handleCancelPayment = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce paiement ?')) {
      setPayments(payments.map(p => p.id === id ? { ...p, status: 'cancelled' } : p));
      toast.success('Paiement annulé');
    }
  };

  const stats = {
    total: payments.length,
    totalAmount: payments.reduce((s, p) => s + p.amount, 0),
    paidAmount: payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0),
    lateAmount: payments.filter(p => p.status === 'late').reduce((s, p) => s + p.amount, 0)
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Chargement des paiements...</p></div>;
  }

  return (
    <>
      <div className="admin-payments">
        <div className="header">
          <h1>Gestion des paiements</h1>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon"><CurrencyEuroIcon /></div>
            <div><span>Total encaissé</span><strong>{stats.paidAmount.toLocaleString()}DH</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><ClockIcon /></div>
            <div><span>En attente</span><strong>{stats.pendingAmount.toLocaleString()}DH</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><ExclamationTriangleIcon /></div>
            <div><span>En retard</span><strong>{stats.lateAmount.toLocaleString()}DH</strong></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><DocumentTextIcon /></div>
            <div><span>Total paiements</span><strong>{stats.total}</strong></div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-wrapper">
            <MagnifyingGlassIcon className="search-icon" />
            <input type="text" className="search-input" placeholder="Rechercher par n° paiement, locataire ou contrat..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="paid">Payés</option>
            <option value="pending">En attente</option>
            <option value="late">En retard</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Paiement</th>
                <th>Contrat</th>
                <th>Bien</th>
                <th>Locataire</th>
                <th>Montant</th>
                <th>Date paiement</th>
                <th>Échéance</th>
                <th>Statut</th>
                <th>Moyen</th>
                <th>Actions</th>
               </tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.id}>
                  <td>{p.payment_number}</td>
                  <td><Link to={`/contracts/${p.contract.contract_number}`} className="link">{p.contract.contract_number}</Link></td>
                  <td>{p.contract.property.title}</td>
                  <td><strong>{p.tenant.name}</strong></td>
                  <td><CurrencyEuroIcon className="inline-icon" /> {p.amount.toLocaleString()}DH</td>
                  <td>{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : '-'}</td>
                  <td className={new Date(p.due_date) < new Date() && p.status !== 'paid' ? 'late-date' : ''}>{new Date(p.due_date).toLocaleDateString()}</td>
                  <td>{getStatusBadge(p.status)}</td>
                  <td>{getPaymentMethodLabel(p.payment_method)}</td>
                  <td className="actions">
                    {p.status === 'pending' && (
                      <button className="btn-icon success" onClick={() => handleMarkAsPaid(p.id)} title="Marquer payé"><CheckCircleIcon /></button>
                    )}
                    {p.status !== 'paid' && p.status !== 'cancelled' && (
                      <button className="btn-icon warning" onClick={() => handleCancelPayment(p.id)} title="Annuler"><XCircleIcon /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>

      <style>{`
        .admin-payments {
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
          grid-template-columns: repeat(4, 1fr);
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

        .late-date {
          color: #dc2626;
          font-weight: 500;
        }

        .link {
          color: #d4af37;
          text-decoration: none;
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
        }

        .btn-icon.success:hover {
          color: #059669;
        }

        .btn-icon.warning:hover {
          color: #d97706;
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

export default AdminPayments;