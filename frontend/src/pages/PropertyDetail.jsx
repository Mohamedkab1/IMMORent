import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'react-toastify';
import { messageService } from '../services/messages';
import { 
  MapPinIcon, 
  HomeIcon, 
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
  ExclamationTriangleIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  StarIcon as StarIconOutline,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProperty();
      fetchReviews();
    }
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

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await propertyService.getReviews(id);
      if (response.success) {
        setReviews(response.data.reviews);
        setAverageRating(response.data.average_rating);
        setTotalReviews(response.data.total_reviews);
      }
    } catch (err) {
      console.error('Erreur chargement avis:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour laisser un avis');
      navigate('/login');
      return;
    }

    if (newComment.length < 5) {
      toast.warning('Le commentaire doit faire au moins 5 caractères');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await propertyService.submitReview(id, {
        rating: newRating,
        comment: newComment
      });

      if (response.success) {
        toast.success(response.message || 'Merci ! Votre avis est en attente de modération.');
        setNewComment('');
        setNewRating(5);
        fetchReviews(); // Refresh list
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis';
      toast.error(msg);
    } finally {
      setSubmittingReview(false);
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

  const sendContactMessage = async () => {
    if (!contactMessage.trim()) {
      toast.warning('Veuillez écrire un message');
      return;
    }
    
    setSendingMessage(true);
    try {
      const response = await messageService.sendMessage({
        receiver_id: property.user_id,
        property_id: property.id,
        body: contactMessage
      });
      
      if (response.success) {
        toast.success('Message envoyé ! Redirection vers la messagerie...');
        setTimeout(() => {
          navigate('/messages');
        }, 1500);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
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
    toast.success('Lien copié dans le presse-papier');
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour ajouter aux favoris');
      navigate('/login');
      return;
    }

    try {
       setIsFavorite(!isFavorite); // Optimistic UI
       /* 
       const response = await fetch('/api/favorites/toggle', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
         body: JSON.stringify({ property_id: property.id })
       });
       const data = await response.json();
       setIsFavorite(data.status === 'added');
       */
       toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
    } catch (error) {
       setIsFavorite(!isFavorite); // Rollback
       toast.error('Erreur de connexion');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-soft flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-4 border-border-main border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-text-muted font-medium">Chargement des détails...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-bg-soft flex justify-center items-center px-4">
        <div className="bg-bg-card p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-border-main">
          <XMarkIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-main mb-2">Erreur</h2>
          <p className="text-text-sub mb-6">{error || 'Bien introuvable.'}</p>
          <button onClick={() => navigate('/properties')} className="w-full py-3 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-md">
            Retour aux biens
          </button>
        </div>
      </div>
    );
  }

  const features = parseFeatures(property.features);
  const images = property.images?.length > 0 ? property.images : [null];
  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80';
  const agent = property.user || { name: 'Agent', email: 'contact@immorent.com', phone: 'Non renseigné' };

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300 pb-12">
      {/* Navigation and Actions Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-4 flex justify-between items-center animate-fade-in">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-text-sub hover:text-primary font-bold transition-all px-4 py-2 hover:bg-bg-card rounded-xl border border-transparent hover:border-border-main"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {t('common.prev')}
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleToggleFavorite} 
            className={`p-3 bg-bg-card border border-border-main rounded-xl transition-all shadow-main ${isFavorite ? 'text-rose-500 border-rose-200' : 'text-text-sub hover:text-rose-500 hover:border-rose-200'}`}
          >
            {isFavorite ? <HeartIconSolid className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
          </button>
          <button className="p-3 bg-bg-card border border-border-main rounded-xl text-text-sub hover:text-primary hover:border-primary/20 transition-all shadow-main">
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in animation-delay-100">
        {/* Title and Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${property.transaction_type === 'rent' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-500'}`}>
                {property.transaction_type === 'rent' ? t('prop.transaction.rent') : t('prop.transaction.sale')}
              </span>
              <span className="px-3 py-1 bg-bg-card text-text-sub rounded-full text-xs font-bold border border-border-main">
                {property.type_label}
              </span>
              {property.status === 'available' && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-500 rounded-full text-xs font-bold">
                  {t('prop.status.available')}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-text-main mb-2 tracking-tight">{property.title}</h1>
            <div className="flex items-center gap-4 mb-3 text-text-sub">
              <p className="flex items-center gap-2 font-medium">
                <MapPinIcon className="w-5 h-5 text-primary" />
                {property.city} {property.postal_code}
              </p>
              {totalReviews > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-bg-card rounded-xl border border-border-main shadow-main">
                  <StarIconSolid className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-black text-text-main">{averageRating}</span>
                  <span className="text-xs text-text-muted">({totalReviews} avis)</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-start md:text-end">
            <div className="text-sm font-black text-text-muted uppercase tracking-widest">{t('prop.price')}</div>
            <div className="text-4xl md:text-5xl font-black text-primary dark:text-secondary mt-1">
              {property.price?.toLocaleString('fr-FR')} <span className="text-xl font-bold text-text-muted">DH{property.transaction_type === 'rent' ? '/ms' : ''}</span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-12">
          <div className="relative h-[400px] md:h-[600px] rounded-[40px] overflow-hidden shadow-huge mb-4 bg-bg-soft border-4 border-bg-card">
            <img 
              src={images[selectedImage] ? (images[selectedImage].startsWith('http') ? images[selectedImage] : `/storage/${images[selectedImage]}`) : defaultImage} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(idx)} 
                  className={`relative flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden border-4 transition-all duration-300 ${selectedImage === idx ? 'border-primary dark:border-secondary scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img ? (img.startsWith('http') ? img : `/storage/${img}`) : defaultImage} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Highlights Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: ArrowsRightLeftIcon, val: `${property.surface} m²`, label: 'Surface' },
                { icon: BuildingOfficeIcon, val: `${property.rooms} p.`, label: 'Pièces' },
                { icon: HomeIcon, val: `${property.bedrooms || 0} ch.`, label: 'Chambres' },
                { icon: CurrencyDollarIcon, val: `${property.bathrooms || 0} sdb`, label: 'Salles de bain' }
              ].map((item, i) => (
                <div key={i} className="bg-bg-card p-6 rounded-2xl border border-border-main flex flex-col items-center justify-center text-center shadow-sm">
                  <item.icon className="w-8 h-8 text-primary dark:text-secondary mb-3" />
                  <span className="text-xl font-bold text-text-main">{item.val}</span>
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </section>

            {/* Description */}
            <section className="bg-bg-card p-8 rounded-3xl border border-border-main shadow-sm">
              <h2 className="text-2xl font-bold text-text-main mb-6">Description du bien</h2>
              <div className="prose dark:prose-invert max-w-none text-text-sub leading-relaxed">
                <p className="whitespace-pre-line">{property.description}</p>
              </div>
            </section>

            {/* Features */}
            {features.length > 0 && (
              <section className="bg-bg-card p-8 rounded-3xl border border-border-main shadow-sm">
                <h2 className="text-2xl font-bold text-text-main mb-6">{t('prop.details.features')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-bg-soft rounded-xl border border-border-main">
                      <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-text-main font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section id="reviews" className="bg-bg-card p-8 rounded-3xl border border-border-main shadow-sm scroll-mt-24">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-text-main flex items-center gap-3">
                    <ChatBubbleLeftRightIcon className="w-7 h-7 text-primary" />
                    Avis des utilisateurs
                  </h2>
                </div>
                {totalReviews > 0 && (
                  <div className="text-center">
                    <div className="text-3xl font-black text-text-main">{averageRating}</div>
                    <div className="flex justify-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIconSolid key={star} className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'text-amber-500' : 'text-text-muted dark:text-border-main'}`} />
                      ))}
                    </div>
                    <div className="text-xs font-bold text-text-muted uppercase tracking-widest">{totalReviews} avis</div>
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="mb-12 p-6 bg-bg-soft rounded-2xl border border-dashed border-border-main">
                {isAuthenticated ? (
                  property.user_id === user.id ? (
                    <div className="text-center py-4">
                      <p className="text-text-muted italic">Vous ne pouvez pas laisser d'avis sur votre propre bien.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview}>
                      <h3 className="font-bold text-text-main mb-4">Laissez votre avis</h3>
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-sm font-semibold text-text-muted mr-2">Votre note :</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="focus:outline-none transition-transform active:scale-90"
                          >
                            {star <= newRating ? (
                              <StarIconSolid className="w-8 h-8 text-amber-500" />
                            ) : (
                              <StarIconOutline className="w-8 h-8 text-text-muted hover:text-amber-500/50" />
                            )}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Qu'avez-vous pensé de ce bien ?"
                        className="w-full p-4 mb-4 bg-bg-card border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main resize-none"
                        rows="3"
                        required
                      ></textarea>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-md disabled:opacity-50"
                      >
                        {submittingReview ? 'Publication...' : 'Publier mon avis'}
                      </button>
                    </form>
                  )
                ) : (
                  <div className="text-center py-6">
                    <p className="text-text-sub mb-4">Vous devez être connecté pour laisser un avis.</p>
                    <Link to="/login" className="inline-flex items-center gap-2 px-6 py-2 bg-secondary text-primary rounded-xl font-bold hover:shadow-md transition-all">
                      Se connecter
                    </Link>
                  </div>
                )}
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {reviewsLoading ? (
                  <div className="flex flex-col items-center py-8">
                    <div className="w-10 h-10 border-4 border-border-main border-t-primary rounded-full animate-spin mb-3"></div>
                    <p className="text-text-muted text-sm italic">Chargement des avis...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="group border-b border-border-main last:border-0 pb-6 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center font-bold text-text-muted">
                            {review.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-text-main text-sm">{review.user?.name}</div>
                            <div className="text-xs text-text-muted font-medium">
                              {new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIconSolid key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-500' : 'text-text-muted dark:text-border-main'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-sub text-sm leading-relaxed whitespace-pre-line bg-bg-soft/50 p-4 rounded-xl group-hover:bg-bg-soft transition-colors">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                     <StarIconOutline className="w-12 h-12 text-text-muted dark:text-border-main mx-auto mb-4" />
                     <p className="text-text-muted font-medium italic">Aucun avis pour le moment.</p>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Agent Card */}
              <div className="bg-bg-card p-8 rounded-3xl border border-border-main shadow-huge">
                <h3 className="text-lg font-bold text-text-main mb-6">Votre conseiller</h3>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {agent.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-text-main text-lg">{agent.name}</div>
                    <div className="text-sm font-medium text-text-muted">Agent IMMORent</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-4 p-4 bg-bg-soft rounded-xl text-text-main hover:text-primary dark:hover:text-secondary group transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-bg-card flex items-center justify-center shadow-sm">
                       <PhoneIcon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{agent.phone}</span>
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-4 p-4 bg-bg-soft rounded-xl text-text-main hover:text-primary dark:hover:text-secondary group transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-bg-card flex items-center justify-center shadow-sm">
                       <EnvelopeIcon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm break-all">{agent.email}</span>
                  </a>
                </div>

                {!showContactForm ? (
                  <div className="space-y-3">
                    <button onClick={handleContact} className="w-full py-4 bg-bg-card border-2 border-border-main text-text-main hover:bg-bg-soft rounded-xl font-bold transition-all shadow-sm">
                      Envoyer un message
                    </button>
                    {property.transaction_type === 'rent' && property.status === 'available' && isAuthenticated && user?.role?.slug === 'client' && (
                      <button onClick={handleRequestRental} className="w-full py-4 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-md shadow-primary/30">
                        Demander la location
                      </button>
                    )}
                    {property.transaction_type === 'sale' && (
                      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-500 rounded-xl text-sm font-medium">
                        <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                        <p>Ce bien est à vendre. Veuillez contacter l'agent pour convenir d'une visite.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-bg-soft p-4 rounded-2xl border border-border-main">
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Votre message</label>
                    <textarea 
                      value={contactMessage} 
                      onChange={e => setContactMessage(e.target.value)} 
                      rows="4" 
                      placeholder="Je suis intéressé par ce bien..."
                      className="w-full p-4 mb-4 bg-bg-card border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main resize-none"
                    />
                    <div className="flex flex-col gap-2">
                        <button 
                          onClick={sendContactMessage} 
                          disabled={sendingMessage}
                          className="w-full py-3 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
                        >
                          {sendingMessage ? 'Envoi...' : 'Envoyer'}
                        </button>
                       <button onClick={() => setShowContactForm(false)} className="w-full py-3 bg-transparent text-text-muted hover:text-text-main rounded-xl font-bold transition-colors">
                         Annuler
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default PropertyDetail;