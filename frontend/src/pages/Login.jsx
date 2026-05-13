import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useLanguage } from '../context/LanguageContext';

const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
  const [isVisible, React_useState] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          React_useState(true);
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

const Login = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await login(formData.email, formData.password);
      toast.success(response.message || t('auth.login.success'));
      
      const user = response.data.user;
      if (user.role?.slug === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role?.slug === 'agent') {
        navigate('/dashboard/agent');
      } else {
        navigate('/dashboard/client');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@immorent.ma', password: 'password', role: 'Admin' },
    { email: 'yassine@agent.ma', password: 'password', role: 'Agent' },
    { email: 'mehdi@client.ma', password: 'password', role: 'Client' }
  ];

  const fillDemoAccount = (email, password) => {
    setFormData({ ...formData, email, password });
  };

  return (
    <div className="min-h-screen flex items-stretch bg-bg-main overflow-hidden">
      {/* Left Side: Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 to-primary-light/80 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80" 
          alt="Luxury Interior" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
        />
        
        <div className="relative z-20 flex flex-col justify-center px-20">
          <RevealOnScroll delay={100}>
            <Link to="/" className="text-3xl font-black text-white mb-12 tracking-tight block">
              IMMO<span className="text-secondary">Rent</span>
            </Link>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <h2 className="text-5xl font-black !text-white mb-6 leading-tight tracking-tight">
              {t('auth.hero.title_1')} <br />{t('auth.hero.title_2')} <br />{t('auth.hero.title_3')}
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <p className="text-xl !text-white/80 max-w-md leading-relaxed mb-12">
              {t('auth.hero.subtitle')}
            </p>
          </RevealOnScroll>
          
          <RevealOnScroll delay={400}>
            <ul className="space-y-4">
              {[
                t('auth.hero.feature_1'),
                t('auth.hero.feature_2'),
                t('auth.hero.feature_3'),
                t('auth.hero.feature_4')
              ].map((item, i) => (
                <li key={i} className="flex items-center !text-white/90 font-medium">
                  <span className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mr-4 text-secondary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center z-20">
          <p className="text-white/40 text-sm font-medium">© 2026 IMMORent Platform</p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"></div>
            <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"></div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-bg-main relative overflow-hidden">
        {/* Animated background blob */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10 animate-float"></div>
        
        <RevealOnScroll delay={100} className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-text-main mb-3 tracking-tight">{t('auth.login.title')}</h1>
            <p className="text-text-sub font-medium">{t('auth.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-sm font-bold text-text-sub group-focus-within:text-primary transition-colors" htmlFor="email">{t('auth.login.email_label')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.login.email_placeholder')}
                required
                className="w-full px-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted hover:border-primary/50"
                disabled={loading}
              />
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-text-sub group-focus-within:text-primary transition-colors" htmlFor="password">{t('auth.login.password_label')}</label>
                <Link to="/forgot-password" title={t('auth.login.forgot_password')} className="text-sm font-bold text-primary hover:text-primary-light transition-colors">{t('auth.login.forgot')}</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted hover:border-primary/50"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-border-main rounded bg-bg-soft transition-all cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm font-medium text-text-sub cursor-pointer select-none">
                {t('auth.login.remember')}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary !text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-light hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('auth.login.submitting')}
                </>
              ) : (
                t('auth.login.submit')
              )}
            </button>
          </form>

          {/* Demo Accounts - Quick Login */}
          <div className="mt-12">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest text-center mb-6">{t('auth.login.demo_title')}</p>
            <div className="grid grid-cols-3 gap-3">
              {demoAccounts.map((acc, i) => (
                <button
                  key={i}
                  onClick={() => fillDemoAccount(acc.email, acc.password)}
                  className="py-2 px-1 text-[10px] font-bold border border-border-main rounded-lg text-text-sub hover:bg-bg-soft hover:text-primary transition-all truncate"
                  title={`${acc.role}: ${acc.email}`}
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-text-sub font-medium">
              {t('auth.login.no_account')}{' '}
              <Link to="/register" className="text-primary font-bold hover:underline transition-colors">{t('auth.login.register_link')}</Link>
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
};

export default Login;