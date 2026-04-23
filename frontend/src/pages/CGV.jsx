import React from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, HomeIcon, ScaleIcon, ExclamationTriangleIcon, ShieldCheckIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, CalendarIcon, DocumentTextIcon, CheckCircleIcon, UserGroupIcon, CreditCardIcon, ClockIcon, HandRaisedIcon, LockClosedIcon, LightBulbIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const CGV = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-light py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md">Conditions Générales de Vente</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">Les conditions d'utilisation de la plateforme IMMORent Maroc</p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-bg-card rounded-3xl p-8 md:p-12 shadow-large border border-border-main">
          <div className="space-y-12">
            
            {/* Article 1 */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <DocumentTextIcon className="w-5 h-5 text-secondary" /> Article 1 : Objet
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation de la plateforme <strong>IMMORent.ma</strong> and définissent les droits et obligations des utilisateurs.</p>
                <p>Elles s'appliquent sans restriction ni réserve à l'ensemble des services proposés par <strong>IMMORent Maroc SARL</strong>.</p>
              </div>
            </section>

            {/* Tarification */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <CreditCardIcon className="w-5 h-5 text-secondary" /> Tarification et Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-bg-soft rounded-3xl border-2 border-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3">
                    <UserGroupIcon className="w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                  </div>
                  <h4 className="font-bold text-primary dark:text-secondary mb-2 uppercase tracking-wider text-xs">Agent Immobilier</h4>
                  <p className="text-3xl font-black text-text-main mb-4">149 DH <span className="text-sm font-normal opacity-60">HT / mois</span></p>
                  <ul className="space-y-2 text-xs text-text-sub font-medium">
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> Annonces illimitées</li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> Gestion complète</li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> Support 7j/7</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-bg-soft rounded-3xl border border-border-main group">
                  <h4 className="font-bold text-text-main mb-2 uppercase tracking-wider text-xs opacity-60">Particulier</h4>
                  <p className="text-3xl font-black text-text-main mb-4">99 DH <span className="text-sm font-normal opacity-60">HT / mois</span></p>
                  <ul className="space-y-2 text-xs text-text-sub font-medium">
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-primary" /> Jusqu'à 5 annonces</li>
                    <li className="flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 text-primary" /> Gestion directe</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-primary/5 dark:bg-secondary/5 rounded-2xl text-text-sub text-sm border border-primary/10">
                <InformationCircleIcon className="w-5 h-5 text-secondary flex-shrink-0" />
                <p>Tous les prix sont exprimés en Dirhams Marocains (DH). La TVA de 20% est applicable sur chaque transaction sécurisée via notre partenaire HPS.</p>
              </div>
            </section>

            {/* Droit applicable */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ScaleIcon className="w-5 h-5 text-secondary" /> Article 14 : Droit applicable
              </h2>
              <p className="text-text-sub leading-relaxed">
                Les présentes CGV sont régies par le <strong>droit marocain</strong>. En cas de litige, and après tentative de recherche d'une solution amiable, les tribunaux de <strong>Marrakech</strong> seront seuls compétents.
              </p>
            </section>

            <div className="pt-12 text-center text-xs text-text-muted space-y-4">
              <div className="flex items-center justify-center gap-6">
                <p className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p>Version : 2.0</p>
              </div>
              <Link to="/" className="inline-block px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary dark:text-secondary font-bold rounded-full transition-all">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGV;