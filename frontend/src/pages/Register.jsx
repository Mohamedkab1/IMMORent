import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedRole = queryParams.get('role') || 'client';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    role: selectedRole
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, logout } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // If no role is selected, redirect to role choice
    if (!queryParams.get('role')) {
      navigate('/register/role');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      return toast.error(t('auth.password_mismatch'));
    }

    setIsLoading(true);
    try {
      await register(formData);
      if (selectedRole === 'agent') {
        await logout();
        toast.info(t('auth.register_agent_pending', "Votre inscription en tant qu'agent a été enregistrée. Votre compte est en attente d'approbation par un administrateur."));
        navigate('/login');
      } else {
        toast.success(t('auth.register_success'));
        navigate('/dashboard/client');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('auth.register_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex-1 flex items-center justify-center min-h-screen relative overflow-hidden transition-colors duration-500 py-40 ${
      theme === 'light' ? 'bg-slate-50' : 'bg-[#050a1f]'
    }`}>
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] animate-pulse ${
          theme === 'light' ? 'bg-blue-200/40' : 'bg-blue-600/10'
        }`}></div>
        <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] animate-pulse delay-1000 ${
          theme === 'light' ? 'bg-indigo-100/40' : 'bg-blue-900/15'
        }`}></div>
        {theme !== 'light' && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050a1f]/80 to-[#050a1f]"></div>
        )}
      </div>

      {/* Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-28 left-8 z-50"
      >
        <Link 
          to="/register/role" 
          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors group ${
            theme === 'light' ? 'text-slate-400 hover:text-primary' : 'text-white/40 hover:text-white'
          }`}
        >
          <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {t('auth.register.change_role')}
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl px-6 pt-12"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`text-4xl font-black tracking-tighter mb-2 ${
              theme === 'light' ? 'text-primary' : 'text-white'
            }`}>
              IMMO<span className="text-blue-500">Rent</span>
            </div>
            <div className="w-12 h-1 bg-yellow-400 mx-auto mb-4"></div>
            <div className={`inline-block px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
              theme === 'light' 
                ? 'bg-blue-50 border-blue-100 text-blue-600' 
                : 'bg-blue-600/20 border-blue-500/30 text-blue-400'
            }`}>
               {t('auth.register.as')} {t(`auth.role.${selectedRole}_short`)}
            </div>
          </motion.div>
        </div>

        <div className={`p-8 sm:p-12 md:p-16 rounded-3xl border shadow-2xl relative group transition-all duration-500 ${
          theme === 'light' 
            ? 'bg-white border-slate-100' 
            : 'bg-white/5 backdrop-blur-xl border-white/10'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10">
            <h2 className={`text-3xl font-black mb-10 tracking-tighter uppercase text-center ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              {t('nav.register')}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors group-focus-within:text-blue-500 ${
                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                }`}>
                  {t('home.contact.first_name')} & {t('home.contact.last_name')}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center ${
                    theme === 'light' ? 'text-slate-300' : 'text-white/20'
                  }`}>
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-8 py-3 bg-transparent border-b outline-none transition-all font-light ${
                      theme === 'light' 
                        ? 'border-slate-100 text-slate-900 focus:border-blue-500' 
                        : 'border-white/10 text-white focus:border-blue-500'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors group-focus-within:text-blue-500 ${
                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                }`}>
                  {t('home.contact.email')}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center ${
                    theme === 'light' ? 'text-slate-300' : 'text-white/20'
                  }`}>
                    <EnvelopeIcon className="h-5 w-5" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-8 py-3 bg-transparent border-b outline-none transition-all font-light ${
                      theme === 'light' 
                        ? 'border-slate-100 text-slate-900 focus:border-blue-500' 
                        : 'border-white/10 text-white focus:border-blue-500'
                    }`}
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors group-focus-within:text-blue-500 ${
                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                }`}>
                  {t('footer.phone')}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center ${
                    theme === 'light' ? 'text-slate-300' : 'text-white/20'
                  }`}>
                    <PhoneIcon className="h-5 w-5" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full pl-8 py-3 bg-transparent border-b outline-none transition-all font-light ${
                      theme === 'light' 
                        ? 'border-slate-100 text-slate-900 focus:border-blue-500' 
                        : 'border-white/10 text-white focus:border-blue-500'
                    }`}
                    placeholder="+212 600..."
                  />
                </div>
              </div>

              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors group-focus-within:text-blue-500 ${
                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                }`}>
                  {t('footer.address')}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center ${
                    theme === 'light' ? 'text-slate-300' : 'text-white/20'
                  }`}>
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <input
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className={`block w-full pl-8 py-3 bg-transparent border-b outline-none transition-all font-light ${
                      theme === 'light' 
                        ? 'border-slate-100 text-slate-900 focus:border-blue-500' 
                        : 'border-white/10 text-white focus:border-blue-500'
                    }`}
                    placeholder="Casablanca, Morocco"
                  />
                </div>
              </div>

              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors group-focus-within:text-blue-500 ${
                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                }`}>
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center ${
                    theme === 'light' ? 'text-slate-300' : 'text-white/20'
                  }`}>
                    <LockClosedIcon className="h-5 w-5" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-8 pr-10 py-3 bg-transparent border-b outline-none transition-all font-light ${
                      theme === 'light' 
                        ? 'border-slate-100 text-slate-900 focus:border-blue-500' 
                        : 'border-white/10 text-white focus:border-blue-500'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 flex items-center pr-2 transition-colors ${
                      theme === 'light' ? 'text-slate-400 hover:text-blue-500' : 'text-white/30 hover:text-white'
                    }`}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors group-focus-within:text-blue-500 ${
                  theme === 'light' ? 'text-slate-400' : 'text-white/30'
                }`}>
                  {t('auth.confirm_password')}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center ${
                    theme === 'light' ? 'text-slate-300' : 'text-white/20'
                  }`}>
                    <LockClosedIcon className="h-5 w-5" />
                  </div>
                  <input
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`block w-full pl-8 pr-10 py-3 bg-transparent border-b outline-none transition-all font-light ${
                      theme === 'light' 
                        ? 'border-slate-100 text-slate-900 focus:border-blue-500' 
                        : 'border-white/10 text-white focus:border-blue-500'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 right-0 flex items-center pr-2 transition-colors ${
                      theme === 'light' ? 'text-slate-400 hover:text-blue-500' : 'text-white/30 hover:text-white'
                    }`}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 pt-8">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 !text-white font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-blue-900/40 disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t('nav.register')}
                      <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className={`mt-12 text-center border-t pt-8 ${
              theme === 'light' ? 'border-slate-50' : 'border-white/5'
            }`}>
              <p className={`text-xs font-light tracking-wide ${
                theme === 'light' ? 'text-slate-500' : 'text-white/40'
              }`}>
                {t('auth.already_account')} {' '}
                <Link to="/login" className="text-blue-500 font-black hover:underline ml-1">
                  {t('nav.login')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;