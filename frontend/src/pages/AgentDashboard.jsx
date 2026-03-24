import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { toast } from 'react-toastify';
import { 
  BuildingOfficeIcon, DocumentTextIcon, CurrencyEuroIcon, BellIcon, UserIcon, 
  PlusIcon, CheckCircleIcon, XCircleIcon, EyeIcon, PencilIcon, TrashIcon, 
  HomeIcon, MapPinIcon, CalendarIcon, DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';

const AgentDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProperties: 0, availableProperties: 0, pendingRequests: 0, activeContracts: 0, monthlyRevenue: 0 });

  useEffect(() => {
    loadAllData();
    if (location.search.includes('refresh')) setTimeout(() => loadAllData(), 500);
  }, [location.search]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadProperties(), loadRequests(), loadContracts()]);
    setLoading(false);
  };

  const loadProperties = async () => {
    try {
      const res = await propertyService.getMyProperties();
      if (res.success) {
        const data = res.data.data || [];
        setProperties(data);
        setStats(prev => ({ ...prev, totalProperties: data.length, availableProperties: data.filter(p => p.status === 'available').length }));
      }
    } catch (error) { toast.error('Erreur chargement biens'); }
  };

  const loadRequests = async () => {
    try {
      const res = await requestService.getAll();
      if (res.success) {
        const data = res.data || [];
        setRequests(data);
        setStats(prev => ({ ...prev, pendingRequests: data.filter(r => r.status === 'pending').length }));
      }
    } catch (error) {}
  };

  const loadContracts = async () => {
    try {
      const res = await contractService.getAgentContracts();
      if (res.success) {
        const data = res.data.data || [];
        setContracts(data);
        setStats(prev => ({ ...prev, activeContracts: data.filter(c => c.status === 'active').length, monthlyRevenue: data.filter(c => c.status === 'active').reduce((s, c) => s + (c.monthly_rent || 0), 0) }));
      }
    } catch (error) {}
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Supprimer ce bien ?')) {
      await propertyService.delete(id);
      toast.success('Bien supprimé');
      loadProperties();
    }
  };

  const getStatusBadge = (status) => {
    const config = { 
      available: { bg: '#dcfce7', color: '#059669', text: 'Disponible' }, 
      rented: { bg: '#f3f4f6', color: '#6b7280', text: 'Loué' }, 
      reserved: { bg: '#fef3c7', color: '#d97706', text: 'Réservé' }, 
      pending: { bg: '#fef3c7', color: '#d97706', text: 'En attente' }, 
      active: { bg: '#dcfce7', color: '#059669', text: 'Actif' } 
    };
    const c = config[status] || config.pending;
    return <span style={{ background: c.bg, color: c.color, padding: '0.25rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>{c.text}</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <>
      <div className="agent-dashboard">
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="user-info">
              <div className="user-avatar">{user?.name?.charAt(0)}</div>
              <div><h3>{user?.name}</h3><p>Agent immobilier</p></div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <BuildingOfficeIcon className="nav-icon" /> Tableau de bord
            </button>
            <button className={`nav-link ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
              <HomeIcon className="nav-icon" /> Mes biens <span className="badge">{stats.totalProperties}</span>
            </button>
            <button className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
              <DocumentTextIcon className="nav-icon" /> Demandes {stats.pendingRequests > 0 && <span className="badge warning">{stats.pendingRequests}</span>}
            </button>
            <button className={`nav-link ${activeTab === 'contracts' ? 'active' : ''}`} onClick={() => setActiveTab('contracts')}>
              <DocumentDuplicateIcon className="nav-icon" /> Contrats <span className="badge">{stats.activeContracts}</span>
            </button>
          </nav>
          <div className="sidebar-footer">
            <Link to="/properties/new" className="btn-add"><PlusIcon /> Ajouter un bien</Link>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="content-header">
            <h1>Tableau de bord agent</h1>
            <div className="header-actions">
              <button className="btn-notification"><BellIcon /><span className="badge">{stats.pendingRequests}</span></button>
              <Link to="/profile"><UserIcon /></Link>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-icon properties"><BuildingOfficeIcon /></div><div><h3>{stats.totalProperties}</h3><p>Biens gérés</p></div></div>
            <div className="stat-card"><div className="stat-icon available"><HomeIcon /></div><div><h3>{stats.availableProperties}</h3><p>Biens disponibles</p></div></div>
            <div className="stat-card"><div className="stat-icon requests"><DocumentTextIcon /></div><div><h3>{stats.pendingRequests}</h3><p>Demandes en attente</p></div></div>
            <div className="stat-card"><div className="stat-icon revenue"><CurrencyEuroIcon /></div><div><h3>{stats.monthlyRevenue.toLocaleString()}€</h3><p>Revenus mensuels</p></div></div>
          </div>

          {activeTab === 'dashboard' && (
            <>
              <div className="content-section">
                <div className="section-header"><h2>Mes biens récents</h2><button className="view-all" onClick={() => setActiveTab('properties')}>Voir tout ({stats.totalProperties})</button></div>
                {properties.slice(0, 3).map(p => (
                  <div key={p.id} className="property-item">
                    <div><h4>{p.title}</h4><p><MapPinIcon /> {p.city} • {p.price}€/mois</p></div>
                    {getStatusBadge(p.status)}
                    <div>
                      <Link to={`/properties/${p.id}`}><EyeIcon /></Link>
                      <Link to={`/properties/edit/${p.id}`}><PencilIcon /></Link>
                      <button onClick={() => handleDeleteProperty(p.id)}><TrashIcon /></button>
                    </div>
                  </div>
                ))}
                {properties.length === 0 && <div className="empty"><p>Aucun bien</p><Link to="/properties/new">Ajouter un bien</Link></div>}
              </div>
              <div className="content-section">
                <div className="section-header"><h2>Demandes en attente</h2><button className="view-all" onClick={() => setActiveTab('requests')}>Voir tout ({stats.pendingRequests})</button></div>
                {requests.filter(r => r.status === 'pending').slice(0, 3).map(r => (
                  <div key={r.id} className="request-item">
                    <div><h4>{r.user?.name}</h4><p>{r.property?.title}</p><span><CalendarIcon /> {new Date(r.created_at).toLocaleDateString()}</span></div>
                    <div><button className="btn-approve"><CheckCircleIcon /></button><button className="btn-reject"><XCircleIcon /></button></div>
                  </div>
                ))}
              </div>
              <div className="content-section">
                <div className="section-header"><h2>Contrats récents</h2><button className="view-all" onClick={() => setActiveTab('contracts')}>Voir tout ({stats.activeContracts})</button></div>
                {contracts.slice(0, 3).map(c => (
                  <Link to={`/contracts/${c.id}`} key={c.id} className="contract-item">
                    <div><h4>{c.property?.title}</h4><p>Locataire: {c.tenant?.name}</p><span><CalendarIcon /> {new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}</span></div>
                    <div className="amount">{c.monthly_rent}€<span>/mois</span></div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {activeTab === 'properties' && (
            <div className="content-section full">
              <div className="section-header"><h2>Mes biens</h2><Link to="/properties/new" className="btn-add-small"><PlusIcon /> Ajouter</Link></div>
              <table className="data-table">
                <thead><tr><th>Titre</th><th>Ville</th><th>Prix</th><th>Surface</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.title}</strong></td>
                      <td>{p.city}</td>
                      <td>{p.price}€</td>
                      <td>{p.surface} m²</td>
                      <td>{getStatusBadge(p.status)}</td>
                      <td className="actions">
                        <Link to={`/properties/${p.id}`}><EyeIcon /></Link>
                        <Link to={`/properties/edit/${p.id}`}><PencilIcon /></Link>
                        <button onClick={() => handleDeleteProperty(p.id)}><TrashIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="content-section full">
              <div className="section-header"><h2>Demandes de location</h2></div>
              <table className="data-table">
                <thead><tr><th>Client</th><th>Bien</th><th>Période</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.user?.name}</strong><br/>{r.user?.email}</td>
                      <td>{r.property?.title}</td>
                      <td>{new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}</td>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td>{getStatusBadge(r.status)}</td>
                      <td className="actions">
                        {r.status === 'pending' && <><button className="btn-approve-small">Approuver</button><button className="btn-reject-small">Refuser</button></>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="content-section full">
              <div className="section-header"><h2>Contrats</h2></div>
              <table className="data-table">
                <thead><tr><th>N° Contrat</th><th>Bien</th><th>Locataire</th><th>Période</th><th>Loyer</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {contracts.map(c => (
                    <tr key={c.id}>
                      <td><Link to={`/contracts/${c.id}`} className="link">{c.contract_number}</Link></td>
                      <td>{c.property?.title}</td>
                      <td>{c.tenant?.name}</td>
                      <td>{new Date(c.start_date).toLocaleDateString()} - {new Date(c.end_date).toLocaleDateString()}</td>
                      <td>{c.monthly_rent}€</td>
                      <td>{getStatusBadge(c.status)}</td>
                      <td className="actions"><Link to={`/contracts/${c.id}`}><EyeIcon /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .agent-dashboard { display: flex; min-height: calc(100vh - 70px); background: #f8f9fa; }
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
        .badge.warning { background: #f59e0b; }
        .sidebar-footer { padding: 1rem; border-top: 1px solid #e5e7eb; }
        .btn-add { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.75rem; background: #d4af37; color: #0f2b4d; text-decoration: none; border-radius: 0.5rem; font-weight: 600; transition: all 0.3s; }
        .btn-add:hover { background: #c4a52e; }
        .dashboard-main { flex: 1; margin-left: 280px; padding: 1.5rem; }
        .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .content-header h1 { font-size: 1.5rem; color: #0f2b4d; }
        .header-actions { display: flex; gap: 1rem; align-items: center; }
        .btn-notification { position: relative; background: white; border: none; padding: 0.5rem; border-radius: 50%; cursor: pointer; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: white; padding: 1rem; border-radius: 0.75rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .stat-icon { width: 3rem; height: 3rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; }
        .stat-icon.properties { background: #e0f2fe; color: #0284c7; }
        .stat-icon.available { background: #dcfce7; color: #059669; }
        .stat-icon.requests { background: #fef3c7; color: #d97706; }
        .stat-icon.revenue { background: #e9d5ff; color: #7c3aed; }
        .stat-card h3 { font-size: 1.25rem; margin-bottom: 0.25rem; }
        .stat-card p { font-size: 0.75rem; color: #6b7280; }
        .content-section { background: white; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .section-header h2 { font-size: 1rem; color: #0f2b4d; }
        .view-all { background: none; border: none; color: #d4af37; cursor: pointer; font-size: 0.75rem; }
        .property-item, .request-item, .contract-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: #f8f9fa; border-radius: 0.5rem; margin-bottom: 0.5rem; text-decoration: none; }
        .property-item h4, .request-item h4, .contract-item h4 { font-size: 0.875rem; margin-bottom: 0.25rem; color: #0f2b4d; }
        .property-item p, .request-item p, .contract-item p { font-size: 0.75rem; color: #6b7280; display: flex; align-items: center; gap: 0.25rem; }
        .amount { font-size: 1rem; font-weight: 600; color: #d4af37; }
        .btn-approve, .btn-reject { background: none; border: none; cursor: pointer; padding: 0.25rem; border-radius: 0.25rem; }
        .btn-approve { color: #10b981; }
        .btn-reject { color: #ef4444; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 0.75rem; background: #f8f9fa; font-size: 0.75rem; font-weight: 500; color: #6b7280; border-bottom: 1px solid #e5e7eb; }
        .data-table td { padding: 0.75rem; border-bottom: 1px solid #e5e7eb; font-size: 0.75rem; }
        .data-table tr:hover { background: #f8f9fa; }
        .link { color: #d4af37; text-decoration: none; }
        .btn-approve-small, .btn-reject-small { padding: 0.25rem 0.5rem; border: none; border-radius: 0.25rem; font-size: 0.625rem; cursor: pointer; margin-right: 0.25rem; }
        .btn-approve-small { background: #dcfce7; color: #059669; }
        .btn-reject-small { background: #fee2e2; color: #dc2626; }
        .btn-add-small { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.375rem 0.75rem; background: #d4af37; color: #0f2b4d; text-decoration: none; border-radius: 0.375rem; font-size: 0.75rem; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .dashboard-sidebar { display: none; } .dashboard-main { margin-left: 0; } }
      `}</style>
    </>
  );
};

export default AgentDashboard;