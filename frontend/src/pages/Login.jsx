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
    { email: 'admin@immorent.ma', password: 'password', role: 'Admin' },
    { email: 'yassine@agent.ma', password: 'password', role: 'Agent' },
    { email: 'mehdi@client.ma', password: 'password', role: 'Client' }
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
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          transition: var(--theme-transition);
        }

        .login-container {
          display: flex;
          min-height: auto;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          background: var(--card-bg);
          border: 1px solid var(--border-color);
        }

        .login-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background: rgba(15, 43, 77, 0.95);
          backdrop-filter: blur(10px);
          position: relative;
        }

        .login-left-content {
          color: white;
          max-width: 400px;
          position: relative;
          z-index: 2;
        }

        .login-left-content h2 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: white;
          letter-spacing: -0.025em;
        }

        .login-left-content p {
          font-size: 1.125rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          space-y: 1rem;
        }

        .benefits-list li {
          margin-bottom: 1rem;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background: var(--card-bg);
          transition: var(--theme-transition);
        }

        .login-box {
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-header h2 {
          color: var(--text-main);
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          letter-spacing: -0.025em;
        }

        .login-header p {
          color: var(--text-muted);
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.625rem;
          color: var(--text-main);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: var(--bg-main);
          color: var(--text-main);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
          background: var(--card-bg);
        }

        .password-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.25rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          color: var(--text-muted);
          font-size: 0.875rem;
          cursor: pointer;
          font-weight: 500;
        }

        .forgot-link {
          color: var(--primary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .btn-login-submit {
          width: 100%;
          padding: 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 1rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.25);
        }

        .btn-login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.3);
          opacity: 0.9;
        }

        .btn-login-submit:active {
          transform: translateY(0);
        }

        .btn-login-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .login-footer {
          margin-top: 2rem;
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .login-footer p {
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .register-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 700;
        }

        .register-link:hover {
          text-decoration: underline;
        }

        .demo-accounts {
          margin-top: 2rem;
          padding: 1.25rem;
          background: var(--bg-muted);
          border-radius: 1rem;
          border: 1px solid var(--border-color);
        }

        .demo-title {
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .demo-buttons {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .demo-btn {
          padding: 0.625rem 1rem;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          color: var(--text-main);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .demo-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .demo-note {
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 1rem;
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .login-container {
            flex-direction: column;
            max-width: 500px;
          }

          .login-left {
            display: none;
          }

          .login-right {
            padding: 2.5rem 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Login;