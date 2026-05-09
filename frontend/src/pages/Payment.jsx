import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';
import { 
  CreditCardIcon, 
  BanknotesIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [property, setProperty] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    entryDate: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  useEffect(() => {
    // Si la propriété a été passée dans l'état de la navigation, on l'utilise
    if (location.state?.property) {
      setProperty(location.state.property);
    } else {
      // Sinon, on pourrait faire un appel API pour récupérer la propriété par son ID
      // Pour l'instant, on redirige si on n'a pas les données
      toast.error(t('pay.data_missing', "Données de la propriété introuvables. Redirection..."));
      navigate(`/properties/${id}`);
    }
  }, [location, navigate, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Formatage simple pour la carte bancaire
    if (name === 'cardNumber') {
      const formatted = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted.substring(0, 19) }));
      return;
    }

    if (name === 'expiryDate') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length >= 2) {
        formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === 'cvv') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '').substring(0, 4) }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulation d'un appel d'API de paiement (ex: Stripe)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      toast.success(t('pay.success_msg', "Réservation confirmée avec succès !"));
      
      // Redirection après un petit délai
      setTimeout(() => {
        navigate('/dashboard'); // ou une autre page appropriée
      }, 3000);
    }, 2000);
  };

  if (!property) return null;

  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';
  const propertyImage = property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : defaultImage;

  if (success) {
    return (
      <div className="min-h-screen bg-bg-soft flex items-center justify-center p-4">
        <div className="bg-bg-card max-w-md w-full rounded-2xl shadow-huge p-8 text-center animate-fade-in border border-border-main">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-14 h-14 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-text-main mb-2">{t('pay.success_title', 'Paiement Réussi !')}</h2>
          <p className="text-text-sub mb-8">
            {t('pay.success_desc', 'Votre réservation pour')} <strong>{t(property.title, property.title)}</strong> {t('pay.success_desc2', 'a été confirmée. Un email récapitulatif vous a été envoyé.')}
          </p>
          <div className="p-4 bg-bg-soft rounded-xl mb-6 flex justify-between text-sm">

             <span className="font-semibold text-text-sub">{t('pay.amount_paid', 'Montant payé:')}</span>
             <span className="font-black text-text-main">{property.price?.toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')} DH</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-hover transition-colors"
          >
            {t('pay.goto_dashboard', 'Aller au tableau de bord')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-soft py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-text-main">
            {t('pay.finalize', 'Finaliser la réservation')}
          </h1>
          <p className="text-text-sub mt-2">
            {t('pay.fill_info', 'Veuillez remplir vos informations et procéder au paiement.')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Formulaire de gauche */}
          <div className="flex-1 space-y-6">

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="bg-bg-card rounded-2xl p-6 border border-border-main shadow-sm">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
                  {t('pay.your_info', 'Vos informations')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-sub mb-1">{t('common.first_name', 'Prénom')}</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 bg-bg-soft border border-border-main rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-sub mb-1">{t('common.last_name', 'Nom')}</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 bg-bg-soft border border-border-main rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-sub mb-1">{t('common.email', 'Email')}</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-bg-soft border border-border-main rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-sub mb-1">{t('common.phone', 'Téléphone')}</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-bg-soft border border-border-main rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-sub mb-1">{t('pay.entry_date', 'Date d\'entrée souhaitée')}</label>
                    <input required type="date" name="entryDate" value={formData.entryDate} onChange={handleChange} className="w-full px-4 py-2 bg-bg-soft border border-border-main rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="bg-bg-card rounded-2xl p-6 border border-border-main shadow-sm">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
                  {t('pay.payment_method', 'Mode de paiement')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-border-main text-text-sub hover:bg-bg-soft'}`}>
                    <CreditCardIcon className="w-6 h-6" />
                    <span className="text-sm font-bold">{t('pay.card', 'Carte Bancaire')}</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('transfer')} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'transfer' ? 'border-primary bg-primary/5 text-primary' : 'border-border-main text-text-sub hover:bg-bg-soft'}`}>
                    <BuildingLibraryIcon className="w-6 h-6" />
                    <span className="text-sm font-bold">{t('pay.transfer', 'Virement')}</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('agency')} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'agency' ? 'border-primary bg-primary/5 text-primary' : 'border-border-main text-text-sub hover:bg-bg-soft'}`}>
                    <BanknotesIcon className="w-6 h-6" />
                    <span className="text-sm font-bold">{t('pay.agency', 'En agence')}</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-sm font-semibold text-text-sub mb-1">{t('pay.card_name', 'Nom sur la carte')}</label>
                      <input required type="text" name="cardName" value={formData.cardName} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-2 bg-bg-soft border border-border-main rounded-xl focus:ring-2 focus:ring-primary focus:outline-none font-mono" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-sub mb-1">{t('pay.card_number', 'Numéro de carte')}</label>
                      <div className="relative">
                        <CreditCardIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input required type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-2 bg-bg-soft border border-border-main rounded-xl focus:ring-2 focus:ring-primary focus:outline-none font-mono tracking-widest" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-text-sub mb-1">{t('pay.expiry', 'Expiration (MM/YY)')}</label>
                        <input required type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="MM/YY" className="w-full px-4 py-2 bg-bg-soft border border-border-main rounded-xl focus:ring-2 focus:ring-primary focus:outline-none font-mono" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-text-sub mb-1">CVV</label>
                        <input required type="text" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" className="w-full px-4 py-2 bg-bg-soft border border-border-main rounded-xl focus:ring-2 focus:ring-primary focus:outline-none font-mono" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'transfer' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl text-blue-800 dark:text-blue-300 text-sm animate-fade-in">
                    <p className="font-bold mb-2">{t('pay.transfer_inst', 'Instructions de virement :')}</p>
                    <p>{t('pay.transfer_desc', 'Veuillez transférer le montant sur le RIB suivant :')} <strong>1234 5678 9101 1121 3141 5161</strong>.</p>
                    <p className="mt-1">{t('pay.transfer_notice', 'Votre réservation sera validée à la réception des fonds.')}</p>
                  </div>
                )}

                {paymentMethod === 'agency' && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded-xl text-orange-800 dark:text-orange-300 text-sm animate-fade-in">
                    <p className="font-bold mb-2">{t('pay.agency_inst', 'Paiement en agence :')}</p>
                    <p>{t('pay.agency_desc', 'Vous disposez de 48h pour vous présenter à notre agence et finaliser le paiement.')}</p>
                    <p className="mt-1">{t('pay.agency_address', 'Adresse : 123 Boulevard de la Résistance, Casablanca.')}</p>
                  </div>
                )}

              </div>

              <div className="flex items-center gap-2 text-xs text-text-muted mt-4">
                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                {t('pay.secure', 'Paiement 100% sécurisé et crypté')}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-hover hover:-translate-y-1 active:translate-y-0 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><ArrowPathIcon className="w-5 h-5 animate-spin" /> {t('pay.processing', 'Traitement en cours...')}</>
                ) : (
                  `${t('pay.confirm', 'Confirmer la réservation')} - ${property.price?.toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')} DH`
                )}
              </button>
            </form>
          </div>

          {/* Résumé de droite */}
          <div className="w-full lg:w-1/3">
            <div className="bg-bg-card rounded-2xl border border-border-main shadow-main overflow-hidden sticky top-24">
              <div className="h-48 overflow-hidden relative">
                <img src={propertyImage} alt={property.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-lg shadow-sm">
                  {property.transaction_type === 'sale' ? t('common.buy', 'Vente') : t('common.rent', 'Location')}
                </div>
              </div>
              <div className="p-5">

                <h4 className="text-lg font-bold text-text-main mb-1 line-clamp-2">{t(property.title, property.title)}</h4>
                <p className="text-sm text-text-muted mb-4">{t(property.city, property.city)}</p>
                
                <div className="h-px bg-border-main mb-4"></div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-sub">{t('pay.base_price', 'Prix')} {property.transaction_type === 'rent' ? t('pay.monthly', 'mensuel') : t('pay.base', 'de base')}</span>
                    <span className="font-semibold text-text-main">{property.price?.toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')} DH</span>
                  </div>
                  {property.transaction_type === 'rent' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-sub">{t('pay.fee', 'Frais de dossier')}</span>
                      <span className="font-semibold text-text-main">500 DH</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-primary/5 rounded-xl flex justify-between items-center">
                  <span className="font-bold text-primary dark:text-white">{t('pay.total', 'Total à payer')}</span>
                  <span className="text-xl font-black text-primary dark:text-white">

                    {property.transaction_type === 'rent' 
                      ? (property.price + 500).toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')
                      : property.price?.toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')} DH
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;
