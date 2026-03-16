import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          ImmoGest
        </Link>

        <button 
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Accueil
          </Link>
          <Link to="/properties" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Biens
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  {getInitials(user?.name || 'User')}
                </div>
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
              </button>
              
              <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                <Link 
                  to={dashboardLink} 
                  className="dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  Profil
                </Link>
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  Déconnexion
                </button>
              </div>
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
  );
};

export default Header;