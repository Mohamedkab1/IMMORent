import { useLanguage } from '../context/LanguageContext';

export const useTranslation = () => {
  const { t, language, toggleLanguage, setLanguage } = useLanguage();
  return { t, language, toggleLanguage, setLanguage };
};