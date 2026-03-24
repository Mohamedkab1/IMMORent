import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

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
                    <div className="role-icon client">🏠</div>
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
                    <div className="role-icon agent">🏢</div>
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 1rem;
        }

        .register-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .register-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .register-header h2 {
          color: #1f2937;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .register-header p {
          color: #6b7280;
        }

        .progress-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .step-number {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: #e5e7eb;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .progress-step.active .step-number {
          background: #2563eb;
          color: white;
        }

        .step-label {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .progress-step.active .step-label {
          color: #2563eb;
        }

        .progress-line {
          width: 4rem;
          height: 2px;
          background: #e5e7eb;
          margin: 0 1rem;
        }

        .progress-line.active {
          background: #2563eb;
        }

        .step h3 {
          color: #1f2937;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .step-description {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .role-selection {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .role-card {
          position: relative;
          padding: 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .role-card:hover {
          border-color: #2563eb;
          transform: translateY(-2px);
        }

        .role-card.selected {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .role-icon {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .role-card h3 {
          text-align: center;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .role-card p {
          text-align: center;
          color: #6b7280;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .role-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .role-features li {
          color: #4b5563;
          font-size: 0.7rem;
          padding: 0.25rem 0;
          text-align: center;
        }

        .selected-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 1.25rem;
          height: 1.25rem;
          background: #2563eb;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #2563eb;
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
          font-size: 1rem;
        }

        .password-strength {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .strength-bars {
          display: flex;
          gap: 0.25rem;
          flex: 1;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          border-radius: 2px;
        }

        .password-match {
          margin-top: 0.5rem;
          font-size: 0.75rem;
        }

        .form-navigation {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .btn-next,
        .btn-submit {
          flex: 1;
          padding: 0.75rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-next:hover,
        .btn-submit:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .btn-back {
          flex: 1;
          padding: 0.75rem;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-back:hover {
          background: #e5e7eb;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .register-footer {
          margin-top: 1.5rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .register-footer p {
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .login-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .register-container {
            padding: 1.5rem;
          }

          .role-selection {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .progress-line {
            width: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default Register;