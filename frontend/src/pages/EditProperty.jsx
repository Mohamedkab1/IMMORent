import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  TrashIcon
} from '@heroicons/react/24/outline';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAgent, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    postal_code: '',
    surface: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    type: 'apartment',
    category_id: '1',
    status: 'available'
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'studio', label: 'Studio' },
    { value: 'commercial', label: 'Local commercial' },
    { value: 'land', label: 'Terrain' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Disponible' },
    { value: 'rented', label: 'Loué' },
    { value: 'reserved', label: 'Réservé' },
    { value: 'unavailable', label: 'Indisponible' }
  ];

  // Vérification des droits
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter');
      navigate('/login');
      return;
    }
    
    if (!isAgent && !isAdmin) {
      toast.error('Vous n\'avez pas les droits pour modifier un bien');
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, isAgent, isAdmin, navigate]);

  // Charger les données du bien
  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await propertyService.getById(id);
      if (response.success && response.data) {
        const propertyData = response.data;
        setProperty(propertyData);
        
        // Remplir le formulaire
        setFormData({
          title: propertyData.title || '',
          description: propertyData.description || '',
          price: propertyData.price || '',
          address: propertyData.address || '',
          city: propertyData.city || '',
          postal_code: propertyData.postal_code || '',
          surface: propertyData.surface || '',
          rooms: propertyData.rooms || '',
          bedrooms: propertyData.bedrooms || '',
          bathrooms: propertyData.bathrooms || '',
          type: propertyData.type || 'apartment',
          category_id: propertyData.category_id || '1',
          status: propertyData.status || 'available'
        });
        
        // Gérer les images existantes
        if (propertyData.images && propertyData.images.length > 0) {
          setExistingImages(propertyData.images);
        }
        
        // Gérer les équipements
        if (propertyData.features) {
          let features = propertyData.features;
          if (typeof features === 'string') {
            try {
              features = JSON.parse(features);
            } catch (e) {
              features = [];
            }
          }
          setFeaturesList(Array.isArray(features) ? features : []);
        }
      } else {
        toast.error('Bien non trouvé');
        navigate('/dashboard/agent');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du bien');
      navigate('/dashboard/agent');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    if (validImages.length !== files.length) {
      toast.warning('Seules les images sont acceptées');
    }
    
    setImages(prev => [...prev, ...validImages]);
    
    validImages.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      if (featuresList.length >= 20) {
        toast.warning('Maximum 20 équipements');
        return;
      }
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
    const errors = [];
    
    if (!formData.title.trim()) errors.push('Le titre est requis');
    if (!formData.description.trim()) errors.push('La description est requise');
    if (!formData.price || formData.price <= 0) errors.push('Le prix doit être supérieur à 0');
    if (!formData.address.trim()) errors.push('L\'adresse est requise');
    if (!formData.city.trim()) errors.push('La ville est requise');
    if (!formData.postal_code.trim()) errors.push('Le code postal est requis');
    if (!formData.surface || formData.surface <= 0) errors.push('La surface doit être supérieure à 0');
    if (!formData.rooms || formData.rooms <= 0) errors.push('Le nombre de pièces doit être supérieur à 0');
    
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Préparer les données
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        surface: formData.surface,
        rooms: formData.rooms,
        bedrooms: formData.bedrooms || 0,
        bathrooms: formData.bathrooms || 0,
        type: formData.type,
        category_id: formData.category_id,
        status: formData.status,
        features: JSON.stringify(featuresList),
        images: existingImages
      };

      const response = await propertyService.update(id, updateData);
      
      if (response.success) {
        toast.success('Bien modifié avec succès !');
        navigate('/dashboard/agent');
      } else {
        toast.error(response.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response?.status === 403) {
        toast.error('Vous n\'avez pas les droits pour modifier ce bien');
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        Object.values(errors).forEach(err => {
          toast.error(err[0]);
        });
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la modification du bien');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du bien...</p>
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

  return (
    <div className="edit-property-page">
      <div className="edit-property-container">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeftIcon className="h-5 w-5" />
            Retour
          </button>
          <h1>Modifier le bien immobilier</h1>
          <p>Modifiez les informations du bien</p>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          {/* Informations de base */}
          <div className="form-section">
            <h2>
              <DocumentTextIcon className="section-icon" />
              Informations générales
            </h2>
            
            <div className="form-group">
              <label htmlFor="title">Titre du bien *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Bel appartement centre-ville"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Décrivez le bien"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Type de bien *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Statut *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="price">
                <CurrencyEuroIcon className="input-icon" />
                Prix mensuel (€) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 850"
                min="0"
                step="1"
                required
              />
            </div>
          </div>

          {/* Localisation */}
          <div className="form-section">
            <h2>
              <MapPinIcon className="section-icon" />
              Localisation
            </h2>
            
            <div className="form-group">
              <label htmlFor="address">Adresse *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Numéro et nom de rue"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Ville *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ex: Paris, Lyon"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="postal_code">Code postal *</label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="Ex: 75001"
                  required
                />
              </div>
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="form-section">
            <h2>
              <HomeIcon className="section-icon" />
              Caractéristiques
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="surface">Surface (m²) *</label>
                <input
                  type="number"
                  id="surface"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  placeholder="Ex: 65"
                  min="0"
                  step="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rooms">Nombre de pièces *</label>
                <input
                  type="number"
                  id="rooms"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  placeholder="Ex: 3"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">Chambres</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="Ex: 2"
                  min="0"
                  step="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bathrooms">Salles de bain</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="Ex: 1"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* Équipements */}
          <div className="form-section">
            <h2>
              <CheckCircleIcon className="section-icon" />
              Équipements
            </h2>
            
            <div className="features-input">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ajouter un équipement (ex: Ascenseur, Balcon, Parking...)"
              />
              <button type="button" onClick={addFeature} className="btn-add-feature">
                <PlusIcon className="h-5 w-5" />
                Ajouter
              </button>
            </div>
            
            {featuresList.length > 0 && (
              <div className="features-list">
                {featuresList.map((feature, index) => (
                  <div key={index} className="feature-tag">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                    <button type="button" onClick={() => removeFeature(index)}>
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="form-section">
            <h2>
              <PhotoIcon className="section-icon" />
              Photos du bien
            </h2>
            
            {/* Images existantes */}
            {existingImages.length > 0 && (
              <div className="image-section">
                <h3>Photos actuelles</h3>
                <div className="image-previews existing">
                  {existingImages.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img 
                        src={`http://localhost:8000/storage/${image}`} 
                        alt={`Photo ${index + 1}`} 
                      />
                      <button type="button" onClick={() => removeExistingImage(index)}>
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Nouvelles images */}
            <div className="image-section">
              <h3>Ajouter des photos</h3>
              <div className="image-upload">
                <label className="image-upload-label">
                  <PhotoIcon className="h-10 w-10" />
                  <span>Cliquez pour ajouter des photos</span>
                  <span className="upload-hint">Formats : JPG, PNG (max 2MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="image-previews new">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt={`Nouvelle photo ${index + 1}`} />
                      <button type="button" onClick={() => removeNewImage(index)}>
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Modification en cours...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .edit-property-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
          padding: 40px 20px;
        }

        .edit-property-container {
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
          font-size: 14px;
        }

        .back-button:hover {
          color: #2563eb;
        }

        .page-header h1 {
          color: #1f2937;
          font-size: 28px;
          margin-bottom: 10px;
        }

        .page-header p {
          color: #6b7280;
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
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .form-section h2 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-section h3 {
          color: #374151;
          font-size: 16px;
          margin-bottom: 15px;
        }

        .section-icon {
          width: 20px;
          height: 20px;
          color: #2563eb;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 15px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #374151;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .input-icon {
          width: 16px;
          height: 16px;
          color: #6b7280;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .features-input {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .features-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
        }

        .btn-add-feature {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 10px 20px;
          background: #f3f4f6;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .btn-add-feature:hover {
          background: #e5e7eb;
        }

        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }

        .feature-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: #f3f4f6;
          border-radius: 20px;
          font-size: 14px;
        }

        .feature-tag button {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }

        .feature-tag button:hover {
          color: #dc2626;
        }

        .image-section {
          margin-bottom: 25px;
        }

        .image-upload {
          margin-bottom: 20px;
        }

        .image-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 40px;
          border: 2px dashed #d1d5db;
          border-radius: 10px;
          cursor: pointer;
        }

        .image-upload-label:hover {
          border-color: #2563eb;
          background: #f8fafc;
        }

        .upload-hint {
          font-size: 12px;
          color: #9ca3af;
        }

        .image-previews {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 15px;
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

        .image-preview button:hover {
          background: #dc2626;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: #f3f4f6;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        .btn-submit {
          flex: 1;
          padding: 12px;
          background: #2563eb;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .image-previews {
            grid-template-columns: repeat(2, 1fr);
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default EditProperty;