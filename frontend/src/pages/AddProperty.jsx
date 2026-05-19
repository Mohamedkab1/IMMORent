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
  DocumentTextIcon,
  InformationCircleIcon,
  StarIcon,
  ClipboardIcon,
  CheckIcon,
  KeyIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

const getPropertyTypeFromCategory = (categoryId, categoriesList) => {
  const catId = parseInt(categoryId);
  
  if (categoriesList && categoriesList.length > 0) {
    const foundCat = categoriesList.find(c => parseInt(c.id) === catId);
    if (foundCat) {
      if (foundCat.slug) return foundCat.slug;
      
      const name = foundCat.name.toLowerCase();
      if (name.includes('apart') || name.includes('app') || name.includes('flat')) return 'apartment';
      if (name.includes('mais') || name.includes('hous')) return 'house';
      if (name.includes('villa')) return 'villa';
      if (name.includes('stud')) return 'studio';
      if (name.includes('bur') || name.includes('offic')) return 'office';
      if (name.includes('commer') || name.includes('loca')) return 'commercial';
      if (name.includes('terr') || name.includes('land')) return 'land';
    }
  }

  const map = {
    1: 'apartment',
    2: 'house',
    3: 'office',
    4: 'commercial',
    5: 'land',
    6: 'studio'
  };
  
  return map[catId] || 'apartment';
};

