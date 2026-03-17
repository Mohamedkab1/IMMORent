import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  PhoneIcon, 
  MapPinIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      toast.error('Veuillez remplir tous les champs obligatoires');
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

  const validateStep2 = () => {
    if (!formData.acceptTerms) {
      toast.error('Vous devez accepter les conditions d\'utilisation');
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
      
      // Redirection selon le rôle (par défaut client)
      navigate('/dashboard/client');
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
    
    return {
      strength,
      label: labels[strength],
      color: colors[strength]
    };
  };

  const passwordMatch = () => {
    if (!formData.password_confirmation) return null;
    return formData.password === formData.password_confirmation;
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h2>Créer un compte</h2>
          <p>Rejoignez ImmoGest et découvrez tous nos services</p>
        </div>

        <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Informations</span>
          </div>
          <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Validation</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {currentStep === 1 && (
            <div className="step step-1">
              <h3>Informations personnelles</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <UserIcon className="input-icon" />
                    Nom complet *
                  </label>
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
                  <label htmlFor="email">
                    <EnvelopeIcon className="input-icon" />
                    Email *
                  </label>
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
                  <label htmlFor="phone">
                    <PhoneIcon className="input-icon" />
                    Téléphone
                  </label>
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
                  <label htmlFor="address">
                    <MapPinIcon className="input-icon" />
                    Adresse
                  </label>
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
                  <label htmlFor="password">
                    <LockClosedIcon className="input-icon" />
                    Mot de passe *
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
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bars">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="strength-bar"
                            style={{
                              backgroundColor: i <= passwordStrength().strength ? passwordStrength().color : '#e5e7eb'
                            }}
                          ></div>
                        ))}
                      </div>
                      <span style={{ color: passwordStrength().color }}>
                        {passwordStrength().label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password_confirmation">
                    <LockClosedIcon className="input-icon" />
                    Confirmer le mot de passe *
                  </label>
                  <div className="password-input-wrapper">
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
                      {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
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
                <button type="button" className="btn-next" onClick={handleNext}>
                  Suivant
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step step-2">
              <h3>Validation du compte</h3>
              
              <div className="summary-card">
                <h4>Récapitulatif</h4>
                <p><strong>Nom :</strong> {formData.name}</p>
                <p><strong>Email :</strong> {formData.email}</p>
                <p><strong>Téléphone :</strong> {formData.phone || 'Non renseigné'}</p>
                <p><strong>Adresse :</strong> {formData.address || 'Non renseignée'}</p>
              </div>

              <div className="terms-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  <span>
                    J'accepte les <Link to="/cgv" target="_blank">conditions générales</Link> et la{' '}
                    <Link to="/confidentialite" target="_blank">politique de confidentialité</Link>
                  </span>
                </label>
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
          <Link to="/login" className="login-link">
            Se connecter
          </Link>
        </div>
      </div>

      <style>{`
        .register-page {
          min-height: calc(100vh - 70px);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
        }

        .register-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .register-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .register-header h2 {
          color: #1f2937;
          font-size: 28px;
          margin-bottom: 10px;
        }

        .register-header p {
          color: #6b7280;
        }

        .progress-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e5e7eb;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .progress-step.active .step-number {
          background: #2563eb;
          color: white;
        }

        .step-label {
          font-size: 14px;
          color: #6b7280;
        }

        .progress-step.active .step-label {
          color: #2563eb;
          font-weight: 500;
        }

        .progress-line {
          width: 100px;
          height: 2px;
          background: #e5e7eb;
          margin: 0 15px;
        }

        .progress-line.active {
          background: #2563eb;
        }

        .register-form h3 {
          color: #1f2937;
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }

        .form-group {
          margin-bottom: 15px;
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

        .password-strength {
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .strength-bars {
          display: flex;
          gap: 5px;
          flex: 1;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          border-radius: 2px;
          transition: background-color 0.3s;
        }

        .password-match {
          margin-top: 5px;
          font-size: 14px;
        }

        .summary-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .summary-card h4 {
          color: #1f2937;
          margin-bottom: 15px;
        }

        .summary-card p {
          margin-bottom: 10px;
          color: #4b5563;
        }

        .terms-section {
          margin-bottom: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #4b5563;
          cursor: pointer;
        }

        .checkbox-label a {
          color: #2563eb;
          text-decoration: none;
        }

        .checkbox-label a:hover {
          text-decoration: underline;
        }

        .form-navigation {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .btn-next,
        .btn-submit {
          flex: 1;
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

        .btn-back {
          flex: 1;
          padding: 14px;
          background: #e5e7eb;
          color: #374151;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-next:hover:not(:disabled),
        .btn-submit:hover:not(:disabled) {
          opacity: 0.9;
        }

        .btn-back:hover {
          background: #d1d5db;
        }

        .btn-next:disabled,
        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .register-footer {
          margin-top: 30px;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .register-footer p {
          color: #6b7280;
          margin-bottom: 10px;
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
            padding: 30px 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .progress-line {
            width: 50px;
          }

          .form-navigation {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;