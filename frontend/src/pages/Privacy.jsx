import React from 'react';
import { Link } from 'react-router-dom';
import { LockClosedIcon, BuildingOfficeIcon, ChartBarIcon, ScaleIcon, ShieldCheckIcon, PencilIcon, EnvelopeIcon, CalendarIcon, CheckIcon, ClipboardDocumentIcon, UserIcon } from '@heroicons/react/24/outline';

const Privacy = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-light py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md">Politique de confidentialité</h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">Comment nous protégeons vos données personnelles sur IMMORent Maroc</p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-bg-card rounded-3xl p-8 md:p-12 shadow-large border border-border-main">
          <div className="space-y-12">
            
            {/* Introduction */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <LockClosedIcon className="w-5 h-5 text-secondary" /> 1. Introduction
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>IMMORent Maroc SARL (ci-après "IMMORent", "nous", "notre") accorde une importance primordiale à la protection de vos données personnelles. La présente politique de confidentialité a pour objectif de vous informer sur la manière dont nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre plateforme immobilière <strong>IMMORent.ma</strong>.</p>
                <p>Nous nous engageons à respecter la <strong>Loi n° 09-08</strong> relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à garantir la confidentialité de vos informations.</p>
              </div>
            </section>

            {/* Responsable du traitement */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <BuildingOfficeIcon className="w-5 h-5 text-secondary" /> 2. Responsable du traitement
              </h2>
              <div className="space-y-2 text-text-sub leading-relaxed">
                <p><strong>IMMORent Maroc SARL</strong></p>
                <p>Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000, Maroc</p>
                <p>Téléphone : +212 5 24 12 34 56</p>
                <p>Email : <a href="mailto:contact@immorent.ma" className="text-secondary hover:underline font-bold">contact@immorent.ma</a></p>
              </div>
            </section>

            {/* Vos droits */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                ✅ 8. Vos droits
              </h2>
              <p className="text-text-sub mb-8">Conformément à la <strong>Loi n° 09-08</strong> et au <strong>RGPD</strong>, vous disposez des droits suivants :</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "🔍", title: "Droit d'accès", desc: "Obtenir la confirmation que vos données sont traitées and y accéder." },
                  { icon: "✏️", title: "Droit de rectification", desc: "Faire rectifier vos données si elles sont inexactes." },
                  { icon: "🗑️", title: "Droit à l'effacement", desc: "Demander la suppression de vos données." },
                  { icon: "⛔", title: "Droit d'opposition", desc: "S'opposer au traitement pour des motifs légitimes." }
                ].map((r, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-bg-soft rounded-2xl border border-border-main hover:scale-[1.02] transition-transform">
                    <span className="text-2xl pt-1">{r.icon}</span>
                    <div>
                      <h4 className="font-bold text-text-main text-sm">{r.title}</h4>
                      <p className="text-xs text-text-muted mt-1">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-8 text-center text-xs text-text-muted space-y-2 border-t border-border-main">
              <p className="flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p>Version : 2.0</p>
              <Link to="/" className="inline-block mt-4 text-secondary font-bold hover:underline">← Retour à l'accueil</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;