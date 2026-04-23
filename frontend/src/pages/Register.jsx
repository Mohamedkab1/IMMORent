import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HomeIcon, BuildingOfficeIcon, UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, LockClosedIcon, ArrowRightIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    role: 'client'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('client');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role: role });
  };

  const validateStep1 = () => {
    if (!selectedRole) {
      toast.error('Veuillez sélectionner un rôle');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('L\'email est requis');
      return false;
    }
    if (!formData.password) {
      toast.error('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const response = await register(formData);
      toast.success(response.message || 'Inscription réussie');
      
      if (formData.role === 'agent') {
        toast.info('Votre compte agent est en attente de validation par un administrateur.');
        navigate('/login');
      } else {
        navigate('/dashboard/client');
      }
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        Object.values(validationErrors).forEach(errArray => {
          errArray.forEach(msg => toast.error(msg));
        });
      } else {
        toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl -z-10 animate-float-delayed"></div>

      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-black text-text-main tracking-tight">
            IMMO<span className="text-secondary">Rent</span>
          </Link>
          <h1 className="mt-6 text-4xl font-extrabold text-text-main tracking-tight">Créer un compte</h1>
          <p className="mt-2 text-text-sub font-medium">Rejoignez la révolution immobilière au Maroc.</p>
        </div>

        {/* Unified Progress Indicator */}
        <div className="max-w-xs mx-auto mb-12">
            <div className="flex items-center justify-between relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 z-10 ${currentStep >= 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-bg-soft text-text-muted'}`}>1</div>
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${currentStep === 2 ? 'bg-primary' : 'bg-bg-soft'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 z-10 ${currentStep === 2 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-bg-soft text-text-muted'}`}>2</div>
                
                <div className="absolute top-12 left-0 right-0 flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted px-2">
                    <span className={currentStep >= 1 ? 'text-primary' : ''}>Profil</span>
                    <span className={currentStep === 2 ? 'text-primary' : ''}>Détails</span>
                </div>
            </div>
        </div>

        <div className="bg-bg-card rounded-3xl shadow-huge border border-border-main p-8 md:p-12 backdrop-blur-xl">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 ? (
              <div className="animate-fade-in">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold text-text-main">Choisissez votre profil</h3>
                  <p className="text-text-sub mt-1">Sélectionnez comment vous souhaitez utiliser la plateforme.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Card */}
                  <div 
                    onClick={() => handleRoleSelect('client')}
                    className={`relative group cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 ${selectedRole === 'client' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-border-main hover:border-primary/50 bg-bg-soft/50'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedRole === 'client' ? 'bg-primary text-white' : 'bg-bg-soft text-primary'}`}>
                      <HomeIcon className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-text-main mb-2">Client / Locataire</h4>
                    <p className="text-sm text-text-sub leading-relaxed mb-6">Je recherche un logement à louer et je souhaite gérer mes contrats en ligne.</p>
                    <ul className="space-y-3">
                      {['Recherche illimitée', 'Contrats numériques', 'Suivi des paiements'].map((f, i) => (
                        <li key={i} className="flex items-center text-xs font-bold text-text-main/80 uppercase tracking-tight">
                            <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    {selectedRole === 'client' && <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center animate-scale-in">✓</div>}
                  </div>

                  {/* Agent Card */}
                  <div 
                    onClick={() => handleRoleSelect('agent')}
                    className={`relative group cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 ${selectedRole === 'agent' ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-border-main hover:border-primary/50 bg-bg-soft/50'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedRole === 'agent' ? 'bg-primary text-white' : 'bg-bg-soft text-primary'}`}>
                      <BuildingOfficeIcon className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-text-main mb-2">Agent Immobilier</h4>
                    <p className="text-sm text-text-sub leading-relaxed mb-6">Je gère un parc immobilier et je souhaite automatiser mes tâches professionnelles.</p>
                    <ul className="space-y-3">
                      {['Publication d\'annonces', 'Gestion des locataires', 'Génération PDF'].map((f, i) => (
                        <li key={i} className="flex items-center text-xs font-bold text-text-main/80 uppercase tracking-tight">
                            <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black rounded-lg uppercase tracking-widest">Validation Admin requise</div>
                    {selectedRole === 'agent' && <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center animate-scale-in">✓</div>}
                  </div>
                </div>

                <div className="mt-12 flex justify-center">
                  <button 
                    type="button" 
                    onClick={handleNext}
                    className="px-10 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-light hover:-translate-y-1 transition-all flex items-center gap-3"
                  >
                    Continuer vers vos infos
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold text-text-main">Informations personnelles</h3>
                  <p className="text-text-sub mt-1">Ces données seront utilisées pour vos futurs contrats.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">Nom Complet</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Meryem Bennani"
                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">Adresse Email</label>
                    <div className="relative">
                        <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="meryem@exemple.ma"
                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">Téléphone</label>
                    <div className="relative">
                        <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="06 12 34 56 78"
                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">Adresse de résidence</label>
                    <div className="relative">
                        <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Gueliz, Marrakech"
                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">Mot de passe</label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main">
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-sub">Confirmer le mot de passe</label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 bg-bg-soft border border-border-main rounded-xl text-text-main font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    type="button" 
                    onClick={handleBack}
                    className="flex-1 py-4 px-6 bg-bg-soft border border-border-main text-text-main rounded-xl font-bold hover:bg-bg-card hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeftIcon className="w-5 h-5" /> Retour
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] py-4 px-6 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-light hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Créer mon compte professionnel'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="mt-12 text-center">
            <p className="text-text-sub font-medium">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-primary font-extrabold hover:underline">Se connecter ici</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Register;