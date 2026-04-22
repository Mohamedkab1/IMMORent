const translations = {
  fr: {
    // Navigation
    unknown: 'Inconnu',
    no_phone: 'Pas de téléphone',
    approve: 'Approuver',
    reject: 'Refuser',
    actions: 'Actions',
    amount: 'Montant',
    status: 'Statut',
    data_refreshed: 'Données actualisées',
    'auth.role.client_short': 'Client',
    'nav.notifications': 'Notifications',
    'nav.mark_all_read': 'Tout marquer lu',
    'nav.no_notifications': 'Aucune notification',
    'nav.personal_space': 'Espace Personnel',
    'nav.messages': 'Messages',
    'nav.language': 'Langue',
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

    // Footer
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

    // Home
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

    // Properties
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
    'prop.add.title': 'Ajouter un nouveau bien',
    'prop.edit.title': 'Modifier le bien',

    // Dashboards
    'dash.client.welcome': 'Bienvenue sur votre espace locataire',
    'dash.agent.welcome': 'Tableau de bord de gestionnaire',
    'dash.admin.welcome': 'Administration IMMORent',
    'dash.stats.total_rent': 'Loyers collectés',
    'dash.stats.active_contracts': 'Contrats actifs',
    'dash.stats.pending_requests': 'Demandes en attente',
    'dash.stats.total_properties': 'Total des biens',
    'dash.stats.revenue': 'Revenus générés',

    // Admin Specific
    'admin.welcome_subtitle': 'Voici l\'état actuel de votre plateforme.',
    'admin.tabs.overview': 'Vue d\'ensemble',
    'admin.tabs.users': 'Utilisateurs',
    'admin.tabs.properties': 'Biens',
    'admin.tabs.contracts': 'Contrats',
    'admin.tabs.payments': 'Paiements',
    'admin.tabs.agent_requests': 'Demandes Agents',
    'admin.tabs.settings': 'Paramètres',
    'admin.overview.performance': 'Performance Financière',
    'admin.overview.evolution': 'Évolution des revenus mensuels',
    'admin.overview.year': 'Année',
    'admin.overview.alerts': 'Alertes Système',
    'admin.overview.late_payments': 'Paiements en retard',
    'admin.overview.late_payments_desc': '4 paiements sont en attente depuis plus de 5 jours.',
    'admin.overview.new_report': 'Nouveau rapport',
    'admin.overview.new_report_desc': 'Le rapport d\'activité mensuel est prêt à être téléchargé.',
    'admin.users.title': 'Répertoire Utilisateurs',
    'admin.users.count': 'Comptes enregistrés',
    'admin.users.filter.all_roles': 'Tous les rôles',
    'admin.users.table.user': 'Utilisateur',
    'admin.users.table.role': 'Rôle',
    'admin.users.table.status': 'Statut',
    'admin.users.table.date': 'Date Inscription',
    'admin.properties.title': 'Gestion du Parc Immobilier',
    'admin.properties.table.reference': 'Bien / Référence',
    'admin.properties.table.agent': 'Agent Responsable',
    'admin.properties.table.approval': 'Approbation',
    'admin.properties.table.flags': 'Flags',
    'admin.settings.title': 'Configuration du Système',
    'admin.settings.agency_name': 'Nom de l\'agence',
    'admin.settings.contact_email': 'Email de contact',
    'admin.settings.contact_phone': 'Téléphone',
    'admin.settings.commission': 'Commission (%)',
    'admin.settings.retraction_delay': 'Délai de rétractation (jours)',
    'admin.agent_requests.title': 'Candidatures Agents',
    'admin.agent_requests.subtitle': 'Examinez les demandes de passage au rôle Agent',
    'admin.agent_requests.no_data': 'Aucune candidature en attente',
    'admin.agent_requests.table.candidate': 'Candidat',
    'admin.agent_requests.table.contact': 'Contact',
    'admin.agent_requests.table.date': 'Date Demande',

    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.loading': 'Chargement...',
    'common.search': 'Rechercher...',
    'common.all': 'Tous',
    'common.actions': 'Actions',
    'common.status': 'Statut',
    'common.date': 'Date',
    'common.amount': 'Montant',
    'common.refresh': 'Actualiser',
    'common.new': 'Nouveau',

    // Auth
    'auth.login.title': 'Bon retour parmi nous',
    'auth.register.title': 'Rejoignez IMMORent',
    'auth.login.subtitle': 'Connectez-vous pour gérer vos biens immobiliers.',
    'auth.register.subtitle': 'Créez votre compte en quelques secondes.',
    'auth.email': 'Adresse Email',
    'auth.password': 'Mot de passe',
    'auth.name': 'Nom complet',
    'auth.role': 'Je suis un...',
    'auth.role.admin': 'Administrateur',
    'auth.role.client': 'Client (Locataire/Acheteur)',
    'auth.role.agent': 'Agent / Propriétaire',
    client: {
      dashboard: {
        subtitle: 'Gérez vos demandes et vos suivis en toute simplicité.',
        loading: 'Chargement de votre espace...',
        stats: {
          expenses: 'Dépenses mensuelles',
          favorites: 'Biens favoris'
        }
      },
      requests: {
        recent: 'Demandes Récentes',
        history: 'Historique des demandes',
        no_data: 'Aucune demande en cours',
        cancel_confirm: 'Êtes-vous sûr de vouloir annuler cette demande ?',
        table: {
          target: 'Bien ciblé'
        }
      },
      contracts: {
        active_title: 'Mes Contrats Actifs',
        no_data: 'Aucun contrat actif'
      }
    },
    agent: {
      dashboard: {
        subtitle: 'Supervisez votre portfolio immobilier en temps réel.',
        refresh: 'Actualiser',
        see_all: 'Tout voir'
      },
      properties: {
        title: 'Gestion de mes biens',
        add: 'Ajouter',
        no_data: 'Aucun bien enregistré',
        table: {
          title: 'Titre & Ville',
          attrs: 'Attributs'
        }
      },
      requests: {
        title: 'Gestion des demandes',
        no_data: 'Aucune demande reçue',
        pending_count: '{{count}} en attente',
        processed_at: 'Traitée le {{date}}',
        table: {
          client: 'Client',
          property: 'Bien concerné',
          date: 'Date demande'
        }
      },
      contracts: {
        title: 'Mes Contrats',
        no_data: 'Aucun contrat trouvé',
        active_count: '{{count}} actif(s)',
        table: {
          property: 'Propriété',
          tenant: 'Locataire',
          rent: 'Loyer'
        }
      }
    }
  },
  en: {
    // Navigation
    unknown: 'Unknown',
    no_phone: 'No phone',
    approve: 'Approve',
    reject: 'Reject',
    actions: 'Actions',
    amount: 'Amount',
    status: 'Status',
    data_refreshed: 'Data refreshed',
    'auth.role.client_short': 'Client',
    'nav.notifications': 'Notifications',
    'nav.mark_all_read': 'Mark all as read',
    'nav.no_notifications': 'No notifications',
    'nav.personal_space': 'Personal Space',
    'nav.messages': 'Messages',
    'nav.language': 'Language',
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

    // Footer
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

    // Home
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

    // Properties
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
    'prop.add.title': 'Add new property',
    'prop.edit.title': 'Edit property',

    // Dashboards
    'dash.client.welcome': 'Welcome to your tenant space',
    'dash.agent.welcome': 'Management Dashboard',
    'dash.admin.welcome': 'IMMORent Administration',
    'dash.stats.total_rent': 'Collected Rents',
    'dash.stats.active_contracts': 'Active Contracts',
    'dash.stats.pending_requests': 'Pending Requests',
    'dash.stats.total_properties': 'Total Properties',
    'dash.stats.revenue': 'Generated Revenue',

    // Admin Specific
    'admin.welcome_subtitle': 'Here is the current state of your platform.',
    'admin.tabs.overview': 'Overview',
    'admin.tabs.users': 'Users',
    'admin.tabs.properties': 'Properties',
    'admin.tabs.contracts': 'Contracts',
    'admin.tabs.payments': 'Payments',
    'admin.tabs.agent_requests': 'Agent Requests',
    'admin.tabs.settings': 'Settings',
    'admin.overview.performance': 'Financial Performance',
    'admin.overview.evolution': 'Monthly revenue evolution',
    'admin.overview.year': 'Year',
    'admin.overview.alerts': 'System Alerts',
    'admin.overview.late_payments': 'Late Payments',
    'admin.overview.late_payments_desc': '4 payments are pending for more than 5 days.',
    'admin.overview.new_report': 'New Report',
    'admin.overview.new_report_desc': 'The monthly activity report is ready for download.',
    'admin.users.title': 'User Directory',
    'admin.users.count': 'Registered Accounts',
    'admin.users.filter.all_roles': 'All Roles',
    'admin.users.table.user': 'User',
    'admin.users.table.role': 'Role',
    'admin.users.table.status': 'Status',
    'admin.users.table.date': 'Registration Date',
    'admin.properties.title': 'Real Estate Fleet Management',
    'admin.properties.table.reference': 'Property / Reference',
    'admin.properties.table.agent': 'Responsible Agent',
    'admin.properties.table.approval': 'Approval',
    'admin.properties.table.flags': 'Flags',
    'admin.settings.title': 'System Configuration',
    'admin.settings.agency_name': 'Agency Name',
    'admin.settings.contact_email': 'Contact Email',
    'admin.settings.contact_phone': 'Phone Number',
    'admin.settings.commission': 'Commission (%)',
    'admin.settings.retraction_delay': 'Retraction Delay (days)',
    'admin.agent_requests.title': 'Agent Requests',
    'admin.agent_requests.subtitle': 'Review requests for switching to Agent role',
    'admin.agent_requests.no_data': 'No pending applications',
    'admin.agent_requests.table.candidate': 'Candidate',
    'admin.agent_requests.table.contact': 'Contact',
    'admin.agent_requests.table.date': 'Request Date',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.search': 'Search...',
    'common.all': 'All',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.amount': 'Amount',
    'common.refresh': 'Refresh',
    'common.new': 'New',

    // Auth
    'auth.login.title': 'Welcome back',
    'auth.register.title': 'Join IMMORent',
    'auth.login.subtitle': 'Log in to manage your real estate.',
    'auth.register.subtitle': 'Create your account in seconds.',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.role': 'I am a...',
    'auth.role.admin': 'Administrator',
    'auth.role.client': 'Client (Tenant/Buyer)',
    'auth.role.agent': 'Agent / Owner',
    client: {
      dashboard: {
        subtitle: 'Manage your requests and follow-ups with ease.',
        loading: 'Loading your space...',
        stats: {
          expenses: 'Monthly Expenses',
          favorites: 'Favorite Properties'
        }
      },
      requests: {
        recent: 'Recent Requests',
        history: 'Requests History',
        no_data: 'No requests in progress',
        cancel_confirm: 'Are you sure you want to cancel this request?',
        table: {
          target: 'Target Property'
        }
      },
      contracts: {
        active_title: 'My Active Contracts',
        no_data: 'No active contracts'
      }
    },
    agent: {
      dashboard: {
        subtitle: 'Oversee your real estate portfolio in real time.',
        refresh: 'Refresh',
        see_all: 'See all'
      },
      properties: {
        title: 'My Properties',
        add: 'Add',
        no_data: 'No properties recorded',
        table: {
          title: 'Title & City',
          attrs: 'Attributes'
        }
      },
      requests: {
        title: 'Requests Management',
        no_data: 'No requests received',
        pending_count: '{{count}} pending',
        processed_at: 'Processed on {{date}}',
        table: {
          client: 'Client',
          property: 'Property',
          date: 'Request Date'
        }
      },
      contracts: {
        title: 'My Contracts',
        no_data: 'No contracts found',
        active_count: '{{count}} active',
        table: {
          property: 'Property',
          tenant: 'Tenant',
          rent: 'Rent'
        }
      }
    }
  },
  ar: {
    // Navigation
    unknown: 'غير معروف',
    no_phone: 'لا يوجد هاتف',
    approve: 'موافقة',
    reject: 'رفض',
    actions: 'إجراءات',
    amount: 'المبلغ',
    status: 'الحالة',
    data_refreshed: 'تم تحديث البيانات',
    'auth.role.client_short': 'عميل',
    'nav.notifications': 'التنبيهات',
    'nav.mark_all_read': 'تحديد الكل كمقروء',
    'nav.no_notifications': 'لا توجد تنبيهات',
    'nav.personal_space': 'الفضاء الشخصي',
    'nav.messages': 'الرسائل',
    'nav.language': 'اللغة',
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

    // Footer
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

    // Home
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

    // Properties
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
    'prop.add.title': 'إضافة عقار جديد',
    'prop.edit.title': 'تعديل العقار',

    // Dashboards
    'dash.client.welcome': 'مرحباً بك في فضاء المستأجر',
    'dash.agent.welcome': 'لوحة تحكم المسير',
    'dash.admin.welcome': 'إدارة إيمورنت',
    'dash.stats.total_rent': 'الإيجارات المحصلة',
    'dash.stats.active_contracts': 'العقود النشطة',
    'dash.stats.pending_requests': 'الطلبات المعلقة',
    'dash.stats.total_properties': 'إجمالي العقارات',
    'dash.stats.revenue': 'الإيرادات المحققة',

    // Admin Specific
    'admin.welcome_subtitle': 'إليك الحالة الحالية لمنصتك.',
    'admin.tabs.overview': 'نظرة عامة',
    'admin.tabs.users': 'المستخدمون',
    'admin.tabs.properties': 'العقارات',
    'admin.tabs.contracts': 'العقود',
    'admin.tabs.payments': 'المدفوعات',
    'admin.tabs.agent_requests': 'طلبات الوكلاء',
    'admin.tabs.settings': 'الإعدادات',
    'admin.overview.performance': 'الأداء المالي',
    'admin.overview.evolution': 'تطور الإيرادات الشهرية',
    'admin.overview.year': 'السنة',
    'admin.overview.alerts': 'تنبيهات النظام',
    'admin.overview.late_payments': 'مدفوعات متأخرة',
    'admin.overview.late_payments_desc': 'هناك 4 مدفوعات معلقة لأكثر من 5 أيام.',
    'admin.overview.new_report': 'تقرير جديد',
    'admin.overview.new_report_desc': 'تقرير النشاط الشهري جاهز للتحميل.',
    'admin.users.title': 'دليل المستخدمين',
    'admin.users.count': 'الحسابات المسجلة',
    'admin.users.filter.all_roles': 'جميع الأدوار',
    'admin.users.table.user': 'المستخدم',
    'admin.users.table.role': 'الدور',
    'admin.users.table.status': 'الحالة',
    'admin.users.table.date': 'تاريخ التسجيل',
    'admin.properties.title': 'إدارة الأسطول العقاري',
    'admin.properties.table.reference': 'العقار / المرجع',
    'admin.properties.table.agent': 'الوكيل المسؤول',
    'admin.properties.table.approval': 'الموافقة',
    'admin.properties.table.flags': 'الأعلام',
    'admin.settings.title': 'إعدادات النظام',
    'admin.settings.agency_name': 'اسم الوكالة',
    'admin.settings.contact_email': 'البريد الإلكتروني',
    'admin.settings.contact_phone': 'رقم الهاتف',
    'admin.settings.commission': 'العمولة (%)',
    'admin.settings.retraction_delay': 'مهلة التراجع (أيام)',
    'admin.agent_requests.title': 'طلبات الوكلاء',
    'admin.agent_requests.subtitle': 'مراجعة طلبات الانتقال إلى دور وكيل',
    'admin.agent_requests.no_data': 'لا توجد طلبات معلقة',
    'admin.agent_requests.table.candidate': 'المرشح',
    'admin.agent_requests.table.contact': 'الاتصال',
    'admin.agent_requests.table.date': 'تاريخ الطلب',

    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.loading': 'جاري التحميل...',
    'common.search': 'بحث...',
    'common.all': 'الكل',
    'common.actions': 'إجراءات',
    'common.status': 'الحالة',
    'common.date': 'التاريخ',
    'common.amount': 'المبلغ',
    'common.refresh': 'تحديث',
    'common.new': 'جديد',

    // Auth
    'auth.login.title': 'مرحباً بعودتك',
    'auth.register.title': 'انضم إلى إيمورنت',
    'auth.login.subtitle': 'سجل الدخول لإدارة عقاراتك.',
    'auth.register.subtitle': 'أنشئ حسابك في ثوانٍ.',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل',
    'auth.role': 'أنا...',
    'auth.role.admin': 'مشرف',
    'auth.role.client': 'عميل (مستأجر/مشتري)',
    'auth.role.agent': 'وكيل / مالك',
    client: {
      dashboard: {
        subtitle: 'قم بإدارة طلباتك ومتابعاتك بكل سهولة.',
        loading: 'جاري تحميل مساحتك...',
        stats: {
          expenses: 'المصاريف الشهرية',
          favorites: 'العقارات المفضلة'
        }
      },
      requests: {
        recent: 'الطلبات الأخيرة',
        history: 'سجل الطلبات',
        no_data: 'لا توجد طلبات جارية',
        cancel_confirm: 'هل أنت متأكد أنك تريد إلغاء هذا الطلب؟',
        table: {
          target: 'العقار المستهدف'
        }
      },
      contracts: {
        active_title: 'عقودي النشطة',
        no_data: 'لا توجد عقود نشطة'
      }
    },
    agent: {
      dashboard: {
        subtitle: 'أشرف على محفظتك العقارية في الوقت الفعلي.',
        refresh: 'تحديث',
        see_all: 'عرض الكل'
      },
      properties: {
        title: 'إدارة عقاراتي',
        add: 'إضافة',
        no_data: 'لم يتم تسجيل أي عقارات',
        table: {
          title: 'العنوان والمدينة',
          attrs: 'المواصفات'
        }
      },
      requests: {
        title: 'إدارة الطلبات',
        no_data: 'لم يتم استلام أي طلبات',
        pending_count: '{{count}} في الانتظار',
        processed_at: 'تمت المعالجة في {{date}}',
        table: {
          client: 'العميل',
          property: 'العقار المعني',
          date: 'تاريخ الطلب'
        }
      },
      contracts: {
        title: 'عقودي',
        no_data: 'لم يتم العثور على أي عقود',
        active_count: '{{count}} نشط',
        table: {
          property: 'العقار',
          tenant: 'المستأجر',
          rent: 'الإيجار'
        }
      }
    }
  }
};

export default translations;
