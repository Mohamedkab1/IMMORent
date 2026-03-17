import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  BellIcon,
  UserIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Données simulées
  const stats = {
    totalProperties: 12,
    availableProperties: 8,
    pendingRequests: 5,
    activeContracts: 7,
    monthlyRevenue: 12500
  };

  const properties = [
    { id: 1, title: 'Appartement Lyon Centre', price: 850, status: 'available', city: 'Lyon', requests: 3 },
    { id: 2, title: 'Maison Caluire', price: 1500, status: 'available', city: 'Caluire', requests: 5 },
    { id: 3, title: 'Studio Villeurbanne', price: 450, status: 'rented', city: 'Villeurbanne', requests: 0 },
    { id: 4, title: 'Local commercial Part-Dieu', price: 2000, status: 'available', city: 'Lyon', requests: 2 },
  ];

  const pendingRequests = [
    { id: 1, client: 'Pierre Durand', property: 'Appartement Lyon Centre', date: '2024-01-15', status: 'pending' },
    { id: 2, client: 'Sophie Bernard', property: 'Maison Caluire', date: '2024-01-14', status: 'pending' },
    { id: 3, client: 'Thomas Petit', property: 'Studio Villeurbanne', date: '2024-01-13', status: 'pending' },
    { id: 4, client: 'Marie Lambert', property: 'Local commercial Part-Dieu', date: '2024-01-12', status: 'pending' },
    { id: 5, client: 'Lucas Martin', property: 'Appartement Lyon Centre', date: '2024-01-11', status: 'pending' },
  ];

  const recentContracts = [
    { id: 1, tenant: 'Pierre Durand', property: 'Appartement Lyon Centre', date: '2024-01-10', amount: 850 },
    { id: 2, tenant: 'Sophie Bernard', property: 'Maison Caluire', date: '2024-01-08', amount: 1500 },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { color: '#10b981', text: 'Disponible' },
      rented: { color: '#6b7280', text: 'Loué' },
      pending: { color: '#f59e0b', text: 'En attente' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 10px',
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
            <BuildingOfficeIcon className="nav-icon" />
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
            <DocumentTextIcon className="nav-icon" />
            <span>Contrats</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <CurrencyEuroIcon className="nav-icon" />
            <span>Paiements</span>
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
              <BuildingOfficeIcon className="h-8 w-8" />
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
              <h3>{stats.monthlyRevenue}€</h3>
              <p>Revenus mensuels</p>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="tab-content">
          {activeTab === 'dashboard' && (
            <>
              {/* Pending Requests */}
              <div className="content-section">
                <div className="section-header">
                  <h2>Demandes en attente</h2>
                  <button className="view-all" onClick={() => setActiveTab('requests')}>
                    Voir tout ({stats.pendingRequests})
                  </button>
                </div>
                <div className="requests-list">
                  {pendingRequests.slice(0, 3).map(request => (
                    <div key={request.id} className="request-item">
                      <div className="request-info">
                        <h4>{request.client}</h4>
                        <p>{request.property}</p>
                        <span className="request-date">
                          {new Date(request.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="request-actions">
                        <button className="btn-approve" title="Approuver">
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button className="btn-reject" title="Refuser">
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                        <button className="btn-view" title="Voir détails">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Properties */}
              <div className="content-section">
                <div className="section-header">
                  <h2>Biens récents</h2>
                  <button className="view-all" onClick={() => setActiveTab('properties')}>
                    Voir tout
                  </button>
                </div>
                <div className="properties-list">
                  {properties.slice(0, 3).map(property => (
                    <div key={property.id} className="property-item">
                      <div className="property-info">
                        <h4>{property.title}</h4>
                        <p>{property.city} • {property.price}€/mois</p>
                      </div>
                      {getStatusBadge(property.status)}
                      <div className="property-actions">
                        <button className="btn-edit" title="Modifier">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="btn-delete" title="Supprimer">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Contracts */}
              <div className="content-section">
                <div className="section-header">
                  <h2>Contrats récents</h2>
                  <button className="view-all" onClick={() => setActiveTab('contracts')}>
                    Voir tout
                  </button>
                </div>
                <div className="contracts-list">
                  {recentContracts.map(contract => (
                    <div key={contract.id} className="contract-item">
                      <div className="contract-info">
                        <h4>{contract.tenant}</h4>
                        <p>{contract.property}</p>
                        <span className="contract-date">
                          Signé le {new Date(contract.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="contract-amount">
                        {contract.amount}€
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'properties' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Gestion des biens</h2>
                <Link to="/properties/new" className="btn-add">
                  <PlusIcon className="h-5 w-5" />
                  Ajouter un bien
                </Link>
              </div>
              <div className="properties-table">
                <table>
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Ville</th>
                      <th>Prix</th>
                      <th>Statut</th>
                      <th>Demandes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id}>
                        <td>{property.title}</td>
                        <td>{property.city}</td>
                        <td>{property.price}€</td>
                        <td>{getStatusBadge(property.status)}</td>
                        <td>
                          {property.requests > 0 && (
                            <span className="request-count">{property.requests}</span>
                          )}
                        </td>
                        <td>
                          <button className="btn-icon" title="Voir">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="btn-icon" title="Modifier">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="btn-icon delete" title="Supprimer">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Demandes de location</h2>
              </div>
              <div className="requests-table">
                <table>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Bien</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map(request => (
                      <tr key={request.id}>
                        <td>{request.client}</td>
                        <td>{request.property}</td>
                        <td>{new Date(request.date).toLocaleDateString('fr-FR')}</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td>
                          <button className="btn-approve-small">Approuver</button>
                          <button className="btn-reject-small">Refuser</button>
                          <button className="btn-view-small">Voir</button>
                        </td>
                      </tr>
                    ))}
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
          background: #f3f4f6;
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

        .content-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

        .requests-list,
        .properties-list,
        .contracts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .request-item,
        .property-item,
        .contract-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background: #f9fafb;
          border-radius: 5px;
        }

        .request-info h4,
        .property-info h4,
        .contract-info h4 {
          color: #1f2937;
          margin-bottom: 5px;
        }

        .request-info p,
        .property-info p,
        .contract-info p {
          color: #6b7280;
          font-size: 14px;
        }

        .request-date,
        .contract-date {
          color: #9ca3af;
          font-size: 12px;
        }

        .request-actions,
        .property-actions {
          display: flex;
          gap: 5px;
        }

        .btn-approve,
        .btn-reject,
        .btn-view,
        .btn-edit,
        .btn-delete {
          padding: 8px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: opacity 0.3s;
        }

        .btn-approve {
          background: #dcfce7;
          color: #059669;
        }

        .btn-reject {
          background: #fee2e2;
          color: #dc2626;
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

        .btn-approve-small,
        .btn-reject-small,
        .btn-view-small {
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
          margin-right: 5px;
        }

        .btn-approve-small {
          background: #dcfce7;
          color: #059669;
        }

        .btn-reject-small {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-view-small {
          background: #e0f2fe;
          color: #0284c7;
        }

        .contract-amount {
          font-size: 18px;
          font-weight: 600;
          color: #2563eb;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 12px;
          background: #f9fafb;
          color: #6b7280;
          font-weight: 500;
          font-size: 14px;
        }

        td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          color: #1f2937;
        }

        .btn-icon {
          padding: 5px;
          border: none;
          background: none;
          cursor: pointer;
          color: #6b7280;
          margin-right: 5px;
        }

        .btn-icon:hover {
          color: #2563eb;
        }

        .btn-icon.delete:hover {
          color: #dc2626;
        }

        .request-count {
          background: #2563eb;
          color: white;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 12px;
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
        }
      `}</style>
    </div>
  );
};

export default AgentDashboard;