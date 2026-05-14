import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { UserIcon, BriefcaseIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const RoleSelection = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050a1f] py-40">
      {/* Deep Blue Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/15 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050a1f]/80 to-[#050a1f]"></div>
      </div>

      {/* Back Button (Restored) */}
      <Link 
        to="/login" 
        className="absolute top-28 left-8 z-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors group"
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
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase">
            {t('auth.role_selection.title').split(' ')[0]} <span className="text-blue-500">{t('auth.role_selection.title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-white/40 font-light tracking-widest uppercase text-xs">
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
              className="group block relative p-12 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-500 shadow-2xl"
            >
              <div className="mb-8 flex justify-center">
                <div className="p-6 bg-blue-600/20 rounded-full group-hover:bg-blue-600 transition-colors duration-500">
                  <UserIcon className="w-12 h-12 text-blue-500 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">{t('auth.role.client_title')}</h3>
              <p className="text-white/40 font-light text-sm leading-relaxed">
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
              className="group block relative p-12 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-yellow-400/50 transition-all duration-500 shadow-2xl"
            >
              <div className="mb-8 flex justify-center">
                <div className="p-6 bg-yellow-400/10 rounded-full group-hover:bg-yellow-400 transition-colors duration-500">
                  <BriefcaseIcon className="w-12 h-12 text-yellow-400 group-hover:text-black transition-colors duration-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">{t('auth.role.agent_title')}</h3>
              <p className="text-white/40 font-light text-sm leading-relaxed">
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
