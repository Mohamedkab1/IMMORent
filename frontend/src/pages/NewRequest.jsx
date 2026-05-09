import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();
  
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
      toast.error(t('req.no_property', 'Aucun bien sélectionné'));
      navigate('/properties');
      return;
    }
    const id = parseInt(propertyId);
    if (isNaN(id)) {
      toast.error(t('req.invalid_id', 'ID invalide'));
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
        toast.error(t('req.not_found', 'Bien non trouvé'));
        navigate('/properties');
      }
    } catch (error) {
      toast.error(t('req.load_error', 'Erreur de chargement'));
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
      
      if (!formData.start_date) newErrors.start_date = t('req.err.start_req', 'Date de début requise');
      else if (startDate < today) newErrors.start_date = t('req.err.start_past', 'Date de début dans le passé');
      
      if (!formData.end_date) newErrors.end_date = t('req.err.end_req', 'Date de fin requise');
      else if (endDate <= startDate) newErrors.end_date = t('req.err.end_after', 'Date de fin après début');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!user) {
      toast.info(t('req.login_req', 'Connectez-vous'));
      navigate('/login');
      return;
    }
    if (user.role?.slug !== 'client') {
      toast.error(t('req.client_only', 'Seuls les clients peuvent faire une demande'));
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
      } else {
        // Cas où l'API retourne success: false sans exception
        toast.error(response.message || t('req.send_error', 'Erreur lors de l\'envoi'));
      }
    } catch (error) {
      if (error.response?.status === 422) {
        // Erreurs de validation Laravel
        const validationErrors = error.response.data.errors || {};
        setErrors(validationErrors);
        Object.values(validationErrors).forEach(err => toast.error(Array.isArray(err) ? err[0] : err));
      } else if (error.response?.status === 400) {
        // ✅ Erreur métier : bien réservé, dates conflictuelles, etc.
        const serverMessage = error.response.data?.message || t('req.impossible', 'Cette réservation est impossible.');
        const propertyStatus = error.response.data?.property_status;

        // Afficher un toast d'erreur rouge bien visible
        toast.error(serverMessage, { autoClose: 6000 });

        // Si c'est un conflit de dates, surligner les champs
        if (propertyStatus === 'date_conflict') {
          setErrors({
            start_date: t('req.dates_taken', 'Ces dates sont déjà prises'),
            end_date: t('req.dates_taken', 'Ces dates sont déjà prises')
          });
        }
      } else if (error.response?.status === 404) {
        toast.error(t('req.not_found_retry', 'Bien introuvable. Veuillez réessayer.'));
      } else {
        toast.error(error.response?.data?.message || t('req.send_error_req', 'Erreur lors de l\'envoi de la demande'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-soft flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-border-main border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-text-muted font-medium">{t('common.loading', 'Chargement...')}</p>
      </div>
    );
  }

  if (!property) return null;

  const isRent = property.transaction_type === 'rent';
  const requestType = isRent ? t('common.rent', 'location') : t('common.buy', 'achat');
  const TypeIcon = isRent ? KeyIcon : TagIcon;

  // ✅ Seuls 'sold' et 'unavailable' bloquent totalement la réservation
  const blockedStatuses = {
    sold:        { color: 'gray', icon: '🏷️', msg: t('req.status.sold', 'Ce bien a déjà été vendu et n\'est plus disponible.') },
    unavailable: { color: 'gray', icon: '⛔', msg: t('req.status.unavailable', 'Ce bien n\'est plus disponible à la réservation.') },
  };
  const blockedInfo = blockedStatuses[property.status];

  // ✅ Infos pour biens loués/réservés (réservables sur dates libres)
  const infoStatuses = {
    rented:   { color: 'blue',  icon: 'ℹ️', msg: t('req.status.rented', 'Ce bien est actuellement loué. Vous pouvez quand même le réserver pour des dates futures libres — le système vérifiera les conflits automatiquement.') },
    reserved: { color: 'amber', icon: '⚠️', msg: t('req.status.reserved', 'Ce bien a déjà une réservation en cours. Choisissez des dates différentes et le système vérifiera la disponibilité.') },
  };
  const infoStatus = infoStatuses[property.status];

  return (
    <div className="min-h-screen bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-text-sub hover:text-primary font-bold transition-colors mb-6 group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t('req.back', 'Retour au bien')}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <ClipboardDocumentCheckIcon className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-text-main tracking-tight">{t('req.title', 'Demande de')} {requestType}</h1>
                <p className="text-text-sub font-medium">{t('req.subtitle', 'Réservez ce bien immobilièr ou planifiez une visite personnalisée.')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Property Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-bg-card rounded-3xl p-6 border border-border-main shadow-huge sticky top-24">
              <h2 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
                  <HomeIcon className="w-5 h-5 text-primary" />
                  {t('req.selected_prop', 'Bien sélectionné')}
              </h2>
              
              <div className="rounded-2xl overflow-hidden mb-6 bg-bg-soft relative group">
                <img 
                    src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} 
                    alt={property.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'; }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg ${isRent ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {isRent ? t('common.rent', 'Location') : t('common.buy', 'Vente')}
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
                        <span className="font-bold text-text-main">{property.price.toLocaleString()} DH</span>{isRent ? <span className="text-xs">{t('prop.per_month', '/mois')}</span> : ''}
                    </p>
                    <p className="flex items-center gap-3 text-text-sub font-medium">
                        <HomeIcon className="w-5 h-5 text-primary" /> {property.surface} m² - {property.rooms} {t('prop.rooms', 'pièces')}
                    </p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Form */}
          <div className="lg:col-span-3">
            <div className="bg-bg-card rounded-3xl p-8 md:p-10 border border-border-main shadow-huge">

              {/* ✅ Alerte blocante : vendu / indisponible */}
              {blockedInfo && (
                <div className="flex items-start gap-4 p-5 mb-8 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/30 rounded-2xl">
                  <span className="text-2xl flex-shrink-0">{blockedInfo.icon}</span>
                  <div>
                    <h4 className="font-bold text-rose-700 dark:text-rose-400 mb-1">{t('req.booking_impossible', 'Réservation impossible')}</h4>
                    <p className="text-sm text-rose-600 dark:text-rose-300">{blockedInfo.msg}</p>
                  </div>
                </div>
              )}

              {/* ✅ Info : bien loué/réservé mais dates libres disponibles */}
              {!blockedInfo && infoStatus && (
                <div className={`flex items-start gap-4 p-5 mb-8 rounded-2xl border ${
                  infoStatus.color === 'blue'
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30'
                }`}>
                  <span className="text-2xl flex-shrink-0">{infoStatus.icon}</span>
                  <div>
                    <h4 className={`font-bold mb-1 ${infoStatus.color === 'blue' ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {infoStatus.color === 'blue' ? t('req.currently_rented', 'Bien actuellement loué') : t('req.already_reserved', 'Bien déjà réservé sur certaines dates')}
                    </h4>
                    <p className={`text-sm ${infoStatus.color === 'blue' ? 'text-blue-600 dark:text-blue-300' : 'text-amber-600 dark:text-amber-300'}`}>
                      {infoStatus.msg}
                    </p>
                  </div>
                </div>
              )}

              <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold mb-8">
                <TypeIcon className="w-5 h-5" />
                {t('req.details_title', 'Détails de la demande')}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {isRent ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" /> {t('req.start_date', 'Date de début')}
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
                          <CalendarIcon className="w-4 h-4" /> {t('req.end_date', 'Date de fin')}
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
                        <h4 className="font-bold mb-1">{t('req.buy_request', 'Demande d\'achat')}</h4>
                        <p className="text-sm opacity-90">{t('req.buy_notice', 'Vous êtes sur le point de soumettre une intention d\'achat pour ce bien. L\'agent responsable vous contactera dans les plus brefs délais pour convenir d\'une visite et discuter des étapes suivantes.')}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-sub flex items-center gap-2">
                      <UserIcon className="w-4 h-4" /> {t('req.msg_agent', 'Message destiné à l\'agent')}
                  </label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows="5" 
                    placeholder={t('req.msg_placeholder', "Précisez ici vos attentes, vos disponibilités pour une visite, ou toute autre question concernant ce bien...")}
                    className="w-full p-4 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border-main">
                  <button 
                    type="button" 
                    className="flex-1 py-4 px-6 bg-bg-soft border border-border-main text-text-main rounded-xl font-bold hover:bg-border-main transition-colors flex items-center justify-center" 
                    onClick={() => navigate(-1)}
                   >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting || !!blockedInfo}
                    title={blockedInfo ? blockedInfo.msg : ''}
                    className="flex-[2] py-4 px-6 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            {t('req.sending', 'Envoi en cours...')}
                        </>
                    ) : (
                        <>{t('req.send_btn', 'Envoyer la demande de')} {requestType}</>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-text-muted mt-6">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                  {t('req.agent_response', 'Généralement, l\'agent répond en moins de 24 heures.')}
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