import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { propertyService } from '../services/properties';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  XMarkIcon, 
  PhotoIcon, 
  MapPinIcon, 
  HomeIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  KeyIcon,
  TagIcon,
  LockClosedIcon,
  InformationCircleIcon,
  StarIcon,
  LinkIcon,
  CheckIcon,
  ClipboardIcon,
  ChatBubbleBottomCenterTextIcon,
  ShareIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map view
const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

const AddProperty = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAgent, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [categories, setCategories] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    transaction_type: 'rent',
    address: '',
    city: '',
    postal_code: '',
    surface: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    type: 'apartment',
    category_id: '',
    latitude: '',
    longitude: '',
  });

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newPropertyId, setNewPropertyId] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (!isAuthenticated) navigate('/login');
    else if (!isAgent && !isAdmin) navigate('/dashboard');
  }, [isAuthenticated, isAgent, isAdmin]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) { 
        setCategories(data.data); 
        if (data.data.length) setFormData(prev => ({ ...prev, category_id: data.data[0].id })); 
      }
    } catch (error) { 
      setCategories([
        { id: 1, name: t('prop.types.apartment', 'Appartement') }, 
        { id: 2, name: t('prop.types.house', 'Maison') }, 
        { id: 3, name: t('prop.types.commercial', 'Local commercial') }, 
        { id: 4, name: t('prop.types.land', 'Terrain') }, 
        { id: 5, name: t('prop.types.studio', 'Studio') }
      ]); 
      setFormData(prev => ({ ...prev, category_id: 1 })); 
    }
  };

  const propertyTypes = [
    { value: 'apartment', label: t('prop.types.apartment', 'Appartement') },
    { value: 'house', label: t('prop.types.house', 'Maison') },
    { value: 'villa', label: t('prop.types.villa', 'Villa') },
    { value: 'studio', label: t('prop.types.studio', 'Studio') },
    { value: 'office', label: t('prop.types.office', 'Bureau') },
    { value: 'commercial', label: t('prop.types.commercial', 'Local commercial') },
    { value: 'land', label: t('prop.types.land', 'Terrain') }
  ];

  const transactionTypes = [
    { value: 'rent', label: t('common.rent', 'Location'), icon: KeyIcon, description: t('prop.rent_desc', 'Location mensuelle') },
    { value: 'sale', label: t('common.buy', 'Vente'), icon: TagIcon, description: t('prop.sale_desc', 'Vente définitive') }
  ];

  const handleChange = (e) => { 
    const { name, value } = e.target; 
    setFormData(prev => ({ ...prev, [name]: value })); 
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: null })); 

    if (name === 'address' && value.length > 3) {
      searchAddress(value);
    } else if (name === 'address') {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const searchAddress = async (query) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`, {
        headers: {
          'User-Agent': 'IMMORent-App'
        }
      });
      const data = await res.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Geocoding error", error);
    }
  };

  const selectSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.display_name,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      city: suggestion.address.city || suggestion.address.town || suggestion.address.village || prev.city,
      postal_code: suggestion.address.postcode || prev.postal_code,
    }));
    setShowSuggestions(false);
  };

  const handleTransactionTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, transaction_type: type }));
  };

  const handleImageChange = (e) => { 
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/')); 
    if (images.length + files.length > 10) {
       toast.warning(t('admin.add.val.max_images', 'Maximum 10 photos autorisées.'));
       return;
    }
    setImages(prev => [...prev, ...files]); 
    files.forEach(f => { 
      const reader = new FileReader(); 
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]); 
      reader.readAsDataURL(f); 
    }); 
  };

  const removeImage = (index) => { 
    setImages(prev => prev.filter((_, i) => i !== index)); 
    setImagePreviews(prev => prev.filter((_, i) => i !== index)); 
  };

  const addFeature = () => { 
    if (newFeature.trim() && !featuresList.includes(newFeature.trim())) { 
      setFeaturesList([...featuresList, newFeature.trim()]); 
      setNewFeature(''); 
    } 
  };

  const removeFeature = (index) => setFeaturesList(featuresList.filter((_, i) => i !== index));

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = t('admin.add.val.title', 'Le titre est requis');
    if (!formData.description.trim()) errors.description = t('admin.add.val.description', 'La description est requise');
    if (!formData.price || formData.price <= 0) errors.price = t('admin.add.val.price', 'Le prix doit être supérieur à zéro');
    if (!formData.address.trim()) errors.address = t('admin.add.val.address', 'L\'adresse est requise');
    if (!formData.city.trim()) errors.city = t('admin.add.val.city', 'La ville est requise');
    if (!formData.postal_code.trim()) errors.postal_code = t('admin.add.val.postal', 'Le code postal est requis');
    if (!formData.surface || formData.surface <= 0) errors.surface = t('admin.add.val.surface', 'La surface est requise');
    if (formData.type !== 'land' && (!formData.rooms || formData.rooms <= 0)) errors.rooms = t('admin.add.val.rooms', 'Le nombre de pièces est requis');
    if (!formData.type) errors.type = t('admin.add.val.type', 'Le type de bien est requis');

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { 
      toast.error(t('admin.add.val.form_errors', 'Veuillez corriger les erreurs dans le formulaire.'));
      // Scroll to first error here optimally
      return; 
    }
    
    if (images.length === 0) {
      toast.warning(t('admin.add.val.image_required', 'Veuillez ajouter au moins une photo.'));
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', parseFloat(formData.price));
      data.append('transaction_type', formData.transaction_type);
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('postal_code', formData.postal_code);
      data.append('surface', parseFloat(formData.surface));
      data.append('rooms', parseInt(formData.rooms) || 1);
      data.append('bedrooms', parseInt(formData.bedrooms) || 0);
      data.append('bathrooms', parseInt(formData.bathrooms) || 0);
      data.append('bathrooms', parseInt(formData.bathrooms) || 0);
      data.append('type', formData.type);
      data.append('category_id', parseInt(formData.category_id));
      if (formData.latitude) data.append('latitude', formData.latitude);
      if (formData.longitude) data.append('longitude', formData.longitude);
      data.append('features', JSON.stringify(featuresList));
      images.forEach(img => data.append('images[]', img));
      
      const res = await propertyService.create(data);
      if (res.success) { 
        toast.success(t('admin.add.success_title', 'Bien immobilier ajouté avec succès !')); 
        setNewPropertyId(res.data.id);
        setShowSuccessModal(true);
      } else {
        toast.error(res.message || 'Une erreur est survenue.');
      }
    } catch (error) { 
      if (error.response?.status === 422) {
         Object.values(error.response.data.errors).forEach(e => toast.error(e[0])); 
      } else {
         toast.error(t('admin.add.val.server_error', 'Erreur de connexion au serveur.')); 
      }
    } finally { setLoading(false); }
  };

  if (!isAgent && !isAdmin) {
    return (
      <div className="min-h-screen bg-bg-soft flex justify-center items-center px-4">
        <div className="bg-bg-card p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-border-main">
          <LockClosedIcon className="w-20 h-20 text-rose-500 mx-auto mb-6 bg-rose-50 dark:bg-rose-900/30 p-4 rounded-full" />
          <h2 className="text-2xl font-black text-text-main mb-2">{t('admin.add.restricted', 'Accès restreint')}</h2>
          <p className="text-text-muted mb-8 font-medium">{t('admin.add.no_auth', "Vous n'avez pas les autorisations nécessaires pour accéder à cette interface de création.")}</p>
          <button onClick={() => navigate('/dashboard')} className="w-full py-3.5 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-md">
            {t('admin.add.back_dash', 'Retourner au tableau de bord')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-soft transition-colors py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border-main">
          <button onClick={() => navigate(-1)} className="p-2 text-text-muted hover:text-primary bg-bg-card border border-border-main hover:bg-bg-soft rounded-full transition-colors shadow-sm">
            <ArrowLeftIcon className="w-6 h-6 rtl:rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">{t('admin.add.title', 'Ajouter un bien')}</h1>
            <p className="text-sm text-text-muted mt-1 font-medium">{t('admin.add.subtitle', 'Remplissez les informations ci-dessous pour publier une nouvelle annonce.')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section: Informations générales */}
          <div className="bg-bg-card rounded-2xl md:rounded-3xl shadow-sm border border-border-main overflow-hidden">
            <div className="bg-bg-soft p-6 border-b border-border-main flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                 <DocumentTextIcon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text-main">{t('admin.add.gen_info', 'Informations générales')}</h2>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                  {t('admin.add.ad_title', 'Titre de l\'annonce')} <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleChange} 
                  placeholder={t('admin.add.title_ph', "Ex: Superbe appartement lumineux en plein coeur de ville")} 
                  className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.title ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                />
                {validationErrors.title && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><InformationCircleIcon className="w-3.5 h-3.5"/> {validationErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                  {t('common.description', 'Description')} <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  name="description" rows="5" value={formData.description} onChange={handleChange} 
                  placeholder={t('admin.add.desc_ph', "Décrivez les atouts de votre bien en détail...")}
                  className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all resize-y ${validationErrors.description ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                />
                {validationErrors.description && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><InformationCircleIcon className="w-3.5 h-3.5"/> {validationErrors.description}</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                  {t('admin.add.category', 'Catégorie')} <span className="text-rose-500">*</span>
                </label>
                <select 
                  name="type" value={formData.type} onChange={handleChange} 
                  className={`w-full px-4 py-3 bg-bg-soft border outline-none rounded-xl text-text-main font-medium transition-all appearance-none cursor-pointer ${validationErrors.type ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary hover:border-slate-400'}`}
                >
                  {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {validationErrors.type && <p className="text-rose-500 text-xs font-semibold mt-1">{validationErrors.type}</p>}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                    {t('admin.add.trans_type', 'Type de transaction')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {transactionTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTransactionTypeSelect(type.value)}
                        className={`flex-1 flex flex-col justify-center items-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.transaction_type === type.value ? 'border-primary bg-primary/5 dark:bg-primary/20 shadow-md shadow-primary/10' : 'border-border-main bg-bg-card hover:border-primary/50'}`}
                      >
                        <type.icon className={`w-6 h-6 ${formData.transaction_type === type.value ? 'text-primary' : 'text-text-muted'}`} />
                        <span className={`font-bold text-sm ${formData.transaction_type === type.value ? 'text-primary dark:text-white' : 'text-text-sub'}`}>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                    <CurrencyDollarIcon className="w-4 h-4 text-text-muted" /> {t('admin.add.price', 'Prix')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" name="price" value={formData.price} onChange={handleChange} 
                      placeholder={t('admin.add.amount', "Montant")} 
                      className={`w-full ps-4 pe-20 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.price ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                    />
                    <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none text-text-muted font-bold text-sm">
                       DH {formData.transaction_type === 'rent' ? t('prop.per_month', '/ ms') : ''}
                    </div>
                  </div>
                  {validationErrors.price && <p className="text-rose-500 text-xs font-semibold mt-1">{validationErrors.price}</p>}
                </div>
              </div>

            </div>
          </div>

          {/* Section: Localisation */}
          <div className="bg-bg-card rounded-2xl md:rounded-3xl shadow-sm border border-border-main overflow-hidden">
            <div className="bg-bg-soft p-6 border-b border-border-main flex items-center gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                 <MapPinIcon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text-main">{t('admin.add.loc', 'Localisation')}</h2>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2 relative">
                <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                  {t('admin.add.full_address', 'Adresse complète')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" name="address" value={formData.address} onChange={handleChange} 
                    placeholder={t('admin.add.addr_ph', "Numéro, rue, bâtiment...")}
                    className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.address ? 'border-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                    autoComplete="off"
                  />
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-bg-card border border-border-main rounded-xl shadow-xl overflow-hidden animate-fade-in">
                      {addressSuggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectSuggestion(s)}
                          className="w-full text-left px-4 py-3 hover:bg-bg-soft text-sm text-text-main border-b border-border-main last:border-0 transition-colors"
                        >
                          {s.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {validationErrors.address && <p className="text-rose-500 text-xs font-semibold">{validationErrors.address}</p>}
              </div>

              {formData.latitude && formData.longitude && (
                <div className="rounded-xl overflow-hidden border border-border-main shadow-sm h-64 w-full relative z-0">
                  <MapContainer center={[formData.latitude, formData.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[formData.latitude, formData.longitude]} />
                    <ChangeView center={[formData.latitude, formData.longitude]} />
                  </MapContainer>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                    {t('admin.add.city', 'Ville')} <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" name="city" value={formData.city} onChange={handleChange} 
                    placeholder={t('admin.add.city', 'Ville')}
                    className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.city ? 'border-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                  />
                  {validationErrors.city && <p className="text-rose-500 text-xs font-semibold">{validationErrors.city}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                    {t('admin.add.postal', 'Code postal')} <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} 
                    placeholder={t('admin.add.postal_ph', 'Ex: 20000')} 
                    className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.postal_code ? 'border-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                  />
                  {validationErrors.postal_code && <p className="text-rose-500 text-xs font-semibold">{validationErrors.postal_code}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Caractéristiques */}
          <div className="bg-bg-card rounded-2xl md:rounded-3xl shadow-sm border border-border-main overflow-hidden">
            <div className="bg-bg-soft p-6 border-b border-border-main flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                 <HomeIcon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text-main">{t('admin.add.features_title', 'Caractéristiques du bien')}</h2>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-sm font-bold text-text-main">
                    {t('admin.add.surface', 'Surface')} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" name="surface" value={formData.surface} onChange={handleChange} 
                      placeholder={t('admin.add.surface_ph', 'Ex: 80')} 
                      className={`w-full ps-4 pe-10 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.surface ? 'border-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                    />
                    <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none text-text-muted font-bold text-sm">m²</div>
                  </div>
                  {validationErrors.surface && <p className="text-rose-500 text-xs font-semibold">{validationErrors.surface}</p>}
                </div>

                {formData.type !== 'land' && (
                  <>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm font-bold text-text-main">
                        {t('admin.add.rooms', 'Pièces')} <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="number" name="rooms" value={formData.rooms} onChange={handleChange} 
                        className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.rooms ? 'border-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                      />
                      {validationErrors.rooms && <p className="text-rose-500 text-xs font-semibold">{validationErrors.rooms}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm font-bold text-text-main">
                        {t('admin.add.bedrooms', 'Chambres')}
                      </label>
                      <input 
                        type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} 
                        className="w-full px-4 py-3 bg-bg-soft border border-border-main appearance-none outline-none rounded-xl text-text-main font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm font-bold text-text-main">
                        {t('admin.add.bathrooms', 'Salles de bain')}
                      </label>
                      <input 
                        type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} 
                        className="w-full px-4 py-3 bg-bg-soft border border-border-main appearance-none outline-none rounded-xl text-text-main font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section: Équipements (Features) */}
          <div className="bg-bg-card rounded-2xl md:rounded-3xl shadow-sm border border-border-main overflow-hidden">
            <div className="bg-bg-soft p-6 border-b border-border-main flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                 <StarIcon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text-main">{t('admin.add.equipments', 'Équipements & Prestations')}</h2>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
               <div className="flex flex-col sm:flex-row gap-3">
                 <input 
                   type="text" value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyPress={e => {if(e.key === 'Enter') { e.preventDefault(); addFeature(); }}} 
                   placeholder={t('admin.add.feat_ph', "Ex: Climatisation, Garage, Piscine...")}
                   className="flex-1 px-4 py-3 bg-bg-soft border border-border-main appearance-none outline-none rounded-xl text-text-main font-medium transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                 />
                 <button 
                   type="button" onClick={addFeature} 
                   className="px-6 py-3 bg-primary !text-white !opacity-100 hover:bg-primary-hover rounded-xl font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm"
                 >
                   <PlusIcon className="w-5 h-5 !text-white"/> {t('admin.add.add_btn', 'Ajouter')}
                 </button>
               </div>
               
               {featuresList.length > 0 && (
                 <div className="flex flex-wrap gap-3 mt-4">
                   {featuresList.map((f, i) => (
                     <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-bg-soft text-primary rounded-lg text-sm font-bold border border-border-main shadow-sm animate-fade-in-up">
                       {f}
                       <button type="button" onClick={() => removeFeature(i)} className="text-primary/70 hover:text-rose-500 transition-colors bg-bg-card rounded-full p-0.5">
                         <XMarkIcon className="w-4 h-4" />
                       </button>
                     </span>
                   ))}
                 </div>
               )}
            </div>
          </div>

          {/* Section: Photos */}
          <div className="bg-bg-card rounded-2xl md:rounded-3xl shadow-sm border border-border-main overflow-hidden">
            <div className="bg-bg-soft p-6 border-b border-border-main flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                 <PhotoIcon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text-main">{t('admin.add.gallery', 'Galerie Photos')} <span className="text-rose-500">*</span></h2>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
               <div className="w-full">
                 <input 
                   type="file" multiple accept="image/*" id="images-upload" 
                   onChange={handleImageChange} className="hidden" 
                 />
                 <label htmlFor="images-upload" className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed border-border-main hover:border-primary bg-bg-soft hover:bg-bg-card rounded-2xl cursor-pointer transition-all group">
                   <div className="w-16 h-16 bg-bg-card shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <PhotoIcon className="w-8 h-8 text-primary" />
                   </div>
                   <span className="text-text-main font-bold text-lg mb-1">{t('admin.add.click_upload', 'Cliquer pour importer')}</span>
                   <span className="text-text-sub text-sm font-medium px-4 text-center">{t('admin.add.upload_info', 'PNG, JPG ou WEBP. Max 10 photos.')}</span>
                 </label>
               </div>

               {imagePreviews.length > 0 && (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                   {imagePreviews.map((preview, i) => (
                     <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border-main shadow-sm group">
                       <img src={preview} alt={t('common.preview', 'Prévisualisation')} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <button 
                         type="button" onClick={() => removeImage(i)}
                         className="absolute top-2 right-2 w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md scale-0 group-hover:scale-100 transition-transform"
                         title={t('common.delete', 'Supprimer')}
                       >
                         <XMarkIcon className="w-5 h-5"/>
                       </button>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>

          {/* Floating Actions Line */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4 pb-12">
            <button type="button" onClick={() => navigate(-1)} className="px-8 py-4 bg-bg-card hover:bg-bg-soft text-text-main border border-border-main rounded-xl font-bold shadow-sm transition-all text-center">
              {t('common.cancel', 'Annuler')}
            </button>
            <button type="submit" disabled={loading} className="px-10 py-4 bg-primary !text-white !opacity-100 hover:bg-primary-hover active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-bold shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3">
              {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              <span className="!text-white !opacity-100">{loading ? t('admin.add.publishing', 'Publication en cours...') : t('admin.add.publish', 'Publier l\'annonce')}</span>
            </button>
          </div>
          
        </form>
      </div>

      {/* Success Sharing Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-border-main overflow-hidden animate-scale-up">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="w-10 h-10 stroke-[3]" />
              </div>
              <h2 className="text-3xl font-black text-text-main mb-2">{t('admin.add.success_title', 'Bien ajouté !')}</h2>
              <p className="text-text-muted font-medium mb-8">{t('admin.add.success_msg', 'Votre annonce est maintenant en ligne. Vous pouvez la partager dès maintenant.')}</p>

              <div className="space-y-4">
                <div className="relative group">
                  <input 
                    readOnly 
                    value={`${window.location.origin}/properties/${newPropertyId}`}
                    className="w-full px-4 py-4 bg-bg-soft border border-border-main rounded-2xl text-sm font-bold text-primary text-center pr-12 focus:outline-none"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/properties/${newPropertyId}`);
                      toast.success("Lien copié !");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-primary transition-colors"
                  >
                    <ClipboardIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(t('admin.add.share_msg', 'Découvrez ce bien : ') + window.location.origin + "/properties/" + newPropertyId)}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-green-500/20"
                  >
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5" /> WhatsApp
                  </a>
                  <a 
                    href={`mailto:?subject=${encodeURIComponent(t('admin.add.share_title', 'Bien immobilier'))}&body=${encodeURIComponent(t('admin.add.share_msg', 'Découvrez ce bien : ') + window.location.origin + "/properties/" + newPropertyId)}`}
                    className="flex items-center justify-center gap-2 py-4 bg-bg-soft border border-border-main text-text-main rounded-2xl font-bold hover:bg-bg-card transition-all"
                  >
                    <EnvelopeIcon className="w-5 h-5" /> Email
                  </a>
                </div>

                {navigator.share && (
                  <button 
                    onClick={() => navigator.share({ title: t('admin.add.share_title', 'Bien immobilier'), url: `${window.location.origin}/properties/${newPropertyId}` })}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-hover transition-all shadow-xl shadow-primary/20"
                  >
                    <ShareIcon className="w-5 h-5" /> {t('admin.add.more_options', 'Plus d\'options')}
                  </button>
                )}

                <button 
                  onClick={() => {
                    setShowSuccessModal(false);
                    setFormData({
                      title: '',
                      description: '',
                      price: '',
                      transaction_type: 'rent',
                      address: '',
                      city: '',
                      postal_code: '',
                      surface: '',
                      rooms: '',
                      bedrooms: '',
                      bathrooms: '',
                      type: 'apartment',
                      category_id: categories.length ? categories[0].id : '',
                      latitude: '',
                      longitude: '',
                    });
                    setImages([]);
                    setImagePreviews([]);
                    setFeaturesList([]);
                  }}
                  className="w-full py-4 text-text-muted font-bold hover:text-text-main transition-colors"
                >
                  {t('admin.add.close_add_another', 'Fermer et ajouter un autre bien')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProperty;