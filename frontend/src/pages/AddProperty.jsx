import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/properties';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  XMarkIcon, 
  PhotoIcon, 
  MapPinIcon, 
  HomeIcon,
  CurrencyEuroIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  KeyIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const AddProperty = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAgent, isAdmin } = useAuth();
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
  });

  // Charger les catégories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
        if (data.data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data.data[0].id }));
        }
      }
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      // Catégories par défaut
      setCategories([
        { id: 1, name: 'Appartement', slug: 'apartment' },
        { id: 2, name: 'Maison', slug: 'house' },
        { id: 3, name: 'Local commercial', slug: 'commercial' },
        { id: 4, name: 'Terrain', slug: 'land' },
        { id: 5, name: 'Studio', slug: 'studio' },
      ]);
      setFormData(prev => ({ ...prev, category_id: 1 }));
    }
  };

  // Vérification des droits au chargement
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter');
      navigate('/login');
      return;
    }
    
    if (!isAgent && !isAdmin) {
      toast.error('Vous n\'avez pas les droits pour ajouter un bien');
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, isAgent, isAdmin, navigate]);

  const propertyTypes = [
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'studio', label: 'Studio' },
    { value: 'commercial', label: 'Local commercial' },
    { value: 'land', label: 'Terrain' }
  ];

  const transactionTypes = [
    { value: 'rent', label: 'Location', icon: KeyIcon, description: 'Location mensuelle', color: '#10b981' },
    { value: 'sale', label: 'Vente', icon: TagIcon, description: 'Vente définitive', color: '#ef4444' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleTransactionTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, transaction_type: type }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    setImages(prev => [...prev, ...validImages]);
    
    validImages.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeaturesList([...featuresList, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Le titre est requis';
    if (!formData.description.trim()) errors.description = 'La description est requise';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) errors.price = 'Le prix doit être un nombre positif';
    if (!formData.address.trim()) errors.address = 'L\'adresse est requise';
    if (!formData.city.trim()) errors.city = 'La ville est requise';
    if (!formData.postal_code.trim()) errors.postal_code = 'Le code postal est requis';
    if (!formData.surface || isNaN(formData.surface) || formData.surface <= 0) errors.surface = 'La surface doit être un nombre positif';
    if (!formData.rooms || isNaN(formData.rooms) || formData.rooms <= 0) errors.rooms = 'Le nombre de pièces doit être un nombre positif';
    if (!formData.type) errors.type = 'Le type de bien est requis';
    if (!formData.category_id) errors.category_id = 'La catégorie est requise';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Object.values(validationErrors).forEach(error => {
        if (error) toast.error(error);
      });
      return;
    }

    // === ÉTAPE 1: AFFICHER LES DONNÉES ENVOYÉES POUR DÉBOGAGE ===
    const dataToSend = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      transaction_type: formData.transaction_type,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postal_code,
      surface: parseFloat(formData.surface),
      rooms: parseInt(formData.rooms),
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      type: formData.type,
      category_id: parseInt(formData.category_id),
      features: JSON.stringify(featuresList),
      images_count: images.length
    };
    
    console.log('=== DONNÉES ENVOYÉES AU SERVEUR ===');
    console.log(dataToSend);
    console.log('=== FIN DES DONNÉES ===');
    
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
      data.append('rooms', parseInt(formData.rooms));
      data.append('bedrooms', parseInt(formData.bedrooms) || 0);
      data.append('bathrooms', parseInt(formData.bathrooms) || 0);
      data.append('type', formData.type);
      data.append('category_id', parseInt(formData.category_id));
      data.append('features', JSON.stringify(featuresList));
      
      images.forEach(image => {
        data.append('images[]', image);
      });

      const response = await propertyService.create(data);
      
      if (response.success) {
        toast.success('Bien ajouté avec succès !');
        navigate('/dashboard/agent?refresh=true');
      } else {
        toast.error(response.message || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('=== ERREUR DÉTAILLÉE ===');
      console.error('Erreur:', error);
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        console.log('Erreurs de validation du serveur:', errors);
        Object.values(errors).forEach(err => {
          if (Array.isArray(err)) {
            err.forEach(e => toast.error(e));
          } else {
            toast.error(err);
          }
        });
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du bien');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAgent && !isAdmin && isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Accès non autorisé</h2>
        <button onClick={() => navigate('/dashboard')}>Retour</button>
      </div>
    );
  }

  return (
    <div className="add-property-page">
      <div className="add-property-container">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeftIcon className="h-5 w-5" />
            Retour
          </button>
          <h1>Ajouter un bien immobilier</h1>
          <p>Remplissez le formulaire pour ajouter un nouveau bien</p>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-section">
            <h2>Informations générales</h2>
            
            <div className="form-group">
              <label>Titre *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Bel appartement centre-ville"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Décrivez le bien"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type de bien *</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Catégorie *</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange}>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prix *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 850"
                  step="1"
                />
                <small>{formData.transaction_type === 'rent' ? '€/mois' : '€'}</small>
              </div>
              
              <div className="form-group">
                <label>Type de transaction *</label>
                <div className="transaction-selector">
                  {transactionTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      className={`transaction-btn ${formData.transaction_type === type.value ? 'active' : ''}`}
                      onClick={() => handleTransactionTypeSelect(type.value)}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Localisation</h2>
            
            <div className="form-group">
              <label>Adresse *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Numéro et nom de rue"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Ville *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ex: Paris"
                />
              </div>
              
              <div className="form-group">
                <label>Code postal *</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="Ex: 75001"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Caractéristiques</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Surface (m²) *</label>
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  placeholder="Ex: 65"
                  step="1"
                />
              </div>
              
              <div className="form-group">
                <label>Nombre de pièces *</label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  placeholder="Ex: 3"
                  step="1"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Chambres</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="Ex: 2"
                />
              </div>
              
              <div className="form-group">
                <label>Salles de bain</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="Ex: 1"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Équipements</h2>
            <div className="features-input">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ajouter un équipement..."
              />
              <button type="button" onClick={addFeature} className="btn-add-feature">
                <PlusIcon className="h-5 w-5" />
                Ajouter
              </button>
            </div>
            
            <div className="features-list">
              {featuresList.map((feature, index) => (
                <div key={index} className="feature-tag">
                  <span>{feature}</span>
                  <button type="button" onClick={() => removeFeature(index)}>
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>Photos</h2>
            <div className="image-upload">
              <label className="image-upload-label">
                <PhotoIcon className="h-10 w-10" />
                <span>Ajouter des photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview} alt={`Photo ${index + 1}`} />
                  <button type="button" onClick={() => removeImage(index)}>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter le bien'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .add-property-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
          padding: 40px 20px;
        }

        .add-property-container {
          max-width: 800px;
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
        }

        .back-button:hover {
          color: #2563eb;
        }

        .page-header h1 {
          color: #1f2937;
          font-size: 28px;
        }

        .property-form {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid #e5e7eb;
        }

        .form-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .form-section h2 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          color: #374151;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
        }

        .form-group small {
          display: block;
          font-size: 11px;
          color: #6b7280;
          margin-top: 4px;
        }

        .transaction-selector {
          display: flex;
          gap: 10px;
        }

        .transaction-btn {
          flex: 1;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          background: white;
          cursor: pointer;
        }

        .transaction-btn.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .features-input {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .features-input input {
          flex: 1;
          padding: 8px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
        }

        .btn-add-feature {
          padding: 8px 15px;
          background: #f3f4f6;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .feature-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          background: #f3f4f6;
          border-radius: 20px;
          font-size: 13px;
        }

        .feature-tag button {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }

        .image-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 30px;
          border: 2px dashed #d1d5db;
          border-radius: 10px;
          cursor: pointer;
        }

        .image-previews {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 20px;
        }

        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 5px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-preview button {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: #f3f4f6;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .btn-submit {
          flex: 1;
          padding: 12px;
          background: #2563eb;
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .image-previews {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default AddProperty;