import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ClipboardIcon,
  ChatBubbleBottomCenterTextIcon,
  ShareIcon,
  EnvelopeIcon,
  CheckIcon,
  ChevronRightIcon
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  }
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
    { value: 'rent', label: t('common.rent', 'Location'), icon: KeyIcon },
    { value: 'sale', label: t('common.buy', 'Vente'), icon: TagIcon }
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
      city: suggestion.address.city || suggestion.address.town || suggestion.address.village || prev.city,
      postal_code: suggestion.address.postcode || prev.postal_code,
    }));
    setShowSuggestions(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('features', JSON.stringify(featuresList));
      images.forEach(img => data.append('images[]', img));
      
      const res = await propertyService.create(data);
      if (res.success) { 
        toast.success(t('admin.add.success_title', 'Bien ajouté !')); 
        setNewPropertyId(res.data.id);
        setShowSuccessModal(true);
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
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-bg-soft pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-border-main pb-12"
        >
          <div className="space-y-4">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              {t('common.prev', 'Retour')}
            </button>
            <h1 className="text-5xl md:text-6xl font-black text-text-main tracking-tighter uppercase leading-none">
              {t('admin.add.title_p1', 'Ajouter un')} <span className="text-primary">{t('admin.add.title_p2', 'Bien')}</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted opacity-60">
              {t('admin.add.subtitle', 'Publiez votre annonce immobilière en quelques étapes.')}
            </p>
          </div>
        </motion.div>

        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit} 
          className="space-y-12"
        >
          {/* Section: General Info */}
          <motion.div variants={sectionVariants} className="bg-bg-card border border-border-main rounded-xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-border-main bg-bg-soft flex items-center gap-4">
              <DocumentTextIcon className="w-6 h-6 text-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest text-text-main">{t('admin.add.gen_info', 'Informations Générales')}</h2>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-primary transition-colors">
                  {t('admin.add.ad_title', 'Titre de l\'annonce')}
                </label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleChange} required
                  className="w-full bg-bg-soft/50 border border-border-main rounded-xl px-8 py-5 font-bold text-text-main outline-none focus:border-primary transition-all shadow-sm"
                  placeholder={t('admin.add.title_ph', "Ex: Appartement de luxe...")}
                />
              </div>

              <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-primary transition-colors">
                  {t('common.description', 'Description')}
                </label>
                <textarea 
                  name="description" rows="5" value={formData.description} onChange={handleChange} required
                  className="w-full bg-bg-soft/50 border border-border-main rounded-xl px-8 py-5 font-bold text-text-main outline-none focus:border-primary transition-all shadow-sm resize-none"
                  placeholder={t('admin.add.desc_ph', "Décrivez votre bien...")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{t('admin.add.trans_type', 'Type de transaction')}</label>
                  <div className="flex gap-4">
                    {transactionTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, transaction_type: type.value }))}
                        className={`flex-1 p-6 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.transaction_type === type.value ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-bg-soft border-border-main text-text-sub hover:border-primary/50'}`}
                      >
                        <type.icon className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-primary transition-colors">{t('admin.add.price', 'Prix')}</label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all" />
                    <input 
                      type="number" name="price" value={formData.price} onChange={handleChange} required
                      className="w-full bg-bg-soft/50 border border-border-main rounded-xl pl-16 pr-20 py-5 font-bold text-text-main outline-none focus:border-primary transition-all shadow-sm"
                      placeholder="0.00"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40">DH</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section: Location */}
          <motion.div variants={sectionVariants} className="bg-bg-card border border-border-main rounded-xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-border-main bg-bg-soft flex items-center gap-4">
              <MapPinIcon className="w-6 h-6 text-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest text-text-main">{t('admin.add.loc', 'Localisation')}</h2>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="space-y-3 group relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted group-focus-within:text-primary transition-colors">{t('admin.add.full_address', 'Adresse Complète')}</label>
                <input 
                  type="text" name="address" value={formData.address} onChange={handleChange} required
                  className="w-full bg-bg-soft/50 border border-border-main rounded-xl px-8 py-5 font-bold text-text-main outline-none focus:border-primary transition-all shadow-sm"
                  autoComplete="off"
                />
                <AnimatePresence>
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-50 w-full mt-4 bg-bg-card border border-border-main rounded-xl shadow-2xl overflow-hidden"
                    >
                      {addressSuggestions.map((s, i) => (
                        <button
                          key={i} type="button" onClick={() => selectSuggestion(s)}
                          className="w-full text-left px-8 py-4 hover:bg-bg-soft text-xs font-bold text-text-main border-b border-border-main last:border-0 transition-colors"
                        >
                          {s.display_name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {formData.latitude && formData.longitude && (
                <div className="rounded-xl overflow-hidden border border-border-main shadow-xl h-80 w-full relative z-0">
                  <MapContainer center={[formData.latitude, formData.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[formData.latitude, formData.longitude]} />
                    <ChangeView center={[formData.latitude, formData.longitude]} />
                  </MapContainer>
                </div>
              )}
            </div>
          </motion.div>

          {/* Section: Features */}
          <motion.div variants={sectionVariants} className="bg-bg-card border border-border-main rounded-xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-border-main bg-bg-soft flex items-center gap-4">
              <HomeIcon className="w-6 h-6 text-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest text-text-main">{t('admin.add.features_title', 'Caractéristiques & Équipements')}</h2>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { name: 'surface', label: t('admin.add.surface', 'Surface'), unit: 'm²' },
                  { name: 'rooms', label: t('admin.add.rooms', 'Pièces'), unit: 'p.' },
                  { name: 'bedrooms', label: t('admin.add.bedrooms', 'Chambres'), unit: 'ch.' },
                  { name: 'bathrooms', label: t('admin.add.bathrooms', 'Salles de bain'), unit: 'sdb' }
                ].map(field => (
                  <div key={field.name} className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{field.label}</label>
                    <div className="relative">
                      <input 
                        type="number" name={field.name} value={formData[field.name]} onChange={handleChange} 
                        className="w-full bg-bg-soft/50 border border-border-main rounded-xl px-6 py-4 font-bold text-text-main outline-none focus:border-primary transition-all shadow-sm"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-text-muted opacity-40">{field.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{t('admin.add.equipments', 'Prestations de Luxe')}</label>
                <div className="flex gap-4">
                  <input 
                    type="text" value={newFeature} onChange={e => setNewFeature(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 bg-bg-soft/50 border border-border-main rounded-xl px-8 py-5 font-bold text-text-main outline-none focus:border-primary transition-all shadow-sm"
                    placeholder={t('admin.add.feat_ph', "Ex: Piscine, Spa...")}
                  />
                  <button type="button" onClick={addFeature} className="w-16 h-16 shrink-0 flex items-center justify-center bg-primary text-white rounded-xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
                    <PlusIcon className="w-7 h-7" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <AnimatePresence>
                    {featuresList.map((f, i) => (
                      <motion.span 
                        key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest"
                      >
                        {f}
                        <button type="button" onClick={() => removeFeature(i)} className="hover:text-rose-500 transition-colors">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section: Photos */}
          <motion.div variants={sectionVariants} className="bg-bg-card border border-border-main rounded-xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-border-main bg-bg-soft flex items-center gap-4">
              <PhotoIcon className="w-6 h-6 text-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest text-text-main">{t('admin.add.gallery', 'Galerie Multimédia')}</h2>
            </div>
            
            <div className="p-10 space-y-10">
              <input type="file" multiple accept="image/*" id="images-upload" onChange={handleImageChange} className="hidden" />
              <label htmlFor="images-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border-main hover:border-primary bg-bg-soft/30 hover:bg-bg-soft/50 rounded-xl cursor-pointer transition-all group">
                <PhotoIcon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black uppercase tracking-[0.2em] text-text-main mb-2">{t('admin.add.click_upload', 'Importer des Photos')}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40">{t('admin.add.upload_info', 'Max 10 photos • PNG, JPG, WEBP')}</span>
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                      i === 0 ? 'border-primary ring-2 ring-primary/30 shadow-xl' : 'border-border-main group'
                    }`}>
                      <img src={preview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                      
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
                        className="absolute top-2 right-2 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all shadow-xl z-10"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-6 pt-12">
            <button type="button" onClick={() => navigate(-1)} className="px-12 py-5 bg-bg-card border border-border-main text-text-sub rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-bg-soft transition-all">
              {t('common.cancel', 'Annuler')}
            </button>
            <button 
              type="submit" disabled={loading}
              className="px-12 py-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : t('admin.add.publish', 'Publier l\'annonce')}
            </button>
          </div>
        </motion.form>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-bg-card w-full max-w-lg rounded-xl shadow-huge border border-border-main p-12 text-center space-y-10"
            >
              <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckIcon className="w-12 h-12 stroke-[3]" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase">{t('admin.add.success_title', 'Succès !')}</h2>
                <p className="text-sm font-bold text-text-sub opacity-60 leading-relaxed">{t('admin.add.success_msg', 'Votre bien a été publié avec succès. Partagez-le dès maintenant.')}</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input readOnly value={`${window.location.origin}/properties/${newPropertyId}`} className="w-full bg-bg-soft border border-border-main rounded-xl px-6 py-4 text-[10px] font-black text-primary text-center focus:outline-none" />
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/properties/${newPropertyId}`); toast.success(t('prop.detail.link_copied')); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors">
                    <ClipboardIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => { setShowSuccessModal(false); navigate(`/properties/${newPropertyId}`); }} className="py-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:bg-primary-dark">{t('common.view_details', 'Voir le bien')}</button>
                   <button onClick={() => { setShowSuccessModal(false); navigate('/dashboard'); }} className="py-5 bg-bg-soft border border-border-main text-text-sub rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-bg-card">{t('admin.add.back_dash', 'Tableau de bord')}</button>
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