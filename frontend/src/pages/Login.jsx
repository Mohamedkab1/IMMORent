import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await login(formData.email, formData.password);
      toast.success(response.message || 'Connexion réussie');
      
      const user = response.data.user;
      if (user.role?.slug === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role?.slug === 'agent') {
        navigate('/dashboard/agent');
      } else {
        navigate('/dashboard/client');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  // CORRIGEZ CES EMAILS AVEC CEUX DE VOTRE BASE DE DONNÉES
  const demoAccounts = [
    { email: 'admin@immorent.com', password: 'password', role: 'Admin' },
    { email: 'agent@immorent.com', password: 'password', role: 'Agent' },
    { email: 'client@immorent.com', password: 'password', role: 'Client' }
  ];

  const fillDemoAccount = (email, password) => {
    setFormData({ ...formData, email, password });
  };

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <div className="login-left">
            <div className="login-left-content">
              <h2>Bienvenue sur IMMORent</h2>
              <p>La plateforme complète pour la gestion immobilière et la location en ligne</p>
              <ul className="benefits-list">
                <li>✓ Accès à des milliers de biens</li>
                <li>✓ Gestion simplifiée des locations</li>
                <li>✓ Suivi des paiements en temps réel</li>
                <li>✓ Contrats sécurisés</li>
                <li>✓ Tableaux de bord personnalisés</li>
              </ul>
            </div>
          </div>

          <div className="login-right">
            <div className="login-box">
              <div className="login-header">
                <h2>Connexion</h2>
                <p>Accédez à votre espace personnel</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Adresse email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@email.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span>Se souvenir de moi</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <button type="submit" className="btn-login-submit" disabled={loading}>
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>

              <div className="login-footer">
                <p>Pas encore de compte ?</p>
                <Link to="/register" className="register-link">
                  Créer un compte gratuitement
                </Link>
              </div>

              <div className="demo-accounts">
                <p className="demo-title">Comptes de démonstration :</p>
                <div className="demo-buttons">
                  {demoAccounts.map(acc => (
                    <button 
                      key={acc.role}
                      className="demo-btn" 
                      onClick={() => fillDemoAccount(acc.email, acc.password)}
                    >
                      {acc.role}
                    </button>
                  ))}
                </div>
                <p className="demo-note">Mot de passe pour tous : <strong>password</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: calc(100vh - 70px);
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%);
        }

        .login-container {
          display: flex;
          min-height: calc(100vh - 70px);
          max-width: 1200px;
          margin: 0 auto;
        }

        .login-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: rgba(15, 43, 77, 0.9);
          backdrop-filter: blur(10px);
        }

        .login-left-content {
          color: white;
          max-width: 400px;
        }

        .login-left-content h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: white;
        }

        .login-left-content p {
          font-size: 1rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
        }

        .benefits-list li {
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: white;
        }

        .login-box {
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h2 {
          color: #0f2b4d;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .login-header p {
          color: #6b7280;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #374151;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
        }

        .password-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.125rem;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .forgot-link {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.875rem;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .btn-login-submit {
          width: 100%;
          padding: 0.75rem;
          background: #d4af37;
          color: #0f2b4d;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s;
        }

        .btn-login-submit:hover:not(:disabled) {
          opacity: 0.9;
        }

        .btn-login-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 1.5rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .login-footer p {
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .register-link {
          color: #d4af37;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link:hover {
          text-decoration: underline;
        }

        .demo-accounts {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .demo-title {
          color: #6b7280;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
          text-align: center;
        }

        .demo-buttons {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .demo-btn {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          color: #374151;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .demo-btn:hover {
          background: #d4af37;
          color: #0f2b4d;
          border-color: #d4af37;
        }

        .demo-note {
          text-align: center;
          font-size: 0.7rem;
          color: #9ca3af;
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }

          .login-left {
            padding: 2rem 1rem;
          }

          .login-left-content {
            text-align: center;
          }

          .benefits-list {
            text-align: left;
          }
        }
      `}</style>
    </>
  );
};

export default Login;