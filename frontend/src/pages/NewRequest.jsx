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
  ExclamationTriangleIcon,
  KeyIcon,
  TagIcon,
  ClipboardDocumentCheckIcon
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
    type: 'rent',
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
        setProperty(response.data);
        setFormData(prev => ({
          ...prev,
          type: response.data.transaction_type
        }));
        
        // Définir les dates par défaut uniquement pour la location
        if (response.data.transaction_type === 'rent') {
          const today = new Date();
          const nextMonth = new Date(today);
          nextMonth.setMonth(today.getMonth() + 1);
          const formatDate = (d) => d.toISOString().split('T')[0];
          setFormData(prev => ({
            ...prev,
            start_date: formatDate(today),
            end_date: formatDate(nextMonth)
          }));
        }
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
    
    if (formData.type === 'rent') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (!formData.start_date) newErrors.start_date = 'Date de début requise';
      else if (startDate < today) newErrors.start_date = 'Date de début dans le passé';
      
      if (!formData.end_date) newErrors.end_date = 'Date de fin requise';
      else if (endDate <= startDate) newErrors.end_date = 'Date de fin après début';
    }
    
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
        type: formData.type,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        message: formData.message || ''
      };
      const response = await requestService.create(requestData);
      if (response.success) {
        toast.success(response.message);
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
    return (
      <div className="min-h-screen bg-bg-soft flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-border-main border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-text-muted font-medium">Chargement...</p>
      </div>
    );
  }

  if (!property) return null;

  const isRent = property.transaction_type === 'rent';
  const requestType = isRent ? 'location' : 'achat';
  const TypeIcon = isRent ? KeyIcon : TagIcon;

  return (
    <div className="min-h-screen bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-text-sub hover:text-primary font-bold transition-colors mb-6 group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Retour au bien
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <ClipboardDocumentCheckIcon className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-text-main tracking-tight">Demande de {requestType}</h1>
                <p className="text-text-sub font-medium">Réservez ce bien immobilièr ou planifiez une visite personnalisée.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Property Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-bg-card rounded-3xl p-6 border border-border-main shadow-huge sticky top-24">
              <h2 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                  <HomeIcon className="w-5 h-5 text-primary" />
                  Bien sélectionné
              </h2>
              
              <div className="rounded-2xl overflow-hidden mb-6 bg-bg-soft relative group">
                <img 
                    src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} 
                    alt={property.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg ${isRent ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {isRent ? 'Location' : 'Vente'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-black text-text-main leading-tight">{property.title}</h3>
                
                <div className="flex flex-col gap-3 pt-2">
                    <p className="flex items-center gap-3 text-text-sub font-medium">
                        <MapPinIcon className="w-5 h-5 text-primary" /> {property.city}
                    </p>
                    <p className="flex items-center gap-3 text-text-sub font-medium">
                        <CurrencyEuroIcon className="w-5 h-5 text-primary" /> 
                        <span className="font-bold text-text-main">{property.price.toLocaleString()} DH</span>{isRent ? <span className="text-xs">/mois</span> : ''}
                    </p>
                    <p className="flex items-center gap-3 text-text-sub font-medium">
                        <HomeIcon className="w-5 h-5 text-primary" /> {property.surface} m² - {property.rooms} pièces
                    </p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Form */}
          <div className="lg:col-span-3">
            <div className="bg-bg-card rounded-3xl p-8 md:p-10 border border-border-main shadow-huge">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold mb-8">
                <TypeIcon className="w-5 h-5" />
                Détails de la demande
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {isRent ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" /> Date de début
                      </label>
                      <input 
                        type="date" 
                        name="start_date" 
                        value={formData.start_date} 
                        onChange={handleChange} 
                        min={new Date().toISOString().split('T')[0]} 
                        required 
                        className="w-full px-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                      {errors.start_date && <p className="text-xs font-bold text-rose-500 mt-1 flex items-center gap-1"><ExclamationTriangleIcon className="w-3 h-3"/>{errors.start_date}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" /> Date de fin
                      </label>
                      <input 
                        type="date" 
                        name="end_date" 
                        value={formData.end_date} 
                        onChange={handleChange} 
                        min={formData.start_date} 
                        required 
                        className="w-full px-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                      {errors.end_date && <p className="text-xs font-bold text-rose-500 mt-1 flex items-center gap-1"><ExclamationTriangleIcon className="w-3 h-3"/>{errors.end_date}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 p-5 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-500 rounded-2xl font-medium border border-amber-200 dark:border-amber-800/30">
                    <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold mb-1">Demande d'achat</h4>
                        <p className="text-sm opacity-90">Vous êtes sur le point de soumettre une intention d'achat pour ce bien. L'agent responsable vous contactera dans les plus brefs délais pour convenir d'une visite et discuter des étapes suivantes.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                      <UserIcon className="w-4 h-4" /> Message destiné à l'agent
                  </label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows="5" 
                    placeholder="Précisez ici vos attentes, vos disponibilités pour une visite, ou toute autre question concernant ce bien..." 
                    className="w-full p-4 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border-main">
                  <button 
                    type="button" 
                    className="flex-1 py-4 px-6 bg-bg-soft border border-border-main text-text-main rounded-xl font-bold hover:bg-border-main transition-colors flex items-center justify-center" 
                    onClick={() => navigate(-1)}
                   >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-[2] py-4 px-6 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Envoi en cours...
                        </>
                    ) : (
                        <>Envoyer la demande de {requestType}</>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-text-muted mt-6">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                  Généralement, l'agent répond en moins de 24 heures.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;