const AddProperty = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAgent, isAdmin } = useAuth();
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
    status: 'available'
  });

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newPropertyId, setNewPropertyId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    else if (!isAgent && !isAdmin) navigate('/dashboard');
    else fetchCategories();
  }, [isAuthenticated, isAgent, isAdmin]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && data.data.length > 0) { 
        setCategories(data.data); 
        const defaultCatId = data.data[0].id;
        setFormData(prev => ({ 
          ...prev, 
          category_id: defaultCatId,
          type: getPropertyTypeFromCategory(defaultCatId, data.data)
        })); 
      } else {
        const defaultCats = [
          { id: 1, name: t('prop.types.apartment', 'Appartement') }, 
          { id: 2, name: t('prop.types.house', 'Maison') }, 
          { id: 3, name: t('prop.types.commercial', 'Local commercial') }, 
          { id: 4, name: t('prop.types.land', 'Terrain') }, 
          { id: 5, name: t('prop.types.studio', 'Studio') }
        ];
        setCategories(defaultCats); 
        setFormData(prev => ({ ...prev, category_id: 1, type: 'apartment' })); 
      }
    } catch (error) { 
      const defaultCats = [
        { id: 1, name: t('prop.types.apartment', 'Appartement') }, 
        { id: 2, name: t('prop.types.house', 'Maison') }, 
        { id: 3, name: t('prop.types.commercial', 'Local commercial') }, 
        { id: 4, name: t('prop.types.land', 'Terrain') }, 
        { id: 5, name: t('prop.types.studio', 'Studio') }
      ];
      setCategories(defaultCats); 
      setFormData(prev => ({ ...prev, category_id: 1, type: 'apartment' })); 
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

  const statusOptions = [
    { value: 'available', label: t('prop.status.available', 'Disponible') },
    { value: 'rented', label: t('prop.status.rented', 'Loué') }, 
    { value: 'reserved', label: t('prop.status.reserved', 'Réservé') }, 
    { value: 'unavailable', label: t('prop.status.unavailable', 'Indisponible') }
  ];

  const transactionTypes = [
    { value: 'rent', label: t('common.rent', 'Location'), icon: KeyIcon },
    { value: 'sale', label: t('common.buy', 'Vente'), icon: TagIcon }
  ];

  const handleChange = (e) => { 
    const { name, value } = e.target; 
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'category_id') {
        updated.type = getPropertyTypeFromCategory(value, categories);
      }
      return updated;
    }); 
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
        headers: { 'User-Agent': 'IMMORent-App' }
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
      city: suggestion.address.city || suggestion.address.town || suggestion.address.village || prev.city || '',
      postal_code: suggestion.address.postcode || prev.postal_code || '',
    }));
    setShowSuggestions(false);
  };

  const handleTransactionTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, transaction_type: type }));
  };

  const handleImageChange = (e) => { 
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/')); 
    if (images.length + files.length > 10) {
      toast.warning('Maximum 10 photos autorisées au total.');
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

  const setMainImage = (index) => {
    if (index === 0) return;
    setImages(prev => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      updated.unshift(selected);
      return updated;
    });
    setImagePreviews(prev => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      updated.unshift(selected);
      return updated;
    });
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
    if (!formData.title.trim()) errors.title = 'Le titre est requis';
    if (!formData.description.trim()) errors.description = 'La description est requise';
    if (!formData.price || formData.price <= 0) errors.price = 'Le prix doit être valide';
    if (!formData.address.trim()) errors.address = 'L\'adresse est requise';
    if (!formData.city.trim()) errors.city = 'La ville est requise';
    if (!formData.postal_code.trim()) errors.postal_code = 'Le code postal est requis';
    if (!formData.surface || formData.surface <= 0) errors.surface = 'La surface est requise';
    
    // Do not validate rooms if category is terrain (land)
    if (formData.type !== 'land') {
      if (!formData.rooms || formData.rooms <= 0) errors.rooms = 'Le nombre de pièces est requis';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        let value = formData[key];
        // Override hidden values to 0 to avoid database / validation issues
        if (formData.type === 'land') {
          if (key === 'rooms') value = 0;
          if (key === 'bedrooms') value = 0;
          if (key === 'bathrooms') value = 0;
        } else if (formData.type === 'office') {
          if (key === 'bedrooms') value = 0;
        }
        if (value !== '' && value !== null) {
          data.append(key, value);
        }
      });
      data.append('features', JSON.stringify(featuresList));
      images.forEach(img => data.append('images[]', img));
      
      const res = await propertyService.create(data);
      if (res.success) { 
        toast.success(t('admin.add.success_title', 'Bien ajouté !')); 
        setNewPropertyId(res.data.id);
        setShowSuccessModal(true);
      } else {
        toast.error(res.message || 'Erreur lors de la création');
      }
    } catch (error) { 
      if (error.response && error.response.status === 422 && error.response.data.errors) {
        const validationMsgs = error.response.data.errors;
        Object.keys(validationMsgs).forEach(key => {
          toast.error(`${key}: ${validationMsgs[key].join(', ')}`);
        });
      } else {
        toast.error(error.response?.data?.message || t('admin.add.val.server_error', 'Erreur serveur'));
      }
    } finally { 
      setLoading(false); 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-bg-soft transition-colors pt-[120px] pb-12 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8 pb-6 border-b border-border-main"
        >
          <button onClick={() => navigate(-1)} className="p-2 text-text-muted hover:text-primary bg-bg-card border border-border-main hover:bg-bg-soft rounded-full transition-colors shadow-sm animate-fade-in">
            <ArrowLeftIcon className="w-6 h-6 rtl:rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">{t('admin.add.title_p1', 'Ajouter un bien')}</h1>
            <p className="text-sm text-text-muted mt-1 font-bold uppercase tracking-widest">{t('admin.add.subtitle', 'Publiez votre annonce immobilière en quelques étapes')}</p>
          </div>
        </motion.div>

        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          onSubmit={handleSubmit} 
          className="space-y-8"
        >
          
          {/* Section: Informations générales */}
          <motion.div variants={itemVariants} className="bg-bg-card rounded-xl shadow-sm border border-border-main overflow-hidden">
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
                  className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.title ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                  placeholder={t('admin.add.title_ph', "Ex: Appartement de luxe...")}
                />
                {validationErrors.title && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><InformationCircleIcon className="w-3.5 h-3.5"/> {validationErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">
                  {t('common.description', 'Description')} <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  name="description" rows="5" value={formData.description} onChange={handleChange} 
                  className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all resize-y ${validationErrors.description ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                  placeholder={t('admin.add.desc_ph', "Décrivez votre bien...")}
                />
                {validationErrors.description && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><InformationCircleIcon className="w-3.5 h-3.5"/> {validationErrors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">{t('admin.add.category', 'Catégorie')} <span className="text-rose-500">*</span></label>
                  <select 
                    name="category_id" value={formData.category_id} onChange={handleChange} 
                    className="w-full px-4 py-3 bg-bg-soft border border-border-main outline-none rounded-xl text-text-main font-medium transition-all appearance-none cursor-pointer focus:border-primary hover:border-slate-400"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">{t('admin.edit.status', 'Statut')} <span className="text-rose-500">*</span></label>
                  <select 
                    name="status" value={formData.status} onChange={handleChange} 
                    className="w-full px-4 py-3 bg-bg-soft border border-border-main outline-none rounded-xl text-text-main font-medium transition-all appearance-none cursor-pointer focus:border-primary hover:border-slate-400"
                  >
                    {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">{t('admin.add.trans_type', 'Type de transaction')} <span className="text-rose-500">*</span></label>
                  <div className="flex gap-4">
                    {transactionTypes.map(type => (
                      <button
                        key={type.value} type="button" onClick={() => handleTransactionTypeSelect(type.value)}
                        className={`flex-1 flex flex-col justify-center items-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.transaction_type === type.value ? 'border-primary bg-primary/10 shadow-md shadow-primary/10' : 'border-border-main bg-bg-card hover:border-primary/50'}`}
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
                      className={`w-full ps-4 pe-20 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.price ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none text-text-muted font-bold text-sm">
                       DH {formData.transaction_type === 'rent' ? t('prop.per_month', '/ ms') : ''}
                    </div>
                  </div>
                  {validationErrors.price && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><InformationCircleIcon className="w-3.5 h-3.5"/> {validationErrors.price}</p>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section: Localisation */}
          <motion.div variants={itemVariants} className="bg-bg-card rounded-xl shadow-sm border border-border-main overflow-hidden">
            <div className="bg-bg-soft p-6 border-b border-border-main flex items-center gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                 <MapPinIcon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text-main">{t('admin.add.loc', 'Localisation')}</h2>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2 relative group">
                <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">{t('admin.add.full_address', 'Adresse complète')} <span className="text-rose-500">*</span></label>
                <input 
                  type="text" name="address" value={formData.address} onChange={handleChange} 
                  className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.address ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                  autoComplete="off"
                />
                {validationErrors.address && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><InformationCircleIcon className="w-3.5 h-3.5"/> {validationErrors.address}</p>}
                
                <AnimatePresence>
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 w-full mt-2 bg-bg-card border border-border-main rounded-xl shadow-xl overflow-hidden"
                    >
                      {addressSuggestions.map((s, i) => (
                        <button
                          key={i} type="button" onClick={() => selectSuggestion(s)}
                          className="w-full text-left px-6 py-3 hover:bg-bg-soft text-xs font-bold text-text-main border-b border-border-main last:border-0 transition-colors"
                        >
                          {s.display_name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">{t('admin.add.city', 'Ville')} <span className="text-rose-500">*</span></label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.city ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`} />
                  {validationErrors.city && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><InformationCircleIcon className="w-3.5 h-3.5"/> {validationErrors.city}</p>}
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">{t('admin.add.postal', 'Code postal')} <span className="text-rose-500">*</span></label>
                  <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.postal_code ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`} />
                  {validationErrors.postal_code && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><InformationCircleIcon className="w-3.5 h-3.5"/> {validationErrors.postal_code}</p>}
                </div>
              </div>

              {formData.latitude && formData.longitude && (
                <div className="rounded-xl overflow-hidden border border-border-main shadow-md h-80 w-full relative z-0 mt-6">
                  <MapContainer center={[formData.latitude, formData.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[formData.latitude, formData.longitude]} />
                    <ChangeView center={[formData.latitude, formData.longitude]} />
                  </MapContainer>
                </div>
              )}
            </div>
          </motion.div>

          {/* Section: Caractéristiques */}
          <motion.div variants={itemVariants} className="bg-bg-card rounded-xl shadow-sm border border-border-main overflow-hidden">
            <div className="bg-bg-soft p-6 border-b border-border-main flex items-center gap-3">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg">
                 <HomeIcon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text-main">{t('admin.add.features_title', 'Caractéristiques du bien')}</h2>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className={`space-y-2 ${formData.type === 'land' ? 'col-span-full' : ''}`}>
                  <label className="text-sm font-bold text-text-main">{t('admin.add.surface', 'Surface')} <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input type="number" name="surface" value={formData.surface} onChange={handleChange} className={`w-full ps-4 pe-10 py-3 bg-bg-soft border outline-none rounded-xl text-text-main font-medium ${validationErrors.surface ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`} />
                    <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none text-text-muted font-bold text-sm">m²</div>
                  </div>
                  {validationErrors.surface && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><InformationCircleIcon className="w-3.5 h-3.5"/> {validationErrors.surface}</p>}
                </div>

                {formData.type !== 'land' && (
                  <div className={`space-y-2 ${formData.type === 'office' ? 'col-span-1' : ''}`}>
                    <label className="text-sm font-bold text-text-main">{t('admin.add.rooms', 'Pièces')} <span className="text-rose-500">*</span></label>
                    <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} className={`w-full px-4 py-3 bg-bg-soft border outline-none rounded-xl text-text-main font-medium ${validationErrors.rooms ? 'border-rose-500 focus:ring-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`} />
                    {validationErrors.rooms && <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1"><InformationCircleIcon className="w-3.5 h-3.5"/> {validationErrors.rooms}</p>}
                  </div>
                )}

                {formData.type !== 'land' && formData.type !== 'office' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-main">{t('admin.add.bedrooms', 'Chambres')}</label>
                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-4 py-3 bg-bg-soft border border-border-main outline-none rounded-xl text-text-main font-medium focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                )}

                {formData.type !== 'land' && (
                  <div className={`space-y-2 ${formData.type === 'office' ? 'col-span-1' : ''}`}>
                    <label className="text-sm font-bold text-text-main">{t('admin.add.bathrooms', 'Salles de bain')}</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-4 py-3 bg-bg-soft border border-border-main outline-none rounded-xl text-text-main font-medium focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Section: Équipements */}
          <motion.div variants={itemVariants} className="bg-bg-card rounded-xl shadow-sm border border-border-main overflow-hidden">
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
                   placeholder={t('admin.edit.add_feat_ph', "Ajouter un équipement (ex: Ascenseur)...")}
                   className="flex-1 px-4 py-3 bg-bg-soft border border-border-main appearance-none outline-none rounded-xl text-text-main font-medium focus:border-primary focus:ring-1 focus:ring-primary"
                 />
                 <button 
                   type="button" onClick={addFeature} 
                   className="px-6 py-3 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                 >
                   <PlusIcon className="w-5 h-5"/> {t('admin.add.add_btn', 'Ajouter')}
                 </button>
               </div>
               
               {featuresList.length > 0 && (
                 <div className="flex flex-wrap gap-3 mt-4">
                   {featuresList.map((f, i) => (
                     <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-bg-soft text-primary rounded-lg text-sm font-bold border border-border-main shadow-sm animate-fade-in-up">
                       {f}
                       <button type="button" onClick={() => removeFeature(i)} className="text-primary/70 hover:text-rose-500 transition-colors p-0.5">
                         <XMarkIcon className="w-4 h-4" />
                       </button>
                     </span>
                   ))}
                 </div>
               )}
            </div>
          </motion.div>

          {/* Section: Photos */}
          <motion.div variants={itemVariants} className="bg-bg-card rounded-xl shadow-sm border border-border-main overflow-hidden">
            <div className="bg-bg-soft p-6 border-b border-border-main flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                 <PhotoIcon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text-main">{t('admin.add.gallery', 'Galerie Photos')}</h2>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
               <div className="w-full">
                 <input 
                   type="file" multiple accept="image/*" id="images-upload" 
                   onChange={handleImageChange} className="hidden" 
                 />
                 <label htmlFor="images-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border-main hover:border-primary bg-bg-soft hover:bg-bg-card rounded-2xl cursor-pointer transition-all group">
                   <div className="w-12 h-12 bg-bg-card shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                     <PlusIcon className="w-6 h-6 text-primary" />
                   </div>
                   <span className="text-text-main font-bold mb-1">{t('admin.add.click_upload', 'Cliquer pour importer')}</span>
                   <span className="text-text-sub text-xs font-medium text-center">PNG, JPG...</span>
                 </label>
               </div>

               {imagePreviews.length > 0 && (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                   {imagePreviews.map((preview, i) => (
                     <div key={i} className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                       i === 0 ? 'border-primary ring-2 ring-primary/30 shadow-xl' : 'border-border-main group'
                     }`}>
                       <img src={preview} alt="Prévisualisation" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                       <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-40 transition-opacity"></div>
                       
                       {/* Main Image Badge / Selector */}
                       {i === 0 ? (
                         <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-primary text-white text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 select-none">
                           <StarIcon className="w-3 h-3 fill-current" />
                           {t('admin.add.main_image', 'Principale')}
                         </div>
                       ) : (
                         <button
                           type="button" onClick={() => setMainImage(i)}
                           className="absolute top-2 left-2 p-2 bg-slate-950/70 hover:bg-primary text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl text-[8px] font-black uppercase tracking-wider flex items-center gap-1"
                           title={t('admin.add.set_main', 'Définir comme principale')}
                         >
                           <StarIcon className="w-3.5 h-3.5 text-white" />
                         </button>
                       )}

                       <button 
                         type="button" onClick={() => removeImage(i)}
                         className="absolute top-2 right-2 w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md z-10 transition-all"
                       >
                         <XMarkIcon className="w-5 h-5"/>
                       </button>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </motion.div>

          {/* Floating Actions Line */}
          <motion.div variants={itemVariants} className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4 pb-12">
            <button type="button" onClick={() => navigate(-1)} className="px-8 py-4 bg-bg-card text-text-main hover:bg-bg-soft border border-border-main rounded-xl font-bold shadow-sm transition-all text-center">
              {t('common.cancel', 'Annuler')}
            </button>
            <button type="submit" disabled={loading} className="px-10 py-4 bg-primary text-white hover:bg-primary-hover active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-bold shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3">
              {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {loading ? t('admin.edit.saving', 'Validation...') : t('admin.add.publish', 'Publier l\'annonce')}
            </button>
          </motion.div>
          
        </motion.form>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-bg-card w-full max-w-lg rounded-xl shadow-xl border border-border-main p-8 sm:p-12 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckIcon className="w-10 h-10 stroke-[3]" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold text-text-main tracking-tight uppercase">{t('admin.add.success_title', 'Succès !')}</h2>
                <p className="text-sm font-semibold text-text-sub opacity-85 leading-relaxed">{t('admin.add.success_msg', 'Votre bien a été publié avec succès. Partagez-le dès maintenant.')}</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input readOnly value={`${window.location.origin}/properties/${newPropertyId}`} className="w-full bg-bg-soft border border-border-main rounded-xl px-4 py-3 text-[11px] font-bold text-primary text-center focus:outline-none" />
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/properties/${newPropertyId}`); toast.success(t('prop.detail.link_copied', 'Lien copié !')); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors">
                    <ClipboardIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => { setShowSuccessModal(false); navigate(`/properties/${newPropertyId}`); }} className="py-4 bg-primary text-white rounded-xl font-bold text-sm shadow-md transition-all hover:bg-primary-hover">{t('common.view_details', 'Voir le bien')}</button>
                   <button onClick={() => { setShowSuccessModal(false); navigate('/dashboard'); }} className="py-4 bg-bg-soft border border-border-main text-text-sub rounded-xl font-bold text-sm transition-all hover:bg-bg-card">{t('admin.add.back_dash', 'Tableau de bord')}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddProperty;