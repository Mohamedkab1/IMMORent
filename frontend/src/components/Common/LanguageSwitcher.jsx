import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  const langs = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' }
  ];

  return (
    <div className="flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
      {langs.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`
            px-3 py-1.5 rounded-lg text-[10px] font-black transition-all duration-300
            ${language === lang.code 
              ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700'
            }
          `}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;