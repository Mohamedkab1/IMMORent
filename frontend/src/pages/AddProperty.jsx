import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/properties';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon,
  HomeIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
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
    category_id: 1,
    features: []
  });

  const [newFeature, setNewFeature] = useState('');
  const [featuresList, setFeaturesList] = useState([]);

  const propertyTypes = [
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'studio', label: 'Studio' },
    { value: 'commercial', label: 'Local commercial' },
    { value: 'land', label: 'Terrain' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);
    
    // Créer les aperçus
    const newPreviews = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeaturesList([...featuresList, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    const newFeatures = [...featuresList];
    newFeatures.splice(index, 1);
    setFeaturesList(newFeatures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || (!user.isAgent && !user.isAdmin)) {
      toast.error('Vous n\'avez pas les droits pour ajouter un bien');
      navigate('/dashboard');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('postal_code', formData.postal_code);
      data.append('surface', formData.surface);
      data.append('rooms', formData.rooms);
      data.append('bedrooms', formData.bedrooms || 0);
      data.append('bathrooms', formData.bathrooms || 0);
      data.append('type', formData.type);
      data.append('category_id', formData.category_id);
      data.append('features', JSON.stringify(featuresList));
      
      images.forEach(image => {
        data.append('images[]', image);
      });

      const response = await propertyService.create(data);
      
      if (response.success) {
        toast.success('Bien ajouté avec succès !');
        navigate('/dashboard/agent');
      } else {
        toast.error(response.message || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du bien');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property-page">
      <div className="add-property-container">
        {/* En-tête */}
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeftIcon className="h-5 w-5" />
            Retour
          </button>
          <h1>Ajouter un bien immobilier</h1>
          <p>Remplissez le formulaire pour ajouter un nouveau bien à la plateforme</p>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          {/* Informations de base */}
          <div className="form-section">
            <h2>Informations générales</h2>
            
            <div className="form-row">
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
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Décrivez le bien (surface, état, environnement, etc.)"
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
            
            <div className="form-row">
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
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Prix mensuel (€) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 850"
                required
              />
            </div>
          </div>

          {/* Équipements */}
          <div className="form-section">
            <h2>Équipements et caractéristiques</h2>
            
            <div className="features-input">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Ajouter un équipement (ex: Ascenseur, Balcon, Parking...)"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
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

          {/* Images */}
          <div className="form-section">
            <h2>
              <PhotoIcon className="section-icon" />
              Photos du bien
            </h2>
            
            <div className="image-upload">
              <label className="image-upload-label">
                <PhotoIcon className="h-8 w-8" />
                <span>Cliquez pour ajouter des photos</span>
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
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Aperçu ${index + 1}`} />
                    <button type="button" onClick={() => removeImage(index)}>
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
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
          display: block;
          color: #374151;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 14px;
          transition: all 0.3s;
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
          color: #374151;
        }

        .btn-add-feature:hover {
          background: #e5e7eb;
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
          display: flex;
          align-items: center;
        }

        .feature-tag button:hover {
          color: #dc2626;
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
          transition: all 0.3s;
        }

        .image-upload-label:hover {
          border-color: #2563eb;
          background: #f8fafc;
        }

        .image-upload-label span {
          color: #6b7280;
          font-size: 14px;
        }

        .image-previews {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 5px;
          overflow: hidden;
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
          background: rgba(0, 0, 0, 0.5);
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
          color: #374151;
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
          .add-property-container {
            padding: 0;
          }

          .form-row {
            grid-template-columns: 1fr;
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

export default AddProperty;