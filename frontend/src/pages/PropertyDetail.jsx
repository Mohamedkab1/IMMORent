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
  WifiIcon,
  TvIcon,
  FireIcon,
  ComputerDesktopIcon,
  KeyIcon,
  BoltIcon,
  CloudIcon,
  SunIcon,
  Cog6ToothIcon,
  CpuChipIcon,
  SparklesIcon
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
    // Vérifier que l'ID est valide (nombre)
    if (!id || id === 'new' || id === 'undefined') {
      setError('ID de bien invalide');
      setLoading(false);
      return;
    }
    
    fetchProperty();
  }, [id]);

  // Fonction pour parser les features (qui peuvent être string JSON ou tableau)
  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      try {
        return JSON.parse(features);
      } catch (e) {
        console.error('Erreur de parsing features:', e);
        return [];
      }
    }
    return [];
  };

  const fetchProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Chargement du bien ID:', id);
      
      // S'assurer que l'ID est un nombre
      const propertyId = parseInt(id);
      if (isNaN(propertyId)) {
        setError('ID de bien invalide');
        setLoading(false);
        return;
      }
      
      const response = await propertyService.getById(propertyId);
      console.log('Réponse reçue:', response);
      
      if (response.success && response.data) {
        // Parser les features si nécessaire
        if (response.data.features) {
          response.data.features = parseFeatures(response.data.features);
        }
        setProperty(response.data);
      } else {
        setError('Bien non trouvé');
      }
    } catch (err) {
      console.error('Erreur détaillée:', err);
      if (err.response?.status === 404) {
        setError('Ce bien n\'existe pas ou a été supprimé');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement du bien');
      }
    } finally {
      setLoading(false);
    }
  };

    const handleRequestRental = () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour faire une demande');
      navigate('/login');
      return;
    }
    
    if (user?.role?.slug !== 'client') {
      toast.error('Seuls les clients peuvent faire des demandes de location');
      return;
    }
    
    // S'assurer que l'ID est un nombre
    const propertyId = parseInt(id);
    if (isNaN(propertyId)) {
      toast.error('ID de bien invalide');
      return;
    }
    
    navigate(`/requests/new?property=${propertyId}`);
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour contacter l\'agent');
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
    // Ici vous pouvez implémenter l'envoi du message via une API
    toast.success('Message envoyé avec succès');
    setShowContactForm(false);
    setContactMessage('');
  };

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour ajouter aux favoris');
      navigate('/login');
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };


  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien copié dans le presse-papiers');
  };

  // Fonction pour obtenir l'icône correspondant à un équipement
  const getFeatureIcon = (feature) => {
    const featureLower = feature.toLowerCase();
    
    if (featureLower.includes('wifi') || featureLower.includes('internet')) 
      return <WifiIcon className="h-4 w-4" />;
    
    if (featureLower.includes('tv') || featureLower.includes('télévision')) 
      return <TvIcon className="h-4 w-4" />;
    
    if (featureLower.includes('chauffage') || featureLower.includes('climatisation')) 
      return <FireIcon className="h-4 w-4" />;
    
    if (featureLower.includes('ascenseur')) 
      return <BuildingOfficeIcon className="h-4 w-4" />;
    
    if (featureLower.includes('parking') || featureLower.includes('garage')) 
      return <Cog6ToothIcon className="h-4 w-4" />;
    
    if (featureLower.includes('cave')) 
      return <KeyIcon className="h-4 w-4" />;
    
    if (featureLower.includes('balcon') || featureLower.includes('terrasse')) 
      return <SunIcon className="h-4 w-4" />;
    
    if (featureLower.includes('meublé')) 
      return <SparklesIcon className="h-4 w-4" />;
    
    if (featureLower.includes('électroménager')) 
      return <CpuChipIcon className="h-4 w-4" />;
    
    if (featureLower.includes('climatisation')) 
      return <CloudIcon className="h-4 w-4" />;
    
    if (featureLower.includes('électricité')) 
      return <BoltIcon className="h-4 w-4" />;
    
    if (featureLower.includes('ordinateur')) 
      return <ComputerDesktopIcon className="h-4 w-4" />;
    
    return <CheckCircleIcon className="h-4 w-4" />;
  };

  // État de chargement
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
          p {
            color: #6b7280;
            font-size: 16px;
          }
        `}</style>
      </div>
    );
  }

  // État d'erreur
  if (error === 'ID de bien invalide') {
    return (
      <div className="error-container">
        <div className="error-card">
          <XMarkIcon className="error-icon" />
          <h2>Oups ! Une erreur est survenue</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => navigate('/properties')} className="btn-primary">
              Voir tous les biens
            </button>
          </div>
        </div>
        <style>{`
          .error-container {
            min-height: calc(100vh - 70px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: #f8fafc;
          }
          .error-card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            text-align: center;
            max-width: 500px;
          }
          .error-icon {
            width: 60px;
            height: 60px;
            color: #dc2626;
            margin: 0 auto 20px;
          }
          .error-card h2 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 15px;
          }
          .error-card p {
            color: #6b7280;
            margin-bottom: 25px;
          }
          .error-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
          }
          .btn-primary {
            padding: 12px 24px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
          }
          .btn-secondary {
            padding: 12px 24px;
            background: #f3f4f6;
            color: #374151;
            border: none;
            border-radius: 5px;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  // Si pas de propriété
  if (!property) {
    return (
      <div className="not-found-container">
        <p>Bien non trouvé</p>
        <button onClick={() => navigate('/properties')}>Retour aux biens</button>
      </div>
    );
  }

  // Parser les features si ce sont encore des strings
  const features = parseFeatures(property.features);
  
  // Données par défaut pour éviter les erreurs
  const images = property.images?.length > 0 ? property.images : [null];
  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop';
  
  // Informations de l'agent
  const agent = property.user || {
    name: 'Agent non spécifié',
    email: 'contact@immogest.com',
    phone: 'Non renseigné'
  };

  return (
    <div className="property-detail-page">
      {/* Navigation */}
      <div className="detail-nav">
        <div className="nav-container">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeftIcon className="h-5 w-5" />
            Retour
          </button>
          <div className="nav-actions">
            <button onClick={toggleFavorite} className="nav-action-button" title="Ajouter aux favoris">
              {isFavorite ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
            <button onClick={handleShare} className="nav-action-button" title="Partager">
              <ShareIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="detail-container">
        {/* Galerie d'images */}
        <div className="gallery-section">
          <div className="main-image">
            <img 
              src={images[selectedImage] ? `http://localhost:8000/storage/${images[selectedImage]}` : defaultImage} 
              alt={property.title || 'Bien immobilier'}
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
            {property.status === 'available' && (
              <span className="status-badge available">Disponible</span>
            )}
            {property.status === 'rented' && (
              <span className="status-badge rented">Loué</span>
            )}
            {property.status === 'reserved' && (
              <span className="status-badge reserved">Réservé</span>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="thumbnail-grid">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                >
                  <img 
                    src={image ? `http://localhost:8000/storage/${image}` : defaultImage} 
                    alt={`${property.title} - ${index + 1}`}
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informations principales */}
        <div className="info-section">
          <div className="info-header">
            <div>
              <h1>{property.title || 'Sans titre'}</h1>
              <div className="location">
                <MapPinIcon className="h-5 w-5" />
                <span>{property.city || 'Localisation non spécifiée'}</span>
                <span className="postal-code">{property.postal_code}</span>
              </div>
              <div className="property-type-badge">
                {property.type_label || property.type}
              </div>
            </div>
            <div className="price-tag">
              <span className="price">{property.price?.toLocaleString('fr-FR') || '0'}€</span>
              <span className="price-period">/mois</span>
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="features-grid">
            <div className="feature-item">
              <HomeIcon className="feature-icon" />
              <span className="feature-label">Surface</span>
              <span className="feature-value">{property.surface || 0} m²</span>
            </div>
            <div className="feature-item">
              <BuildingOfficeIcon className="feature-icon" />
              <span className="feature-label">Pièces</span>
              <span className="feature-value">{property.rooms || 0}</span>
            </div>
            <div className="feature-item">
              <HomeIcon className="feature-icon" />
              <span className="feature-label">Chambres</span>
              <span className="feature-value">{property.bedrooms || 0}</span>
            </div>
            <div className="feature-item">
              <HomeIcon className="feature-icon" />
              <span className="feature-label">Salles de bain</span>
              <span className="feature-value">{property.bathrooms || 0}</span>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h2>Description</h2>
            <p>{property.description || 'Aucune description disponible'}</p>
          </div>

          {/* Équipements */}
          {features && features.length > 0 && (
            <div className="features-section">
              <h2>Équipements</h2>
              <div className="features-list">
                {features.map((feature, index) => (
                  <div key={index} className="feature-tag">
                    {getFeatureIcon(feature)}
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact agent */}
          <div className="contact-section">
            <h2>Contact</h2>
            <div className="agent-card">
              <div className="agent-avatar">
                {agent.name?.charAt(0) || 'A'}
              </div>
              <div className="agent-info">
                <h3>{agent.name}</h3>
                <p>Agent immobilier</p>
                <div className="agent-details">
                  <div className="agent-detail">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{agent.phone || 'Non renseigné'}</span>
                  </div>
                  <div className="agent-detail">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{agent.email || 'Non renseigné'}</span>
                  </div>
                </div>
              </div>
            </div>

            {!showContactForm ? (
              <div className="contact-actions">
                <button onClick={handleContact} className="btn-contact">
                  Contacter l'agent
                </button>
                {property.status === 'available' && isAuthenticated && user?.role?.slug === 'client' && (
                  <button onClick={handleRequestRental} className="btn-request">
                    Faire une demande de location
                  </button>
                )}
                {!isAuthenticated && property.status === 'available' && (
                  <button onClick={() => navigate('/login')} className="btn-login-prompt">
                    Connectez-vous pour faire une demande
                  </button>
                )}
              </div>
            ) : (
              <div className="contact-form">
                <textarea
                  placeholder="Votre message..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows="4"
                />
                <div className="form-actions">
                  <button onClick={sendContactMessage} className="btn-send">
                    Envoyer
                  </button>
                  <button onClick={() => setShowContactForm(false)} className="btn-cancel">
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .property-detail-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
        }

        .detail-nav {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 70px;
          z-index: 10;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 16px;
          transition: color 0.3s;
        }

        .back-button:hover {
          color: #2563eb;
        }

        .nav-actions {
          display: flex;
          gap: 15px;
        }

        .nav-action-button {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          transition: color 0.3s;
          padding: 5px;
        }

        .nav-action-button:hover {
          color: #2563eb;
        }

        .detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .gallery-section {
          margin-bottom: 40px;
        }

        .main-image {
          position: relative;
          height: 500px;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 8px 16px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 14px;
        }

        .status-badge.available {
          background: #10b981;
          color: white;
        }

        .status-badge.rented {
          background: #6b7280;
          color: white;
        }

        .status-badge.reserved {
          background: #f59e0b;
          color: white;
        }

        .thumbnail-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }

        .thumbnail {
          height: 100px;
          border: none;
          padding: 0;
          border-radius: 5px;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.3s;
        }

        .thumbnail:hover,
        .thumbnail.active {
          opacity: 1;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .info-section {
          background: white;
          border-radius: 10px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-header h1 {
          color: #1f2937;
          font-size: 28px;
          margin-bottom: 10px;
        }

        .location {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #6b7280;
          margin-bottom: 10px;
        }

        .postal-code {
          color: #9ca3af;
        }

        .property-type-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #e5e7eb;
          border-radius: 20px;
          font-size: 14px;
          color: #4b5563;
        }

        .price-tag {
          text-align: right;
        }

        .price {
          font-size: 32px;
          font-weight: 700;
          color: #2563eb;
        }

        .price-period {
          color: #6b7280;
          font-size: 16px;
          margin-left: 5px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 10px;
        }

        .feature-item {
          text-align: center;
        }

        .feature-icon {
          width: 30px;
          height: 30px;
          margin: 0 auto 10px;
          color: #2563eb;
        }

        .feature-label {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .feature-value {
          display: block;
          color: #1f2937;
          font-size: 16px;
          font-weight: 600;
        }

        .description-section,
        .features-section,
        .contact-section {
          margin-bottom: 30px;
        }

        .description-section h2,
        .features-section h2,
        .contact-section h2 {
          color: #1f2937;
          font-size: 20px;
          margin-bottom: 15px;
        }

        .description-section p {
          color: #4b5563;
          line-height: 1.8;
        }

        .features-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .feature-tag {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          background: #f9fafb;
          border-radius: 5px;
          color: #4b5563;
        }

        .agent-card {
          display: flex;
          gap: 20px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .agent-avatar {
          width: 60px;
          height: 60px;
          background: #2563eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: 600;
        }

        .agent-info h3 {
          color: #1f2937;
          margin-bottom: 5px;
        }

        .agent-info p {
          color: #6b7280;
          margin-bottom: 10px;
        }

        .agent-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .agent-detail {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #4b5563;
          font-size: 14px;
        }

        .contact-actions {
          display: flex;
          gap: 15px;
        }

        .btn-contact,
        .btn-request,
        .btn-login-prompt {
          padding: 12px 30px;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
          text-decoration: none;
          text-align: center;
        }

        .btn-contact {
          background: #2563eb;
          color: white;
        }

        .btn-contact:hover {
          background: #1d4ed8;
        }

        .btn-request {
          background: #10b981;
          color: white;
        }

        .btn-request:hover {
          background: #059669;
        }

        .btn-login-prompt {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-login-prompt:hover {
          background: #e5e7eb;
        }

        .contact-form {
          margin-top: 20px;
        }

        .contact-form textarea {
          width: 100%;
          padding: 15px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 16px;
          margin-bottom: 15px;
          resize: vertical;
        }

        .contact-form textarea:focus {
          outline: none;
          border-color: #2563eb;
        }

        .form-actions {
          display: flex;
          gap: 15px;
        }

        .btn-send,
        .btn-cancel {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-send {
          background: #2563eb;
          color: white;
        }

        .btn-send:hover {
          background: #1d4ed8;
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        @media (max-width: 768px) {
          .main-image {
            height: 300px;
          }

          .thumbnail-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .info-header {
            flex-direction: column;
            gap: 20px;
          }

          .price-tag {
            text-align: left;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .contact-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetail;