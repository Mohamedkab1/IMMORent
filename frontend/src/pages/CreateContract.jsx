import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { propertyService } from '../services/properties';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  CurrencyEuroIcon, 
  UserIcon, 
  HomeIcon, 
  MapPinIcon, 
  CheckCircleIcon, 
  KeyIcon, 
  TagIcon,
  DocumentTextIcon,
  ClockIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const CreateContract = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [daysCount, setDaysCount] = useState(0);
  const [monthlyRate, setMonthlyRate] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  
  const [formData, setFormData] = useState({
    rental_request_id: '',
    contract_type: '',
    start_date: '',
    end_date: '',
    sale_date: '',
    monthly_rent: '',
    sale_price: '',
    security_deposit: '',
    charges: ''
  });

  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get('request');

  useEffect(() => {
    if (!requestId) {
      toast.error('Aucune demande sélectionnée');
      navigate('/dashboard/agent');
      return;
    }
    fetchRequest();
  }, [requestId]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchRequest = async () => {
    try {
      const res = await requestService.getById(requestId);
      if (res.success && res.data) {
        setRequest(res.data);
        const propertyRes = await propertyService.getById(res.data.property_id);
        if (propertyRes.success) {
          setProperty(propertyRes.data);
          
          const monthlyPrice = propertyRes.data.price;
          setMonthlyRate(monthlyPrice);
          const dailyPrice = monthlyPrice / 30;
          setDailyRate(dailyPrice);
          
          const startDate = formatDateForInput(res.data.start_date);
          const endDate = formatDateForInput(res.data.end_date);
          
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysCount(diffDays);
            const total = dailyPrice * diffDays;
            setCalculatedTotal(total);
          }
          
          setFormData(prev => ({
            ...prev,
            rental_request_id: res.data.id,
            contract_type: propertyRes.data.transaction_type,
            start_date: startDate,
            end_date: endDate,
            monthly_rent: propertyRes.data.price,
            sale_price: propertyRes.data.price,
            security_deposit: propertyRes.data.price,
            sale_date: formatDateForInput(new Date().toISOString())
          }));
        }
      } else {
        toast.error('Demande non trouvée');
        navigate('/dashboard/agent');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de chargement');
      navigate('/dashboard/agent');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'start_date' || name === 'end_date') {
      const startDate = name === 'start_date' ? value : formData.start_date;
      const endDate = name === 'end_date' ? value : formData.end_date;
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysCount(diffDays);
        const total = dailyRate * diffDays;
        setCalculatedTotal(total);
      }
    }
  };

  const handleMonthlyRentChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setMonthlyRate(value);
    setDailyRate(value / 30);
    setFormData(prev => ({ ...prev, monthly_rent: value }));
    
    if (formData.start_date && formData.end_date) {
      const total = (value / 30) * daysCount;
      setCalculatedTotal(total);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'monthly_rent') {
      handleMonthlyRentChange(e);
    } else if (name === 'start_date' || name === 'end_date') {
      handleDateChange(e);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submitData = {
        rental_request_id: parseInt(formData.rental_request_id),
        contract_type: formData.contract_type,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        sale_date: formData.sale_date || null,
        monthly_rent: parseFloat(formData.monthly_rent) || 0,
        sale_price: parseFloat(formData.sale_price) || 0,
        security_deposit: parseFloat(formData.security_deposit) || 0,
        charges: parseFloat(formData.charges) || 0
      };
      
      const res = await contractService.create(submitData);
      if (res.success) {
        toast.success(res.message);
        navigate(`/contracts/${res.data.id}`);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error('Erreur création contrat:', error);
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach(err => {
          toast.error(err[0]);
        });
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la création');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-soft">
      <div className="w-12 h-12 border-4 border-border-main border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-text-sub font-medium">Préparation du contrat...</p>
    </div>
  );

  if (!request || !property) return null;

  const isRent = property.transaction_type === 'rent';
  const contractTypeLabel = isRent ? 'Location' : 'Vente';
  
  const formatDisplayDate = (date) => {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-text-sub hover:text-secondary transition-colors mb-6 font-medium group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour au tableau de bord
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
            Créer un <span className="text-secondary">contrat de {contractTypeLabel}</span>
          </h1>
          <p className="text-text-sub mt-2">Finalisation de la transaction pour le bien "{property.title}"</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-bg-card rounded-3xl p-6 shadow-main border border-border-main">
              <h2 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6 pb-4 border-b border-border-main">
                <InformationCircleIcon className="w-5 h-5 text-secondary" /> Détails de la demande
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Client</span>
                    <p className="text-sm font-bold text-text-main">{request.user?.name}</p>
                    <p className="text-xs text-text-sub">{request.user?.email}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <HomeIcon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Bien Immobilier</span>
                    <p className="text-sm font-bold text-text-main">{property.title}</p>
                    <p className="text-xs text-text-sub flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3" /> {property.city}
                    </p>
                  </div>
                </div>

                {isRent ? (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Période souhaitée</span>
                      <p className="text-xs font-bold text-text-main mt-1">
                        Du {formatDisplayDate(request.start_date)}
                      </p>
                      <p className="text-xs font-bold text-text-main">
                        Au {formatDisplayDate(request.end_date)}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-1 font-bold">
                        <ClockIcon className="w-3 h-3" /> Durée: {daysCount} jours
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <CurrencyEuroIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Conditions de vente</span>
                      <p className="text-sm font-bold text-text-main">{property.price.toLocaleString()} DH</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {isRent && (
              <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4" /> Estimation financière
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-sub">Loyer/mois</span>
                    <span className="text-text-main font-bold">{monthlyRate.toLocaleString()} DH</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-sub">Base journalière</span>
                    <span className="text-text-main font-bold">{Math.round(dailyRate).toLocaleString()} DH</span>
                  </div>
                  <div className="pt-3 border-t border-primary/10 flex justify-between items-center">
                    <span className="text-sm font-bold text-text-main">Total estimé</span>
                    <span className="text-xl font-black text-primary">{Math.round(calculatedTotal).toLocaleString()} DH</span>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Form Area */}
          <main className="lg:col-span-2">
            <div className="bg-bg-card rounded-3xl p-8 shadow-large border border-border-main">
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-xl bg-secondary/20`}>
                  {isRent ? <KeyIcon className="w-6 h-6 text-secondary" /> : <TagIcon className="w-6 h-6 text-secondary" />}
                </div>
                <h2 className="text-xl font-bold text-text-main uppercase tracking-tight">Configuration du contrat</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {isRent ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-main flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-secondary" /> Date de début
                        </label>
                        <input 
                          type="date" name="start_date" 
                          value={formData.start_date} onChange={handleChange} required 
                          className="w-full bg-bg-soft border-border-main rounded-2xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm text-text-main"
                        />
                        <p className="text-[10px] text-text-muted italic px-1">Souhait client: {formatDisplayDate(request.start_date)}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-main flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-secondary" /> Date de fin
                        </label>
                        <input 
                          type="date" name="end_date" 
                          value={formData.end_date} onChange={handleChange} required 
                          min={formData.start_date}
                          className="w-full bg-bg-soft border-border-main rounded-2xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm text-text-main"
                        />
                        <p className="text-[10px] text-text-muted italic px-1">Souhait client: {formatDisplayDate(request.end_date)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-main flex items-center gap-2">
                          <CurrencyEuroIcon className="w-4 h-4 text-secondary" /> Loyer mensuel (DH)
                        </label>
                        <input 
                          type="number" name="monthly_rent" 
                          value={formData.monthly_rent} onChange={handleChange} required 
                          className="w-full bg-bg-soft border-border-main rounded-2xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-bold text-text-main"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-main flex items-center gap-2">
                          <CurrencyEuroIcon className="w-4 h-4 text-secondary" /> Caution / Dépôt (DH)
                        </label>
                        <input 
                          type="number" name="security_deposit" 
                          value={formData.security_deposit} onChange={handleChange} required 
                          className="w-full bg-bg-soft border-border-main rounded-2xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-bold text-text-main"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-main flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-secondary" /> Date effective de la vente
                      </label>
                      <input 
                        type="date" name="sale_date" 
                        value={formData.sale_date} onChange={handleChange} required 
                        className="w-full bg-bg-soft border-border-main rounded-2xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm text-text-main"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-main flex items-center gap-2">
                        <CurrencyEuroIcon className="w-4 h-4 text-secondary" /> Prix de vente final (DH)
                      </label>
                      <input 
                        type="number" name="sale_price" 
                        value={formData.sale_price} onChange={handleChange} required 
                        className="w-full bg-bg-soft border-border-main rounded-2xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-bold text-text-main"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-main flex items-center gap-2">
                    <CurrencyEuroIcon className="w-4 h-4 text-secondary" /> Frais annexes / Charges (DH)
                  </label>
                  <input 
                    type="number" name="charges" 
                    value={formData.charges} onChange={handleChange} 
                    placeholder="0"
                    className="w-full bg-bg-soft border-border-main rounded-2xl p-3 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm text-text-main"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <button 
                    type="button" 
                    onClick={() => navigate(-1)} 
                    className="flex-1 px-8 py-4 bg-bg-soft text-text-main rounded-2xl font-bold hover:bg-border-main transition-colors border border-border-main"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-[2] px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-main disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Enregistrement...
                      </span>
                    ) : `Générer le contrat de ${contractTypeLabel}`}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8 flex items-start gap-3 p-4 bg-bg-card rounded-2xl border border-border-main text-[10px] text-text-muted leading-relaxed">
              <InformationCircleIcon className="w-5 h-5 flex-shrink-0 text-secondary" />
              <p>En générant ce contrat, vous confirmez que les informations ci-dessus ont été vérifiées and acceptées par toutes les parties. Le statut du bien sera automatiquement mis à jour en "{isRent ? 'Loué' : 'Vendu'}". Les documents PDF seront disponibles immédiatement après validation.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateContract;