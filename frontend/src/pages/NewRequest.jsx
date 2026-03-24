import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
      toast.error('ID invalide');
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
        if (response.data.transaction_type !== 'rent') {
          toast.error('Ce bien est à vendre, pas à louer');
          navigate('/properties');
          return;
        }
        setProperty(response.data);
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        const formatDate = (d) => d.toISOString().split('T')[0];
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
      toast.error('Erreur de chargement');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (!formData.start_date) newErrors.start_date = 'Date de début requise';
    else if (startDate < today) newErrors.start_date = 'Date de début dans le passé';
    
    if (!formData.end_date) newErrors.end_date = 'Date de fin requise';
    else if (endDate <= startDate) newErrors.end_date = 'Date de fin après début';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!user) {
      toast.info('Connectez-vous');
      navigate('/login');
      return;
    }
    if (user.role?.slug !== 'client') {
      toast.error('Seuls les clients peuvent faire une demande');
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
        toast.success('Demande envoyée !');
        navigate('/dashboard/client?refresh=true');
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        setErrors(validationErrors);
        Object.values(validationErrors).forEach(err => toast.error(err[0]));
      } else {
        toast.error('Erreur lors de l\'envoi');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div><p>Chargement...</p></div>;
  }

  if (!property || property.transaction_type !== 'rent') {
    return (
      <div className="error-page">
        <div className="error-card">
          <ExclamationTriangleIcon className="error-icon" />
          <h2>Bien à vendre</h2>
          <p>Ce bien n'est pas disponible à la location</p>
          <button onClick={() => navigate('/properties')}>Voir les biens</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="request-page">
        <div className="request-container">
          <div className="request-header">
            <button onClick={() => navigate(-1)} className="back-button">
              <ArrowLeftIcon className="h-5 w-5" />
              Retour
            </button>
            <h1>Demande de location</h1>
          </div>

          <div className="request-content">
            <div className="property-summary">
              <h2>Bien sélectionné</h2>
              <div className="property-card">
                <img src={property.images?.[0] ? `http://localhost:8000/storage/${property.images[0]}` : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} alt={property.title} />
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p><MapPinIcon className="h-4 w-4" /> {property.city}</p>
                  <p><CurrencyEuroIcon className="h-4 w-4" /> {property.price}€ / mois</p>
                  <p><HomeIcon className="h-4 w-4" /> {property.surface} m² - {property.rooms} pièces</p>
                </div>
              </div>
            </div>

            <div className="request-form-container">
              <h2>Détails de la demande</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label><CalendarIcon className="h-4 w-4" /> Date de début *</label>
                  <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
                  {errors.start_date && <span className="error">{errors.start_date}</span>}
                </div>

                <div className="form-group">
                  <label><CalendarIcon className="h-4 w-4" /> Date de fin *</label>
                  <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} min={formData.start_date} required />
                  {errors.end_date && <span className="error">{errors.end_date}</span>}
                </div>

                <div className="form-group">
                  <label><UserIcon className="h-4 w-4" /> Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Message pour l'agent..." />
                </div>

                <div className="form-info">
                  <CheckCircleIcon className="h-5 w-5" />
                  <p>L'agent vous répondra dans les plus brefs délais.</p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Envoi...' : 'Envoyer la demande'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .request-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
          padding: 2rem 1rem;
        }

        .request-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .request-header { margin-bottom: 2rem; }
        .back-button { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; color: #6b7280; margin-bottom: 1rem; }
        .back-button:hover { color: #d4af37; }
        .request-header h1 { font-size: 1.75rem; color: #0f2b4d; }

        .request-content { display: grid; grid-template-columns: 1fr 1.5fr; gap: 2rem; }

        .property-summary {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          height: fit-content;
        }

        .property-summary h2 { font-size: 1.125rem; color: #0f2b4d; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }

        .property-card img { width: 100%; height: 180px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem; }
        .property-info h3 { font-size: 1rem; margin-bottom: 0.5rem; color: #0f2b4d; }
        .property-info p { display: flex; align-items: center; gap: 0.25rem; color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem; }

        .request-form-container {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .request-form-container h2 { font-size: 1.125rem; color: #0f2b4d; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }

        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: flex; align-items: center; gap: 0.25rem; font-weight: 500; margin-bottom: 0.5rem; color: #374151; }
        .form-group input, .form-group textarea { width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #d4af37; }
        .error { color: #dc2626; font-size: 0.75rem; margin-top: 0.25rem; display: block; }

        .form-info { display: flex; align-items: center; gap: 0.5rem; padding: 1rem; background: #f0f9ff; border-radius: 0.5rem; margin: 1rem 0; }
        .form-info p { color: #0369a1; font-size: 0.875rem; margin: 0; }

        .form-actions { display: flex; gap: 1rem; }
        .btn-submit, .btn-cancel { flex: 1; padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
        .btn-submit { background: #d4af37; color: #0f2b4d; }
        .btn-submit:hover:not(:disabled) { background: #c4a52e; }
        .btn-cancel { background: #f3f4f6; color: #374151; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .loading { text-align: center; padding: 3rem; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .error-page { min-height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center; }
        .error-card { background: white; padding: 2rem; border-radius: 0.75rem; text-align: center; max-width: 400px; }
        .error-icon { width: 3rem; height: 3rem; color: #f59e0b; margin: 0 auto 1rem; }
        .error-card button { margin-top: 1rem; padding: 0.5rem 1rem; background: #d4af37; border: none; border-radius: 0.5rem; cursor: pointer; }

        @media (max-width: 768px) {
          .request-content { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default NewRequest;