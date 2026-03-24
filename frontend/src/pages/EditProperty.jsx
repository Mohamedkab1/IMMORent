import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/properties';
import { toast } from 'react-toastify';
import { ArrowLeftIcon, PlusIcon, XMarkIcon, PhotoIcon, MapPinIcon, HomeIcon, CurrencyEuroIcon, BuildingOfficeIcon, DocumentTextIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

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
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', transaction_type: 'rent', address: '', city: '', postal_code: '', surface: '', rooms: '', bedrooms: '', bathrooms: '', type: 'apartment', category_id: '', status: 'available' });

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    else if (!isAgent && !isAdmin) navigate('/dashboard');
    else fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [propRes, catRes] = await Promise.all([propertyService.getById(id), fetch('http://localhost:8000/api/categories').then(r => r.json())]);
      if (propRes.success && propRes.data) {
        const p = propRes.data;
        setProperty(p);
        setFormData({ title: p.title, description: p.description, price: p.price, transaction_type: p.transaction_type, address: p.address, city: p.city, postal_code: p.postal_code, surface: p.surface, rooms: p.rooms, bedrooms: p.bedrooms || '', bathrooms: p.bathrooms || '', type: p.type, category_id: p.category_id, status: p.status });
        setExistingImages(p.images || []);
        let features = p.features;
        if (typeof features === 'string') try { features = JSON.parse(features); } catch(e) { features = []; }
        setFeaturesList(Array.isArray(features) ? features : []);
      } else toast.error('Bien non trouvé');
      if (catRes.success) setCategories(catRes.data);
    } catch (error) { toast.error('Erreur chargement'); navigate('/dashboard/agent'); }
    finally { setLoading(false); }
  };

  const propertyTypes = [{ value: 'apartment', label: 'Appartement' }, { value: 'house', label: 'Maison' }, { value: 'studio', label: 'Studio' }, { value: 'commercial', label: 'Local commercial' }, { value: 'land', label: 'Terrain' }];
  const statusOptions = [{ value: 'available', label: 'Disponible' }, { value: 'rented', label: 'Loué' }, { value: 'reserved', label: 'Réservé' }, { value: 'unavailable', label: 'Indisponible' }];

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleImageChange = (e) => { const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/')); setImages(prev => [...prev, ...files]); files.forEach(f => { const reader = new FileReader(); reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]); reader.readAsDataURL(f); }); };
  const removeExistingImage = (index) => setExistingImages(prev => prev.filter((_, i) => i !== index));
  const removeNewImage = (index) => { setImages(prev => prev.filter((_, i) => i !== index)); setImagePreviews(prev => prev.filter((_, i) => i !== index)); };
  const addFeature = () => { if (newFeature.trim()) { setFeaturesList([...featuresList, newFeature.trim()]); setNewFeature(''); } };
  const removeFeature = (index) => setFeaturesList(featuresList.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updateData = { ...formData, price: parseFloat(formData.price), surface: parseFloat(formData.surface), rooms: parseInt(formData.rooms), bedrooms: parseInt(formData.bedrooms) || 0, bathrooms: parseInt(formData.bathrooms) || 0, category_id: parseInt(formData.category_id), features: JSON.stringify(featuresList), images: existingImages };
      const res = await propertyService.update(id, updateData);
      if (res.success) { toast.success('Bien modifié'); navigate('/dashboard/agent?refresh=true'); }
      else toast.error(res.message);
    } catch (error) { toast.error('Erreur modification'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <>
      <div className="edit-property-page">
        <div className="edit-container">
          <button onClick={() => navigate(-1)} className="back-btn"><ArrowLeftIcon /> Retour</button>
          <h1>Modifier le bien</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-section"><h2><DocumentTextIcon /> Informations générales</h2>
              <div className="form-group"><label>Titre *</label><input name="title" value={formData.title} onChange={handleChange} /></div>
              <div className="form-group"><label>Description *</label><textarea name="description" rows="4" value={formData.description} onChange={handleChange} /></div>
              <div className="form-row"><div className="form-group"><label>Type *</label><select name="type" value={formData.type} onChange={handleChange}>{propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
              <div className="form-group"><label>Catégorie *</label><select name="category_id" value={formData.category_id} onChange={handleChange}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div></div>
              <div className="form-row"><div className="form-group"><label>Prix *</label><input type="number" name="price" value={formData.price} onChange={handleChange} /></div>
              <div className="form-group"><label>Statut *</label><select name="status" value={formData.status} onChange={handleChange}>{statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div></div>
              <div className="form-group"><label>Type transaction *</label><div className="transaction-selector"><button type="button" className={`transaction-btn ${formData.transaction_type === 'rent' ? 'active' : ''}`} onClick={() => setFormData(prev => ({ ...prev, transaction_type: 'rent' }))}>📍 Location</button><button type="button" className={`transaction-btn ${formData.transaction_type === 'sale' ? 'active' : ''}`} onClick={() => setFormData(prev => ({ ...prev, transaction_type: 'sale' }))}>💰 Vente</button></div></div></div>

            <div className="form-section"><h2><MapPinIcon /> Localisation</h2>
              <div className="form-group"><label>Adresse *</label><input name="address" value={formData.address} onChange={handleChange} /></div>
              <div className="form-row"><div className="form-group"><label>Ville *</label><input name="city" value={formData.city} onChange={handleChange} /></div>
              <div className="form-group"><label>Code postal *</label><input name="postal_code" value={formData.postal_code} onChange={handleChange} /></div></div></div>

            <div className="form-section"><h2><HomeIcon /> Caractéristiques</h2>
              <div className="form-row"><div className="form-group"><label>Surface (m²) *</label><input type="number" name="surface" value={formData.surface} onChange={handleChange} /></div>
              <div className="form-group"><label>Pièces *</label><input type="number" name="rooms" value={formData.rooms} onChange={handleChange} /></div></div>
              <div className="form-row"><div className="form-group"><label>Chambres</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} /></div>
              <div className="form-group"><label>Salles de bain</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} /></div></div></div>

            <div className="form-section"><h2><CheckCircleIcon /> Équipements</h2>
              <div className="features-input"><input value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyPress={e => e.key === 'Enter' && addFeature()} placeholder="Ajouter un équipement..." /><button type="button" onClick={addFeature}><PlusIcon /> Ajouter</button></div>
              <div className="features-list">{featuresList.map((f, i) => <div key={i} className="feature-tag"><span>{f}</span><button onClick={() => removeFeature(i)}><XMarkIcon /></button></div>)}</div></div>

            <div className="form-section"><h2><PhotoIcon /> Photos</h2>
              {existingImages.length > 0 && <div><h3>Photos actuelles</h3><div className="image-previews">{existingImages.map((img, i) => <div key={i} className="image-preview"><img src={`http://localhost:8000/storage/${img}`} alt="" /><button onClick={() => removeExistingImage(i)}><TrashIcon /></button></div>)}</div></div>}
              <div><h3>Ajouter des photos</h3><label className="image-upload"><PhotoIcon /><span>Cliquez pour ajouter</span><input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} /></label></div>
              {imagePreviews.length > 0 && <div className="image-previews">{imagePreviews.map((p, i) => <div key={i} className="image-preview"><img src={p} alt="" /><button onClick={() => removeNewImage(i)}><XMarkIcon /></button></div>)}</div>}</div>

            <div className="form-actions"><button type="button" onClick={() => navigate(-1)} className="btn-cancel">Annuler</button><button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Enregistrement...' : 'Enregistrer'}</button></div>
          </form>
        </div>
      </div>

      <style>{`
        .edit-property-page { min-height: calc(100vh - 70px); background: #f8f9fa; padding: 2rem 1rem; }
        .edit-container { max-width: 800px; margin: 0 auto; }
        .back-btn { display: flex; align-items: center; gap: 0.5rem; background: none; border: none; color: #6b7280; cursor: pointer; margin-bottom: 1rem; }
        .back-btn:hover { color: #d4af37; }
        h1 { font-size: 1.75rem; color: #0f2b4d; margin-bottom: 2rem; }
        form { background: white; border-radius: 0.75rem; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .form-section { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #e5e7eb; }
        .form-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .form-section h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 1.125rem; color: #0f2b4d; margin-bottom: 1rem; }
        .form-section h2 svg { width: 1.25rem; height: 1.25rem; color: #d4af37; }
        .form-section h3 { font-size: 0.875rem; color: #374151; margin: 1rem 0 0.5rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.625rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 0.875rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .transaction-selector { display: flex; gap: 1rem; }
        .transaction-btn { flex: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: white; cursor: pointer; }
        .transaction-btn.active { background: #d4af37; border-color: #d4af37; color: #0f2b4d; }
        .features-input { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .features-input input { flex: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
        .features-input button { display: flex; align-items: center; gap: 0.25rem; padding: 0.5rem 1rem; background: #f3f4f6; border: none; border-radius: 0.5rem; cursor: pointer; }
        .features-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .feature-tag { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.75rem; background: #f3f4f6; border-radius: 2rem; font-size: 0.75rem; }
        .image-previews { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem; }
        .image-preview { position: relative; aspect-ratio: 1; border-radius: 0.5rem; overflow: hidden; background: #f3f4f6; }
        .image-preview img { width: 100%; height: 100%; object-fit: cover; }
        .image-preview button { position: absolute; top: 0.25rem; right: 0.25rem; background: rgba(0,0,0,0.6); border: none; border-radius: 50%; width: 1.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; }
        .image-upload { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.5rem; border: 2px dashed #d1d5db; border-radius: 0.75rem; cursor: pointer; }
        .form-actions { display: flex; gap: 1rem; margin-top: 2rem; }
        .btn-cancel, .btn-submit { flex: 1; padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
        .btn-cancel { background: #f3f4f6; color: #374151; }
        .btn-submit { background: #d4af37; color: #0f2b4d; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; }
        .spinner { width: 2rem; height: 2rem; border: 2px solid #e5e7eb; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } .image-previews { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </>
  );
};

export default EditProperty;