import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/properties';
import { requestService } from '../services/requests';
import { toast } from 'react-toastify';
import { 
  HomeIcon, 
  CalendarIcon, 
  MapPinIcon,
  CurrencyEuroIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const NewRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    start_date: '',
    end_date: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  // Récupérer l'ID du bien depuis l'URL
  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('property');

  useEffect(() => {
    if (!propertyId) {
      toast.error('Aucun bien sélectionné');
      navigate('/properties');
      return;
    }

    const id = parseInt(propertyId);
    if (isNaN(id)) {
      toast.error('ID de bien invalide');
      navigate('/properties');
      return;
    }

    setFormData(prev => ({ ...prev, property_id: id }));
    fetchProperty(id);
  }, [propertyId]);

  const fetchProperty = async (id) => {
    try {
      const response = await propertyService.getById(id);
      if (response.success && response.data) {
        setProperty(response.data);
        
        // Vérifier si le bien est à louer
        if (response.data.transaction_type !== 'rent') {
          toast.error('Ce bien est à vendre, pas à louer. Les demandes de location ne sont pas acceptées.');
          navigate('/properties');
          return;
        }
        
        // Définir les dates par défaut
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        setFormData(prev => ({
          ...prev,
          start_date: formatDate(today),
          end_date: formatDate(nextMonth)
        }));
      } else {
        toast.error('Bien non trouvé');
        navigate('/properties');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du bien');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (!formData.start_date) {
      newErrors.start_date = 'La date de début est requise';
    } else if (startDate < today) {
      newErrors.start_date = 'La date de début ne peut pas être dans le passé';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'La date de fin est requise';
    } else if (endDate <= startDate) {
      newErrors.end_date = 'La date de fin doit être postérieure à la date de début';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      toast.info('Veuillez vous connecter pour faire une demande');
      navigate('/login');
      return;
    }

    if (user.role?.slug !== 'client') {
      toast.error('Seuls les clients peuvent faire des demandes de location');
      return;
    }

    // Vérification supplémentaire
    if (property?.transaction_type !== 'rent') {
      toast.error('Ce bien n\'est pas disponible à la location');
      navigate('/properties');
      return;
    }

    setSubmitting(true);

    try {
      const requestData = {
        property_id: parseInt(formData.property_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        message: formData.message || ''
      };
      
      const response = await requestService.create(requestData);
      
      if (response.success) {
        toast.success('Demande envoyée avec succès !');
        navigate('/dashboard/client?refresh=true');
      } else {
        toast.error(response.message || 'Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors.start_date) {
          toast.error(validationErrors.start_date[0]);
        }
        if (validationErrors.end_date) {
          toast.error(validationErrors.end_date[0]);
        }
        setErrors(validationErrors);
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de la demande');
      }
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
            margin-bottom: 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  // Si le bien est à vendre, afficher un message d'erreur
  if (property.transaction_type !== 'rent') {
    return (
      <div className="error-page">
        <div className="error-card">
          <ExclamationTriangleIcon className="error-icon" />
          <h2>Bien à vendre</h2>
          <p>Ce bien est à vendre, pas à louer. Les demandes de location ne sont pas acceptées.</p>
          <p className="property-info">
            <strong>Type de transaction:</strong> {property.transaction_type_label}
          </p>
          <div className="error-actions">
            <button onClick={() => navigate('/properties')} className="btn-primary">
              Voir tous les biens
            </button>
            <button onClick={() => navigate(`/properties/${property.id}`)} className="btn-secondary">
              Retour au bien
            </button>
          </div>
        </div>
        <style>{`
          .error-page {
            min-height: calc(100vh - 70px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: #f8fafc;
          }
          .error-card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          .error-icon {
            width: 60px;
            height: 60px;
            color: #f59e0b;
            margin: 0 auto 20px;
          }
          .error-card h2 {
            color: #1f2937;
            margin-bottom: 15px;
          }
          .error-card p {
            color: #6b7280;
            margin-bottom: 10px;
          }
          .property-info {
            background: #f3f4f6;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
          }
          .error-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
          }
          .btn-primary {
            padding: 10px 20px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          .btn-secondary {
            padding: 10px 20px;
            background: #f3f4f6;
            color: #374151;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="request-page">
      <div className="request-container">
        <div className="request-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeftIcon className="h-5 w-5" />
            Retour
          </button>
          <h1>Faire une demande de location</h1>
        </div>

        <div className="request-content">
          {/* Récapitulatif du bien */}
          <div className="property-summary">
            <h2>Bien sélectionné</h2>
            <div className="property-card">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={`http://localhost:8000/storage/${property.images[0]}`} 
                  alt={property.title}
                  className="property-image"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
                  }}
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400" 
                  alt={property.title}
                  className="property-image"
                />
              )}
              <div className="property-info">
                <h3>{property.title}</h3>
                <p className="property-location">
                  <MapPinIcon className="h-4 w-4" />
                  {property.city} {property.postal_code}
                </p>
                <p className="property-price">
                  <CurrencyEuroIcon className="h-4 w-4" />
                  {property.price?.toLocaleString('fr-FR')}€ / mois
                </p>
                <div className="property-features">
                  <span><HomeIcon className="h-4 w-4" /> {property.surface} m²</span>
                  <span><HomeIcon className="h-4 w-4" /> {property.rooms} pièces</span>
                </div>
                <div className="transaction-badge rent">
                  Location
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de demande */}
          <div className="request-form-container">
            <h2>Détails de la demande</h2>
            <form onSubmit={handleSubmit} className="request-form">
              <div className="form-group">
                <label htmlFor="start_date">
                  <CalendarIcon className="h-4 w-4" />
                  Date de début *
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.start_date ? 'error' : ''}
                  required
                />
                {errors.start_date && (
                  <span className="error-message">{errors.start_date}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="end_date">
                  <CalendarIcon className="h-4 w-4" />
                  Date de fin *
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  min={formData.start_date}
                  className={errors.end_date ? 'error' : ''}
                  required
                />
                {errors.end_date && (
                  <span className="error-message">{errors.end_date}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  <UserIcon className="h-4 w-4" />
                  Message (optionnel)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Ajoutez un message pour l'agent immobilier..."
                />
              </div>

              <div className="form-info">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <p>Votre demande sera envoyée à l'agent immobilier qui vous répondra dans les plus brefs délais.</p>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => navigate(-1)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .request-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
          padding: 40px 20px;
        }

        .request-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .request-header {
          margin-bottom: 30px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 16px;
          margin-bottom: 20px;
          padding: 0;
        }

        .back-button:hover {
          color: #2563eb;
        }

        .request-header h1 {
          color: #1f2937;
          font-size: 28px;
        }

        .request-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 30px;
        }

        .property-summary {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          height: fit-content;
        }

        .property-summary h2 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e5e7eb;
        }

        .property-card {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .property-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 5px;
        }

        .property-info h3 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .property-location,
        .property-price {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #6b7280;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .property-features {
          display: flex;
          gap: 20px;
          color: #4b5563;
          font-size: 14px;
        }

        .property-features span {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .transaction-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 10px;
        }

        .transaction-badge.rent {
          background: #dcfce7;
          color: #059669;
        }

        .request-form-container {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .request-form-container h2 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e5e7eb;
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
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 16px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #dc2626;
        }

        .error-message {
          color: #dc2626;
          font-size: 12px;
          margin-top: 5px;
          display: block;
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

        .btn-submit,
        .btn-cancel {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
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

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        @media (max-width: 768px) {
          .request-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default NewRequest;