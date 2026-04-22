import React, { createContext, useState, useContext, useEffect } from 'react';

// Traductions simplifiées pour commencer
const translations = {
  fr: {
    'nav.home': 'Accueil',
    'nav.properties': 'Biens',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.register': 'Inscription',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profil',
    'nav.logout': 'Déconnexion',
    'nav.theme': 'Thème',
    'footer.description': 'IMMORent est la plateforme SaaS n°1 au Maroc pour la gestion et la location immobilière premium. Trouvez votre prochain logement ou gérez vos actifs en toute sérénité.',
    'footer.quickLinks': 'Liens rapides',
    'footer.services': 'Services',
    'footer.legal': 'Informations légales',
    'footer.legalMentions': 'Mentions légales',
    'footer.privacy': 'Confidentialité',
    'footer.terms': 'CGV',
    'footer.siteMap': 'Plan du site',
    'footer.contactUs': 'Nous contacter',
    'footer.address': 'Avenue Mohammed VI, Guéliz, Marrakech 40000, Maroc',
    'footer.phone': '+212 5 24 12 34 56',
    'footer.email': 'contact@immorent.ma',
    'footer.hours': 'Lun-Ven: 9h-18h | Sam: 9h-13h',
    'footer.rights': 'Tous droits réservés',
    'home.apartments': 'Appartements',
    'home.houses': 'Villas & Maisons',
    'home.commercial': 'Locaux professionnels',
    'home.lands': 'Terrains',
    'home.hero.title': 'Trouvez votre bien idéal au Maroc',
    'home.hero.subtitle': 'La référence de l\'immobilier premium à Casablanca, Marrakech et Tanger.',
    'home.stats.properties': 'Biens exclusifs',
    'home.stats.clients': 'Clients satisfaits',
    'home.stats.agencies': 'Partenaires',
    'home.stats.satisfaction': 'Taux de satisfaction',
    'prop.list.title': 'Découvrez nos propriétés',
    'prop.filter.city': 'Ville',
    'prop.filter.type': 'Type',
    'prop.filter.price': 'Prix Max',
    'prop.status.available': 'Disponible',
    'prop.status.rented': 'Loué',
    'prop.status.sold': 'Vendu',
    'prop.details.features': 'Équipements',
    'prop.details.description': 'Description',
    'prop.details.location': 'Localisation',
    'prop.details.contact': 'Contacter l\'agent',
    'dash.client.welcome': 'Bienvenue sur votre espace locataire',
    'dash.agent.welcome': 'Tableau de bord de gestionnaire',
    'dash.admin.welcome': 'Administration IMMORent',
    'dash.stats.total_rent': 'Loyers collectés',
    'dash.stats.active_contracts': 'Contrats actifs',
    'dash.stats.pending_requests': 'Demandes en attente',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.loading': 'Chargement...',
    'auth.login.title': 'Bon retour parmi nous',
    'auth.register.title': 'Rejoignez IMMORent',
  },
  en: {
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.theme': 'Theme',
    'footer.description': 'IMMORent is the #1 SaaS platform in Morocco for premium real estate management and rental. Find your next home or manage your assets with peace of mind.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.legal': 'Legal Information',
    'footer.legalMentions': 'Legal Mentions',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.siteMap': 'Site Map',
    'footer.contactUs': 'Contact Us',
    'footer.address': 'Avenue Mohammed VI, Gueliz, Marrakech 40000, Morocco',
    'footer.phone': '+212 5 24 12 34 56',
    'footer.email': 'contact@immorent.ma',
    'footer.hours': 'Mon-Fri: 9am-6pm | Sat: 9am-1pm',
    'footer.rights': 'All rights reserved',
    'home.apartments': 'Apartments',
    'home.houses': 'Villas & Houses',
    'home.commercial': 'Commercial Spaces',
    'home.lands': 'Lands',
    'home.hero.title': 'Find your ideal property in Morocco',
    'home.hero.subtitle': 'The benchmark for premium real estate in Casablanca, Marrakech, and Tangier.',
    'home.stats.properties': 'Exclusive properties',
    'home.stats.clients': 'Happy clients',
    'home.stats.agencies': 'Partners',
    'home.stats.satisfaction': 'Satisfaction rate',
    'prop.list.title': 'Discover our properties',
    'prop.filter.city': 'City',
    'prop.filter.type': 'Type',
    'prop.filter.price': 'Max Price',
    'prop.status.available': 'Available',
    'prop.status.rented': 'Rented',
    'prop.status.sold': 'Sold',
    'prop.details.features': 'Features',
    'prop.details.description': 'Description',
    'prop.details.location': 'Location',
    'prop.details.contact': 'Contact Agent',
    'dash.client.welcome': 'Welcome to your tenant space',
    'dash.agent.welcome': 'Management Dashboard',
    'dash.admin.welcome': 'IMMORent Administration',
    'dash.stats.total_rent': 'Collected Rents',
    'dash.stats.active_contracts': 'Active Contracts',
    'dash.stats.pending_requests': 'Pending Requests',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'auth.login.title': 'Welcome back',
    'auth.register.title': 'Join IMMORent',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.properties': 'العقارات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.dashboard': 'لوحة التحكم',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',
    'nav.theme': 'المظهر',
    'footer.description': 'إيمورنت هي المنصة رقم 1 في المغرب لإدارة وتأجير العقارات الفاخرة. ابحث عن منزلك القادم أو أدر أصولك بكل طمأنينة.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.services': 'الخدمات',
    'footer.legal': 'معلومات قانونية',
    'footer.legalMentions': 'شروط الاستخدام',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'الشروط العامة',
    'footer.siteMap': 'خريطة الموقع',
    'footer.contactUs': 'اتصل بنا',
    'footer.address': 'شارع محمد السادس، كليز، مراكش 40000، المغرب',
    'footer.phone': '+212 5 24 12 34 56',
    'footer.email': 'contact@immorent.ma',
    'footer.hours': 'الإثنين-الجمعة: 9-18 | السبت: 9-13',
    'footer.rights': 'جميع الحقوق محفوظة',
    'home.apartments': 'شقق فاخرة',
    'home.houses': 'فيلات ومنازل',
    'home.commercial': 'محلات تجارية',
    'home.lands': 'أراضي',
    'home.hero.title': 'ابحث عن عقارك المثالي في المغرب',
    'home.hero.subtitle': 'الرائد في العقارات الفاخرة في الدار البيضاء، مراكش وطنجة.',
    'home.stats.properties': 'عقارات حصرية',
    'home.stats.clients': 'عملاء سعداء',
    'home.stats.agencies': 'شركاء',
    'home.stats.satisfaction': 'نسبة الرضا',
    'prop.list.title': 'اكتشف عقاراتنا',
    'prop.filter.city': 'المدينة',
    'prop.filter.type': 'النوع',
    'prop.filter.price': 'السعر الأقصى',
    'prop.status.available': 'متاح',
    'prop.status.rented': 'مؤجر',
    'prop.status.sold': 'مباع',
    'prop.details.features': 'المميزات',
    'prop.details.description': 'الوصف',
    'prop.details.location': 'الموقع',
    'prop.details.contact': 'اتصل بالوكيل',
    'dash.client.welcome': 'مرحباً بك في فضاء المستأجر',
    'dash.agent.welcome': 'لوحة تحكم المسير',
    'dash.admin.welcome': 'إدارة إيمورنت',
    'dash.stats.total_rent': 'الإيجارات المحصلة',
    'dash.stats.active_contracts': 'العقود النشطة',
    'dash.stats.pending_requests': 'الطلبات المعلقة',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.loading': 'جاري التحميل...',
    'auth.login.title': 'مرحباً بعودتك',
    'auth.register.title': 'انضم إلى إيمورنت',
  }
};

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

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    if (['fr', 'en', 'ar'].includes(lang)) {
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