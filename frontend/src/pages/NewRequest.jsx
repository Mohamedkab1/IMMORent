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
  UserIcon
} from '@heroicons/react/24/outline';

const NewRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    message: ''
  });

  // Récupérer l'ID du bien depuis l'URL
  const queryParams = new URLSearchParams(location.search);
  const propertyId = queryParams.get('property');

  useEffect(() => {
    if (!propertyId) {
      toast.error('Aucun bien sélectionné');
      navigate('/properties');
      return;
    }

    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await propertyService.getById(propertyId);
      if (response.success && response.data) {
        setProperty(response.data);
        // Définir les dates par défaut
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        
        setFormData({
          ...formData,
          start_date: today.toISOString().split('T')[0],
          end_date: nextMonth.toISOString().split('T')[0]
        });
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Veuillez vous connecter pour faire une demande');
      navigate('/login');
      return;
    }

    if (user.role?.slug !== 'client') {
      toast.error('Seuls les clients peuvent faire des demandes de location');
      return;
    }

    // Validation des dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      toast.error('La date de début ne peut pas être dans le passé');
      return;
    }

    if (endDate <= startDate) {
      toast.error('La date de fin doit être postérieure à la date de début');
      return;
    }

    setSubmitting(true);

    try {
      const response = await requestService.create({
        property_id: parseInt(propertyId),
        start_date: formData.start_date,
        end_date: formData.end_date,
        message: formData.message
      });

      if (response.success) {
        toast.success('Demande envoyée avec succès !');
        navigate('/dashboard/client');
      } else {
        toast.error(response.message || 'Erreur lors de l\'envoi de la demande');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de la demande');
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

  return (
    <div className="request-page">
      <div className="request-container">
        {/* En-tête */}
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
                  required
                />
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
                  required
                />
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
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .form-group input[type="date"] {
          font-family: inherit;
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
          transition: all 0.3s;
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