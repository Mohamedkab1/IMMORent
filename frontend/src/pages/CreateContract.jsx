import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { requestService } from '../services/requests';
import { contractService } from '../services/contracts';
import { propertyService } from '../services/properties';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  HomeIcon,
  MapPinIcon,
  CheckCircleIcon,
  KeyIcon,
  TagIcon,
  DocumentTextIcon,
  ClockIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

/* ─── Reveal on scroll ─── */
const RevealOnScroll = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ─── Input field ─── */
const FormField = ({ label, icon: Icon, children, hint }) => (
  <div className="space-y-2 group/field">
    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-sub group-focus-within/field:text-primary transition-colors">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-text-muted italic px-1">{hint}</p>}
  </div>
);

const inputCls =
  'w-full px-5 py-3.5 rounded-xl border bg-bg-soft border-border-main text-text-main font-bold text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none';

/* ─── Stat pill ─── */
const StatPill = ({ label, value, color = 'blue' }) => {
  const colors = {
    blue:   'bg-blue-500/10 text-blue-500 border-blue-500/20',
    amber:  'bg-amber-500/10 text-amber-500 border-amber-500/20',
    green:  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rose:   'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };
  return (
    <div className={`flex flex-col items-center justify-center px-5 py-4 rounded-xl border font-black ${colors[color]}`}>
      <span className="text-xl tracking-tighter">{value}</span>
      <span className="text-[9px] uppercase tracking-widest mt-0.5 opacity-70">{label}</span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════ */

const CreateContract = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const { t }     = useLanguage();
  const { theme } = useTheme();

  const [request,         setRequest]         = useState(null);
  const [property,        setProperty]        = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [submitting,      setSubmitting]      = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [daysCount,       setDaysCount]       = useState(0);
  const [monthlyRate,     setMonthlyRate]     = useState(0);
  const [dailyRate,       setDailyRate]       = useState(0);

  const [formData, setFormData] = useState({
    rental_request_id: '',
    contract_type:     '',
    start_date:        '',
    end_date:          '',
    sale_date:         '',
    monthly_rent:      '',
    sale_price:        '',
    security_deposit:  '',
    charges:           ''
  });

  const queryParams = new URLSearchParams(location.search);
  const requestId   = queryParams.get('request');

  /* ── helpers ── */
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDisplayDate = (date) => {
    if (!date) return t('ctr.not_defined', 'Non définie');
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  /* ── load data ── */
  useEffect(() => {
    if (!requestId) {
      toast.error(t('ctr.no_request', 'Aucune demande sélectionnée'));
      navigate('/dashboard/agent');
      return;
    }
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const res = await requestService.getById(requestId);
      if (res.success && res.data) {
        setRequest(res.data);
        const propRes = await propertyService.getById(res.data.property_id);
        if (propRes.success) {
          setProperty(propRes.data);
          const mp = propRes.data.price;
          const dp = mp / 30;
          setMonthlyRate(mp);
          setDailyRate(dp);

          const sd = formatDateForInput(res.data.start_date);
          const ed = formatDateForInput(res.data.end_date);

          if (sd && ed) {
            const diff = Math.ceil(Math.abs(new Date(ed) - new Date(sd)) / 86400000);
            setDaysCount(diff);
            setCalculatedTotal(dp * diff);
          }

          setFormData(prev => ({
            ...prev,
            rental_request_id: res.data.id,
            contract_type:     propRes.data.transaction_type,
            start_date:        sd,
            end_date:          ed,
            monthly_rent:      mp,
            sale_price:        mp,
            security_deposit:  mp,
            sale_date:         formatDateForInput(new Date().toISOString())
          }));
        }
      } else {
        toast.error(t('ctr.request_not_found', 'Demande non trouvée'));
        navigate('/dashboard/agent');
      }
    } catch {
      toast.error(t('ctr.load_error_short', 'Erreur de chargement'));
      navigate('/dashboard/agent');
    } finally {
      setLoading(false);
    }
  };

  /* ── handlers ── */
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const sd = name === 'start_date' ? value : formData.start_date;
    const ed = name === 'end_date'   ? value : formData.end_date;
    if (sd && ed) {
      const diff = Math.ceil(Math.abs(new Date(ed) - new Date(sd)) / 86400000);
      setDaysCount(diff);
      setCalculatedTotal(dailyRate * diff);
    }
  };

  const handleMonthlyRentChange = (e) => {
    const v = parseFloat(e.target.value) || 0;
    setMonthlyRate(v);
    setDailyRate(v / 30);
    setFormData(prev => ({ ...prev, monthly_rent: v }));
    if (formData.start_date && formData.end_date)
      setCalculatedTotal((v / 30) * daysCount);
  };

  const handleChange = (e) => {
    const { name } = e.target;
    if (name === 'monthly_rent')              handleMonthlyRentChange(e);
    else if (name === 'start_date' || name === 'end_date') handleDateChange(e);
    else setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        rental_request_id: parseInt(formData.rental_request_id),
        contract_type:     formData.contract_type,
        start_date:        formData.start_date        || null,
        end_date:          formData.end_date          || null,
        sale_date:         formData.sale_date         || null,
        monthly_rent:      parseFloat(formData.monthly_rent)      || 0,
        sale_price:        parseFloat(formData.sale_price)        || 0,
        security_deposit:  parseFloat(formData.security_deposit)  || 0,
        charges:           parseFloat(formData.charges)           || 0
      };
      const res = await contractService.create(payload);
      if (res.success) {
        toast.success(res.message);
        navigate(`/contracts/${res.data.id}`);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      if (error.response?.data?.errors)
        Object.values(error.response.data.errors).forEach(e => toast.error(e[0]));
      else
        toast.error(error.response?.data?.message || t('ctr.create_error', 'Erreur lors de la création'));
    } finally {
      setSubmitting(false);
    }
  };

  /* ── loading ── */
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-soft gap-4">
      <div className="w-14 h-14 border-4 border-border-main border-t-primary rounded-full animate-spin" />
      <p className="text-text-sub font-bold text-sm uppercase tracking-widest animate-pulse">
        {t('ctr.preparing', 'Préparation du contrat…')}
      </p>
    </div>
  );

  if (!request || !property) return null;

  const isRent           = property.transaction_type === 'rent';
  const contractTypeLabel = isRent
    ? t('ctr.rental_contract', 'Location')
    : t('ctr.sale_contract',   'Vente');

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className={`min-h-screen transition-colors duration-500 pb-24 ${
      theme === 'light' ? 'bg-slate-50' : 'bg-[#050a1f]'
    }`}>

      {/* ─── Hero Banner ─── */}
      <div className="relative h-[280px] md:h-[340px] flex items-end pb-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 transition-colors duration-500 ${
            theme === 'light'
              ? 'bg-gradient-to-r from-blue-600/10 via-white to-white border-b border-slate-100'
              : 'bg-gradient-to-r from-blue-900 via-[#0a1535] to-[#050a1f]'
          }`} />
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-1/3 w-40 h-40 rounded-full bg-yellow-400/5 blur-2xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors group ${
              theme === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-white/30 hover:text-white'
            }`}
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            {t('ctr.back_dashboard', 'Retour au tableau de bord')}
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.25em] mb-4 ${
              isRent
                ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20'
                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}>
              {isRent ? <KeyIcon className="w-3.5 h-3.5" /> : <TagIcon className="w-3.5 h-3.5" />}
              {t('ctr.contract_type_label', 'Contrat de')} {contractTypeLabel}
            </span>

            <h1 className={`text-4xl md:text-5xl font-black tracking-tighter leading-none mb-3 ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              {t('ctr.create_title', 'Générer le')} <span className="text-blue-500">{t('ctr.contract', 'Contrat')}</span>
            </h1>
            <p className={`text-sm font-medium max-w-xl ${
              theme === 'light' ? 'text-slate-500' : 'text-white/50'
            }`}>
              {t('ctr.finalization', 'Finalisation de la transaction pour le bien')} —{' '}
              <span className={theme === 'light' ? 'text-slate-800 font-bold' : 'text-white/80 font-bold'}>
                {property.title}
              </span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 relative z-20">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ══ LEFT: Sidebar ══ */}
          <div className="lg:col-span-1 space-y-6">

            {/* Request summary card */}
            <RevealOnScroll delay={50}>
              <div className={`shadow-2xl border rounded-xl p-8 transition-all duration-500 ${
                theme === 'light' ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10 backdrop-blur-xl'
              }`}>
                <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-8 ${
                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                }`}>
                  {t('ctr.request_details', 'Détails de la demande')}
                </h2>

                {/* Client */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dashed border-border-main/50">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-500/10 border border-blue-500/20'
                  }`}>
                    <UserIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                      theme === 'light' ? 'text-slate-400' : 'text-white/30'
                    }`}>{t('admin.req.client', 'Client')}</p>
                    <p className={`text-sm font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {request.user?.name}
                    </p>
                    <p className={`text-[11px] ${theme === 'light' ? 'text-slate-400' : 'text-white/30'}`}>
                      {request.user?.email}
                    </p>
                  </div>
                </div>

                {/* Property */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dashed border-border-main/50">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    theme === 'light' ? 'bg-amber-50 border border-amber-100' : 'bg-yellow-400/10 border border-yellow-400/20'
                  }`}>
                    <BuildingOfficeIcon className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                      theme === 'light' ? 'text-slate-400' : 'text-white/30'
                    }`}>{t('ctr.real_estate', 'Bien Immobilier')}</p>
                    <p className={`text-sm font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {property.title}
                    </p>
                    <p className={`text-[11px] flex items-center gap-1 ${theme === 'light' ? 'text-slate-400' : 'text-white/30'}`}>
                      <MapPinIcon className="w-3 h-3" /> {property.city}
                    </p>
                  </div>
                </div>

                {/* Period / price */}
                {isRent ? (
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      theme === 'light' ? 'bg-emerald-50 border border-emerald-100' : 'bg-emerald-500/10 border border-emerald-500/20'
                    }`}>
                      <CalendarIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${
                        theme === 'light' ? 'text-slate-400' : 'text-white/30'
                      }`}>{t('ctr.desired_period', 'Période souhaitée')}</p>
                      <p className={`text-xs font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white/80'}`}>
                        {t('ctr.from', 'Du')} {formatDisplayDate(request.start_date)}
                      </p>
                      <p className={`text-xs font-bold ${theme === 'light' ? 'text-slate-800' : 'text-white/80'}`}>
                        {t('ctr.to', 'Au')} {formatDisplayDate(request.end_date)}
                      </p>
                      <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black">
                        <ClockIcon className="w-3 h-3" />
                        {daysCount} {t('ctr.days', 'jours')}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      theme === 'light' ? 'bg-emerald-50 border border-emerald-100' : 'bg-emerald-500/10 border border-emerald-500/20'
                    }`}>
                      <CurrencyDollarIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                        theme === 'light' ? 'text-slate-400' : 'text-white/30'
                      }`}>{t('ctr.sale_conditions', 'Prix de vente')}</p>
                      <p className={`text-xl font-black tracking-tighter ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                        {property.price.toLocaleString()} <span className="text-xs font-bold text-text-muted">DH</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </RevealOnScroll>

            {/* Financial estimate (rent only) */}
            {isRent && (
              <RevealOnScroll delay={150}>
                <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <SparklesIcon className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.25em] mb-6 text-blue-200">
                    {t('ctr.financial_estimate', 'Estimation financière')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">{t('ctr.rent_per_month', 'Loyer / mois')}</span>
                      <span className="text-sm font-bold">{monthlyRate.toLocaleString()} DH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">{t('ctr.daily_rate', 'Taux journalier')}</span>
                      <span className="text-sm font-bold">{Math.round(dailyRate).toLocaleString()} DH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">{t('ctr.duration', 'Durée')}</span>
                      <span className="text-sm font-bold">{daysCount} {t('ctr.days', 'jours')}</span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                        {t('ctr.estimated_total', 'Total estimé')}
                      </span>
                      <span className="text-2xl font-black text-amber-300 tracking-tighter">
                        {Math.round(calculatedTotal).toLocaleString()} DH
                      </span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            )}

            {/* Legal notice */}
            <RevealOnScroll delay={200}>
              <div className={`flex items-start gap-3 p-5 rounded-xl border text-[10px] leading-relaxed ${
                theme === 'light'
                  ? 'bg-white border-slate-100 text-slate-500'
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}>
                <ShieldCheckIcon className="w-5 h-5 shrink-0 text-blue-500 mt-0.5" />
                <p>{t('ctr.validation_info', 'En générant ce contrat, vous confirmez que les informations ont été vérifiées et acceptées par toutes les parties. Le statut du bien sera automatiquement mis à jour.')}</p>
              </div>
            </RevealOnScroll>
          </div>

          {/* ══ RIGHT: Form ══ */}
          <div className="lg:col-span-2">
            <RevealOnScroll delay={100}>
              <div className={`shadow-2xl border rounded-xl p-10 md:p-14 transition-all duration-500 ${
                theme === 'light' ? 'bg-white border-slate-100' : 'bg-white/5 border-white/10 backdrop-blur-xl'
              }`}>

                {/* Form header */}
                <div className="flex items-center gap-5 mb-12 pb-8 border-b border-dashed border-border-main/50">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center border shrink-0 ${
                    isRent
                      ? 'bg-blue-500/10 border-blue-500/20'
                      : 'bg-amber-500/10 border-amber-500/20'
                  }`}>
                    {isRent
                      ? <KeyIcon className="w-7 h-7 text-blue-500" />
                      : <TagIcon className="w-7 h-7 text-amber-500" />}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-black tracking-tighter ${
                      theme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}>
                      {t('ctr.config', 'Configuration du contrat')}
                    </h2>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${
                      theme === 'light' ? 'text-slate-400' : 'text-white/30'
                    }`}>
                      {t('ctr.fill_fields', 'Remplissez les informations ci-dessous')}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* ── RENT fields ── */}
                  {isRent ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          label={t('ctr.start_date', 'Date de début')}
                          icon={CalendarIcon}
                          hint={`${t('ctr.client_wish', 'Souhait client')}: ${formatDisplayDate(request.start_date)}`}
                        >
                          <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            required
                            className={inputCls}
                          />
                        </FormField>

                        <FormField
                          label={t('ctr.end_date', 'Date de fin')}
                          icon={CalendarIcon}
                          hint={`${t('ctr.client_wish', 'Souhait client')}: ${formatDisplayDate(request.end_date)}`}
                        >
                          <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            required
                            min={formData.start_date}
                            className={inputCls}
                          />
                        </FormField>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          label={t('ctr.monthly_rent_dh', 'Loyer mensuel (DH)')}
                          icon={CurrencyDollarIcon}
                        >
                          <input
                            type="number"
                            name="monthly_rent"
                            value={formData.monthly_rent}
                            onChange={handleChange}
                            required
                            className={inputCls}
                          />
                        </FormField>

                        <FormField
                          label={t('ctr.deposit_dh', 'Caution / Dépôt (DH)')}
                          icon={CurrencyDollarIcon}
                        >
                          <input
                            type="number"
                            name="security_deposit"
                            value={formData.security_deposit}
                            onChange={handleChange}
                            required
                            className={inputCls}
                          />
                        </FormField>
                      </div>
                    </>
                  ) : (
                    /* ── SALE fields ── */
                    <>
                      <FormField
                        label={t('ctr.effective_sale_date', 'Date effective de la vente')}
                        icon={CalendarIcon}
                      >
                        <input
                          type="date"
                          name="sale_date"
                          value={formData.sale_date}
                          onChange={handleChange}
                          required
                          className={inputCls}
                        />
                      </FormField>

                      <FormField
                        label={t('ctr.final_sale_price', 'Prix de vente final (DH)')}
                        icon={CurrencyDollarIcon}
                      >
                        <input
                          type="number"
                          name="sale_price"
                          value={formData.sale_price}
                          onChange={handleChange}
                          required
                          className={inputCls}
                        />
                      </FormField>
                    </>
                  )}

                  {/* Charges (common) */}
                  <FormField
                    label={t('ctr.extra_charges', 'Frais annexes / Charges (DH)')}
                    icon={CurrencyDollarIcon}
                  >
                    <input
                      type="number"
                      name="charges"
                      value={formData.charges}
                      onChange={handleChange}
                      placeholder="0"
                      className={inputCls}
                    />
                  </FormField>

                  {/* Divider */}
                  <div className="border-t border-dashed border-border-main/50 pt-4" />

                  {/* Action buttons */}
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className={`flex-1 py-5 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] border ${
                          theme === 'light'
                            ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                      >
                        {t('common.cancel', 'Annuler')}
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-[2] py-5 px-6 bg-blue-600 !text-white rounded-xl text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('admin.settings.saving', 'Enregistrement…')}
                          </>
                        ) : (
                          <>
                            <DocumentTextIcon className="w-4 h-4" />
                            {t('ctr.generate', 'Générer le contrat de')} {contractTypeLabel}
                          </>
                        )}
                      </button>
                    </motion.div>
                  </AnimatePresence>
                </form>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContract;