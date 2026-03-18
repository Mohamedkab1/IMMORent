import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

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
      console.log('Tentative de connexion avec:', formData.email);
      const response = await login(formData.email, formData.password);
      console.log('Réponse login:', response);
      
      if (response.success) {
        toast.success(response.message || 'Connexion réussie');
        
        // Redirection selon le rôle
        const user = response.data.user;
        if (user.role?.slug === 'admin') {
          navigate('/dashboard/admin');
        } else if (user.role?.slug === 'agent') {
          navigate('/dashboard/agent');
        } else {
          navigate('/dashboard/client');
        }
      } else {
        toast.error(response.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      console.error('Response data:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Email ou mot de passe incorrect');
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0];
        toast.error(firstError || 'Données invalides');
      } else {
        toast.error(error.response?.data?.message || 'Erreur de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-left-content">
            <h2>Bienvenue sur ImmoGest</h2>
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
                <label htmlFor="email">
                  <EnvelopeIcon className="input-icon" />
                  Adresse email
                </label>
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
                <label htmlFor="password">
                  <LockClosedIcon className="input-icon" />
                  Mot de passe
                </label>
                <div className="password-input-wrapper">
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
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
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

              <button type="submit" className="btn-login" disabled={loading}>
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
                <button className="demo-btn" onClick={() => setFormData({...formData, email: 'admin@immobilier.com', password: 'password'})}>
                  Admin
                </button>
                <button className="demo-btn" onClick={() => setFormData({...formData, email: 'jean.dupont@agence.com', password: 'password'})}>
                  Agent
                </button>
                <button className="demo-btn" onClick={() => setFormData({...formData, email: 'pierre.durand@email.com', password: 'password'})}>
                  Client
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        .login-page {
          min-height: calc(100vh - 70px);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          padding: 40px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .login-left-content {
          color: white;
          max-width: 400px;
        }

        .login-left-content h2 {
          font-size: 36px;
          margin-bottom: 20px;
        }

        .login-left-content p {
          font-size: 18px;
          margin-bottom: 30px;
          opacity: 0.9;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
        }

        .benefits-list li {
          margin-bottom: 15px;
          font-size: 16px;
          display: flex;
          align-items: center;
        }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: white;
        }

        .login-box {
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-header h2 {
          color: #1f2937;
          font-size: 28px;
          margin-bottom: 10px;
        }

        .login-header p {
          color: #6b7280;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 5px;
          color: #374151;
          font-weight: 500;
        }

        .input-icon {
          width: 18px;
          height: 18px;
          color: #2563eb;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }

        .password-toggle:hover {
          color: #2563eb;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #6b7280;
          cursor: pointer;
        }

        .forgot-link {
          color: #2563eb;
          text-decoration: none;
          font-size: 14px;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .btn-login {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s;
        }

        .btn-login:hover:not(:disabled) {
          opacity: 0.9;
        }

        .btn-login:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 30px;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .login-footer p {
          color: #6b7280;
          margin-bottom: 10px;
        }

        .register-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link:hover {
          text-decoration: underline;
        }

        .demo-accounts {
          margin-top: 30px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 5px;
        }

        .demo-title {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 10px;
          text-align: center;
        }

        .demo-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .demo-btn {
          padding: 8px 12px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          color: #374151;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .demo-btn:hover {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }

          .login-left {
            padding: 40px 20px;
          }

          .login-left-content {
            text-align: center;
          }

          .benefits-list {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;