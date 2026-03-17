import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
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
  XCircleIcon
} from '@heroicons/react/24/outline';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Données simulées
  const stats = {
    activeRequests: 2,
    activeContracts: 1,
    totalPayments: 2450,
    favoriteProperties: 5
  };

  const rentalRequests = [
    { id: 1, property: 'Appartement Lyon Centre', date: '2024-01-15', status: 'pending', price: 850 },
    { id: 2, property: 'Studio Villeurbanne', date: '2024-01-10', status: 'approved', price: 450 },
    { id: 3, property: 'Maison Caluire', date: '2024-01-05', status: 'rejected', price: 1200 },
  ];

  const payments = [
    { id: 1, month: 'Décembre 2023', amount: 850, status: 'paid', date: '2023-12-05' },
    { id: 2, month: 'Janvier 2024', amount: 850, status: 'pending', date: '2024-01-05' },
  ];

  const contracts = [
    { id: 1, property: 'Appartement Lyon Centre', startDate: '2023-12-01', endDate: '2024-11-30', status: 'active' }
  ];

  const favorites = [
    { id: 1, title: 'Appartement avec vue', price: 950, city: 'Lyon', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400' },
    { id: 2, title: 'Maison avec jardin', price: 1500, city: 'Caluire', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400' },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: '#f59e0b', text: 'En attente', icon: ClockIcon },
      approved: { color: '#10b981', text: 'Approuvée', icon: CheckCircleIcon },
      rejected: { color: '#ef4444', text: 'Refusée', icon: XCircleIcon },
      paid: { color: '#10b981', text: 'Payé', icon: CheckCircleIcon },
      active: { color: '#10b981', text: 'Actif', icon: CheckCircleIcon }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
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
        <Icon style={{ width: '14px', height: '14px' }} />
        {config.text}
      </span>
    );
  };

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
            className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <CurrencyEuroIcon className="nav-icon" />
            <span>Paiements</span>
          </button>
          <button 
            className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <HeartIcon className="nav-icon" />
            <span>Favoris</span>
            {stats.favoriteProperties > 0 && (
              <span className="badge">{stats.favoriteProperties}</span>
            )}
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
            <button className="btn-notification">
              <BellIcon className="h-6 w-6" />
              <span className="notification-badge">2</span>
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
                  <h2>Demandes en cours</h2>
                  <button className="view-all" onClick={() => setActiveTab('requests')}>
                    Voir tout
                  </button>
                </div>
                <div className="requests-grid">
                  {rentalRequests.filter(r => r.status === 'pending').map(request => (
                    <div key={request.id} className="request-card">
                      <div className="request-header">
                        <h3>{request.property}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="request-date">
                        <CalendarIcon className="h-4 w-4" />
                        Demande du {new Date(request.date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="request-price">{request.price}€ / mois</p>
                      <div className="request-actions">
                        <button className="btn-cancel">Annuler la demande</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Payments */}
              <div className="content-section">
                <div className="section-header">
                  <h2>Paiements récents</h2>
                  <button className="view-all" onClick={() => setActiveTab('payments')}>
                    Voir tout
                  </button>
                </div>
                <div className="payments-list">
                  {payments.map(payment => (
                    <div key={payment.id} className="payment-item">
                      <div className="payment-info">
                        <h4>Loyer {payment.month}</h4>
                        <p className="payment-date">{new Date(payment.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="payment-amount">{payment.amount}€</div>
                      {getStatusBadge(payment.status)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Contract */}
              {contracts.length > 0 && (
                <div className="content-section">
                  <div className="section-header">
                    <h2>Contrat actif</h2>
                  </div>
                  <div className="contract-card">
                    <h3>{contracts[0].property}</h3>
                    <div className="contract-dates">
                      <span>Du {new Date(contracts[0].startDate).toLocaleDateString('fr-FR')}</span>
                      <span>au {new Date(contracts[0].endDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {getStatusBadge(contracts[0].status)}
                    <button className="btn-view-contract">Voir le contrat</button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'requests' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Toutes mes demandes</h2>
              </div>
              <div className="requests-table">
                <table>
                  <thead>
                    <tr>
                      <th>Bien</th>
                      <th>Date de demande</th>
                      <th>Prix</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentalRequests.map(request => (
                      <tr key={request.id}>
                        <td>{request.property}</td>
                        <td>{new Date(request.date).toLocaleDateString('fr-FR')}</td>
                        <td>{request.price}€</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td>
                          <button className="btn-view">Voir</button>
                          {request.status === 'pending' && (
                            <button className="btn-cancel-small">Annuler</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Historique des paiements</h2>
              </div>
              <div className="payments-summary">
                <div className="summary-card">
                  <h4>Total payé</h4>
                  <p className="summary-value">{stats.totalPayments}€</p>
                </div>
                <div className="summary-card">
                  <h4>Prochain paiement</h4>
                  <p className="summary-value">850€</p>
                  <p className="summary-date">Le 5 février 2024</p>
                </div>
              </div>
              <div className="payments-table">
                <table>
                  <thead>
                    <tr>
                      <th>Mois</th>
                      <th>Montant</th>
                      <th>Date de paiement</th>
                      <th>Statut</th>
                      <th>Reçu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id}>
                        <td>{payment.month}</td>
                        <td>{payment.amount}€</td>
                        <td>{new Date(payment.date).toLocaleDateString('fr-FR')}</td>
                        <td>{getStatusBadge(payment.status)}</td>
                        <td>
                          {payment.status === 'paid' && (
                            <button className="btn-download">Télécharger</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Mes biens favoris</h2>
              </div>
              <div className="favorites-grid">
                {favorites.map(favorite => (
                  <div key={favorite.id} className="favorite-card">
                    <img src={favorite.image} alt={favorite.title} />
                    <div className="favorite-info">
                      <h3>{favorite.title}</h3>
                      <p>{favorite.city}</p>
                      <p className="favorite-price">{favorite.price}€ / mois</p>
                      <div className="favorite-actions">
                        <Link to={`/properties/${favorite.id}`} className="btn-view-property">
                          Voir le bien
                        </Link>
                        <button className="btn-remove-favorite">
                          <HeartIcon className="h-5 w-5" fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style >{`
        .client-dashboard {
          display: flex;
          min-height: calc(100vh - 70px);
          background: #f3f4f6;
        }

        /* Sidebar */
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
          text-decoration: none;
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

        /* Main Content */
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

        /* Stats Grid */
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

        /* Content Sections */
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

        .view-all:hover {
          text-decoration: underline;
        }

        /* Requests Grid */
        .requests-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
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

        .btn-cancel {
          width: 100%;
          padding: 8px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-cancel:hover {
          background: #fecaca;
        }

        /* Payments List */
        .payments-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .payment-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background: #f9fafb;
          border-radius: 5px;
        }

        .payment-info h4 {
          color: #1f2937;
          margin-bottom: 5px;
        }

        .payment-date {
          color: #6b7280;
          font-size: 12px;
        }

        .payment-amount {
          font-size: 18px;
          font-weight: 600;
          color: #2563eb;
        }

        /* Contract Card */
        .contract-card {
          padding: 20px;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
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

        .btn-view-contract {
          margin-top: 15px;
          padding: 10px 20px;
          background: white;
          color: #2563eb;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-view-contract:hover {
          background: #f3f4f6;
        }

        /* Tables */
        .requests-table,
        .payments-table {
          overflow-x: auto;
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

        .btn-view,
        .btn-download {
          padding: 5px 10px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
          margin-right: 5px;
        }

        .btn-cancel-small {
          padding: 5px 10px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
        }

        /* Payments Summary */
        .payments-summary {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .summary-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 5px;
        }

        .summary-card h4 {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .summary-value {
          font-size: 24px;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 5px;
        }

        .summary-date {
          color: #6b7280;
          font-size: 12px;
        }

        /* Favorites Grid */
        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .favorite-card {
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          overflow: hidden;
        }

        .favorite-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .favorite-info {
          padding: 15px;
        }

        .favorite-info h3 {
          color: #1f2937;
          margin-bottom: 5px;
        }

        .favorite-info p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .favorite-price {
          font-size: 16px;
          font-weight: 600;
          color: #2563eb;
          margin: 10px 0;
        }

        .favorite-actions {
          display: flex;
          gap: 10px;
        }

        .btn-view-property {
          flex: 1;
          padding: 8px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 12px;
          text-align: center;
        }

        .btn-remove-favorite {
          padding: 8px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 5px;
          cursor: pointer;
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

          .favorites-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;