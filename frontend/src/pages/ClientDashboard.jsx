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
  ArrowPathIcon
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

  // Vérifier si un paramètre refresh est présent dans l'URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const shouldRefresh = queryParams.get('refresh');
    
    loadAllData();
    
    if (shouldRefresh === 'true') {
      setTimeout(() => {
        loadAllData();
      }, 500);
    }
  }, [location.search]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadRequests(),
      loadContracts(),
      loadStats()
    ]);
    setLoading(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([
      loadRequests(),
      loadContracts(),
      loadStats()
    ]);
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const loadRequests = async () => {
    try {
      const response = await requestService.getMyRequests();
      if (response.success) {
        const requestsData = response.data.data || [];
        setRequests(requestsData);
        setStats(prev => ({
          ...prev,
          activeRequests: requestsData.filter(r => r.status === 'pending' || r.status === 'approved').length
        }));
      }
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    }
  };

  const loadContracts = async () => {
    try {
      const response = await contractService.getMyContracts();
      if (response.success) {
        const contractsData = response.data.data || [];
        setContracts(contractsData);
        setStats(prev => ({
          ...prev,
          activeContracts: contractsData.filter(c => c.status === 'active').length,
          totalPayments: contractsData
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

  const cancelRequest = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette demande ?')) {
      return;
    }

    try {
      const response = await requestService.cancel(id);
      if (response.success) {
        toast.success('Demande annulée avec succès');
        loadRequests(); // Recharger les demandes après annulation
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
      pending: { color: '#f59e0b', text: 'En attente', icon: ClockIcon },
      approved: { color: '#10b981', text: 'Approuvée', icon: CheckCircleIcon },
      rejected: { color: '#ef4444', text: 'Refusée', icon: XCircleIcon },
      cancelled: { color: '#9ca3af', text: 'Annulée', icon: XCircleIcon },
      active: { color: '#10b981', text: 'Actif', icon: CheckCircleIcon },
      terminated: { color: '#ef4444', text: 'Résilié', icon: XCircleIcon },
      expired: { color: '#6b7280', text: 'Expiré', icon: ClockIcon }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
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
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de votre espace...</p>
        <style>{`
          .loading-container {
            min-height: calc(100vh - 70px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="client-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)}
            </div>
            <div className="user-details">
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
            <HomeIcon className="nav-icon" />
            <span>Tableau de bord</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <DocumentTextIcon className="nav-icon" />
            <span>Mes demandes</span>
            {stats.activeRequests > 0 && (
              <span className="badge">{stats.activeRequests}</span>
            )}
          </button>
          <button 
            className={`nav-link ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contracts')}
          >
            <DocumentTextIcon className="nav-icon" />
            <span>Mes contrats</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon className="nav-icon" />
            <span>Mon profil</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <Link to="/properties" className="btn-search-properties">
            <MagnifyingGlassIcon className="h-5 w-5" />
            Rechercher un bien
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="content-header">
          <h1>Tableau de bord client</h1>
          <div className="header-actions">
            <button 
              onClick={refreshData} 
              className="btn-refresh"
              disabled={refreshing}
              title="Actualiser les données"
            >
              <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="btn-notification">
              <BellIcon className="h-6 w-6" />
              <span className="notification-badge">{stats.activeRequests}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon requests">
              <DocumentTextIcon className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{stats.activeRequests}</h3>
              <p>Demandes en cours</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon contracts">
              <DocumentTextIcon className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{stats.activeContracts}</h3>
              <p>Contrats actifs</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon payments">
              <CurrencyEuroIcon className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalPayments}€</h3>
              <p>Total payé</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon favorites">
              <HeartIcon className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{stats.favoriteProperties}</h3>
              <p>Biens favoris</p>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="tab-content">
          {activeTab === 'dashboard' && (
            <>
              {/* Active Requests */}
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
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="request-date">
                        <CalendarIcon className="h-4 w-4" />
                        Du {new Date(request.start_date).toLocaleDateString('fr-FR')} au {new Date(request.end_date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="request-price">{request.property?.price}€ / mois</p>
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
                      <Link to="/properties" className="btn-browse-properties">
                        Parcourir les biens
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Contract */}
              {contracts.filter(c => c.status === 'active').length > 0 && (
                <div className="content-section">
                  <div className="section-header">
                    <h2>Contrat actif</h2>
                    <button className="view-all" onClick={() => setActiveTab('contracts')}>
                      Voir tout
                    </button>
                  </div>
                  <div className="contract-card">
                    {contracts.filter(c => c.status === 'active').slice(0, 1).map(contract => (
                      <div key={contract.id}>
                        <h3>{contract.property?.title}</h3>
                        <div className="contract-dates">
                          <span>Du {new Date(contract.start_date).toLocaleDateString('fr-FR')}</span>
                          <span>au {new Date(contract.end_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="contract-price">
                          <span>Loyer mensuel:</span>
                          <strong>{contract.monthly_rent}€</strong>
                        </div>
                        {getStatusBadge(contract.status)}
                        <Link to={`/contracts/${contract.id}`} className="btn-view-contract">
                          Voir le contrat
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'requests' && (
            <div className="content-section full-width">
              <div className="section-header">
                <h2>Toutes mes demandes</h2>
                <button onClick={refreshData} className="btn-refresh-small" disabled={refreshing}>
                  <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>
              <div className="requests-table">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Bien</th>
                      <th>Période</th>
                      <th>Date de demande</th>
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
                          <p className="text-sm text-gray-500">{request.property?.city}</p>
                        </td>
                        <td>
                          {new Date(request.start_date).toLocaleDateString('fr-FR')} - {new Date(request.end_date).toLocaleDateString('fr-FR')}
                        </td>
                        <td>{new Date(request.created_at).toLocaleDateString('fr-FR')}</td>
                        <td>{request.property?.price}€</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td>
                          {request.status === 'pending' && (
                            <button onClick={() => cancelRequest(request.id)} className="btn-cancel-small">
                              Annuler
                            </button>
                          )}
                          {request.status === 'approved' && (
                            <span className="text-green-600">En attente de contrat</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                          Aucune demande effectuée
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="content-section full-width">
              <div className="section-header">
                <h2>Mes contrats</h2>
                <button onClick={refreshData} className="btn-refresh-small" disabled={refreshing}>
                  <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>
              <div className="contracts-table">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>N° Contrat</th>
                      <th>Bien</th>
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
                        <td>{contract.property?.title}</td>
                        <td>
                          {new Date(contract.start_date).toLocaleDateString('fr-FR')} - {new Date(contract.end_date).toLocaleDateString('fr-FR')}
                        </td>
                        <td>{contract.monthly_rent}€ / mois</td>
                        <td>{getStatusBadge(contract.status)}</td>
                        <td>
                          <Link to={`/contracts/${contract.id}`} className="btn-view">
                            Voir
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {contracts.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
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

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-search-properties {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 500;
          transition: opacity 0.3s;
        }

        .btn-search-properties:hover {
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
          align-items: center;
        }

        .btn-refresh {
          background: white;
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          color: #6b7280;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }

        .btn-refresh:hover:not(:disabled) {
          background: #f3f4f6;
          color: #2563eb;
        }

        .btn-refresh:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .btn-notification {
          position: relative;
          background: white;
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          color: #6b7280;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

        .stat-icon.requests {
          background: #fef3c7;
          color: #d97706;
        }

        .stat-icon.contracts {
          background: #dcfce7;
          color: #059669;
        }

        .stat-icon.payments {
          background: #e0f2fe;
          color: #0284c7;
        }

        .stat-icon.favorites {
          background: #fce7f3;
          color: #db2777;
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

        .btn-refresh-small {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          background: #f3f4f6;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
          color: #6b7280;
        }

        .btn-refresh-small:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .request-card {
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          padding: 15px;
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .request-header h3 {
          color: #1f2937;
          font-size: 16px;
        }

        .request-date {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .request-price {
          font-size: 18px;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 15px;
        }

        .rejection-reason {
          color: #dc2626;
          font-size: 12px;
          margin-top: 10px;
        }

        .btn-cancel {
          padding: 8px 16px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-cancel-small {
          padding: 4px 8px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-browse-properties {
          display: inline-block;
          margin-top: 15px;
          padding: 10px 20px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }

        .contract-card {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          padding: 20px;
          border-radius: 10px;
          color: white;
        }

        .contract-card h3 {
          font-size: 18px;
          margin-bottom: 15px;
        }

        .contract-dates {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          font-size: 14px;
          opacity: 0.9;
        }

        .contract-price {
          margin-bottom: 15px;
        }

        .btn-view-contract {
          display: inline-block;
          margin-top: 15px;
          padding: 10px 20px;
          background: white;
          color: #2563eb;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #6b7280;
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

        .contract-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .contract-link:hover {
          text-decoration: underline;
        }

        .btn-view {
          padding: 4px 12px;
          background: #e0f2fe;
          color: #0284c7;
          text-decoration: none;
          border-radius: 5px;
          font-size: 12px;
        }

        .text-sm {
          font-size: 12px;
        }

        .text-gray-500 {
          color: #6b7280;
        }

        .text-green-600 {
          color: #059669;
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

          .data-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;