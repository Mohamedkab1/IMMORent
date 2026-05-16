import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { paymentService } from '../services/payments';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [property, setProperty] = useState(null);
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showTransferConfirm, setShowTransferConfirm] = useState(false);
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState(false);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    entryDate: formatDateForInput(location.state?.request?.start_date || location.state?.contract?.start_date || location.state?.property?.start_date) || new Date().toISOString().split('T')[0],
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: user?.name || '',
    transferCode: ''
  });

  useEffect(() => {
    // Si la propriété a été passée dans l'état de la navigation, on l'utilise
    if (location.state?.property) {
      setProperty(location.state.property);
      const start_date = location.state.request?.start_date || location.state.contract?.start_date;
      if (start_date) {
        const formattedDate = formatDateForInput(start_date);
        console.log('Setting entryDate to:', formattedDate, 'from raw:', start_date);
        setFormData(prev => ({ ...prev, entryDate: formattedDate }));
      }
    } else {
      // Sinon, on pourrait faire un appel API pour récupérer la propriété par son ID
      // Pour l'instant, on redirige si on n'a pas les données
      toast.error(t('pay.data_missing', "Données de la propriété introuvables. Redirection..."));
      navigate(`/properties/${id}`);
    }
  }, [location, navigate, id, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // La date est toujours en lecture seule (provient du contrat/demande)
    if (name === 'entryDate') return;

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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Si c'est un virement et qu'on n'a pas encore confirmé via le modal
    if (paymentMethod === 'transfer' && !showTransferConfirm) {
      if (!formData.transferCode) {
        toast.error(t('pay.transfer_code_required', "Veuillez saisir le code de transaction."));
        return;
      }
      setShowTransferConfirm(true);
      return;
    }

    // Si on est dans le virement et qu'on a cliqué sur confirmer dans le modal
    if (paymentMethod === 'transfer' && showTransferConfirm && !hasConfirmedCheckbox) {
      toast.error(t('pay.please_verify_checkbox', "Veuillez cocher la case de confirmation."));
      return;
    }

    setLoading(true);

    try {
      // 1. Créer l'intention de paiement
      const intentRes = await paymentService.createIntent({
        propertyId: property.id,
        contractId: location.state?.contract?.id || location.state?.request?.contract?.id || location.state?.request?.contract_id || location.state?.contractId,
        amount: property.price,
        currency: 'MAD',
        method: paymentMethod,
        transferCode: formData.transferCode
      });

      if (intentRes.paymentId) {
        // 2. Confirmer le paiement
        const confirmRes = await paymentService.confirm({
          paymentId: intentRes.paymentId,
          status: 'paid'
        });

        if (confirmRes.success) {
          setSuccess(true);
          setInvoiceUrl(confirmRes.invoiceUrl);
          toast.success(t('pay.success_msg', "Paiement effectué avec succès !"));
        } else {
          // Si c'est un virement avec un code, on simule le succès si le serveur accepte
          if (paymentMethod === 'transfer' && formData.transferCode) {
             setSuccess(true);
             toast.success(t('pay.transfer_code_submitted', "Code de virement soumis."));
          } else {
             toast.error(confirmRes.message || "Erreur lors de la confirmation");
          }
        }
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      const serverMessage = error.response?.data?.message || t('pay.error_msg', "Une erreur est survenue lors du paiement.");
      toast.error(serverMessage);
    } finally {
      setLoading(false);
      setShowTransferConfirm(false);
      setHasConfirmedCheckbox(false);
    }
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
            {paymentMethod === 'agency' 
              ? t('pay.agency_success_desc', 'Votre réservation a été enregistrée. Veuillez passer à l\'agence pour finaliser le paiement et récupérer votre facture.')
              : t('pay.success_desc', 'Votre réservation pour') + ' ' + (t(property.title, property.title)) + ' ' + t('pay.success_desc2', 'a été confirmée. Un email récapitulatif vous a été envoyé.')}
          </p>
          <div className="p-4 bg-bg-soft rounded-xl mb-6 flex justify-between text-sm border border-border-main">
            <span className="font-semibold text-text-sub">{t('pay.amount_paid', 'Montant payé:')}</span>
            <span className="font-black text-text-main">{property.price?.toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')} DH</span>
          </div>

          <div className="flex flex-col gap-3">
            {invoiceUrl && paymentMethod !== 'agency' && (
              <a 
                href={invoiceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                {t('pay.view_invoice', 'Voir votre facture')}
              </a>
            )}
            <button
              onClick={() => navigate('/payments/history')}
              className="w-full py-3 bg-bg-soft text-text-main border border-border-main rounded-xl font-bold hover:bg-bg-card transition-all"
            >
              {t('pay.view_history', 'Voir mon historique')}
            </button>
          </div>
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
                    <input 
                      required 
                      type="date" 
                      name="entryDate" 
                      value={formData.entryDate} 
                      onChange={handleChange} 
                      readOnly
                      className="w-full px-4 py-2 bg-bg-soft border border-border-main rounded-xl focus:outline-none opacity-70 cursor-not-allowed" 
                    />
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
                    <div className="mt-4">
                      <label className="block text-xs font-bold uppercase mb-1">{t('pay.transfer_code', 'Code de transaction (reçu après virement)')}</label>
                      <input 
                        required 
                        type="text" 
                        name="transferCode" 
                        value={formData.transferCode} 
                        onChange={handleChange} 
                        placeholder="Ex: TR-987654321" 
                        className="w-full px-3 py-2 bg-white dark:bg-bg-card border border-blue-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none font-mono" 
                      />
                    </div>
                    <p className="mt-3 text-[10px] opacity-75">{t('pay.transfer_notice', 'Votre réservation sera validée automatiquement après soumission du code.')}</p>
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
                className="w-full py-4 bg-primary !text-white rounded-xl font-bold shadow-lg hover:bg-primary-hover hover:-translate-y-1 active:translate-y-0 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                    <span style={{ color: theme === 'light' ? '#000000' : '' }} className="text-text-sub">{t('pay.base_price', 'Prix')} {property.transaction_type === 'rent' ? t('pay.monthly', 'mensuel') : t('pay.base', 'de base')}</span>
                    <span style={{ color: theme === 'light' ? '#000000' : '' }} className="font-semibold text-text-main">{property.price?.toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')} DH</span>
                  </div>
                  {property.transaction_type === 'rent' && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme === 'light' ? '#000000' : '' }} className="text-text-sub">{t('pay.fee', 'Frais de dossier')}</span>
                      <span style={{ color: theme === 'light' ? '#000000' : '' }} className="font-semibold text-text-main">500 {t('prop.currency')}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-primary/5 rounded-xl flex justify-between items-center">
                  <span style={{ color: theme === 'light' ? '#000000' : '' }} className="font-bold dark:!text-white">{t('pay.total', 'Total à payer')}</span>
                  <span style={{ color: theme === 'light' ? '#000000' : '' }} className="text-xl font-black dark:!text-white">

                    {property.transaction_type === 'rent'
                      ? (property.price + 500).toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')
                      : property.price?.toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')} {t('prop.currency')}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal de confirmation de virement */}
      <AnimatePresence>
        {showTransferConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowTransferConfirm(false);
                setHasConfirmedCheckbox(false);
              }}
              className="absolute inset-0 bg-bg-main/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-bg-card border border-border-main rounded-2xl p-8 shadow-huge text-center overflow-hidden"
            >
              {/* Luxury Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-primary to-blue-500"></div>

              <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-6">
                <BuildingLibraryIcon className="w-10 h-10" />
              </div>
              
              <h3 className="text-xl font-black text-text-main uppercase tracking-widest mb-4">
                {t('pay.transfer_confirm_title', 'Vérification du Paiement')}
              </h3>
              
              <div className="bg-bg-soft rounded-xl p-4 mb-6 border border-border-main">
                <p className="text-sm font-bold text-text-sub leading-relaxed">
                  {t('pay.transfer_confirm_msg', 'Avez-vous réellement effectué le virement bancaire sur le RIB indiqué ?')}
                </p>
                <div className="mt-3 pt-3 border-t border-border-main text-xs space-y-1">
                   <div className="flex justify-between items-center text-text-muted">
                      <span>RIB IMMORent:</span>
                      <strong className="text-text-main">1234 5678 9101 1121 3141 5161</strong>
                   </div>
                   <div className="flex justify-between items-center text-text-muted">
                      <span>{t('pay.transfer_code', 'Code de transaction')}:</span>
                      <strong className="text-primary font-mono">{formData.transferCode}</strong>
                   </div>
                   <div className="flex justify-between items-center text-text-muted">
                      <span>{t('pay.total', 'Montant total')}:</span>
                      <strong className="text-text-main">
                         {property.transaction_type === 'rent'
                            ? (property.price + 500).toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')
                            : property.price?.toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR')} DH
                      </strong>
                   </div>
                </div>
              </div>

              {/* Verification Section */}
              <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-left">
                <div className="flex gap-3 items-start">
                  <div className="mt-1 flex-shrink-0">
                    <input 
                      id="verify-transfer"
                      type="checkbox" 
                      checked={hasConfirmedCheckbox}
                      onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
                      className="w-5 h-5 rounded border-border-main text-primary focus:ring-primary cursor-pointer"
                    />
                  </div>
                  <label htmlFor="verify-transfer" className="text-sm font-bold text-text-main cursor-pointer leading-tight">
                    {t('pay.transfer_checkbox', 'Je confirme avoir effectué le virement bancaire correspondant au montant total.')}
                  </label>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-red-500 font-black uppercase tracking-wider">
                   <ExclamationTriangleIcon className="w-4 h-4" />
                   {t('pay.transfer_warning', 'Toute fausse déclaration entraînera l\'annulation immédiate.')}
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  disabled={!hasConfirmedCheckbox || loading}
                  onClick={() => handleSubmit()} 
                  className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    hasConfirmedCheckbox 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-bg-soft text-text-muted border border-border-main cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <><ArrowPathIcon className="w-4 h-4 animate-spin" /> {t('pay.processing', 'Traitement...')}</>
                  ) : (
                    t('pay.transfer_confirm_btn', 'Oui, je confirme avoir payé')
                  )}
                </button>
                <button 
                  disabled={loading}
                  onClick={() => {
                    setShowTransferConfirm(false);
                    setHasConfirmedCheckbox(false);
                  }} 
                  className="w-full py-3 bg-transparent text-xs font-bold text-text-muted hover:text-text-main transition-all"
                >
                  {t('common.cancel', 'Annuler')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payment;

