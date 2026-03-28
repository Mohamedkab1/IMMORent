import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, UserGroupIcon, BuildingOfficeIcon, DocumentTextIcon, 
  CurrencyEuroIcon, BellIcon, CogIcon, ArrowTrendingUpIcon, 
  UserIcon, CalendarIcon, CheckCircleIcon, XCircleIcon 
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 5,
    totalProperties: 5,
    activeContracts: 2,
    monthlyRevenue: 2800,
    pendingRequests: 2,
    availableProperties: 3
  });
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: 'Pierre Durand', action: 'a fait une demande pour Appartement Lyon', time: 'Il y a 5 minutes', type: 'request' },
    { id: 2, user: 'Marie Martin', action: 'a validé un contrat pour Maison Caluire', time: 'Il y a 30 minutes', type: 'contract' },
    { id: 3, user: 'Sophie Bernard', action: 'a effectué un paiement de 850DH', time: 'Il y a 2 heures', type: 'payment' },
  ]);

  return (
    <>
      <div className="admin-dashboard">
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="admin-info">
              <div className="admin-avatar">{user?.name?.charAt(0)}</div>
              <div>
                <h3>{user?.name}</h3>
                <p>Administrateur</p>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <Link to="/dashboard/admin" className="nav-link active">
              <ChartBarIcon className="nav-icon" /> Tableau de bord
            </Link>
            <Link to="/dashboard/admin/users" className="nav-link">
              <UserGroupIcon className="nav-icon" /> Utilisateurs
            </Link>
            <Link to="/dashboard/admin/properties" className="nav-link">
              <BuildingOfficeIcon className="nav-icon" /> Biens
            </Link>
            <Link to="/dashboard/admin/contracts" className="nav-link">
              <DocumentTextIcon className="nav-icon" /> Contrats
            </Link>
            <Link to="/dashboard/admin/payments" className="nav-link">
              <CurrencyEuroIcon className="nav-icon" /> Paiements
            </Link>
            <Link to="/dashboard/admin/requests" className="nav-link">
              <BellIcon className="nav-icon" /> Demandes
            </Link>
            <Link to="/dashboard/admin/settings" className="nav-link">
              <CogIcon className="nav-icon" /> Paramètres
            </Link>
          </nav>
        </div>

        <div className="dashboard-main">
          <div className="content-header">
            <h1>Tableau de bord administrateur</h1>
            <div className="header-actions">
              <button className="btn-notification">
                <BellIcon className="bell-icon" />
                <span className="badge">3</span>
              </button>
              <Link to="/profile"><UserIcon className="profile-icon" /></Link>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon users"><UserGroupIcon className="stat-icon-svg" /></div>
              <div><h3>{stats.totalUsers}</h3><p>Utilisateurs</p></div>
              <div className="stat-change positive"><ArrowTrendingUpIcon className="trend-icon" /> +12%</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon properties"><BuildingOfficeIcon className="stat-icon-svg" /></div>
              <div><h3>{stats.totalProperties}</h3><p>Biens</p></div>
              <div className="stat-change positive"><ArrowTrendingUpIcon className="trend-icon" /> +5</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon contracts"><DocumentTextIcon className="stat-icon-svg" /></div>
              <div><h3>{stats.activeContracts}</h3><p>Contrats actifs</p></div>
              <div className="stat-change neutral">+2</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue"><CurrencyEuroIcon className="stat-icon-svg" /></div>
              <div><h3>{stats.monthlyRevenue.toLocaleString()}DH</h3><p>Revenus mensuels</p></div>
              <div className="stat-change positive"><ArrowTrendingUpIcon className="trend-icon" /> +8%</div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header"><h2>Demandes en attente</h2><Link to="/dashboard/admin/requests" className="view-all">Voir tout</Link></div>
              <div className="requests-list">
                <div className="request-item">
                  <div><h4>Pierre Durand</h4><p>Appartement Lyon Centre</p><span className="date">15/03/2024</span></div>
                  <div className="actions">
                    <button className="btn-approve"><CheckCircleIcon className="action-icon" /></button>
                    <button className="btn-reject"><XCircleIcon className="action-icon" /></button>
                  </div>
                </div>
                <div className="request-item">
                  <div><h4>Sophie Bernard</h4><p>Maison Caluire</p><span className="date">14/03/2024</span></div>
                  <div className="actions">
                    <button className="btn-approve"><CheckCircleIcon className="action-icon" /></button>
                    <button className="btn-reject"><XCircleIcon className="action-icon" /></button>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-header"><h2>Activités récentes</h2><Link to="/dashboard/admin/requests" className="view-all">Voir tout</Link></div>
              <div className="activities-list">
                {recentActivities.map(a => (
                  <div key={a.id} className="activity-item">
                    <div className={`activity-icon ${a.type}`}></div>
                    <div><p><strong>{a.user}</strong> {a.action}</p><span className="time">{a.time}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-header"><h2>Aperçu rapide</h2></div>
              <div className="quick-stats">
                <div><span>Biens disponibles</span><strong>{stats.availableProperties}</strong></div>
                <div><span>Demandes en attente</span><strong>{stats.pendingRequests}</strong></div>
                <div><span>Taux d'occupation</span><strong>62%</strong></div>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Rendez-vous à venir</h2>
                <CalendarIcon className="calendar-icon" />
              </div>
              <div className="events">
                <div className="event-item">
                  <div className="event-date">
                    <span className="event-day">25</span>
                    <span className="event-month">Mar</span>
                  </div>
                  <div className="event-info">
                    <h4>Visite - Appartement Lyon</h4>
                    <p>14:30</p>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-date">
                    <span className="event-day">26</span>
                    <span className="event-month">Mar</span>
                  </div>
                  <div className="event-info">
                    <h4>Signature - Maison Caluire</h4>
                    <p>10:00</p>
                  </div>
                </div>
                <div className="event-item">
                  <div className="event-date">
                    <span className="event-day">28</span>
                    <span className="event-month">Mar</span>
                  </div>
                  <div className="event-info">
                    <h4>Visite - Studio Villeurbanne</h4>
                    <p>15:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          display: flex;
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .dashboard-sidebar {
          width: 300px;
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

        .admin-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-avatar {
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

        .admin-info h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .admin-info p {
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
          padding: 0.75rem 1rem;
          color: #6b7280;
          text-decoration: none;
          border-radius: 0.5rem;
          transition: all 0.3s;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
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

        .btn-notification {
          position: relative;
          background: white;
          border: none;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 0.625rem;
          padding: 0.125rem 0.375rem;
          border-radius: 1rem;
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
          justify-content: space-between;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .stat-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
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

        .stat-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
        }

        .stat-change.positive {
          background: #dcfce7;
          color: #059669;
        }

        .stat-change.neutral {
          background: #f3f4f6;
          color: #6b7280;
        }

        .trend-icon {
          width: 0.75rem;
          height: 0.75rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .dashboard-card {
          background: white;
          border-radius: 0.75rem;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-header h2 {
          font-size: 1rem;
          color: #0f2b4d;
          margin: 0;
        }

        .calendar-icon {
          width: 1rem;
          height: 1rem;
          color: #9ca3af;
        }

        .view-all {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.75rem;
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .request-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
        }

        .request-item h4 {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          color: #0f2b4d;
        }

        .request-item p {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .date {
          font-size: 0.625rem;
          color: #9ca3af;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-approve,
        .btn-reject {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-icon {
          width: 1rem;
          height: 1rem;
        }

        .btn-approve {
          color: #10b981;
        }

        .btn-reject {
          color: #ef4444;
        }

        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .activity-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .activity-icon {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          margin-top: 0.375rem;
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

        .activity-item p {
          font-size: 0.75rem;
          margin-bottom: 0.25rem;
          color: #374151;
        }

        .time {
          font-size: 0.625rem;
          color: #9ca3af;
        }

        .quick-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quick-stats div {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quick-stats span {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .quick-stats strong {
          font-size: 0.875rem;
          color: #0f2b4d;
        }

        .events {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .event-item {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
        }

        .event-date {
          text-align: center;
          min-width: 3rem;
        }

        .event-day {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          color: #d4af37;
        }

        .event-month {
          font-size: 0.625rem;
          color: #6b7280;
        }

        .event-info h4 {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          color: #0f2b4d;
        }

        .event-info p {
          font-size: 0.75rem;
          color: #6b7280;
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
          .dashboard-sidebar {
            display: none;
          }
          .dashboard-main {
            margin-left: 0;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;