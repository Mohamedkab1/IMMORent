import React, { createContext, useState, useContext, useEffect } from 'react';

import translations from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang && ['fr', 'en', 'ar'].includes(savedLang) ? savedLang : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, arg2, arg3) => {
    // Si le 2ème argument est une string, c'est un texte par défaut. Sinon c'est des paramètres.
    const defaultValue = typeof arg2 === 'string' ? arg2 : key;
    const params = typeof arg2 === 'object' ? arg2 : (typeof arg3 === 'object' ? arg3 : {});

    // Helper pour traverser l'objet avec la notation par point (ex: "client.requests.recent")
    const getNestedTranslation = (langObj, path) => {
      if (!langObj) return undefined;
      // 1. Essayer d'abord la clé exacte (car on a des clés plates comme 'nav.dashboard')
      if (langObj[path] !== undefined) return langObj[path];
      
      // 2. Sinon, essayer de traverser l'objet
      return path.split('.').reduce((obj, p) => (obj ? obj[p] : undefined), langObj);
    };

    let translation = getNestedTranslation(translations[language], key) 
                   || getNestedTranslation(translations['fr'], key);
                   
    if (translation === undefined) {
      translation = defaultValue;
    }
    
    // Support interpolation: t('welcome', { name: 'John' }) replaces {{name}} with John
    if (typeof translation === 'string' && params && typeof params === 'object') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }
    
    return translation;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};