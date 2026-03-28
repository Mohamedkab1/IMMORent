import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { toast } from 'react-toastify';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CurrencyEuroIcon, 
  BellIcon, 
  UserIcon, 
  CalendarIcon, 
  MagnifyingGlassIcon, 
  HeartIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  KeyIcon,
  TagIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const ClientDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ 
    activeRequests: 0, 
    activeContracts: 0, 
    totalPayments: 0, 
    favoriteProperties: 0 
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
      loadRequests(),
      loadContracts()
    ]);
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([
      loadRequests(),
      loadContracts()
    ]);
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const loadRequests = async () => {
    try {
      const response = await requestService.getMyRequests();
      if (response.success) {
        const data = response.data || [];
        setRequests(data);
        setStats(prev => ({ 
          ...prev, 
          activeRequests: data.filter(r => r.status === 'pending' || r.status === 'approved').length 
        }));
      }
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    }
  };

// Dans loadContracts, corrigez le calcul du totalPayments
  const loadContracts = async () => {
    try {
      const response = await contractService.getMyContracts();
      if (response.success) {
        const data = response.data.data || [];
        setContracts(data);
        
        // Calculer le total des paiements correctement
        const activeContracts = data.filter(c => c.status === 'active');
        const total = activeContracts.reduce((sum, c) => {
          // Assurez-vous que monthly_rent est un nombre
          const monthlyRent = parseFloat(c.monthly_rent) || 0;
          return sum + monthlyRent;
        }, 0);
        
        setStats(prev => ({ 
          ...prev, 
          activeContracts: activeContracts.length,
          totalPayments: total
        }));
      }
    } catch (error) {
      console.error('Erreur chargement contrats:', error);
    }
  };

  const cancelRequest = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette demande ?')) {
      return;
    }

    try {
      const response = await requestService.cancel(id);
      if (response.success) {
        toast.success('Demande annulée avec succès');
        loadRequests();
      } else {
        toast.error(response.message || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'annulation de la demande');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: '#fef3c7', color: '#d97706', text: 'En attente', icon: ClockIcon },
      approved: { bg: '#dcfce7', color: '#059669', text: 'Approuvée', icon: CheckCircleIcon },
      rejected: { bg: '#fee2e2', color: '#dc2626', text: 'Refusée', icon: XCircleIcon },
      cancelled: { bg: '#f3f4f6', color: '#6b7280', text: 'Annulée', icon: XCircleIcon },
      active: { bg: '#dcfce7', color: '#059669', text: 'Actif', icon: CheckCircleIcon },
      terminated: { bg: '#fee2e2', color: '#dc2626', text: 'Résilié', icon: XCircleIcon },
      expired: { bg: '#f3f4f6', color: '#6b7280', text: 'Expiré', icon: ClockIcon },
      completed: { bg: '#dbeafe', color: '#2563eb', text: 'Terminé', icon: CheckCircleIcon }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.5rem',
        background: config.bg,
        color: config.color,
        borderRadius: '1rem',
        fontSize: '0.625rem',
        fontWeight: '500'
      }}>
        <Icon style={{ width: '0.75rem', height: '0.75rem' }} />
        {config.text}
      </span>
    );
  };

  const getRequestTypeBadge = (type) => {
    if (type === 'rent') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem 0.5rem',
          background: '#dcfce7',
          color: '#059669',
          borderRadius: '1rem',
          fontSize: '0.625rem',
          fontWeight: '500'
        }}>
          <KeyIcon style={{ width: '0.75rem', height: '0.75rem' }} />
          Location
        </span>
      );
    } else {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem 0.5rem',
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: '1rem',
          fontSize: '0.625rem',
          fontWeight: '500'
        }}>
          <TagIcon style={{ width: '0.75rem', height: '0.75rem' }} />
          Achat
        </span>
      );
    }
  };

  const getContractTypeBadge = (type) => {
    if (type === 'rent') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem 0.5rem',
          background: '#dcfce7',
          color: '#059669',
          borderRadius: '1rem',
          fontSize: '0.625rem',
          fontWeight: '500'
        }}>
          <KeyIcon style={{ width: '0.75rem', height: '0.75rem' }} />
          Location
        </span>
      );
    } else {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem 0.5rem',
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: '1rem',
          fontSize: '0.625rem',
          fontWeight: '500'
        }}>
          <TagIcon style={{ width: '0.75rem', height: '0.75rem' }} />
          Vente
        </span>
      );
    }
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
      <div className="client-dashboard">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="user-info">
              <div className="user-avatar">{user?.name?.charAt(0)}</div>
              <div>
                <h3>{user?.name}</h3>
                <p>Client</p>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <HomeIcon className="nav-icon" /> Tableau de bord
            </button>
            <button 
              className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <DocumentTextIcon className="nav-icon" /> Mes demandes
              {stats.activeRequests > 0 && <span className="badge">{stats.activeRequests}</span>}
            </button>
            <button 
              className={`nav-link ${activeTab === 'contracts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contracts')}
            >
              <DocumentTextIcon className="nav-icon" /> Mes contrats
            </button>
            <button 
              className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <UserIcon className="nav-icon" /> Mon profil
            </button>
          </nav>
          <div className="sidebar-footer">
            <Link to="/properties" className="btn-search">
              <MagnifyingGlassIcon className="btn-search-icon" /> Rechercher un bien
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <div className="content-header">
            <h1>Tableau de bord client</h1>
            <div className="header-actions">
              <button onClick={refreshData} className="btn-refresh" disabled={refreshing}>
                <ArrowPathIcon className={`refresh-icon ${refreshing ? 'spin' : ''}`} />
                {refreshing ? 'Actualisation...' : 'Actualiser'}
              </button>
              <button className="btn-notification">
                <BellIcon className="notification-icon" />
                <span className="badge">{stats.activeRequests}</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {/* Stats Cards - Version corrigée */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon requests">
                <DocumentTextIcon className="stat-icon-svg" />
              </div>
              <div>
                <h3>{stats.activeRequests}</h3>
                <p>Demandes en cours</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon contracts">
                <DocumentTextIcon className="stat-icon-svg" />
              </div>
              <div>
                <h3>{stats.activeContracts}</h3>
                <p>Contrats actifs</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon payments">
                <CurrencyEuroIcon className="stat-icon-svg" />
              </div>
              <div>
                {/* Correction de l'affichage du total */}
                <h3>{stats.totalPayments.toLocaleString('fr-FR')} DH</h3>
                <p>Total mensuel</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon favorites">
                <HeartIcon className="stat-icon-svg" />
              </div>
              <div>
                <h3>{stats.favoriteProperties}</h3>
                <p>Biens favoris</p>
              </div>
            </div>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <div className="content-section">
                <div className="section-header">
                  <h2>Mes demandes récentes</h2>
                  <button className="view-all" onClick={() => setActiveTab('requests')}>
                    Voir tout ({stats.activeRequests})
                  </button>
                </div>
                <div className="requests-list">
                  {requests.slice(0, 3).map(request => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <h3>{request.property?.title}</h3>
                        <div className="request-badges">
                          {getRequestTypeBadge(request.type)}
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                      {request.type === 'rent' && (
                        <p className="request-date">
                          <CalendarIcon className="inline-icon" />
                          Du {new Date(request.start_date).toLocaleDateString()} au {new Date(request.end_date).toLocaleDateString()}
                        </p>
                      )}
                      <p className="request-price">
                        <CurrencyEuroIcon className="inline-icon" />
                        {request.property?.price.toLocaleString()}DH{request.type === 'rent' ? '/mois' : ''}
                      </p>
                      {request.status === 'pending' && (
                        <div className="request-actions">
                          <button onClick={() => cancelRequest(request.id)} className="btn-cancel">
                            Annuler la demande
                          </button>
                        </div>
                      )}
                      {request.status === 'rejected' && request.rejection_reason && (
                        <p className="rejection-reason">
                          Motif: {request.rejection_reason}
                        </p>
                      )}
                    </div>
                  ))}
                  {requests.filter(r => r.status === 'pending' || r.status === 'approved').length === 0 && (
                    <div className="empty-state">
                      <p>Aucune demande en cours</p>
                      <Link to="/properties">Parcourir les biens</Link>
                    </div>
                  )}
                </div>
              </div>

              {contracts.filter(c => c.status === 'active' || c.status === 'completed').length > 0 && (
                <div className="content-section">
                  <div className="section-header">
                    <h2>Contrats récents</h2>
                    <button className="view-all" onClick={() => setActiveTab('contracts')}>
                      Voir tout
                    </button>
                  </div>
                  <div className="contracts-list">
                    {contracts.filter(c => c.status === 'active' || c.status === 'completed').slice(0, 1).map(contract => (
                      <Link to={`/contracts/${contract.id}`} key={contract.id} className="contract-card">
                        <div className="contract-header">
                          <h3>{contract.property?.title}</h3>
                          {getContractTypeBadge(contract.contract_type)}
                        </div>
                        {contract.contract_type === 'rent' ? (
                          <>
                            <div className="contract-dates">
                              <span>Du {new Date(contract.start_date).toLocaleDateString()}</span>
                              <span>au {new Date(contract.end_date).toLocaleDateString()}</span>
                            </div>
                            <div className="contract-price">
                              <span>Loyer mensuel:</span>
                              <strong>{contract.monthly_rent}DH</strong>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="contract-price">
                              <span>Prix de vente:</span>
                              <strong>{contract.sale_price}DH</strong>
                            </div>
                            <div className="contract-date">
                              <span>Date de vente: {new Date(contract.sale_date).toLocaleDateString()}</span>
                            </div>
                          </>
                        )}
                        {getStatusBadge(contract.status)}
                        <button className="btn-view-contract">Voir le contrat</button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="content-section full-width">
              <div className="section-header">
                <h2>Toutes mes demandes</h2>
                <button onClick={refreshData} className="btn-refresh-small">
                  <ArrowPathIcon className={`refresh-small-icon ${refreshing ? 'spin' : ''}`} />
                  Actualiser
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Bien</th>
                      <th>Type</th>
                      <th>Période</th>
                      <th>Date demande</th>
                      <th>Prix</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(request => (
                      <tr key={request.id}>
                        <td>
                          <strong>{request.property?.title}</strong>
                          <br/><span className="text-muted">{request.property?.city}</span>
                        </td>
                        <td>{getRequestTypeBadge(request.type)}</td>
                        <td>
                          {request.type === 'rent' ? (
                            `${new Date(request.start_date).toLocaleDateString()} - ${new Date(request.end_date).toLocaleDateString()}`
                          ) : (
                            'Demande d\'achat'
                          )}
                        </td>
                        <td>{new Date(request.created_at).toLocaleDateString()}</td>
                        <td>{request.property?.price.toLocaleString()}DH{request.type === 'rent' ? '/mois' : ''}</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td className="actions-cell">
                          {request.status === 'pending' && (
                            <button onClick={() => cancelRequest(request.id)} className="btn-cancel-small">
                              Annuler
                            </button>
                          )}
                          {request.status === 'approved' && (
                            <span className="text-success">En attente de contrat</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan="7" className="empty-cell">
                          Aucune demande effectuée
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
                <h2>Mes contrats</h2>
                <button onClick={refreshData} className="btn-refresh-small">
                  <ArrowPathIcon className={`refresh-small-icon ${refreshing ? 'spin' : ''}`} />
                  Actualiser
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>N° Contrat</th>
                      <th>Bien</th>
                      <th>Type</th>
                      <th>Période/Date</th>
                      <th>Montant</th>
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
                        <td>{contract.property?.title}</td>
                        <td>{getContractTypeBadge(contract.contract_type)}</td>
                        <td>
                          {contract.contract_type === 'rent' ? (
                            `${new Date(contract.start_date).toLocaleDateString()} - ${new Date(contract.end_date).toLocaleDateString()}`
                          ) : (
                            `Vente le ${new Date(contract.sale_date).toLocaleDateString()}`
                          )}
                        </td>
                        <td>
                          {contract.contract_type === 'rent' 
                            ? `${contract.monthly_rent}DH / mois`
                            : `${contract.sale_price}DH`
                          }
                        </td>
                        <td>{getStatusBadge(contract.status)}</td>
                        <td className="actions-cell">
                          <Link to={`/contracts/${contract.id}`} className="btn-view" title="Voir">
                            Voir
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
        .client-dashboard {
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
          width: 1rem;
          height: 1rem;
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

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-search {
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
          font-size: 0.875rem;
        }

        .btn-search-icon {
          width: 1rem;
          height: 1rem;
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
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .refresh-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        .btn-notification {
          position: relative;
          background: white;
          border: none;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
        }

        .notification-icon {
          width: 1rem;
          height: 1rem;
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
          background: #f3f4f6;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
        }

        .stat-icon-svg {
          width: 1rem;
          height: 1rem;
        }

        .stat-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .stat-card p {
          font-size: 0.75rem;
          color: #6b7280;
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

        .btn-refresh-small {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.75rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .refresh-small-icon {
          width: 0.75rem;
          height: 0.75rem;
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .request-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .request-header h3 {
          font-size: 1rem;
          color: #0f2b4d;
          margin: 0;
        }

        .request-badges {
          display: flex;
          gap: 0.5rem;
        }

        .request-date {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #6b7280;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .request-price {
          font-size: 0.875rem;
          font-weight: 600;
          color: #d4af37;
          margin-bottom: 0.75rem;
        }

        .btn-cancel {
          padding: 0.375rem 0.75rem;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .rejection-reason {
          color: #dc2626;
          font-size: 0.625rem;
          margin-top: 0.5rem;
        }

        .contracts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contract-card {
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%);
          padding: 1rem;
          border-radius: 0.5rem;
          color: white;
          text-decoration: none;
          display: block;
        }

        .contract-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .contract-header h3 {
          font-size: 1rem;
          margin: 0;
          color: white;
        }

        .contract-dates {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .contract-price {
          margin-bottom: 0.5rem;
          font-size: 0.75rem;
        }

        .contract-price strong {
          font-size: 1rem;
          margin-left: 0.5rem;
        }

        .contract-date {
          margin-bottom: 0.5rem;
          font-size: 0.75rem;
        }

        .btn-view-contract {
          display: inline-block;
          margin-top: 0.75rem;
          padding: 0.375rem 0.75rem;
          background: white;
          color: #0f2b4d;
          text-decoration: none;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
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

        .contract-link {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.75rem;
        }

        .btn-view {
          padding: 0.25rem 0.5rem;
          background: #e0f2fe;
          color: #0284c7;
          text-decoration: none;
          border-radius: 0.25rem;
          font-size: 0.625rem;
        }

        .btn-cancel-small {
          padding: 0.25rem 0.5rem;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          font-size: 0.625rem;
        }

        .text-success {
          color: #059669;
          font-size: 0.625rem;
        }

        .text-muted {
          color: #9ca3af;
          font-size: 0.625rem;
        }

        .inline-icon {
          width: 0.75rem;
          height: 0.75rem;
          display: inline;
          vertical-align: middle;
          margin-right: 0.25rem;
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

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
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
          .request-header {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default ClientDashboard;