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
  TagIcon,
  BanknotesIcon
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

  useEffect(() => {
    fetchCategories();
    if (!isAuthenticated) navigate('/login');
    else if (!isAgent && !isAdmin) navigate('/dashboard');
  }, [isAuthenticated, isAgent, isAdmin]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/categories');
      const data = await res.json();
      if (data.success) { 
        setCategories(data.data); 
        if (data.data.length) setFormData(prev => ({ ...prev, category_id: data.data[0].id })); 
      }
    } catch (error) { 
      setCategories([
        { id: 1, name: 'Appartement' }, 
        { id: 2, name: 'Maison' }, 
        { id: 3, name: 'Local commercial' }, 
        { id: 4, name: 'Terrain' }, 
        { id: 5, name: 'Studio' }
      ]); 
      setFormData(prev => ({ ...prev, category_id: 1 })); 
    }
  };

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
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: null })); 
  };

  const handleTransactionTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, transaction_type: type }));
  };

  const handleImageChange = (e) => { 
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/')); 
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
    if (newFeature.trim()) { 
      setFeaturesList([...featuresList, newFeature.trim()]); 
      setNewFeature(''); 
    } 
  };

  const removeFeature = (index) => setFeaturesList(featuresList.filter((_, i) => i !== index));

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Titre requis';
    if (!formData.description.trim()) errors.description = 'Description requise';
    if (!formData.price || formData.price <= 0) errors.price = 'Prix positif requis';
    if (!formData.address.trim()) errors.address = 'Adresse requise';
    if (!formData.city.trim()) errors.city = 'Ville requise';
    if (!formData.postal_code.trim()) errors.postal_code = 'Code postal requis';
    if (!formData.surface || formData.surface <= 0) errors.surface = 'Surface positive requise';
    if (!formData.rooms || formData.rooms <= 0) errors.rooms = 'Nombre de pièces requis';
    if (!formData.type) errors.type = 'Type de bien requis';
    if (!formData.category_id) errors.category_id = 'Catégorie requise';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { 
      Object.values(validationErrors).forEach(e => e && toast.error(e)); 
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
      data.append('rooms', parseInt(formData.rooms));
      data.append('bedrooms', parseInt(formData.bedrooms) || 0);
      data.append('bathrooms', parseInt(formData.bathrooms) || 0);
      data.append('type', formData.type);
      data.append('category_id', parseInt(formData.category_id));
      data.append('features', JSON.stringify(featuresList));
      images.forEach(img => data.append('images[]', img));
      const res = await propertyService.create(data);
      if (res.success) { 
        toast.success('Bien ajouté !'); 
        navigate('/dashboard/agent?refresh=true'); 
      } else toast.error(res.message);
    } catch (error) { 
      if (error.response?.status === 422) Object.values(error.response.data.errors).forEach(e => toast.error(e[0])); 
      else toast.error('Erreur'); 
    } finally { setLoading(false); }
  };

  if (!isAgent && !isAdmin) {
    return (
      <div className="unauthorized">
        <div className="unauthorized-card">
          <div className="unauthorized-icon">🔒</div>
          <h2>Accès non autorisé</h2>
          <p>Vous n'avez pas les droits pour ajouter un bien.</p>
          <button onClick={() => navigate('/dashboard')}>Retour</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="add-property-page">
        <div className="add-property-container">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeftIcon className="back-icon" />
            Retour
          </button>
          <h1>Ajouter un bien immobilier</h1>

          <form onSubmit={handleSubmit} className="property-form">
            {/* Informations générales */}
            <div className="form-section">
              <h2><DocumentTextIcon className="section-icon" /> Informations générales</h2>
              <div className="form-group">
                <label>Titre du bien *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ex: Bel appartement centre-ville" />
                {validationErrors.title && <span className="error">{validationErrors.title}</span>}
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Décrivez le bien" />
                {validationErrors.description && <span className="error">{validationErrors.description}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type de bien *</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  {validationErrors.type && <span className="error">{validationErrors.type}</span>}
                </div>
                <div className="form-group">
                  <label>Catégorie *</label>
                  <select name="category_id" value={formData.category_id} onChange={handleChange}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {validationErrors.category_id && <span className="error">{validationErrors.category_id}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><CurrencyEuroIcon className="input-icon" /> Prix *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Ex: 850" />
                  {validationErrors.price && <span className="error">{validationErrors.price}</span>}
                  <small>{formData.transaction_type === 'rent' ? 'DH/mois' : 'DH'}</small>
                </div>
                <div className="form-group">
                  <label>Type de transaction *</label>
                  <div className="transaction-type-selector">
                    {transactionTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          className={`transaction-option ${formData.transaction_type === type.value ? 'selected' : ''}`}
                          onClick={() => handleTransactionTypeSelect(type.value)}
                        >
                          <Icon className="transaction-icon" style={{ color: type.color }} />
                          <span className="transaction-label">{type.label}</span>
                          <span className="transaction-desc">{type.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className="form-section">
              <h2><MapPinIcon className="section-icon" /> Localisation</h2>
              <div className="form-group">
                <label>Adresse *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Numéro et nom de rue" />
                {validationErrors.address && <span className="error">{validationErrors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ville *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Ex: Paris" />
                  {validationErrors.city && <span className="error">{validationErrors.city}</span>}
                </div>
                <div className="form-group">
                  <label>Code postal *</label>
                  <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Ex: 75001" />
                  {validationErrors.postal_code && <span className="error">{validationErrors.postal_code}</span>}
                </div>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="form-section">
              <h2><HomeIcon className="section-icon" /> Caractéristiques</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Surface (m²) *</label>
                  <input type="number" name="surface" value={formData.surface} onChange={handleChange} placeholder="Ex: 65" />
                  {validationErrors.surface && <span className="error">{validationErrors.surface}</span>}
                </div>
                <div className="form-group">
                  <label>Nombre de pièces *</label>
                  <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} placeholder="Ex: 3" />
                  {validationErrors.rooms && <span className="error">{validationErrors.rooms}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Chambres</label>
                  <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Ex: 2" />
                </div>
                <div className="form-group">
                  <label>Salles de bain</label>
                  <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Ex: 1" />
                </div>
              </div>
            </div>

            {/* Équipements */}
            <div className="form-section">
              <h2><CheckCircleIcon className="section-icon" /> Équipements</h2>
              <div className="features-input">
                <input value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyPress={e => e.key === 'Enter' && addFeature()} placeholder="Ajouter un équipement..." />
                <button type="button" onClick={addFeature} className="btn-add-feature">
                  <PlusIcon className="add-feature-icon" /> Ajouter
                </button>
              </div>
              <div className="features-list">
                {featuresList.map((f, i) => (
                  <div key={i} className="feature-tag">
                    <CheckCircleIcon className="feature-check-icon" />
                    <span>{f}</span>
                    <button type="button" onClick={() => removeFeature(i)}><XMarkIcon className="remove-icon" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="form-section">
              <h2><PhotoIcon className="section-icon" /> Photos</h2>
              <label className="image-upload">
                <PhotoIcon className="upload-icon" />
                <span>Ajouter des photos</span>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
              <div className="image-previews">
                {imagePreviews.map((p, i) => (
                  <div key={i} className="image-preview">
                    <img src={p} alt="" />
                    <button onClick={() => removeImage(i)}><XMarkIcon className="remove-icon" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Annuler</button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Ajout en cours...' : 'Ajouter le bien'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .add-property-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
          padding: 2rem 1rem;
        }

        .add-property-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .back-icon {
          width: 1rem;
          height: 1rem;
        }

        .back-button:hover {
          color: #d4af37;
        }

        h1 {
          font-size: 1.75rem;
          color: #0f2b4d;
          margin-bottom: 2rem;
        }

        .property-form {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .form-section {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .form-section h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          color: #0f2b4d;
          margin-bottom: 1rem;
        }

        .section-icon {
          width: 1rem;
          height: 1rem;
          color: #d4af37;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .input-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: #6b7280;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .form-group small {
          display: block;
          font-size: 0.7rem;
          color: #9ca3af;
          margin-top: 0.25rem;
        }

        .error {
          color: #dc2626;
          font-size: 0.7rem;
          margin-top: 0.25rem;
          display: block;
        }

        /* Transaction Type Selector */
        .transaction-type-selector {
          display: flex;
          gap: 1rem;
          margin-top: 0.25rem;
        }

        .transaction-option {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .transaction-option:hover {
          border-color: #d4af37;
          background: #f8f9fa;
        }

        .transaction-option.selected {
          border-color: #d4af37;
          background: #eff6ff;
        }

        .transaction-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .transaction-label {
          font-weight: 600;
          font-size: 0.75rem;
          color: #1f2937;
        }

        .transaction-desc {
          font-size: 0.625rem;
          color: #6b7280;
        }

        /* Features */
        .features-input {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .features-input input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .btn-add-feature {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .add-feature-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .feature-tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.625rem;
          background: #f3f4f6;
          border-radius: 2rem;
          font-size: 0.75rem;
        }

        .feature-check-icon {
          width: 0.75rem;
          height: 0.75rem;
          color: #10b981;
        }

        .remove-icon {
          width: 0.75rem;
          height: 0.75rem;
          color: #9ca3af;
          cursor: pointer;
        }

        .remove-icon:hover {
          color: #dc2626;
        }

        /* Image Upload */
        .image-upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          border: 2px dashed #d1d5db;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .image-upload:hover {
          border-color: #d4af37;
          background: #f8f9fa;
        }

        .upload-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: #9ca3af;
        }

        .image-previews {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 0.5rem;
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
          top: 0.25rem;
          right: 0.25rem;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .btn-cancel,
        .btn-submit {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        .btn-submit {
          background: #d4af37;
          color: #0f2b4d;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Unauthorized */
        .unauthorized {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .unauthorized-card {
          background: white;
          padding: 2rem;
          border-radius: 0.75rem;
          text-align: center;
          max-width: 400px;
        }

        .unauthorized-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .unauthorized-card button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #d4af37;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .transaction-type-selector {
            flex-direction: column;
          }
          .image-previews {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
};

export default AddProperty;