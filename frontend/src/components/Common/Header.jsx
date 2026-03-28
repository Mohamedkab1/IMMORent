import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/IMMORent.jpeg';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const dashboardLink = user?.role?.slug === 'admin' 
    ? '/dashboard/admin' 
    : user?.role?.slug === 'agent' 
    ? '/dashboard/agent' 
    : '/dashboard/client';

  return (
    <>
      <header className="immorent-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <img 
              src={logo} 
              alt="IMMORent Logo" 
              className="logo-image"
            />
            <span className="logo-text">IMMORent</span>
          </Link>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>

          <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Accueil
            </Link>
            <Link to="/properties" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Biens
            </Link>
            <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              À propos
            </Link>
            <Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>

            {isAuthenticated ? (
              <div className="user-menu">
                <button 
                  className="user-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="user-avatar">
                    {getInitials(user?.name || 'U')}
                  </div>
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {dropdownOpen && (
                  <div className="dropdown">
                    <Link to={dashboardLink} className="dropdown-item" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }}>
                      Dashboard
                    </Link>
                    <Link to="/profile" className="dropdown-item" onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }}>
                      Profil
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login" onClick={() => setMobileMenuOpen(false)}>
                  Connexion
                </Link>
                <Link to="/register" className="btn-register" onClick={() => setMobileMenuOpen(false)}>
                  Inscription
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <style>{`
        .immorent-header {
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 70px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .logo-image {
          width: 45px;
          height: 45px;
          object-fit: cover;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          letter-spacing: 1px;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: white;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: #e0e7ff;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: white;
        }

        .auth-buttons {
          display: flex;
          gap: 1rem;
        }

        .btn-login {
          padding: 0.5rem 1.25rem;
          background-color: transparent;
          border: 1px solid #e0e7ff;
          border-radius: 0.5rem;
          color: #e0e7ff;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-login:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn-register {
          padding: 0.5rem 1.25rem;
          background-color: white;
          border-radius: 0.5rem;
          color: #1e4a6e;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-register:hover {
          background-color: #f0f0f0;
          transform: translateY(-1px);
        }

        .user-menu {
          position: relative;
        }

        .user-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 2rem;
          transition: background-color 0.3s ease;
        }

        .user-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .user-avatar {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #d4af37 0%, #b8942e 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e4a6e;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .user-name {
          color: white;
          font-weight: 500;
        }

        .dropdown-arrow {
          color: #e0e7ff;
          font-size: 0.75rem;
        }

        .dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          min-width: 180px;
          overflow: hidden;
          z-index: 10;
        }

        .dropdown-item {
          display: block;
          padding: 0.75rem 1rem;
          color: #1f2937;
          text-decoration: none;
          transition: background-color 0.3s ease;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .dropdown-item:hover {
          background-color: #f3f4f6;
        }

        .dropdown-item.logout {
          color: #dc2626;
          border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }

          .logo-image {
            width: 35px;
            height: 35px;
          }

          .logo-text {
            font-size: 1.25rem;
          }

          .nav {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: white;
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
            transition: left 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .nav.mobile-open {
            left: 0;
          }

          .nav-link {
            color: #1f2937;
            font-size: 1rem;
          }

          .auth-buttons {
            flex-direction: column;
            width: 100%;
          }

          .btn-login,
          .btn-register {
            text-align: center;
          }

          .user-menu {
            width: 100%;
          }

          .user-btn {
            width: 100%;
            justify-content: center;
            padding: 0.5rem;
          }

          .dropdown {
            position: static;
            margin-top: 0.5rem;
            box-shadow: none;
            border: 1px solid #e5e7eb;
          }
        }
      `}</style>
    </>
  );
};

export default Header;