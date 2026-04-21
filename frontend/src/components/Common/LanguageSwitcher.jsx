import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button 
        className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
        onClick={() => setLanguage('fr')}
      >
        FR
      </button>
      <button 
        className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
        onClick={() => setLanguage('ar')}
      >
        AR
      </button>
      
      <style>{`
        .language-switcher {
          display: flex;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem;
          border-radius: 2rem;
        }

        .lang-btn {
          padding: 0.375rem 0.875rem;
          border: none;
          border-radius: 1.5rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.75rem;
          transition: all 0.3s ease;
          background: transparent;
          color: #e0e7ff;
        }

        .lang-btn.active {
          background: #d4af37;
          color: #0f2b4d;
        }

        .lang-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;