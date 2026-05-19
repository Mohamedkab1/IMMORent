import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { messageService } from '../services/messages';
import { 
  MapPinIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon as HeartIconOutline,
  HomeIcon,
  ArrowsPointingOutIcon,
  HashtagIcon,
  KeyIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  HomeModernIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/PropertyDetail.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);

  // Contact form state
  const [contactData, setContactData] = useState({
    message: ''
  });
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProperty();
      fetchReviews();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      } else setError(t('prop.detail.not_found'));
    } catch (err) {
      setError(t('prop.detail.load_error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await propertyService.getReviews(id);
      if (response.success) {
        if (response.data && response.data.reviews) {
          setReviews(response.data.reviews);
          setUserReview(response.data.user_review);
          setAverageRating(response.data.average_rating || 0);
          setTotalReviews(response.data.total_reviews || 0);
        } else if (Array.isArray(response.data)) {
          setReviews(response.data);
          const sum = response.data.reduce((acc, r) => acc + (r.rating || 0), 0);
          setAverageRating(response.data.length ? sum / response.data.length : 0);
          setTotalReviews(response.data.length);
        }
      }
    } catch (err) {
      console.error('Erreur chargement avis:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info(t('auth.login.required', 'Veuillez vous connecter pour laisser un avis.'));
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }
    
    setSubmittingReview(true);
    try {
      const response = await propertyService.submitReview(id, newReview);
      if (response.success) {
        toast.success(t('prop.detail.review.submitted', 'Votre avis a été ajouté avec succès.'));
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('prop.detail.review.error', 'Erreur lors de l\'ajout de l\'avis.');
      toast.error(errorMsg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info(t('auth.login.required'));
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }
    
    setSendingMessage(true);
    try {
      const response = await messageService.sendMessage({
        receiver_id: property.user_id,
        property_id: property.id,
        body: contactData.message
      });
      
      if (response.success) {
        toast.success(t('prop.detail.contact.sent'));
        setContactData({ message: '' });
      }
    } catch (error) {
      toast.error(t('prop.detail.contact.error'));
    } finally {
      setSendingMessage(false);
    }
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const nextImage = () => {
    const imagesArray = property?.images?.length > 0 ? property.images : [null];
    setCurrentImageIndex((prev) => (prev + 1) % imagesArray.length);
  };

  const prevImage = () => {
    const imagesArray = property?.images?.length > 0 ? property.images : [null];
    setCurrentImageIndex((prev) => (prev - 1 + imagesArray.length) % imagesArray.length);
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 200;
      thumbnailContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="pd-loader-container">
        <div className="pd-spinner"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="pd-error-container">
        <div className="pd-error-card">
          <ExclamationTriangleIcon className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-slate-800">{t('common.error')}</h2>
          <p className="text-slate-500 mb-6">{error || t('prop.detail.not_found')}</p>
          <button onClick={() => navigate('/properties')} className="pd-btn-primary">
            {t('prop.detail.back_to_list')}
          </button>
        </div>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : [null];
  const defaultImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80';
  const getImageUrl = (img) => img ? (img.startsWith('http') ? img : `/storage/${img}`) : defaultImage;

  const agent = property.user || { 
    name: 'EM CONSULT', 
    email: 'contact@emconsult-marrakech.com', 
    phone: '00212664506568' 
  };

  return (
    <div className="pd-page-wrapper">
      <div className="pd-container">
        
        {/* Gallery Section */}
        <div className="pd-gallery-section">
          <div className="pd-main-image-wrapper">
            <img 
              src={getImageUrl(images[currentImageIndex])} 
              alt={property.title} 
              className="pd-main-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
            
            {/* Favorite Button Overlay */}
            <button 
              className={`pd-favorite-btn ${isFavorite(property.id) ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(property);
              }}
              title={isFavorite(property.id) ? t('favorites.remove') : t('favorites.add')}
            >
              {isFavorite(property.id) ? (
                <HeartIconSolid className="w-6 h-6 text-rose-500" />
              ) : (
                <HeartIconOutline className="w-6 h-6" />
              )}
            </button>

            {/* Navigation Arrows for Gallery */}
            {images.length > 1 && (
              <>
                <button className="pd-nav-arrow left" onClick={prevImage}>
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button className="pd-nav-arrow right" onClick={nextImage}>
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          
          <div className="pd-thumbnails-wrapper">
            <button className="pd-thumb-nav-btn" onClick={() => scrollThumbnails('left')}>
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="pd-thumbnails-container" ref={thumbnailContainerRef}>
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`pd-thumbnail ${currentImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img 
                    src={getImageUrl(img)} 
                    alt={`Thumbnail ${idx}`} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
              ))}
            </div>

            <button className="pd-thumb-nav-btn" onClick={() => scrollThumbnails('right')}>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="pd-content-layout">
          
          {/* Left Column */}
          <div className="pd-main-col">
            
            {/* Top Badges */}
            <div className="pd-top-badges">
              <div className="pd-badge flex items-center gap-2">
                <HomeIcon className="w-5 h-5 text-primary" />
                <span>{t(`property.type.${property.type?.toLowerCase()}`)}</span>
              </div>
              {property.bedrooms && (
                <div className="pd-badge flex items-center gap-2">
                  <HomeModernIcon className="w-5 h-5 text-primary" />
                  <span>{property.bedrooms} {t('prop.detail.bedrooms', 'chambres')}</span>
                </div>
              )}
              {property.surface && (
                <div className="pd-badge flex items-center gap-2">
                  <ArrowsPointingOutIcon className="w-5 h-5 text-primary" />
                  <span>{property.surface} m²</span>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="pd-section">
              <h2 className="pd-section-title">{t('prop.detail.description', 'Description')}</h2>
              
              <div className="pd-description-content">
                <p className="pd-subtitle">
                  {t(`prop.transaction.${property.transaction_type?.toLowerCase()}`)} – {t(`property.type.${property.type?.toLowerCase()}`)} {property.bedrooms && `${property.bedrooms} ${t('prop.detail.bedrooms', 'chambres').toLowerCase()}`} {property.surface && `${property.surface} m²`} – {t(property.city)}
                </p>
                
                <div className="pd-text-body">
                  {property.description && property.description.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {property.features && property.features.length > 0 && (
                  <div className="pd-features-list">
                    <h3 className="pd-subheading">{t('prop.detail.features', 'Caractéristiques')} :</h3>
                    <ul>
                      {parseFeatures(property.features).map((feature, idx) => (
                        <li key={idx}>• {t(feature, feature)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="pd-section pd-details-section">
              <h2 className="pd-section-title">{t('prop.detail.info_title', 'Détails du bien')}</h2>
              
              <div className="pd-details-grid">
                <div className="pd-detail-row">
                  <div className="pd-detail-label flex items-center gap-2">
                    <HashtagIcon className="w-5 h-5 text-slate-400" />
                    {t('prop.detail.reference', 'Référence')} :
                  </div>
                  <div className="pd-detail-value">{t('prop.detail.ref_prefix', 'Ref')}{property.id}</div>
                </div>
                <div className="pd-detail-row">
                  <div className="pd-detail-label flex items-center gap-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
                    {t('prop.detail.info.type', 'Type')} :
                  </div>
                  <div className="pd-detail-value">{t(`property.type.${property.type?.toLowerCase()}`)}</div>
                </div>
                <div className="pd-detail-row">
                  <div className="pd-detail-label flex items-center gap-2">
                    <KeyIcon className="w-5 h-5 text-slate-400" />
                    {t('prop.detail.info.vocation', 'Vocation')} :
                  </div>
                  <div className="pd-detail-value">{t(`prop.transaction.${property.transaction_type?.toLowerCase()}`)}</div>
                </div>
                {property.bedrooms && (
                  <div className="pd-detail-row">
                    <div className="pd-detail-label flex items-center gap-2">
                      <HomeModernIcon className="w-5 h-5 text-slate-400" />
                      {t('prop.detail.nb_bedrooms', 'Chambres')} :
                    </div>
                    <div className="pd-detail-value">{property.bedrooms}</div>
                  </div>
                )}
                {property.surface && (
                  <div className="pd-detail-row">
                    <div className="pd-detail-label flex items-center gap-2">
                      <ArrowsPointingOutIcon className="w-5 h-5 text-slate-400" />
                      {t('prop.detail.info.surface_habitable', 'Surface')} :
                    </div>
                    <div className="pd-detail-value">{property.surface} m²</div>
                  </div>
                )}
                {property.price && (
                  <div className="pd-detail-row">
                    <div className="pd-detail-label flex items-center gap-2">
                      <BanknotesIcon className="w-5 h-5 text-slate-400" />
                      {t('prop.detail.info.price', 'Prix')} :
                    </div>
                    <div className="pd-detail-value">{property.price.toLocaleString()} {t('prop.currency', 'DH')}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pd-section mt-10">
              <h2 className="pd-section-title">{t('prop.detail.reviews.title', 'Avis Clients')}</h2>
              
              {reviewsLoading ? (
                <div className="flex justify-center py-8"><div className="pd-spinner"></div></div>
              ) : reviews.length === 0 ? (
                <div className="pd-empty-reviews bg-slate-50 rounded-xl p-8 text-center border border-slate-100 dark:bg-slate-800 dark:border-slate-700" style={{backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-main)'}}>
                  <StarIconSolid className="w-12 h-12 text-slate-200 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">{t('prop.detail.review.empty', 'Soyez le premier à donner votre avis sur ce bien.')}</p>
                </div>
              ) : (
                <div className="pd-reviews-container">
                  <div className="pd-reviews-summary p-6 rounded-xl border shadow-sm flex items-center gap-6 mb-6" style={{backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-main)'}}>
                    <div className="text-5xl font-black tracking-tighter" style={{color: 'var(--color-text-main)'}}>
                      {Number(averageRating).toFixed(1)}
                    </div>
                    <div className="pd-rating-info">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4,5].map(star => (
                          <StarIconSolid key={star} className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                        ))}
                      </div>
                      <div className="font-medium" style={{color: 'var(--color-text-sub)'}}>{t('prop.detail.review.based_on', 'Basé sur')} {totalReviews} {t('prop.detail.review.count', 'avis')}</div>
                    </div>
                  </div>
                  
                  <div className="pd-reviews-list space-y-4">
                    {reviews.slice(0, 5).map((review, idx) => (
                      <div key={idx} className="pd-review-card p-5 rounded-xl border shadow-sm" style={{backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-main)'}}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{backgroundColor: 'var(--color-bg-soft)', color: 'var(--color-text-main)'}}>
                              {review.user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div>
                              <div className="font-bold text-sm" style={{color: 'var(--color-text-main)'}}>{review.user?.name || t('common.anonymous', 'Anonyme')}</div>
                              <div className="text-xs" style={{color: 'var(--color-text-muted)'}}>{new Date(review.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(star => (
                              <StarIconSolid key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-sm leading-relaxed" style={{color: 'var(--color-text-sub)'}}>{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Form */}
              {!isAuthenticated ? (
                <div className="mt-8 p-10 rounded-xl border border-dashed text-center bg-bg-soft/50" style={{borderColor: 'var(--color-border-main)'}}>
                   <StarIconSolid className="w-10 h-10 text-text-muted/20 mx-auto mb-4" />
                   <p className="text-text-sub font-medium mb-6">{t('prop.detail.review.login_required', 'Veuillez vous connecter pour partager votre expérience.')}</p>
                   <Link 
                    to="/login" 
                    state={{ from: `/properties/${id}` }}
                    className="px-8 py-3 bg-primary text-white rounded-lg font-bold transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20"
                   >
                    {t('nav.login')}
                   </Link>
                </div>
              ) : user?.role?.slug === 'client' ? (
                userReview ? (
                  <div className="mt-8 p-6 rounded-xl border shadow-sm flex items-center gap-4 bg-amber-50/30 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30" style={{borderColor: 'var(--color-border-main)'}}>
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                      <CheckCircleIcon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: theme === 'dark' ? '#f1f5f9' : 'black' }}>
                        {userReview.status === 'pending' ? t('prop.detail.review.pending_notice', 'Votre avis est en attente de modération.') : t('prop.detail.review.already_submitted', 'Vous avez déjà laissé un avis pour ce bien.')}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {t('prop.detail.review.one_per_user', 'Un seul avis est autorisé par utilisateur et par bien.')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 p-6 rounded-xl border shadow-sm" style={{backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border-main)'}}>
                    <h3 className="text-lg font-bold mb-4" style={{color: 'var(--color-text-main)'}}>{t('prop.detail.review.add', 'Ajouter un avis')}</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-sub)'}}>{t('prop.detail.review.rating', 'Note')}</label>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(star => (
                            <button 
                              key={star} 
                              type="button" 
                              onClick={() => setNewReview({...newReview, rating: star})}
                              className="focus:outline-none hover:scale-110 transition-transform"
                            >
                              <StarIconSolid className={`w-8 h-8 ${star <= newReview.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'} transition-colors`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{color: 'var(--color-text-sub)'}}>{t('prop.detail.review.comment', 'Votre commentaire')}</label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                          className="w-full rounded-lg p-3 border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          style={{backgroundColor: 'var(--color-bg-soft)', borderColor: 'var(--color-border-main)', color: 'var(--color-text-main)'}}
                          rows="3"
                          required
                          placeholder={t('prop.detail.review.placeholder', 'Partagez votre expérience...')}
                        ></textarea>
                      </div>
                      <button 
                        type="submit" 
                        disabled={submittingReview}
                        className="px-6 py-3 rounded-lg font-bold !text-white transition-all disabled:opacity-50 hover:opacity-90 active:scale-95 shadow-md"
                        style={{backgroundColor: 'var(--color-primary)'}}
                      >
                        {submittingReview ? t('common.sending', 'Envoi...') : t('prop.detail.review.submit', 'Publier l\'avis')}
                      </button>
                    </form>
                  </div>
                )
              ) : null}

            </div>

          </div>

          {/* Right Column / Sidebar */}
          <div className="pd-sidebar-col">
            <div className="pd-sticky-sidebar">
              
              <div className="pd-contact-card" style={{marginBottom: '30px'}}>
                <h2 className="pd-contact-title">{t('prop.detail.contact.title', 'Contacter Nous')}</h2>
                
                <div className="pd-agent-info">
                  <div className="pd-agent-logo">
                    <div className="text-center font-serif text-xl tracking-widest" style={{color: 'var(--color-text-sub)'}}>
                      {agent.name}
                    </div>
                  </div>
                  <div className="pd-agent-details">
                    <p>{agent.phone}</p>
                    <p>{agent.email}</p>
                  </div>
                </div>

                <form className="pd-contact-form" onSubmit={handleContactSubmit}>
                  <div className="pd-form-group">
                    <textarea 
                      name="message"
                      value={contactData.message}
                      onChange={handleContactChange}
                      placeholder={t('prop.detail.contact.default_msg', 'Bonjour,\nJe suis intéressé(e) par l\'annonce que vous proposez sur le site. Merci de me recontacter.')}
                      rows="4" 
                      className="pd-form-input pd-form-textarea"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" disabled={sendingMessage} className="pd-submit-btn">
                     {sendingMessage ? t('common.sending', 'Envoi...') : t('prop.detail.contact.send', 'Envoyer le message')}
                  </button>
                </form>
                
                {property.transaction_type === 'rent' && (
                  <div className="pd-request-wrapper">
                    <button 
                      type="button" 
                      onClick={() => navigate(`/requests/new?property=${property.id}`)}
                      className="pd-request-btn"
                    >
                      {t('prop.detail.rental.request_btn', 'Demande de location')}
                    </button>
                    {property.status === 'rented' && (
                      <p className="pd-rented-notice text-xs text-amber-500 mt-2 text-center leading-relaxed">
                        {(property.active_contract?.start_date || property.current_contract?.start_date) ? 
                          t('prop.detail.status.rented_desc', { 
                            start: new Date(property.active_contract?.start_date || property.current_contract?.start_date).toLocaleDateString(), 
                            end: new Date(property.active_contract?.end_date || property.current_contract?.end_date).toLocaleDateString() 
                          }) : 
                          t('prop.detail.rented_notice', 'Ce bien est actuellement loué. Vous pouvez effectuer une demande pour d\'autres dates.')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Map Section moved to Sidebar */}
              <div className="pd-contact-card pd-map-card">
                <h2 className="pd-contact-title" style={{marginBottom: '15px'}}>{t('prop.detail.location.title', 'Localisation')}</h2>
                <div className="pd-map-wrapper">
                  {property.latitude && property.longitude ? (
                    <MapContainer
                      center={[parseFloat(property.latitude), parseFloat(property.longitude)]}
                      zoom={14}
                      style={{ height: '250px', width: '100%', zIndex: 1 }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer 
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      <Marker position={[parseFloat(property.latitude), parseFloat(property.longitude)]}>
                        <Popup>
                          <div className="font-semibold text-slate-800">{t(property.title)}</div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div className="pd-map-placeholder" style={{height: '250px'}}>
                      <MapPinIcon className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-xs text-center">{t('prop.detail.location.not_available', 'Emplacement précis non disponible')}</p>
                      <p className="text-xs font-bold mt-1">{t(property.city)}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
