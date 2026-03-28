import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { toast } from 'react-toastify';
import { 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  CurrencyEuroIcon, 
  BellIcon, 
  UserIcon, 
  PlusIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  HomeIcon, 
  MapPinIcon, 
  CalendarIcon, 
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';

const AgentDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ 
    totalProperties: 0, 
    availableProperties: 0, 
    pendingRequests: 0, 
    activeContracts: 0, 
    monthlyRevenue: 0 
  });

  useEffect(() => {
    loadAllData();
    if (location.search.includes('refresh')) {
      setTimeout(() => loadAllData(), 500);
    }
  }, [location.search]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadProperties(),
      loadRequests(),
      loadContracts()
    ]);
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([
      loadProperties(),
      loadRequests(),
      loadContracts()
    ]);
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const loadProperties = async () => {
    try {
      const response = await propertyService.getMyProperties();
      if (response.success) {
        const data = response.data.data || [];
        setProperties(data);
        setStats(prev => ({ 
          ...prev, 
          totalProperties: data.length, 
          availableProperties: data.filter(p => p.status === 'available').length 
        }));
      }
    } catch (error) {
      console.error('Erreur chargement biens:', error);
      toast.error('Erreur lors du chargement des biens');
    }
  };

  const loadRequests = async () => {
    try {
      const response = await requestService.getAll();
      if (response.success) {
        const data = response.data || [];
        setRequests(data);
        setStats(prev => ({ 
          ...prev, 
          pendingRequests: data.filter(r => r.status === 'pending').length 
        }));
      }
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    }
  };

  const loadContracts = async () => {
    try {
      const response = await contractService.getAgentContracts();
      if (response.success) {
        let data = response.data.data || [];
        
        // S'assurer que monthly_rent est un nombre pour chaque contrat
        data = data.map(contract => ({
          ...contract,
          monthly_rent: parseFloat(contract.monthly_rent) || 0,
          charges: parseFloat(contract.charges) || 0
        }));
        
        setContracts(data);
        
        // Filtrer les contrats actifs
        const activeContracts = data.filter(c => c.status === 'active');
        
        // Calculer la somme des loyers (addition numérique)
        const totalRevenue = activeContracts.reduce((sum, c) => {
          return sum + c.monthly_rent;
        }, 0);
        
        setStats(prev => ({ 
          ...prev, 
          activeContracts: activeContracts.length,
          monthlyRevenue: totalRevenue
        }));
      }
    } catch (error) {
      console.error('Erreur chargement contrats:', error);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
      try {
        await propertyService.delete(id);
        toast.success('Bien supprimé avec succès');
        loadProperties();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleProcessRequest = async (requestId, status) => {
    const actionText = status === 'approved' ? 'approuver' : 'refuser';
    if (!window.confirm(`Êtes-vous sûr de vouloir ${actionText} cette demande ?`)) {
      return;
    }

    try {
      let rejectionReason = null;
      if (status === 'rejected') {
        rejectionReason = prompt('Motif du refus :');
        if (!rejectionReason) return;
      }

      const response = await requestService.process(requestId, {
        status,
        rejection_reason: rejectionReason
      });
      
      if (response.success) {
        toast.success(`Demande ${status === 'approved' ? 'approuvée' : 'refusée'} avec succès`);
        
        if (status === 'approved') {
          navigate(`/contracts/new?request=${requestId}`);
        } else {
          loadRequests();
        }
      } else {
        toast.error(response.message || 'Erreur lors du traitement');
      }
    } catch (error) {
      toast.error('Erreur lors du traitement de la demande');
    }
  };

  const getStatusBadge = (status) => {
    const config = { 
      available: { bg: '#dcfce7', color: '#059669', text: 'Disponible' },
      rented: { bg: '#f3f4f6', color: '#6b7280', text: 'Loué' },
      reserved: { bg: '#fef3c7', color: '#d97706', text: 'Réservé' },
      pending: { bg: '#fef3c7', color: '#d97706', text: 'En attente' },
      approved: { bg: '#dcfce7', color: '#059669', text: 'Approuvée' },
      rejected: { bg: '#fee2e2', color: '#dc2626', text: 'Refusée' },
      active: { bg: '#dcfce7', color: '#059669', text: 'Actif' }
    };
    const c = config[status] || config.pending;
    return (
      <span style={{ 
        background: c.bg, 
        color: c.color, 
        padding: '0.25rem 0.5rem', 
        borderRadius: '1rem', 
        fontSize: '0.75rem' 
      }}>
        {c.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <>
      <div className="agent-dashboard">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="user-info">
              <div className="user-avatar">{user?.name?.charAt(0)}</div>
              <div>
                <h3>{user?.name}</h3>
                <p>Agent immobilier</p>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BuildingOfficeIcon className="nav-icon" /> Tableau de bord
            </button>
            <button 
              className={`nav-link ${activeTab === 'properties' ? 'active' : ''}`}
              onClick={() => setActiveTab('properties')}
            >
              <HomeIcon className="nav-icon" /> Mes biens
              <span className="badge">{stats.totalProperties}</span>
            </button>
            <button 
              className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <DocumentTextIcon className="nav-icon" /> Demandes
              {stats.pendingRequests > 0 && (
                <span className="badge warning">{stats.pendingRequests}</span>
              )}
            </button>
            <button 
              className={`nav-link ${activeTab === 'contracts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contracts')}
            >
              <DocumentDuplicateIcon className="nav-icon" /> Contrats
              <span className="badge">{stats.activeContracts}</span>
            </button>
          </nav>
          <div className="sidebar-footer">
            <Link to="/properties/new" className="btn-add">
              <PlusIcon className="add-icon" />
              Ajouter un bien
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <div className="content-header">
            <h1>Tableau de bord agent</h1>
            <div className="header-actions">
              <button onClick={refreshData} className="btn-refresh" disabled={refreshing}>
                🔄 {refreshing ? 'Actualisation...' : 'Actualiser'}
              </button>
              <button className="btn-notification">
                <BellIcon className="bell-icon" />
                <span className="badge">{stats.pendingRequests}</span>
              </button>
              <Link to="/profile"><UserIcon className="profile-icon" /></Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon properties"><BuildingOfficeIcon className="stat-icon-svg" /></div>
              <div><h3>{stats.totalProperties}</h3><p>Biens gérés</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon available"><HomeIcon className="stat-icon-svg" /></div>
              <div><h3>{stats.availableProperties}</h3><p>Biens disponibles</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon requests"><DocumentTextIcon className="stat-icon-svg" /></div>
              <div><h3>{stats.pendingRequests}</h3><p>Demandes en attente</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue"><CurrencyEuroIcon className="stat-icon-svg" /></div>
              <div>
                <h3>{stats.monthlyRevenue.toLocaleString()}DH</h3>
                <p>Revenus mensuels</p>
                <small className="revenue-note">(loyers des contrats actifs)</small>
              </div>
            </div>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <div className="content-section">
                <div className="section-header">
                  <h2>Mes biens récents</h2>
                  <button className="view-all" onClick={() => setActiveTab('properties')}>
                    Voir tout ({stats.totalProperties})
                  </button>
                </div>
                <div className="properties-list">
                  {properties.slice(0, 3).map(property => (
                    <div key={property.id} className="property-item">
                      <div className="property-info">
                        <h4>{property.title}</h4>
                        <p className="property-location">
                          <MapPinIcon className="inline-icon" /> {property.city} • {property.price}DH/mois
                        </p>
                      </div>
                      {getStatusBadge(property.status)}
                      <div className="property-actions">
                        <Link to={`/properties/${property.id}`} className="action-btn" title="Voir">
                          <EyeIcon className="action-icon" />
                        </Link>
                        <Link to={`/properties/edit/${property.id}`} className="action-btn" title="Modifier">
                          <PencilIcon className="action-icon" />
                        </Link>
                        <button onClick={() => handleDeleteProperty(property.id)} className="action-btn delete" title="Supprimer">
                          <TrashIcon className="action-icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {properties.length === 0 && (
                    <div className="empty-state">
                      <p>Aucun bien ajouté pour le moment</p>
                      <Link to="/properties/new">Ajouter votre premier bien</Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="content-section">
                <div className="section-header">
                  <h2>Demandes en attente</h2>
                  <button className="view-all" onClick={() => setActiveTab('requests')}>
                    Voir tout ({stats.pendingRequests})
                  </button>
                </div>
                <div className="requests-list">
                  {requests.filter(r => r.status === 'pending').slice(0, 3).map(request => (
                    <div key={request.id} className="request-item">
                      <div className="request-info">
                        <h4>{request.user?.name || 'Client'}</h4>
                        <p>{request.property?.title || 'Bien'}</p>
                        <span className="request-date">
                          <CalendarIcon className="inline-icon" /> {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="request-actions">
                        <button 
                          onClick={() => handleProcessRequest(request.id, 'approved')} 
                          className="action-btn approve" 
                          title="Approuver"
                        >
                          <CheckCircleIcon className="action-icon" />
                        </button>
                        <button 
                          onClick={() => handleProcessRequest(request.id, 'rejected')} 
                          className="action-btn reject" 
                          title="Refuser"
                        >
                          <XCircleIcon className="action-icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {requests.filter(r => r.status === 'pending').length === 0 && (
                    <div className="empty-state">
                      <p>Aucune demande en attente</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="content-section">
                <div className="section-header">
                  <h2>Contrats récents</h2>
                  <button className="view-all" onClick={() => setActiveTab('contracts')}>
                    Voir tout ({stats.activeContracts})
                  </button>
                </div>
                <div className="contracts-list">
                  {contracts.slice(0, 3).map(contract => (
                    <Link to={`/contracts/${contract.id}`} key={contract.id} className="contract-item">
                      <div className="contract-info">
                        <h4>{contract.property?.title}</h4>
                        <p>Locataire: {contract.tenant?.name}</p>
                        <span className="contract-period">
                          <CalendarIcon className="inline-icon" /> {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="contract-amount">
                        {contract.monthly_rent}DH<span>/mois</span>
                      </div>
                    </Link>
                  ))}
                  {contracts.length === 0 && (
                    <div className="empty-state">
                      <p>Aucun contrat pour le moment</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="content-section full-width">
              <div className="section-header">
                <h2>Mes biens</h2>
                <Link to="/properties/new" className="btn-add-small">
                  <PlusIcon className="add-icon-small" /> Ajouter un bien
                </Link>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Ville</th>
                      <th>Prix</th>
                      <th>Surface</th>
                      <th>Statut</th>
                      <th>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id}>
                        <td><strong>{property.title}</strong></td>
                        <td><MapPinIcon className="inline-icon" /> {property.city}</td>
                        <td>{property.price}DH</td>
                        <td>{property.surface} m²</td>
                        <td>{getStatusBadge(property.status)}</td>
                        <td className="actions-cell">
                          <Link to={`/properties/${property.id}`} className="action-btn" title="Voir">
                            <EyeIcon className="action-icon" />
                          </Link>
                          <Link to={`/properties/edit/${property.id}`} className="action-btn" title="Modifier">
                            <PencilIcon className="action-icon" />
                          </Link>
                          <button onClick={() => handleDeleteProperty(property.id)} className="action-btn delete" title="Supprimer">
                            <TrashIcon className="action-icon" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-cell">
                          <p>Aucun bien ajouté pour le moment</p>
                          <Link to="/properties/new">Ajouter votre premier bien</Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="content-section full-width">
              <div className="section-header">
                <h2>Demandes de location</h2>
                <button onClick={refreshData} className="btn-refresh-small">
                  🔄 Actualiser
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Bien</th>
                      <th>Période</th>
                      <th>Date demande</th>
                      <th>Statut</th>
                      <th>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                    {requests.map(request => (
                      <tr key={request.id}>
                        <td>
                          <strong>{request.user?.name || 'Client'}</strong>
                          <br/><span className="text-muted">{request.user?.email}</span>
                        </td>
                        <td>
                          <strong>{request.property?.title || 'Bien'}</strong>
                          <br/><span className="text-muted">{request.property?.city}</span>
                        </td>
                        <td>
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </td>
                        <td>{new Date(request.created_at).toLocaleDateString()}</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td className="actions-cell">
                          {request.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleProcessRequest(request.id, 'approved')} 
                                className="action-btn approve" 
                                title="Approuver"
                              >
                                <CheckCircleIcon className="action-icon" />
                              </button>
                              <button 
                                onClick={() => handleProcessRequest(request.id, 'rejected')} 
                                className="action-btn reject" 
                                title="Refuser"
                              >
                                <XCircleIcon className="action-icon" />
                              </button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <Link to={`/contracts/new?request=${request.id}`} className="btn-create-contract">
                              Créer contrat
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-cell">
                          Aucune demande reçue
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Contracts Tab */}
          {activeTab === 'contracts' && (
            <div className="content-section full-width">
              <div className="section-header">
                <h2>Contrats de location</h2>
                <button onClick={refreshData} className="btn-refresh-small">
                  🔄 Actualiser
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>N° Contrat</th>
                      <th>Bien</th>
                      <th>Locataire</th>
                      <th>Période</th>
                      <th>Loyer</th>
                      <th>Statut</th>
                      <th>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                    {contracts.map(contract => (
                      <tr key={contract.id}>
                        <td>
                          <Link to={`/contracts/${contract.id}`} className="contract-link">
                            {contract.contract_number}
                          </Link>
                        </td>
                        <td>{contract.property?.title || 'Bien'}</td>
                        <td>{contract.tenant?.name || 'Locataire'}</td>
                        <td>
                          {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
                        </td>
                        <td>{contract.monthly_rent}DH / mois</td>
                        <td>{getStatusBadge(contract.status)}</td>
                        <td className="actions-cell">
                          <Link to={`/contracts/${contract.id}`} className="action-btn" title="Voir">
                            <EyeIcon className="action-icon" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {contracts.length === 0 && (
                      <tr>
                        <td colSpan="7" className="empty-cell">
                          Aucun contrat pour le moment
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .agent-dashboard {
          display: flex;
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .dashboard-sidebar {
          width: 280px;
          background: white;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
          position: ;
          top: 70px;
          left: 0;
          bottom: 0;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, #d4af37 0%, #c4a52e 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f2b4d;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .user-info h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .user-info p {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .sidebar-nav {
          padding: 1rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          text-align: left;
          font-size: 0.875rem;
          color: #6b7280;
          transition: all 0.3s;
          position: relative;
        }

        .nav-link:hover {
          background: #f3f4f6;
          color: #d4af37;
        }

        .nav-link.active {
          background: #d4af37;
          color: #0f2b4d;
        }

        .nav-icon {
          width: 1rem !important;
          height: 1rem !important;
        }

        .badge {
          position: absolute;
          right: 1rem;
          background: #ef4444;
          color: white;
          font-size: 0.625rem;
          padding: 0.125rem 0.375rem;
          border-radius: 1rem;
        }

        .badge.warning {
          background: #f59e0b;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-add {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: #d4af37;
          color: #0f2b4d;
          text-decoration: none;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.3s;
          font-size: 0.875rem;
        }

        .add-icon {
          width: 1rem !important;
          height: 1rem !important;
        }

        .btn-add:hover {
          background: #c4a52e;
        }

        .dashboard-main {
          flex: 1;
          margin-left: 280px;
          padding: 1.5rem;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .content-header h1 {
          font-size: 1.5rem;
          color: #0f2b4d;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn-refresh {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .btn-notification {
          position: relative;
          background: white;
          border: none;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bell-icon {
          width: 1rem;
          height: 1rem;
          color: #6b7280;
        }

        .profile-icon {
          width: 1rem;
          height: 1rem;
          color: #6b7280;
        }

        .stats-grid {
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
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.properties {
          background: #e0f2fe;
          color: #0284c7;
        }

        .stat-icon.available {
          background: #dcfce7;
          color: #059669;
        }

        .stat-icon.requests {
          background: #fef3c7;
          color: #d97706;
        }

        .stat-icon.revenue {
          background: #e9d5ff;
          color: #7c3aed;
        }

        .stat-icon-svg {
          width: 1rem !important;
          height: 1rem !important;
        }

        .stat-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .stat-card p {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .revenue-note {
          font-size: 0.6rem;
          color: #9ca3af;
          display: block;
          margin-top: 0.25rem;
        }

        .content-section {
          background: white;
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .content-section.full-width {
          width: 100%;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          font-size: 1rem;
          color: #0f2b4d;
        }

        .view-all {
          background: none;
          border: none;
          color: #d4af37;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .btn-add-small {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.75rem;
          background: #d4af37;
          color: #0f2b4d;
          text-decoration: none;
          border-radius: 0.375rem;
          font-size: 0.75rem;
        }

        .add-icon-small {
          width: 0.875rem !important;
          height: 0.875rem !important;
        }

        .btn-refresh-small {
          padding: 0.25rem 0.5rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .properties-list,
        .requests-list,
        .contracts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .property-item,
        .request-item,
        .contract-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: background-color 0.3s;
        }

        .contract-item {
          cursor: pointer;
        }

        .contract-item:hover {
          background: #f3f4f6;
        }

        .property-info h4,
        .request-info h4,
        .contract-info h4 {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          color: #0f2b4d;
        }

        .property-location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #6b7280;
          font-size: 0.75rem;
        }

        .request-date,
        .contract-period {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #9ca3af;
          font-size: 0.625rem;
          margin-top: 0.25rem;
        }

        .contract-amount {
          font-size: 1rem;
          font-weight: 600;
          color: #d4af37;
        }

        .contract-amount span {
          font-size: 0.625rem;
          font-weight: normal;
          color: #6b7280;
        }

        .property-actions,
        .request-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 0.375rem;
          border-radius: 0.375rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          width: 1.75rem;
          height: 1.75rem;
        }

        .action-icon {
          width: 0.875rem !important;
          height: 0.875rem !important;
        }

        .action-btn:hover {
          background: #f3f4f6;
          color: #d4af37;
        }

        .action-btn.approve:hover {
          color: #059669;
        }

        .action-btn.reject:hover {
          color: #dc2626;
        }

        .action-btn.delete:hover {
          color: #dc2626;
        }

        .inline-icon {
          width: 0.75rem;
          height: 0.75rem;
          display: inline;
          vertical-align: middle;
          margin-right: 0.25rem;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 0.75rem;
          background: #f8f9fa;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
        }

        .data-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.75rem;
        }

        .actions-cell {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .text-muted {
          color: #9ca3af;
          font-size: 0.625rem;
        }

        .contract-link {
          color: #d4af37;
          text-decoration: none;
        }

        .contract-link:hover {
          text-decoration: underline;
        }

        .btn-create-contract {
          padding: 0.25rem 0.5rem;
          background: #d4af37;
          color: #0f2b4d;
          text-decoration: none;
          border-radius: 0.25rem;
          font-size: 0.625rem;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .empty-state a {
          color: #d4af37;
          text-decoration: none;
        }

        .empty-cell {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
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

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-sidebar {
            display: none;
          }
          .dashboard-main {
            margin-left: 0;
          }
          .property-item,
          .request-item,
          .contract-item {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }
          .property-actions,
          .request-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </>
  );
};

export default AgentDashboard;