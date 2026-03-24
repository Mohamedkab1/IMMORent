import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { propertyService } from '../services/properties';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  UserIcon,
  HomeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const CreateContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [request, setRequest] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rental_request_id: '',
    start_date: '',
    end_date: '',
    monthly_rent: '',
    security_deposit: '',
    charges: ''
  });

  // Récupérer l'ID de la demande depuis l'URL
  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get('request');

  useEffect(() => {
    if (!requestId) {
      toast.error('Aucune demande sélectionnée');
      navigate('/dashboard/agent');
      return;
    }

    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const response = await requestService.getById(requestId);
      if (response.success && response.data) {
        setRequest(response.data);
        
        // Formater les dates
        const formatDate = (date) => {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        setFormData({
          rental_request_id: response.data.id,
          start_date: formatDate(response.data.start_date),
          end_date: formatDate(response.data.end_date),
          monthly_rent: response.data.property?.price || '',
          security_deposit: response.data.property?.price || '',
          charges: ''
        });
        
        // Récupérer les détails du bien
        if (response.data.property_id) {
          const propertyResponse = await propertyService.getById(response.data.property_id);
          if (propertyResponse.success) {
            setProperty(propertyResponse.data);
          }
        }
      } else {
        toast.error('Demande non trouvée');
        navigate('/dashboard/agent');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement de la demande');
      navigate('/dashboard/agent');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await contractService.create(formData);
      
      if (response.success) {
        toast.success('Contrat créé avec succès !');
        
        // Rediriger vers la page de détail du contrat créé
        if (response.data && response.data.id) {
          navigate(`/contracts/${response.data.id}`);
        } else {
          // Fallback: rediriger vers le dashboard agent
          navigate('/dashboard/agent?refresh=true');
        }
      } else {
        toast.error(response.message || 'Erreur lors de la création du contrat');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création du contrat');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
        <style>{`
          .loading-container {
            min-height: calc(100vh - 70px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #e5e7eb;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!request || !property) {
    return null;
  }

  return (
    <div className="create-contract-page">
      <div className="create-contract-container">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeftIcon className="h-5 w-5" />
            Retour
          </button>
          <h1>Créer un contrat de location</h1>
          <p>Remplissez les informations pour générer le contrat</p>
        </div>

        <div className="contract-content">
          {/* Récapitulatif de la demande */}
          <div className="request-summary">
            <h2>Demande de location</h2>
            <div className="summary-card">
              <div className="summary-item">
                <UserIcon className="summary-icon" />
                <div>
                  <span className="summary-label">Client</span>
                  <p className="summary-value">{request.user?.name}</p>
                </div>
              </div>
              <div className="summary-item">
                <HomeIcon className="summary-icon" />
                <div>
                  <span className="summary-label">Bien</span>
                  <p className="summary-value">{property.title}</p>
                  <p className="summary-address">{property.city} {property.postal_code}</p>
                </div>
              </div>
              <div className="summary-item">
                <CalendarIcon className="summary-icon" />
                <div>
                  <span className="summary-label">Période souhaitée</span>
                  <p className="summary-value">
                    {new Date(request.start_date).toLocaleDateString('fr-FR')} - {new Date(request.end_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire du contrat */}
          <div className="contract-form-container">
            <h2>Informations du contrat</h2>
            <form onSubmit={handleSubmit} className="contract-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_date">
                    <CalendarIcon className="input-icon" />
                    Date de début *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date">
                    <CalendarIcon className="input-icon" />
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="monthly_rent">
                    <CurrencyEuroIcon className="input-icon" />
                    Loyer mensuel (€) *
                  </label>
                  <input
                    type="number"
                    id="monthly_rent"
                    name="monthly_rent"
                    value={formData.monthly_rent}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="security_deposit">
                    <CurrencyEuroIcon className="input-icon" />
                    Dépôt de garantie (€) *
                  </label>
                  <input
                    type="number"
                    id="security_deposit"
                    name="security_deposit"
                    value={formData.security_deposit}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="charges">
                  <CurrencyEuroIcon className="input-icon" />
                  Charges mensuelles (€)
                </label>
                <input
                  type="number"
                  id="charges"
                  name="charges"
                  value={formData.charges}
                  onChange={handleChange}
                  min="0"
                  step="1"
                />
              </div>

              <div className="form-info">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <p>
                  Une fois le contrat créé, le bien sera marqué comme "Loué" et le locataire
                  pourra consulter son contrat dans son espace personnel.
                </p>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => navigate(-1)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Création en cours...' : 'Créer le contrat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .create-contract-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
          padding: 40px 20px;
        }

        .create-contract-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .back-button:hover {
          color: #2563eb;
        }

        .page-header h1 {
          color: #1f2937;
          font-size: 28px;
          margin-bottom: 10px;
        }

        .page-header p {
          color: #6b7280;
        }

        .contract-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 30px;
        }

        .request-summary,
        .contract-form-container {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .request-summary h2,
        .contract-form-container h2 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-card {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .summary-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .summary-icon {
          width: 20px;
          height: 20px;
          color: #2563eb;
          margin-top: 2px;
        }

        .summary-label {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .summary-value {
          color: #1f2937;
          font-weight: 500;
          margin: 0;
        }

        .summary-address {
          color: #6b7280;
          font-size: 13px;
          margin: 5px 0 0;
        }

        .contract-form {
          margin-top: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #374151;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .input-icon {
          width: 16px;
          height: 16px;
          color: #6b7280;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 14px;
        }

        .form-group input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .form-info {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          background: #f0f9ff;
          border-radius: 5px;
          margin: 20px 0;
        }

        .form-info p {
          color: #0369a1;
          font-size: 14px;
          margin: 0;
        }

        .form-actions {
          display: flex;
          gap: 15px;
        }

        .btn-cancel,
        .btn-submit {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        .btn-submit {
          background: #2563eb;
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .contract-content {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateContract;