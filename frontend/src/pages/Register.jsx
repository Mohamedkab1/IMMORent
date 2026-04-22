import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HomeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    role: 'client'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('client');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role: role });
  };

  const validateStep1 = () => {
    if (!selectedRole) {
      toast.error('Veuillez sélectionner un rôle');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('L\'email est requis');
      return false;
    }
    if (!formData.password) {
      toast.error('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const response = await register(formData);
      toast.success(response.message || 'Inscription réussie');
      
      if (formData.role === 'agent') {
        navigate('/dashboard/agent');
      } else {
        navigate('/dashboard/client');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const labels = ['', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const colors = ['', '#ef4444', '#f59e0b', '#10b981', '#059669'];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordMatch = () => {
    if (!formData.password_confirmation) return null;
    return formData.password === formData.password_confirmation;
  };

  return (
    <>
      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <h2>Créer un compte</h2>
            <p>Rejoignez IMMORent et découvrez tous nos services</p>
          </div>

          <div className="progress-bar">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Choix du rôle</span>
            </div>
            <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Informations</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {currentStep === 1 && (
              <div className="step step-1">
                <h3>Choisissez votre profil</h3>
                <p className="step-description">Sélectionnez le rôle qui correspond à votre activité</p>
                
                <div className="role-selection">
                  <div 
                    className={`role-card ${selectedRole === 'client' ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect('client')}
                  >
                    <HomeIcon className="role-icon" />
                    <h3>Client / Locataire</h3>
                    <p>Je recherche un logement à louer</p>
                    <ul className="role-features">
                      <li>✓ Consultation des biens</li>
                      <li>✓ Demandes de location</li>
                      <li>✓ Gestion des contrats</li>
                    </ul>
                    {selectedRole === 'client' && <div className="selected-badge">✓</div>}
                  </div>

                  <div 
                    className={`role-card ${selectedRole === 'agent' ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect('agent')}
                  >
                    <BuildingOfficeIcon className="role-icon" />
                    <h3>Agent immobilier</h3>
                    <p>Je gère des biens immobiliers</p>
                    <ul className="role-features">
                      <li>✓ Gestion des biens</li>
                      <li>✓ Traitement des demandes</li>
                      <li>✓ Création de contrats</li>
                    </ul>
                    {selectedRole === 'agent' && <div className="selected-badge">✓</div>}
                  </div>
                </div>

                <div className="form-navigation">
                  <button type="button" className="btn-next" onClick={handleNext}>
                    Suivant
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step step-2">
                <h3>Informations personnelles</h3>
                <p className="step-description">
                  {selectedRole === 'agent' 
                    ? 'Créez votre compte agent pour commencer à gérer des biens' 
                    : 'Créez votre compte client pour trouver votre prochain logement'}
                </p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nom complet *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jean Dupont"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jean.dupont@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Téléphone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="06 12 34 56 78"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Adresse</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 rue Example, 75001 Paris"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Mot de passe *</label>
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
                    {formData.password && (
                      <div className="password-strength">
                        <div className="strength-bars">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="strength-bar" style={{
                              backgroundColor: i <= passwordStrength().strength ? passwordStrength().color : '#e5e7eb'
                            }}></div>
                          ))}
                        </div>
                        <span style={{ color: passwordStrength().color }}>{passwordStrength().label}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="password_confirmation">Confirmer le mot de passe *</label>
                    <div className="password-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {formData.password_confirmation && (
                      <div className="password-match">
                        {passwordMatch() ? (
                          <span style={{ color: '#10b981' }}>✓ Les mots de passe correspondent</span>
                        ) : (
                          <span style={{ color: '#ef4444' }}>✗ Les mots de passe ne correspondent pas</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-navigation">
                  <button type="button" className="btn-back" onClick={handleBack}>
                    Retour
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Création du compte...' : 'Créer mon compte'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="register-footer">
            <p>Déjà un compte ?</p>
            <Link to="/login" className="login-link">Se connecter</Link>
          </div>
        </div>
      </div>

      <style>{`
        .register-page {
          min-height: calc(100vh - 70px);
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          padding: 2rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--theme-transition);
        }

        .register-container {
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          background: var(--card-bg);
          border-radius: 1.5rem;
          padding: 3rem 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-color);
          transition: var(--theme-transition);
        }

        .register-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .register-header h2 {
          color: var(--text-main);
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          letter-spacing: -0.025em;
        }

        .register-header p {
          color: var(--text-muted);
          font-weight: 500;
        }

        .progress-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .step-number {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: var(--bg-muted);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          transition: all 0.3s;
          border: 2px solid var(--border-color);
        }

        .progress-step.active .step-number {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .step-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .progress-step.active .step-label {
          color: var(--text-main);
        }

        .progress-line {
          width: 5rem;
          height: 3px;
          background: var(--border-color);
          margin: 0 1rem;
          border-radius: 1rem;
          margin-top: -1.5rem;
        }

        .progress-line.active {
          background: var(--primary);
        }

        .step h3 {
          color: var(--text-main);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .step-description {
          color: var(--text-muted);
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .role-selection {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .role-card {
          position: relative;
          padding: 2.5rem 1.5rem;
          border: 2px solid var(--border-color);
          border-radius: 1.25rem;
          cursor: pointer;
          transition: all 0.3s;
          background: var(--bg-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .role-card:hover {
          border-color: var(--primary);
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .role-card.selected {
          border-color: var(--primary);
          background: var(--card-bg);
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.15);
        }

        .role-icon {
          width: 3rem;
          height: 3rem;
          margin-bottom: 1.5rem;
          color: var(--primary);
          transition: transform 0.3s;
        }

        .role-card:hover .role-icon {
          transform: scale(1.1);
        }

        .role-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .role-card p {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }

        .role-features {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%;
        }

        .role-features li {
          color: var(--text-muted);
          font-size: 0.8125rem;
          padding: 0.375rem 0;
          font-weight: 500;
        }

        .selected-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 1.75rem;
          height: 1.75rem;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.625rem;
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-main);
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

        .password-strength {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .strength-bars {
          display: flex;
          gap: 0.375rem;
          flex: 1;
        }

        .strength-bar {
          height: 6px;
          flex: 1;
          border-radius: 1rem;
          transition: all 0.3s;
        }

        .password-match {
          margin-top: 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .form-navigation {
          display: flex;
          gap: 1.5rem;
          margin-top: 2.5rem;
        }

        .btn-next,
        .btn-submit {
          flex: 1.5;
          padding: 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.25);
          font-size: 1rem;
        }

        .btn-next:hover,
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.3);
          opacity: 0.9;
        }

        .btn-back {
          flex: 1;
          padding: 1rem;
          background: var(--bg-muted);
          color: var(--text-main);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
        }

        .btn-back:hover {
          background: var(--border-color);
          transform: translateY(-2px);
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .register-footer {
          margin-top: 2.5rem;
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .register-footer p {
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .login-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 700;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .register-container {
            padding: 2rem 1.5rem;
          }

          .role-selection {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .progress-line {
            width: 2rem;
          }
          
          .progress-bar {
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default Register;