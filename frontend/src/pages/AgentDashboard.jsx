import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  ClockIcon,
  DocumentDuplicateIcon  // Remplacer FileTextIcon par DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    pendingRequests: 0,
    activeContracts: 0,
    monthlyRevenue: 0
  });

  // Charger les données au montage du composant
  useEffect(() => {
    // Vérifier si un paramètre refresh est présent dans l'URL
    const queryParams = new URLSearchParams(location.search);
    const shouldRefresh = queryParams.get('refresh');
    
    loadAllData();
    
    // Si refresh=true, recharger les données après 1 seconde
    if (shouldRefresh === 'true') {
      setTimeout(() => {
        loadAllData();
      }, 1000);
    }
  }, [location.search]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadProperties(),
      loadRequests(),
      loadContracts(),
      loadStats()
    ]);
    setLoading(false);
  };

  const loadProperties = async () => {
    try {
      const response = await propertyService.getMyProperties();
      if (response.success) {
        const propertiesData = response.data.data || [];
        setProperties(propertiesData);
        setStats(prev => ({
          ...prev,
          totalProperties: propertiesData.length,
          availableProperties: propertiesData.filter(p => p.status === 'available').length
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
      console.log('Demandes reçues:', response);
      if (response.success) {
        const requestsData = response.data || [];
        setRequests(requestsData);
        setStats(prev => ({
          ...prev,
          pendingRequests: requestsData.filter(r => r.status === 'pending').length
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
        const contractsData = response.data.data || [];
        setContracts(contractsData);
        setStats(prev => ({
          ...prev,
          activeContracts: contractsData.filter(c => c.status === 'active').length,
          monthlyRevenue: contractsData
            .filter(c => c.status === 'active')
            .reduce((sum, c) => sum + (c.monthly_rent || 0), 0)
        }));
      }
    } catch (error) {
      console.error('Erreur chargement contrats:', error);
    }
  };

  const loadStats = async () => {
    // Les stats sont déjà mises à jour dans les autres fonctions
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

  const handleProcessRequest = async (requestId, status, rejectionReason = null) => {
    const actionText = status === 'approved' ? 'approuver' : 'refuser';
    if (!window.confirm(`Êtes-vous sûr de vouloir ${actionText} cette demande ?`)) {
      return;
    }

    try {
      const response = await requestService.process(requestId, {
        status,
        rejection_reason: rejectionReason
      });
      
      if (response.success) {
        toast.success(`Demande ${status === 'approved' ? 'approuvée' : 'refusée'} avec succès`);
        
        if (status === 'approved') {
          // Rediriger vers la création de contrat
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
    const statusConfig = {
      available: { color: '#10b981', text: 'Disponible' },
      rented: { color: '#6b7280', text: 'Loué' },
      reserved: { color: '#f59e0b', text: 'Réservé' },
      pending: { color: '#f59e0b', text: 'En attente' },
      approved: { color: '#10b981', text: 'Approuvée' },
      rejected: { color: '#ef4444', text: 'Refusée' },
      cancelled: { color: '#9ca3af', text: 'Annulée' },
      active: { color: '#10b981', text: 'Actif' },
      terminated: { color: '#ef4444', text: 'Résilié' },
      expired: { color: '#6b7280', text: 'Expiré' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        background: config.color + '20',
        color: config.color,
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        {config.text}
      </span>
    );
  };

  if (loading && properties.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="spinner"></div>
        <style>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)}
            </div>
            <div className="user-details">
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
            <BuildingOfficeIcon className="nav-icon" />
            <span>Tableau de bord</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <HomeIcon className="nav-icon" />
            <span>Mes biens</span>
            <span className="badge">{stats.totalProperties}</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <DocumentTextIcon className="nav-icon" />
            <span>Demandes</span>
            {stats.pendingRequests > 0 && (
              <span className="badge warning">{stats.pendingRequests}</span>
            )}
          </button>
          <button 
            className={`nav-link ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contracts')}
          >
            <DocumentDuplicateIcon className="nav-icon" />
            <span>Contrats</span>
            <span className="badge">{stats.activeContracts}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <Link to="/properties/new" className="btn-add-property">
            <PlusIcon className="h-5 w-5" />
            Ajouter un bien
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="content-header">
          <h1>Tableau de bord agent</h1>
          <div className="header-actions">
            <button className="btn-notification">
              <BellIcon className="h-6 w-6" />
              <span className="notification-badge">{stats.pendingRequests}</span>
            </button>
            <Link to="/profile" className="btn-profile">
              <UserIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon properties">
              <BuildingOfficeIcon className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalProperties}</h3>
              <p>Biens gérés</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon available">
              <HomeIcon className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{stats.availableProperties}</h3>
              <p>Biens disponibles</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon requests">
              <DocumentTextIcon className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingRequests}</h3>
              <p>Demandes en attente</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <CurrencyEuroIcon className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{stats.monthlyRevenue.toLocaleString()}€</h3>
              <p>Revenus mensuels</p>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="tab-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Recent Properties */}
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
                          <MapPinIcon className="h-4 w-4" />
                          {property.city} • {property.price}€/mois
                        </p>
                      </div>
                      {getStatusBadge(property.status)}
                      <div className="property-actions">
                        <Link to={`/properties/${property.id}`} className="btn-view" title="Voir">
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link to={`/properties/edit/${property.id}`} className="btn-edit" title="Modifier">
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDeleteProperty(property.id)} className="btn-delete" title="Supprimer">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {properties.length === 0 && (
                    <div className="empty-state">
                      <p>Aucun bien ajouté pour le moment</p>
                      <Link to="/properties/new" className="btn-add-first">
                        Ajouter votre premier bien
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Pending Requests */}
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
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(request.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="request-actions">
                        <button 
                          onClick={() => handleProcessRequest(request.id, 'approved')} 
                          className="btn-approve" 
                          title="Approuver"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleProcessRequest(request.id, 'rejected')} 
                          className="btn-reject" 
                          title="Refuser"
                        >
                          <XCircleIcon className="h-5 w-5" />
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

              {/* Recent Contracts */}
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
                        <p className="contract-period">
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(contract.start_date).toLocaleDateString('fr-FR')} - {new Date(contract.end_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="contract-amount">
                        {contract.monthly_rent}€
                        <span>/mois</span>
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
                <Link to="/properties/new" className="btn-add">
                  <PlusIcon className="h-5 w-5" />
                  Ajouter un bien
                </Link>
              </div>
              <div className="properties-table">
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
                        <td>{property.city}</td>
                        <td>{property.price}€</td>
                        <td>{property.surface} m²</td>
                        <td>{getStatusBadge(property.status)}</td>
                        <td className="actions-cell">
                          <Link to={`/properties/${property.id}`} className="action-btn" title="Voir">
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <Link to={`/properties/edit/${property.id}`} className="action-btn" title="Modifier">
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <button onClick={() => handleDeleteProperty(property.id)} className="action-btn delete" title="Supprimer">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                          <p>Aucun bien ajouté pour le moment</p>
                          <Link to="/properties/new" style={{ marginTop: '10px', display: 'inline-block' }}>
                            Ajouter votre premier bien
                          </Link>
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
              </div>
              <div className="requests-table">
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
                          <p className="text-sm text-gray-500">{request.user?.email}</p>
                        </td>
                        <td>{request.property?.title || 'Bien'}</td>
                        <td>
                          <span className="date-range">
                            {new Date(request.start_date).toLocaleDateString('fr-FR')} - {new Date(request.end_date).toLocaleDateString('fr-FR')}
                          </span>
                        </td>
                        <td>{new Date(request.created_at).toLocaleDateString('fr-FR')}</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td className="actions-cell">
                          {request.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleProcessRequest(request.id, 'approved')} 
                                className="btn-approve-small"
                              >
                                Approuver
                              </button>
                              <button 
                                onClick={() => handleProcessRequest(request.id, 'rejected')} 
                                className="btn-reject-small"
                              >
                                Refuser
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
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
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
              </div>
              <div className="contracts-table">
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
                          <span className="date-range">
                            {new Date(contract.start_date).toLocaleDateString('fr-FR')} - {new Date(contract.end_date).toLocaleDateString('fr-FR')}
                          </span>
                        </td>
                        <td>{contract.monthly_rent}€ / mois</td>
                        <td>{getStatusBadge(contract.status)}</td>
                        <td className="actions-cell">
                          <Link to={`/contracts/${contract.id}`} className="action-btn" title="Voir">
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {contracts.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
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
          background: #f8fafc;
        }

        .dashboard-sidebar {
          width: 280px;
          background: white;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
          position: fixed;
          top: 70px;
          left: 0;
          bottom: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 30px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          font-weight: 600;
        }

        .user-details h3 {
          color: #1f2937;
          font-size: 16px;
          margin-bottom: 5px;
        }

        .user-details p {
          color: #6b7280;
          font-size: 14px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 15px;
          color: #6b7280;
          border: none;
          background: none;
          border-radius: 5px;
          transition: all 0.3s;
          margin-bottom: 5px;
          cursor: pointer;
          font-size: 14px;
          position: relative;
        }

        .nav-link:hover {
          background: #f3f4f6;
          color: #2563eb;
        }

        .nav-link.active {
          background: #2563eb;
          color: white;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
        }

        .badge {
          position: absolute;
          right: 15px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .badge.warning {
          background: #f59e0b;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-add-property {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 500;
          transition: opacity 0.3s;
        }

        .btn-add-property:hover {
          opacity: 0.9;
        }

        .dashboard-main {
          flex: 1;
          margin-left: 280px;
          padding: 30px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .content-header h1 {
          color: #1f2937;
          font-size: 24px;
        }

        .header-actions {
          display: flex;
          gap: 15px;
        }

        .btn-notification,
        .btn-profile {
          background: white;
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          color: #6b7280;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 10px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
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

        .stat-info h3 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .stat-info p {
          color: #6b7280;
          font-size: 14px;
        }

        .tab-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .content-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .content-section.full-width {
          width: 100%;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          color: #1f2937;
          font-size: 18px;
        }

        .view-all {
          background: none;
          border: none;
          color: #2563eb;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 15px;
          background: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 14px;
        }

        .properties-list,
        .requests-list,
        .contracts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .property-item,
        .request-item,
        .contract-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background: #f9fafb;
          border-radius: 5px;
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
          color: #1f2937;
          margin-bottom: 5px;
        }

        .property-location {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #6b7280;
          font-size: 14px;
        }

        .request-date,
        .contract-period {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #9ca3af;
          font-size: 12px;
          margin-top: 5px;
        }

        .contract-amount {
          font-size: 18px;
          font-weight: 600;
          color: #2563eb;
        }

        .contract-amount span {
          font-size: 12px;
          font-weight: normal;
          color: #6b7280;
        }

        .property-actions,
        .request-actions {
          display: flex;
          gap: 10px;
        }

        .btn-view,
        .btn-edit,
        .btn-delete,
        .btn-approve,
        .btn-reject {
          padding: 8px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: opacity 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-view {
          background: #e0f2fe;
          color: #0284c7;
        }

        .btn-edit {
          background: #fef3c7;
          color: #d97706;
        }

        .btn-delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-approve {
          background: #dcfce7;
          color: #059669;
        }

        .btn-reject {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-approve-small,
        .btn-reject-small,
        .btn-create-contract {
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
          margin-right: 5px;
          text-decoration: none;
          display: inline-block;
        }

        .btn-approve-small {
          background: #dcfce7;
          color: #059669;
        }

        .btn-reject-small {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-create-contract {
          background: #2563eb;
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        .btn-add-first {
          display: inline-block;
          margin-top: 15px;
          padding: 10px 20px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          text-align: left;
          padding: 12px;
          background: #f9fafb;
          color: #6b7280;
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid #e5e7eb;
        }

        .data-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          color: #1f2937;
        }

        .data-table tr:hover {
          background: #f9fafb;
        }

        .actions-cell {
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .action-btn {
          padding: 5px;
          border: none;
          background: none;
          cursor: pointer;
          color: #6b7280;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .action-btn:hover {
          color: #2563eb;
        }

        .action-btn.delete:hover {
          color: #dc2626;
        }

        .contract-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .contract-link:hover {
          text-decoration: underline;
        }

        .date-range {
          font-size: 12px;
          white-space: nowrap;
        }

        .text-sm {
          font-size: 12px;
        }

        .text-gray-500 {
          color: #6b7280;
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

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .property-item,
          .request-item,
          .contract-item {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .property-actions,
          .request-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .data-table {
            display: block;
            overflow-x: auto;
          }

          .actions-cell {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentDashboard;