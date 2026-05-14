import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { UserIcon, BriefcaseIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const RoleSelection = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 py-40 ${
      theme === 'light' ? 'bg-slate-50' : 'bg-[#050a1f]'
    }`}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse ${
          theme === 'light' ? 'bg-blue-100/40' : 'bg-blue-600/10'
        }`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse delay-700 ${
          theme === 'light' ? 'bg-indigo-50/40' : 'bg-blue-900/15'
        }`}></div>
        {theme !== 'light' && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050a1f]/80 to-[#050a1f]"></div>
        )}
      </div>

      {/* Back Button */}
      <Link 
        to="/login" 
        className={`absolute top-28 left-8 z-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors group ${
          theme === 'light' ? 'text-slate-400 hover:text-primary' : 'text-white/40 hover:text-white'
        }`}
      >
        <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        {t('auth.already_account')}
      </Link>

      <div className="relative z-10 w-full max-w-4xl px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className={`text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase ${
            theme === 'light' ? 'text-slate-900' : 'text-white'
          }`}>
            {t('auth.role_selection.title').split(' ')[0]} <span className="text-blue-500">{t('auth.role_selection.title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className={`font-light tracking-widest uppercase text-xs ${
            theme === 'light' ? 'text-slate-400' : 'text-white/40'
          }`}>
            {t('auth.role_selection.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Role */}
          <motion.div
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              to="/register?role=client"
              className={`group block relative p-12 border rounded-2xl transition-all duration-500 shadow-2xl ${
                theme === 'light' 
                  ? 'bg-white border-slate-100 hover:border-blue-500/50 shadow-slate-200/50' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50'
              }`}
            >
              <div className="mb-8 flex justify-center">
                <div className={`p-6 rounded-full transition-colors duration-500 ${
                  theme === 'light' ? 'bg-blue-50 group-hover:bg-blue-600' : 'bg-blue-600/20 group-hover:bg-blue-600'
                }`}>
                  <UserIcon className={`w-12 h-12 transition-colors duration-500 ${
                    theme === 'light' ? 'text-blue-600 group-hover:text-white' : 'text-blue-500 group-hover:text-white'
                  }`} />
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-4 uppercase tracking-tight ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>{t('auth.role.client_title')}</h3>
              <p className={`font-light text-sm leading-relaxed ${
                theme === 'light' ? 'text-slate-500' : 'text-white/40'
              }`}>
                {t('auth.role.client_desc')}
              </p>
              <div className="mt-8 h-1 w-0 bg-blue-500 group-hover:w-full transition-all duration-500 mx-auto"></div>
            </Link>
          </motion.div>

          {/* Agent Role */}
          <motion.div
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              to="/register?role=agent"
              className={`group block relative p-12 border rounded-2xl transition-all duration-500 shadow-2xl ${
                theme === 'light' 
                  ? 'bg-white border-slate-100 hover:border-yellow-400/50 shadow-slate-200/50' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-yellow-400/50'
              }`}
            >
              <div className="mb-8 flex justify-center">
                <div className={`p-6 rounded-full transition-colors duration-500 ${
                  theme === 'light' ? 'bg-yellow-50 group-hover:bg-yellow-400' : 'bg-yellow-400/10 group-hover:bg-yellow-400'
                }`}>
                  <BriefcaseIcon className={`w-12 h-12 transition-colors duration-500 ${
                    theme === 'light' ? 'text-yellow-600 group-hover:text-slate-900' : 'text-yellow-400 group-hover:text-black'
                  }`} />
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-4 uppercase tracking-tight ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>{t('auth.role.agent_title')}</h3>
              <p className={`font-light text-sm leading-relaxed ${
                theme === 'light' ? 'text-slate-500' : 'text-white/40'
              }`}>
                {t('auth.role.agent_desc')}
              </p>
              <div className="mt-8 h-1 w-0 bg-yellow-400 group-hover:w-full transition-all duration-500 mx-auto"></div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
