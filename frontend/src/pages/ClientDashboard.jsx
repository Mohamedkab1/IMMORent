import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { toast } from 'react-toastify';
import { 
  HomeIcon, DocumentTextIcon, CurrencyEuroIcon, BellIcon, UserIcon, 
  CalendarIcon, MagnifyingGlassIcon, HeartIcon, ClockIcon, CheckCircleIcon, 
  XCircleIcon, ArrowPathIcon, DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';
const ClientDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ activeRequests: 0, activeContracts: 0, totalPayments: 0, favoriteProperties: 0 });

  useEffect(() => {
    loadAllData();
    if (location.search.includes('refresh')) setTimeout(() => loadAllData(), 500);
  }, [location.search]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadRequests(), loadContracts()]);
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([loadRequests(), loadContracts()]);
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const loadRequests = async () => {
    try {
      const res = await requestService.getMyRequests();
      if (res.success) {
        const data = res.data || [];
        setRequests(data);
        setStats(prev => ({ ...prev, activeRequests: data.filter(r => r.status === 'pending' || r.status === 'approved').length }));
      }
    } catch (error) {}
  };

  const loadContracts = async () => {
    try {
      const res = await contractService.getMyContracts();
      if (res.success) {
        const data = res.data.data || [];
        setContracts(data);
        setStats(prev => ({ ...prev, activeContracts: data.filter(c => c.status === 'active').length, totalPayments: data.filter(c => c.status === 'active').reduce((s, c) => s + (c.monthly_rent || 0), 0) }));
      }
    } catch (error) {}
  };

  const cancelRequest = async (id) => {
    if (window.confirm('Annuler cette demande ?')) {
      await requestService.cancel(id);
      toast.success('Demande annulée');
      loadRequests();
    }
  };

  const getStatusBadge = (status) => {
    const config = { pending: { bg: '#fef3c7', color: '#d97706', text: 'En attente' }, approved: { bg: '#dcfce7', color: '#059669', text: 'Approuvée' }, rejected: { bg: '#fee2e2', color: '#dc2626', text: 'Refusée' }, cancelled: { bg: '#f3f4f6', color: '#6b7280', text: 'Annulée' }, active: { bg: '#dcfce7', color: '#059669', text: 'Actif' } };
    const c = config[status] || config.pending;
    return <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>{c.text}</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <>
      <div className="client-dashboard">
        <div className="dashboard-sidebar">
          <div className="sidebar-header"><div className="user-info"><div className="user-avatar">{user?.name?.charAt(0)}</div><div><h3>{user?.name}</h3><p>Client</p></div></div></div>
          <nav className="sidebar-nav">
            <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><HomeIcon className="nav-icon" /> Tableau de bord</button>
            <button className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}><DocumentTextIcon className="nav-icon" /> Mes demandes {stats.activeRequests > 0 && <span className="badge">{stats.activeRequests}</span>}</button>
            <button className={`nav-link ${activeTab === 'contracts' ? 'active' : ''}`} onClick={() => setActiveTab('contracts')}><DocumentTextIcon className="nav-icon" /> Mes contrats</button>
            <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><UserIcon className="nav-icon" /> Mon profil</button>
          </nav>
          <div className="sidebar-footer"><Link to="/properties" className="btn-search"><MagnifyingGlassIcon /> Rechercher un bien</Link></div>
        </div>

        <div className="dashboard-main">
          <div className="content-header"><h1>Tableau de bord client</h1><div className="header-actions"><button onClick={refreshData} className="btn-refresh" disabled={refreshing}><ArrowPathIcon className={refreshing ? 'spin' : ''} /></button><button className="btn-notification"><BellIcon /><span className="badge">{stats.activeRequests}</span></button></div></div>

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon requests"><DocumentTextIcon /></div><div><h3>{stats.activeRequests}</h3><p>Demandes en cours</p></div></div>
            <div className="stat-card"><div className="stat-icon contracts"><DocumentTextIcon /></div><div><h3>{stats.activeContracts}</h3><p>Contrats actifs</p></div></div>
            <div className="stat-card"><div className="stat-icon payments"><CurrencyEuroIcon /></div><div><h3>{stats.totalPayments}€</h3><p>Total payé</p></div></div>
            <div className="stat-card"><div className="stat-icon favorites"><HeartIcon /></div><div><h3>{stats.favoriteProperties}</h3><p>Biens favoris</p></div></div>
          </div>

          {activeTab === 'dashboard' && (
            <>
              <div className="content-section"><div className="section-header"><h2>Mes demandes récentes</h2><button className="view-all" onClick={() => setActiveTab('requests')}>Voir tout ({stats.activeRequests})</button></div>
                {requests.slice(0, 3).map(r => (<div key={r.id} className="request-card"><div><h3>{r.property?.title}</h3>{getStatusBadge(r.status)}</div><p><CalendarIcon /> Du {new Date(r.start_date).toLocaleDateString()} au {new Date(r.end_date).toLocaleDateString()}</p><p className="price">{r.property?.price}€ / mois</p>{r.status === 'pending' && <button onClick={() => cancelRequest(r.id)} className="btn-cancel">Annuler</button>}</div>))}
                {requests.filter(r => r.status === 'pending' || r.status === 'approved').length === 0 && <div className="empty"><p>Aucune demande</p><Link to="/properties">Parcourir les biens</Link></div>}</div>
              {contracts.filter(c => c.status === 'active').length > 0 && (<div className="content-section"><div className="section-header"><h2>Contrat actif</h2><button className="view-all" onClick={() => setActiveTab('contracts')}>Voir tout</button></div>
                <div className="contract-card">{contracts.filter(c => c.status === 'active').slice(0, 1).map(c => (<div key={c.id}><h3>{c.property?.title}</h3><div className="dates"><span>Du {new Date(c.start_date).toLocaleDateString()}</span><span>au {new Date(c.end_date).toLocaleDateString()}</span></div><div className="price"><span>Loyer:</span><strong>{c.monthly_rent}€</strong></div>{getStatusBadge(c.status)}<Link to={`/contracts/${c.id}`} className="btn-view">Voir le contrat</Link></div>))}</div></div>)}
            </>
          )}

          {activeTab === 'requests' && (
            <div className="content-section full"><div className="section-header"><h2>Toutes mes demandes</h2><button onClick={refreshData} className="btn-refresh-small" disabled={refreshing}><ArrowPathIcon className={refreshing ? 'spin' : ''} /> Actualiser</button></div>
              <table className="data-table"><thead><tr><th>Bien</th><th>Période</th><th>Date</th><th>Prix</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>{requests.map(r => (<tr key={r.id}><td><strong>{r.property?.title}</strong><br/>{r.property?.city}</td><td>{new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}</td><td>{new Date(r.created_at).toLocaleDateString()}</td><td>{r.property?.price}€</td><td>{getStatusBadge(r.status)}</td><td>{r.status === 'pending' && <button onClick={() => cancelRequest(r.id)} className="btn-cancel-small">Annuler</button>}</td></tr>))}</tbody></table></div>
          )}

          {activeTab === 'contracts' && (
            <div className="content-section full"><div className="section-header"><h2>Mes contrats</h2><button onClick={refreshData} className="btn-refresh-small" disabled={refreshing}><ArrowPathIcon className={refreshing ? 'spin' : ''} /> Actualiser</button></div>
              <table className="data-table"><thead><tr><th>N° Contrat</th><th>Bien</th><th>Période</th><th>Loyer</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>{contracts.map(c => (<tr key={c.id}><td><Link to={`/contracts/${c.id}`} className="link">{c.contract_number}</Link></td><td>{c.property?.title}</td><td>{new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}</td><td>{c.monthly_rent}€</td><td>{getStatusBadge(c.status)}</td><td><Link to={`/contracts/${c.id}`} className="btn-view-small">Voir</Link></td></tr>))}</tbody></table></div>
          )}
        </div>
      </div>

      <style>{`
        .client-dashboard { display: flex; min-height: calc(100vh - 70px); background: #f8f9fa; }
        .dashboard-sidebar { width: 280px; background: white; box-shadow: 2px 0 8px rgba(0,0,0,0.05); position: fixed; top: 70px; left: 0; bottom: 0; overflow-y: auto; }
        .sidebar-header { padding: 1.5rem; border-bottom: 1px solid #e5e7eb; }
        .user-info { display: flex; align-items: center; gap: 1rem; }
        .user-avatar { width: 3rem; height: 3rem; background: linear-gradient(135deg, #d4af37 0%, #c4a52e 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0f2b4d; font-weight: 700; font-size: 1.25rem; }
        .user-info h3 { font-size: 1rem; margin-bottom: 0.25rem; }
        .user-info p { font-size: 0.75rem; color: #6b7280; }
        .sidebar-nav { padding: 1rem; }
        .nav-link { display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.75rem 1rem; background: none; border: none; border-radius: 0.5rem; cursor: pointer; text-align: left; font-size: 0.875rem; color: #6b7280; transition: all 0.3s; position: relative; }
        .nav-link:hover { background: #f3f4f6; color: #d4af37; }
        .nav-link.active { background: #d4af37; color: #0f2b4d; }
        .nav-icon { width: 1.25rem; height: 1.25rem; }
        .badge { position: absolute; right: 1rem; background: #ef4444; color: white; font-size: 0.625rem; padding: 0.125rem 0.375rem; border-radius: 1rem; }
        .sidebar-footer { padding: 1rem; border-top: 1px solid #e5e7eb; }
        .btn-search { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.75rem; background: #d4af37; color: #0f2b4d; text-decoration: none; border-radius: 0.5rem; font-weight: 600; }
        .dashboard-main { flex: 1; margin-left: 280px; padding: 1.5rem; }
        .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .content-header h1 { font-size: 1.5rem; color: #0f2b4d; }
        .header-actions { display: flex; gap: 1rem; align-items: center; }
        .btn-refresh { background: white; border: none; padding: 0.5rem; border-radius: 50%; cursor: pointer; }
        .spin { animation: spin 1s linear infinite; }
        .btn-notification { position: relative; background: white; border: none; padding: 0.5rem; border-radius: 50%; cursor: pointer; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: white; padding: 1rem; border-radius: 0.75rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .stat-icon { width: 3rem; height: 3rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
        .stat-icon.requests { background: #fef3c7; color: #d97706; }
        .stat-icon.contracts { background: #dcfce7; color: #059669; }
        .stat-icon.payments { background: #e0f2fe; color: #0284c7; }
        .stat-icon.favorites { background: #fce7f3; color: #db2777; }
        .stat-card h3 { font-size: 1.25rem; margin-bottom: 0.25rem; }
        .stat-card p { font-size: 0.75rem; color: #6b7280; }
        .content-section { background: white; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .section-header h2 { font-size: 1rem; color: #0f2b4d; }
        .view-all { background: none; border: none; color: #d4af37; cursor: pointer; font-size: 0.75rem; }
        .request-card { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; }
        .request-card > div:first-child { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .request-card h3 { font-size: 1rem; margin-bottom: 0; }
        .request-card p { display: flex; align-items: center; gap: 0.25rem; color: #6b7280; font-size: 0.75rem; margin-bottom: 0.5rem; }
        .price { font-weight: 600; color: #d4af37; font-size: 1rem; }
        .btn-cancel { padding: 0.375rem 0.75rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.75rem; }
        .contract-card { background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%); padding: 1rem; border-radius: 0.5rem; color: white; }
        .contract-card h3 { font-size: 1rem; margin-bottom: 0.5rem; color: white; }
        .dates { display: flex; gap: 1rem; margin-bottom: 0.5rem; font-size: 0.75rem; opacity: 0.9; }
        .contract-card .price { margin-bottom: 0.5rem; }
        .btn-view { display: inline-block; margin-top: 0.5rem; padding: 0.375rem 0.75rem; background: white; color: #0f2b4d; text-decoration: none; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 500; }
        .empty { text-align: center; padding: 2rem; color: #6b7280; }
        .empty a { color: #d4af37; text-decoration: none; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 0.75rem; background: #f8f9fa; font-size: 0.75rem; font-weight: 500; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
        .data-table td { padding: 0.75rem; border-bottom: 1px solid #e5e7eb; font-size: 0.75rem; }
        .link { color: #d4af37; text-decoration: none; }
        .btn-refresh-small { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.5rem; background: #f3f4f6; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.75rem; }
        .btn-cancel-small { padding: 0.25rem 0.5rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.625rem; }
        .btn-view-small { padding: 0.25rem 0.5rem; background: #e0f2fe; color: #0284c7; text-decoration: none; border-radius: 0.25rem; font-size: 0.625rem; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .dashboard-sidebar { display: none; } .dashboard-main { margin-left: 0; } }
      `}</style>
    </>
  );
};

export default ClientDashboard;