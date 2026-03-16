import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  BellIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 150,
    totalProperties: 45,
    activeContracts: 28,
    monthlyRevenue: 45600,
    pendingRequests: 12,
    availableProperties: 32
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: 'Pierre Durand', action: 'a fait une demande pour Appartement Lyon', time: 'Il y a 5 minutes', type: 'request' },
    { id: 2, user: 'Marie Martin', action: 'a validé un contrat pour Maison Caluire', time: 'Il y a 30 minutes', type: 'contract' },
    { id: 3, user: 'Sophie Bernard', action: 'a effectué un paiement de 850€', time: 'Il y a 2 heures', type: 'payment' },
    { id: 4, user: 'Jean Dupont', action: 'a ajouté un nouveau bien', time: 'Il y a 3 heures', type: 'property' },
    { id: 5, user: 'Admin', action: 'a modifié les paramètres', time: 'Il y a 5 heures', type: 'settings' },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, user: 'Pierre Durand', property: 'Appartement Lyon', date: '2024-01-15', status: 'pending' },
    { id: 2, user: 'Sophie Bernard', property: 'Maison Villeurbanne', date: '2024-01-14', status: 'pending' },
    { id: 3, user: 'Thomas Petit', property: 'Studio Caluire', date: '2024-01-13', status: 'pending' },
  ]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="admin-info">
            <div className="admin-avatar">
              {user?.name?.charAt(0)}
            </div>
            <div className="admin-details">
              <h3>{user?.name}</h3>
              <p>Administrateur</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard/admin" className="nav-link active">
            <ChartBarIcon className="nav-icon" />
            <span>Tableau de bord</span>
          </Link>
          <Link to="/dashboard/admin/users" className="nav-link">
            <UserGroupIcon className="nav-icon" />
            <span>Utilisateurs</span>
          </Link>
          <Link to="/dashboard/admin/properties" className="nav-link">
            <BuildingOfficeIcon className="nav-icon" />
            <span>Biens</span>
          </Link>
          <Link to="/dashboard/admin/contracts" className="nav-link">
            <DocumentTextIcon className="nav-icon" />
            <span>Contrats</span>
          </Link>
          <Link to="/dashboard/admin/payments" className="nav-link">
            <CurrencyEuroIcon className="nav-icon" />
            <span>Paiements</span>
          </Link>
          <Link to="/dashboard/admin/requests" className="nav-link">
            <BellIcon className="nav-icon" />
            <span>Demandes</span>
          </Link>
          <Link to="/dashboard/admin/settings" className="nav-link">
            <CogIcon className="nav-icon" />
            <span>Paramètres</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>Tableau de bord administrateur</h1>
          <div className="header-actions">
            <button className="btn-notification">
              <BellIcon className="h-6 w-6" />
              <span className="notification-badge">3</span>
            </button>
            <Link to="/profile" className="btn-profile">
              <UserIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <UserGroupIcon className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Utilisateurs</p>
            </div>
            <div className="stat-change positive">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span>+12%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon properties">
              <BuildingOfficeIcon className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{stats.totalProperties}</h3>
              <p>Biens</p>
            </div>
            <div className="stat-change positive">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span>+5</span>
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
            <div className="stat-change neutral">
              <span>+2</span>
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
            <div className="stat-change positive">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span>+8%</span>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="dashboard-grid">
          {/* Pending Requests */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Demandes en attente</h2>
              <Link to="/dashboard/admin/requests" className="view-all">
                Voir tout
              </Link>
            </div>
            <div className="requests-list">
              {pendingRequests.map((request) => (
                <div key={request.id} className="request-item">
                  <div className="request-info">
                    <h4>{request.user}</h4>
                    <p>{request.property}</p>
                    <span className="request-date">{new Date(request.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="request-actions">
                    <button className="btn-approve">
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                    <button className="btn-reject">
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Activités récentes</h2>
              <button className="view-all">Voir tout</button>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}></div>
                  <div className="activity-info">
                    <p>
                      <strong>{activity.user}</strong> {activity.action}
                    </p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Aperçu rapide</h2>
            </div>
            <div className="quick-stats">
              <div className="quick-stat-item">
                <span className="stat-label">Biens disponibles</span>
                <span className="stat-value">{stats.availableProperties}</span>
              </div>
              <div className="quick-stat-item">
                <span className="stat-label">Demandes en attente</span>
                <span className="stat-value">{stats.pendingRequests}</span>
              </div>
              <div className="quick-stat-item">
                <span className="stat-label">Taux d'occupation</span>
                <span className="stat-value">62%</span>
              </div>
              <div className="quick-stat-item">
                <span className="stat-label">Nouveaux utilisateurs (mois)</span>
                <span className="stat-value">28</span>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Rendez-vous à venir</h2>
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="calendar-events">
              <div className="event-item">
                <div className="event-date">
                  <span className="event-day">15</span>
                  <span className="event-month">Jan</span>
                </div>
                <div className="event-info">
                  <h4>Visite - Appartement Lyon</h4>
                  <p>Client: Pierre Durand • 14:30</p>
                </div>
              </div>
              <div className="event-item">
                <div className="event-date">
                  <span className="event-day">16</span>
                  <span className="event-month">Jan</span>
                </div>
                <div className="event-info">
                  <h4>Signature contrat - Maison Caluire</h4>
                  <p>Client: Sophie Bernard • 10:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: calc(100vh - 70px);
          background: #f3f4f6;
        }

        /* Sidebar */
        .sidebar {
          width: 280px;
          background: white;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
          position: fixed;
          top: 70px;
          left: 0;
          bottom: 0;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 30px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .admin-avatar {
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

        .admin-details h3 {
          color: #1f2937;
          font-size: 16px;
          margin-bottom: 5px;
        }

        .admin-details p {
          color: #6b7280;
          font-size: 14px;
        }

        .sidebar-nav {
          padding: 20px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          color: #6b7280;
          text-decoration: none;
          border-radius: 5px;
          transition: all 0.3s;
          margin-bottom: 5px;
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

        /* Main Content */
        .main-content {
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

        .btn-profile {
          background: white;
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          color: #6b7280;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
          position: relative;
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

        .stat-icon.users {
          background: #e0f2fe;
          color: #0284c7;
        }

        .stat-icon.properties {
          background: #dcfce7;
          color: #059669;
        }

        .stat-icon.contracts {
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

        .stat-change {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 20px;
        }

        .stat-change.positive {
          background: #dcfce7;
          color: #059669;
        }

        .stat-change.neutral {
          background: #f3f4f6;
          color: #6b7280;
        }

        /* Dashboard Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .dashboard-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header h2 {
          color: #1f2937;
          font-size: 18px;
        }

        .view-all {
          color: #2563eb;
          text-decoration: none;
          font-size: 14px;
        }

        .view-all:hover {
          text-decoration: underline;
        }

        /* Requests List */
        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .request-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f9fafb;
          border-radius: 5px;
        }

        .request-info h4 {
          color: #1f2937;
          margin-bottom: 5px;
        }

        .request-info p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .request-date {
          color: #9ca3af;
          font-size: 12px;
        }

        .request-actions {
          display: flex;
          gap: 10px;
        }

        .btn-approve,
        .btn-reject {
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

        .btn-approve:hover,
        .btn-reject:hover {
          opacity: 0.8;
        }

        /* Activities List */
        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .activity-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .activity-icon {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 5px;
        }

        .activity-icon.request {
          background: #f59e0b;
        }

        .activity-icon.contract {
          background: #10b981;
        }

        .activity-icon.payment {
          background: #3b82f6;
        }

        .activity-icon.property {
          background: #8b5cf6;
        }

        .activity-icon.settings {
          background: #6b7280;
        }

        .activity-info p {
          color: #374151;
          margin-bottom: 5px;
        }

        .activity-time {
          color: #9ca3af;
          font-size: 12px;
        }

        /* Quick Stats */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .quick-stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          color: #6b7280;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .stat-value {
          color: #1f2937;
          font-size: 18px;
          font-weight: 600;
        }

        /* Calendar Events */
        .calendar-events {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .event-item {
          display: flex;
          gap: 15px;
          padding: 15px;
          background: #f9fafb;
          border-radius: 5px;
        }

        .event-date {
          text-align: center;
          min-width: 50px;
        }

        .event-day {
          display: block;
          font-size: 20px;
          font-weight: 600;
          color: #2563eb;
        }

        .event-month {
          font-size: 12px;
          color: #6b7280;
        }

        .event-info h4 {
          color: #1f2937;
          margin-bottom: 5px;
          font-size: 14px;
        }

        .event-info p {
          color: #6b7280;
          font-size: 12px;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }

          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
