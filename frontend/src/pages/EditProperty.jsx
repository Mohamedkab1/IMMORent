import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  InformationCircleIcon,
  StarIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAgent, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [categories, setCategories] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({ 
    title: '', description: '', price: '', 
    transaction_type: 'rent', address: '', city: '', 
    postal_code: '', surface: '', rooms: '', 
    bedrooms: '', bathrooms: '', type: 'apartment', 
    category_id: '', status: 'available' 
  });

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    else if (!isAgent && !isAdmin) navigate('/dashboard');
    else fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [propRes, catRes] = await Promise.all([
        propertyService.getById(id), 
        fetch('/api/categories').then(r => r.json())
      ]);
      
      if (propRes.success && propRes.data) {
        const p = propRes.data;
        setProperty(p);
        setFormData({ 
          title: p.title, description: p.description, 
          price: p.price, transaction_type: p.transaction_type, 
          address: p.address, city: p.city, postal_code: p.postal_code, 
          surface: p.surface, rooms: p.rooms, bedrooms: p.bedrooms || '', 
          bathrooms: p.bathrooms || '', type: p.type, 
          category_id: p.category_id, status: p.status 
        });
        setExistingImages(p.images || []);
        let features = p.features;
        if (typeof features === 'string') try { features = JSON.parse(features); } catch(e) { features = []; }
        setFeaturesList(Array.isArray(features) ? features : []);
      } else {
        toast.error('Bien non trouvé');
        navigate('/dashboard/agent');
      }
      
      if (catRes.success) {
        setCategories(catRes.data);
      } else {
        setCategories([
          { id: 1, name: t('prop.types.apartment', 'Appartement') }, { id: 2, name: t('prop.types.house', 'Maison') }, 
          { id: 3, name: t('prop.types.commercial', 'Local commercial') }, { id: 4, name: t('prop.types.land', 'Terrain') }, { id: 5, name: t('prop.types.studio', 'Studio') }
        ]);
      }
    } catch (error) { 
      toast.error('Erreur lors du chargement des données'); 
      navigate('/dashboard/agent'); 
    } finally { 
      setLoading(false); 
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
    { value: 'available', label: t('prop.status.available', 'Disponible') }, { value: 'rented', label: t('prop.status.rented', 'Loué') }, 
    { value: 'reserved', label: t('prop.status.reserved', 'Réservé') }, { value: 'unavailable', label: t('prop.status.unavailable', 'Indisponible') }
  ];
  const transactionTypes = [
    { value: 'rent', label: t('common.rent', 'Location'), icon: KeyIcon },
    { value: 'sale', label: t('common.buy', 'Vente'), icon: TagIcon }
  ];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (validationErrors[e.target.name]) setValidationErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleTransactionTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, transaction_type: type }));
  };

  const handleImageChange = (e) => { 
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/')); 
    if (existingImages.length + images.length + files.length > 10) {
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

  const removeExistingImage = (index) => setExistingImages(prev => prev.filter((_, i) => i !== index));
  
  const removeNewImage = (index) => { 
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
    if (!formData.title.trim()) errors.title = 'Le titre est requis';
    if (!formData.description.trim()) errors.description = 'La description est requise';
    if (!formData.price || formData.price <= 0) errors.price = 'Le prix doit être valide';
    if (!formData.address.trim()) errors.address = 'L\'adresse est requise';
    if (!formData.city.trim()) errors.city = 'La ville est requise';
    if (!formData.postal_code.trim()) errors.postal_code = 'Le code postal est requis';
    if (!formData.surface || formData.surface <= 0) errors.surface = 'La surface est requise';
    if (!formData.rooms || formData.rooms <= 0) errors.rooms = 'Le nombre de pièces est requis';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }
    setSubmitting(true);
    
    try {
      const updateData = { 
        ...formData, 
        price: parseFloat(formData.price), 
        surface: parseFloat(formData.surface), 
        rooms: parseInt(formData.rooms), 
        bedrooms: parseInt(formData.bedrooms) || 0, 
        bathrooms: parseInt(formData.bathrooms) || 0, 
        category_id: parseInt(formData.category_id), 
        features: JSON.stringify(featuresList), 
        existing_images: existingImages,
        new_images: images
      };

      // Depending on API implementation, file uploads on PUT might be tricky without FormData. 
      // If we use FormData for update:
      const data = new FormData();
      Object.keys(updateData).forEach(key => {
         if (key === 'images') {
             updateData.images.forEach(img => data.append('existing_images[]', img));
         } else {
             data.append(key, updateData[key]);
         }
      });
      images.forEach(img => data.append('new_images[]', img));
      data.append('_method', 'PUT'); // Laravel requirement for form-data PUT
      
      // Let's use the standard update mechanism, assuming the backend supports it.
      const res = await propertyService.update(id, updateData);
      
      if (res.success) { 
        toast.success('Bien modifié avec succès'); 
        navigate('/dashboard/agent?refresh=true'); 
      } else {
        toast.error(res.message || 'Erreur lors de la modification');
      }
    } catch (error) { 
      toast.error('Erreur lors de la communication aver le serveur'); 
    } finally { 
      setSubmitting(false); 
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

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-soft flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-bg-card border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-text-muted font-medium">{t('admin.edit.loading', 'Chargement des détails...')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-soft transition-colors pt-[120px] pb-12 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8 pb-6 border-b border-border-main"
        >
          <button onClick={() => navigate(-1)} className="p-2 text-text-muted hover:text-primary bg-bg-card border border-border-main hover:bg-bg-soft rounded-full transition-colors shadow-sm">
            <ArrowLeftIcon className="w-6 h-6 rtl:rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">{t('admin.edit.title', 'Modifier le bien')}</h1>
            <p className="text-sm text-text-muted mt-1 font-bold uppercase tracking-widest">{t('admin.edit.subtitle', 'Mettez à jour les informations de l\'annonce')} #{id}</p>
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
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">{t('admin.add.prop_type', 'Type de bien')} <span className="text-rose-500">*</span></label>
                  <select 
                    name="type" value={formData.type} onChange={handleChange} 
                    className="w-full px-4 py-3 bg-bg-soft border border-border-main outline-none rounded-xl text-text-main font-medium transition-all appearance-none cursor-pointer focus:border-primary hover:border-slate-400"
                  >
                    {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                
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
                      className={`w-full ps-4 pe-20 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.price ? 'border-rose-500' : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary'}`}
                    />
                    <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none text-text-muted font-bold text-sm">
                       {t('prop.currency')} {formData.transaction_type === 'rent' ? t('prop.per_month', '/ ms') : ''}
                    </div>
                  </div>
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
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">{t('admin.add.full_address', 'Adresse complète')} <span className="text-rose-500">*</span></label>
                <input 
                  type="text" name="address" value={formData.address} onChange={handleChange} 
                  className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.address ? 'border-rose-500' : 'border-border-main focus:border-primary'}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">{t('admin.add.city', 'Ville')} <span className="text-rose-500">*</span></label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.city ? 'border-rose-500' : 'border-border-main focus:border-primary'}`} />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-bold text-text-main">{t('admin.add.postal', 'Code postal')} <span className="text-rose-500">*</span></label>
                  <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className={`w-full px-4 py-3 bg-bg-soft border appearance-none outline-none rounded-xl text-text-main font-medium transition-all ${validationErrors.postal_code ? 'border-rose-500' : 'border-border-main focus:border-primary'}`} />
                </div>
              </div>
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
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-main">{t('admin.add.surface', 'Surface')} <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input type="number" name="surface" value={formData.surface} onChange={handleChange} className="w-full ps-4 pe-10 py-3 bg-bg-soft border border-border-main outline-none rounded-xl text-text-main font-medium focus:border-primary" />
                    <div className="absolute inset-y-0 end-0 flex items-center pe-4 pointer-events-none text-text-muted font-bold text-sm">m²</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-main">{t('admin.add.rooms', 'Pièces')} <span className="text-rose-500">*</span></label>
                  <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} className="w-full px-4 py-3 bg-bg-soft border border-border-main outline-none rounded-xl text-text-main font-medium focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-main">{t('admin.add.bedrooms', 'Chambres')}</label>
                  <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-4 py-3 bg-bg-soft border border-border-main outline-none rounded-xl text-text-main font-medium focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-main">{t('admin.add.bathrooms', 'Salles de bain')}</label>
                  <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-4 py-3 bg-bg-soft border border-border-main outline-none rounded-xl text-text-main font-medium focus:border-primary" />
                </div>
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
                   className="flex-1 px-4 py-3 bg-bg-soft border border-border-main appearance-none outline-none rounded-xl text-text-main font-medium focus:border-primary"
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
               
               {/* Photos existantes */}
               {existingImages.length > 0 && (
                 <div>
                   <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">{t('admin.edit.current_photos', 'Photos actuelles')}</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {existingImages.map((img, i) => (
                       <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border-main shadow-sm group">
                         <img src={img.startsWith('http') ? img : `/storage/${img}`} alt="Existant" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <button 
                           type="button" onClick={() => removeExistingImage(i)}
                           className="absolute top-2 right-2 w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md scale-0 group-hover:scale-100 transition-transform"
                         >
                           <TrashIcon className="w-4 h-4"/>
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               <div className="w-full mt-6">
                 <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">{t('admin.edit.add_new_photos', 'Ajouter de nouvelles photos')}</h3>
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
                     <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-primary/20 bg-bg-card shadow-sm group">
                       <div className="absolute top-0 left-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10">{t('common.new')}</div>
                       <img src={preview} alt="Prévisualisation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <button 
                         type="button" onClick={() => removeNewImage(i)}
                         className="absolute top-2 right-2 w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md scale-0 group-hover:scale-100 transition-transform"
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
              {t('admin.edit.cancel_changes', 'Annuler les modifications')}
            </button>
            <button type="submit" disabled={submitting} className="px-10 py-4 bg-primary text-white hover:bg-primary-hover active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-bold shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3">
              {submitting && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {submitting ? t('admin.edit.saving', 'Validation...') : t('admin.edit.save', 'Enregistrer les modifications')}
            </button>
          </motion.div>
          
        </motion.form>
      </div>
    </div>
  );
};

export default EditProperty;