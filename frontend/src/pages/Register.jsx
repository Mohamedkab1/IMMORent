import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HomeIcon, BuildingOfficeIcon, UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, LockClosedIcon, ArrowRightIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
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

const Register = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    role: 'client'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('client');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role: role });
  };

  const validateStep1 = () => {
    if (!selectedRole) {
      toast.error(t('auth.register.error_role'));
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name.trim()) {
      toast.error(t('auth.register.error_name'));
      return false;
    }
    if (!formData.email.trim()) {
      toast.error(t('auth.register.error_email'));
      return false;
    }
    if (!formData.password) {
      toast.error(t('auth.register.error_password'));
      return false;
    }
    if (formData.password.length < 8) {
      toast.error(t('auth.register.error_password_length'));
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      toast.error(t('auth.register.error_password_match'));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const response = await register(formData);
      toast.success(response.message || t('auth.register.success'));
      
      if (formData.role === 'agent') {
        toast.info(t('auth.register.agent_pending'));
        navigate('/login');
      } else {
        navigate('/dashboard/client');
      }
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        Object.values(validationErrors).forEach(errArray => {
          errArray.forEach(msg => toast.error(msg));
        });
      } else {
        toast.error(error.response?.data?.message || t('auth.register.error_general'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl -z-10 animate-float-delayed"></div>

      <RevealOnScroll delay={100} className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-black text-text-main tracking-tight">
            IMMO<span className="text-secondary">Rent</span>
          </Link>
          <h1 className="mt-6 text-4xl font-extrabold text-text-main tracking-tight">{t('auth.register.title')}</h1>
          <p className="mt-2 text-text-sub font-medium">{t('auth.register.subtitle')}</p>
        </div>

        {/* Unified Progress Indicator */}
        <div className="max-w-xs mx-auto mb-12">
            <div className="flex items-center justify-between relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 z-10 ${currentStep >= 1 ? 'bg-primary !text-white shadow-lg shadow-primary/20' : 'bg-bg-soft text-text-muted'}`}>1</div>
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${currentStep === 2 ? 'bg-primary' : 'bg-bg-soft'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 z-10 ${currentStep === 2 ? 'bg-primary !text-white shadow-lg shadow-primary/20' : 'bg-bg-soft text-text-muted'}`}>2</div>
                
                <div className="absolute top-12 left-0 right-0 flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted px-2">
                    <span className={currentStep >= 1 ? 'text-primary transition-colors duration-500' : 'transition-colors duration-500'}>{t('auth.register.step1_badge')}</span>
                    <span className={currentStep === 2 ? 'text-primary transition-colors duration-500' : 'transition-colors duration-500'}>{t('auth.register.step2_badge')}</span>
                </div>
            </div>
        </div>

        <div className="bg-bg-card rounded-3xl shadow-huge border border-border-main p-8 md:p-12 backdrop-blur-xl transition-all duration-500">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 ? (
              <div className="animate-fade-in">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold text-text-main">{t('auth.register.step1_title')}</h3>
                  <p className="text-text-sub mt-1">{t('auth.register.step1_subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Card */}
                  <RevealOnScroll delay={100} className="h-full">
                    <div 
                      onClick={() => handleRoleSelect('client')}
                      className={`relative group h-full cursor-pointer p-8 rounded-2xl border-2 transition-all duration-500 hover:-translate-y-1 ${selectedRole === 'client' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-border-main hover:border-primary/30 bg-bg-soft/50'}`}
                    >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedRole === 'client' ? 'bg-primary !text-white' : 'bg-bg-soft text-primary'}`}>
                      <HomeIcon className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-text-main mb-2">{t('auth.register.role_client_title')}</h4>
                    <p className="text-sm text-text-sub leading-relaxed mb-6">{t('auth.register.role_client_desc')}</p>
                    <ul className="space-y-3">
                      {[t('auth.register.role_client_f1'), t('auth.register.role_client_f2'), t('auth.register.role_client_f3')].map((f, i) => (
                        <li key={i} className="flex items-center text-xs font-bold text-text-main/80 uppercase tracking-tight">
                            <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    {selectedRole === 'client' && <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center animate-scale-in">✓</div>}
                    </div>
                  </RevealOnScroll>

                  {/* Agent Card */}
                  <RevealOnScroll delay={200} className="h-full">
                    <div 
                      onClick={() => handleRoleSelect('agent')}
                      className={`relative group h-full cursor-pointer p-8 rounded-2xl border-2 transition-all duration-500 hover:-translate-y-1 ${selectedRole === 'agent' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-border-main hover:border-primary/30 bg-bg-soft/50'}`}
                    >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedRole === 'agent' ? 'bg-primary !text-white' : 'bg-bg-soft text-primary'}`}>
                      <BuildingOfficeIcon className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-text-main mb-2">{t('auth.register.role_agent_title')}</h4>
                    <p className="text-sm text-text-sub leading-relaxed mb-6">{t('auth.register.role_agent_desc')}</p>
                    <ul className="space-y-3">
                      {[t('auth.register.role_agent_f1'), t('auth.register.role_agent_f2'), t('auth.register.role_agent_f3')].map((f, i) => (
                        <li key={i} className="flex items-center text-xs font-bold text-text-main/80 uppercase tracking-tight">
                            <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black rounded-lg uppercase tracking-widest">{t('auth.register.agent_validation')}</div>
                    {selectedRole === 'agent' && <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center animate-scale-in">✓</div>}
                    </div>
                  </RevealOnScroll>
                </div>

                <div className="mt-12 flex justify-center">
                  <button 
                    type="button" 
                    onClick={handleNext}
                    className="px-10 py-4 bg-primary !text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-light hover:-translate-y-1 transition-all flex items-center gap-3"
                  >
                    {t('auth.register.next_btn')}
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold text-text-main">{t('auth.register.step2_title')}</h3>
                  <p className="text-text-sub mt-1">{t('auth.register.step2_subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">{t('auth.register.name_label')}</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t('auth.register.name_placeholder')}
                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">{t('auth.register.email_label')}</label>
                    <div className="relative">
                        <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t('auth.register.email_placeholder')}
                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">{t('auth.register.phone_label')}</label>
                    <div className="relative">
                        <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="06 12 34 56 78"
                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">{t('auth.register.address_label')}</label>
                    <div className="relative">
                        <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder={t('auth.register.address_placeholder')}
                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">{t('auth.register.password_label')}</label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main">
                            {showPassword ? t('auth.password.hide') : t('auth.password.show')}
                        </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub group-focus-within:text-primary transition-colors">{t('auth.register.password_confirm_label')}</label>
                    <div className="relative group">
                        <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50 outline-none transition-all"
                            required
                        />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    type="button" 
                    onClick={handleBack}
                    className="flex-1 py-4 px-6 bg-bg-soft border border-border-main text-text-main rounded-xl font-bold hover:bg-bg-card hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeftIcon className="w-5 h-5" /> {t('auth.register.back_btn')}
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] py-4 px-6 bg-primary !text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-light hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : t('auth.register.submit_btn')}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="mt-12 text-center">
            <p className="text-text-sub font-medium">
              {t('auth.register.has_account')}{' '}
              <Link to="/login" className="text-primary font-extrabold hover:underline transition-colors">{t('auth.register.login_link')}</Link>
            </p>
        </div>
      </RevealOnScroll>
    </div>
  );
};

export default Register;