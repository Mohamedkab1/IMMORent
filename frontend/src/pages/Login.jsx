import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(email, password);
      toast.success(t('auth.login_success'));
      
      const user = response.data.user;
      const role = user.role.slug;
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'agent') navigate('/dashboard/agent');
      else navigate('/dashboard/client');
    } catch (error) {
      toast.error(error.response?.data?.message || t('auth.login_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen relative overflow-hidden bg-[#050a1f] py-32">
      {/* Deep Blue Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/15 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050a1f]/80 to-[#050a1f]"></div>
      </div>

      {/* Back Button (Restored) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-28 left-8 z-50" // Increased top to avoid Navbar overlap
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {t('nav.home')}
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl px-6 pt-24" // Increased padding
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-4xl font-black tracking-tighter text-white mb-2">
              IMMO<span className="text-blue-500">Rent</span>
            </div>
            <div className="w-12 h-1 bg-yellow-400 mx-auto"></div>
          </motion.div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-8 sm:p-14 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase text-center">
              {t('auth.login.title')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 transition-colors group-focus-within:text-blue-500">
                    {t('auth.login.email_label')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center text-white/20">
                      <EnvelopeIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-8 py-4 bg-transparent border-b border-white/10 text-white focus:border-blue-500 outline-none transition-all font-light"
                      placeholder={t('auth.login.email_placeholder')}
                    />
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 transition-colors group-focus-within:text-blue-500">
                      {t('auth.login.password_label')}
                    </label>
                    <Link to="/forgot-password" weights="light" className="text-[10px] font-bold text-white/20 hover:text-blue-500 uppercase tracking-widest transition-colors">
                      {t('auth.login.forgot_password')}
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center text-white/20">
                      <LockClosedIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-8 py-4 bg-transparent border-b border-white/10 text-white focus:border-blue-500 outline-none transition-all font-light"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-blue-900/40 disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t('auth.login.submit')}
                      <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="mt-12 text-center border-t border-white/5 pt-8">
              <p className="text-white/40 text-xs font-light tracking-wide">
                {t('auth.login.no_account')} {' '}
                <Link to="/register/role" className="text-blue-500 font-black hover:underline ml-1">
                  {t('auth.login.register_link')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;