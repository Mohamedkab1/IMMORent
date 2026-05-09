import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  ClipboardDocumentIcon, 
  UserIcon, 
  LockClosedIcon, 
  CheckIcon, 
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const LegalMentions = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-light py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md">
          {t('legal.mentions.title', 'Mentions légales')}
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          {t('legal.mentions.subtitle', 'Informations légales concernant la plateforme IMMORent Maroc')}
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-bg-card rounded-3xl p-8 md:p-12 shadow-large border border-border-main">
          <div className="space-y-12">
            
            {/* Éditeur du site */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <ClipboardDocumentIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.mentions.editor_title', '1. Éditeur du site')}
              </h2>
              <div className="space-y-2 text-text-sub leading-relaxed">
                <p><strong>{t('legal.mentions.editor_desc', 'IMMORent Maroc SARL')}</strong></p>
                <p>{t('legal.mentions.capital', 'Société à responsabilité limitée au capital de 500 000 DH')}</p>
                <p>{t('legal.mentions.headquarters', 'Siège social : Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000, Maroc')}</p>
                <p>{t('legal.mentions.rc', 'RC : 123456 / Marrakech | IF : 12345678 | ICE : 001234567890123')}</p>
                <p>{t('legal.mentions.tva', 'N° TVA : 12345678')}</p>
                <p>{t('legal.mentions.phone', 'Téléphone : +212 5 24 12 34 56')}</p>
                <p>{t('legal.mentions.email', 'Email')} : <a href="mailto:contact@immorent.ma" className="text-secondary hover:underline font-bold">
                  contact@immorent.ma
                </a></p>
              </div>
            </section>

            {/* Directeur de publication */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <UserIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.mentions.pub_dir_title', '2. Directeur de publication')}
              </h2>
              <div className="space-y-2 text-text-sub leading-relaxed">
                <p><strong>{t('legal.mentions.pub_dir_desc', 'Mohamed Kabbaj, Gérant')}</strong></p>
                <p>{t('legal.mentions.email', 'Email')} : <a href="mailto:M.Kabbaj@immorent.ma" className="text-secondary hover:underline font-bold">
                  M.Kabbaj@immorent.ma
                </a></p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <DocumentTextIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.mentions.intellectual_title', '3. Propriété intellectuelle')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>
                  {t('legal.mentions.intellectual_desc_1', "L'ensemble des contenus présents sur le site IMMORent.ma (textes, images, logos, vidéos, icônes, base de données, etc.) sont la propriété exclusive de IMMORent Maroc SARL ou de ses partenaires et sont protégés par les dispositions du Code de la Propriété Intellectuelle marocain.")}
                </p>
                <p>
                  {t('legal.mentions.intellectual_desc_2', "Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de la société.")}
                </p>
              </div>
            </section>

            {/* Protection des données personnelles */}
            <section className="pb-8 border-b border-border-main last:border-0 last:pb-0">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-3 mb-6">
                <LockClosedIcon className="w-5 h-5 text-secondary" /> 
                {t('legal.mentions.data_title', '4. Protection des données personnelles')}
              </h2>
              <div className="space-y-4 text-text-sub leading-relaxed">
                <p>
                  {t('legal.mentions.data_desc', "Conformément à la Loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez des droits suivants :")}
                </p>
                <ul className="space-y-2 ps-2">
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-4 h-4 text-secondary mt-1" /> 
                    {t('legal.mentions.right_access', "Droit d'accès à vos données personnelles")}
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-4 h-4 text-secondary mt-1" /> 
                    {t('legal.mentions.right_rectify', "Droit de rectification des informations inexactes")}
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="w-4 h-4 text-secondary mt-1" /> 
                    {t('legal.mentions.right_oppose', "Droit d'opposition pour motifs légitimes")}
                  </li>
                </ul>
                <p>
                  {t('legal.mentions.dpo_contact', "Pour exercer ces droits, contactez notre Délégué à la Protection des Données (DPO) :")} 
                  {' '}<a href="mailto:dpo@immorent.ma" className="text-secondary hover:underline font-bold">
                    dpo@immorent.ma
                  </a>
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="pt-8 text-center text-xs text-text-muted space-y-2">
              <p className="flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" /> 
                {t('legal.mentions.last_update', 'Dernière mise à jour :')} 
                {' '}{new Date().toLocaleDateString(t('common.locale', 'fr-FR'), { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <p>{t('legal.mentions.version', 'Version :')} 2.0</p>
              <Link to="/" className="inline-block mt-4 text-secondary font-bold hover:underline">
                {t('legal.mentions.back_home', '← Retour à l\'accueil')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalMentions;