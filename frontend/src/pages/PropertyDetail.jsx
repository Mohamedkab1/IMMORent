import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  MapPinIcon, 
  HomeIcon, 
  CurrencyEuroIcon, 
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  CheckCircleIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      try { return JSON.parse(features); }
      catch (e) { return []; }
    }
    return [];
  };

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getById(id);
      if (response.success && response.data) {
        if (response.data.features) response.data.features = parseFeatures(response.data.features);
        setProperty(response.data);
      } else setError('Bien non trouvé');
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter');
      navigate('/login');
      return;
    }
    setShowContactForm(true);
  };

  const sendContactMessage = () => {
    if (!contactMessage.trim()) {
      toast.warning('Veuillez écrire un message');
      return;
    }
    toast.success('Message envoyé');
    setShowContactForm(false);
    setContactMessage('');
  };

  const handleRequestRental = () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter');
      navigate('/login');
      return;
    }
    if (user?.role?.slug !== 'client') {
      toast.error('Seuls les clients peuvent faire une demande');
      return;
    }
    if (property?.transaction_type !== 'rent') {
      toast.error('Ce bien n\'est pas disponible à la location');
      return;
    }
    navigate(`/requests/new?property=${id}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien copié');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="error-container">
        <div className="error-card">
          <XMarkIcon className="error-icon" />
          <h2>Erreur</h2>
          <p>{error || 'Bien non trouvé'}</p>
          <button onClick={() => navigate('/properties')}>Retour aux biens</button>
        </div>
      </div>
    );
  }

  const features = parseFeatures(property.features);
  const images = property.images?.length > 0 ? property.images : [null];
  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';
  const agent = property.user || { name: 'Agent', email: 'contact@immorent.com', phone: 'Non renseigné' };

  return (
    <>
      <div className="property-detail-page">
        <div className="detail-nav">
          <div className="nav-container">
            <button onClick={() => navigate(-1)} className="back-button">
              <ArrowLeftIcon className="h-5 w-5" />
              Retour
            </button>
            <div className="nav-actions">
              <button onClick={() => setIsFavorite(!isFavorite)} className="nav-action">
                {isFavorite ? <HeartIconSolid className="h-6 w-6 text-red-500" /> : <HeartIcon className="h-6 w-6" />}
              </button>
              <button onClick={handleShare} className="nav-action">
                <ShareIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="detail-container">
          <div className="gallery-section">
            <div className="main-image">
              <img src={images[selectedImage] ? `http://localhost:8000/storage/${images[selectedImage]}` : defaultImage} alt={property.title} />
              {property.status === 'available' && <span className="status-badge available">Disponible</span>}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-grid">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}>
                    <img src={img ? `http://localhost:8000/storage/${img}` : defaultImage} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="info-section">
            <div className="info-header">
              <div>
                <h1>{property.title}</h1>
                <div className="location">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{property.city} {property.postal_code}</span>
                </div>
              </div>
              <div className="price-tag">
                <span className="price">{property.price?.toLocaleString('fr-FR')}€</span>
                <span className="period">{property.transaction_type === 'rent' ? '/mois' : ''}</span>
                <span className={`transaction-badge ${property.transaction_type}`}>
                  {property.transaction_type === 'rent' ? 'Location' : 'Vente'}
                </span>
              </div>
            </div>

            <div className="features-grid">
              <div className="feature-item"><HomeIcon className="feature-icon" /><span>{property.surface} m²</span></div>
              <div className="feature-item"><BuildingOfficeIcon className="feature-icon" /><span>{property.rooms} pièces</span></div>
              <div className="feature-item"><HomeIcon className="feature-icon" /><span>{property.bedrooms || 0} chambres</span></div>
              <div className="feature-item"><HomeIcon className="feature-icon" /><span>{property.bathrooms || 0} sdb</span></div>
            </div>

            <div className="description-section">
              <h2>Description</h2>
              <p>{property.description}</p>
            </div>

            {features.length > 0 && (
              <div className="features-section">
                <h2>Équipements</h2>
                <div className="features-list">
                  {features.map((f, i) => <div key={i} className="feature-tag"><CheckCircleIcon className="h-4 w-4" />{f}</div>)}
                </div>
              </div>
            )}

            <div className="contact-section">
              <h2>Contact</h2>
              <div className="agent-card">
                <div className="agent-avatar">{agent.name?.charAt(0)}</div>
                <div className="agent-info">
                  <h3>{agent.name}</h3>
                  <p>Agent immobilier</p>
                  <div className="agent-details">
                    <div><PhoneIcon className="h-4 w-4" /> {agent.phone}</div>
                    <div><EnvelopeIcon className="h-4 w-4" /> {agent.email}</div>
                  </div>
                </div>
              </div>

              {!showContactForm ? (
                <div className="contact-actions">
                  <button onClick={handleContact} className="btn-contact">Contacter l'agent</button>
                  {property.transaction_type === 'rent' && property.status === 'available' && isAuthenticated && user?.role?.slug === 'client' && (
                    <button onClick={handleRequestRental} className="btn-request">Faire une demande</button>
                  )}
                  {property.transaction_type === 'sale' && (
                    <div className="sale-info"><ExclamationTriangleIcon /> Ce bien est à vendre. Contactez l'agent.</div>
                  )}
                </div>
              ) : (
                <div className="contact-form">
                  <textarea value={contactMessage} onChange={e => setContactMessage(e.target.value)} rows="4" placeholder="Votre message..." />
                  <div className="form-actions">
                    <button onClick={sendContactMessage} className="btn-send">Envoyer</button>
                    <button onClick={() => setShowContactForm(false)} className="btn-cancel">Annuler</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .property-detail-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .detail-nav {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 70px;
          z-index: 10;
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .back-button:hover { color: #d4af37; }

        .nav-actions { display: flex; gap: 1rem; }
        .nav-action { background: none; border: none; cursor: pointer; color: #6b7280; }

        .detail-container { max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem; }

        .gallery-section { margin-bottom: 2rem; }

        .main-image {
          position: relative;
          height: 500px;
          border-radius: 0.75rem;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .main-image img { width: 100%; height: 100%; object-fit: cover; }

        .status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-weight: 600;
          background: #10b981;
          color: white;
        }

        .thumbnail-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }

        .thumbnail {
          height: 80px;
          border: none;
          border-radius: 0.5rem;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.3s;
        }

        .thumbnail.active, .thumbnail:hover { opacity: 1; }
        .thumbnail img { width: 100%; height: 100%; object-fit: cover; }

        .info-section {
          background: white;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-header h1 { font-size: 1.5rem; color: #0f2b4d; margin-bottom: 0.5rem; }
        .location { display: flex; align-items: center; gap: 0.25rem; color: #6b7280; }

        .price-tag { text-align: right; }
        .price { font-size: 1.75rem; font-weight: 700; color: #d4af37; }
        .period { color: #6b7280; font-size: 0.875rem; }

        .transaction-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .transaction-badge.rent { background: #dcfce7; color: #059669; }
        .transaction-badge.sale { background: #fee2e2; color: #dc2626; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 0.75rem;
          margin-bottom: 2rem;
        }

        .feature-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-align: center; }
        .feature-icon { width: 1.5rem; height: 1.5rem; color: #d4af37; }
        .feature-item span { font-weight: 500; color: #0f2b4d; }

        .description-section h2, .features-section h2, .contact-section h2 {
          font-size: 1.25rem;
          color: #0f2b4d;
          margin-bottom: 1rem;
        }

        .description-section p { color: #4b5563; line-height: 1.6; }

        .features-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .feature-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f8f9fa;
          border-radius: 0.5rem;
          color: #4b5563;
        }

        .agent-card {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .agent-avatar {
          width: 4rem;
          height: 4rem;
          background: #d4af37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f2b4d;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .agent-info h3 { color: #0f2b4d; margin-bottom: 0.25rem; }
        .agent-info p { color: #6b7280; font-size: 0.875rem; margin-bottom: 0.75rem; }
        .agent-details div { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #4b5563; }

        .contact-actions { display: flex; flex-direction: column; gap: 1rem; }
        .btn-contact, .btn-request { padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-contact { background: #d4af37; color: #0f2b4d; }
        .btn-contact:hover { background: #c4a52e; }
        .btn-request { background: #0f2b4d; color: white; }
        .btn-request:hover { background: #1e4a6e; }

        .sale-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #fef3c7;
          border-radius: 0.5rem;
          color: #d97706;
        }

        .contact-form textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          resize: vertical;
        }

        .form-actions { display: flex; gap: 1rem; }
        .btn-send, .btn-cancel { flex: 1; padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
        .btn-send { background: #d4af37; color: #0f2b4d; }
        .btn-cancel { background: #f3f4f6; color: #374151; }

        .loading-container, .error-container {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid #e5e7eb;
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-card {
          background: white;
          padding: 2rem;
          border-radius: 0.75rem;
          text-align: center;
          max-width: 400px;
        }

        .error-icon { width: 3rem; height: 3rem; color: #dc2626; margin: 0 auto 1rem; }

        @media (max-width: 768px) {
          .main-image { height: 300px; }
          .thumbnail-grid { grid-template-columns: repeat(3, 1fr); }
          .info-header { flex-direction: column; gap: 1rem; }
          .price-tag { text-align: left; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
};

export default PropertyDetail;