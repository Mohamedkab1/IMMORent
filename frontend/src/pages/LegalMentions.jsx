import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  ClipboardDocumentIcon, 
  UserIcon, 
  LockClosedIcon, 
  CheckIcon, 
  CalendarIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  ScaleIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  FingerPrintIcon,
  ServerIcon,
  CogIcon,
  ChartBarIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  HandRaisedIcon,
  ArchiveBoxIcon,
  PauseCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
  }
};

const LegalMentions = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-bg-soft pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            <ArrowLeftIcon className="w-3 h-3" />
            Retour
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">
            Mentions Légales <span className="text-primary">& Confidentialité</span>
          </h1>
          <p className="text-xs text-text-sub font-bold uppercase tracking-[0.3em] opacity-60">
            Protection de vos données personnelles et informations légales
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-card border border-border-main rounded-xl shadow-xl overflow-hidden backdrop-blur-sm"
        >
          <div className="p-8 md:p-12 space-y-16">
            
            {/* 1. Introduction */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <InformationCircleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  1. Introduction
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub leading-relaxed">
                <p>IMMORent Maroc SARL (ci-après "IMMORent", "nous", "notre") accorde une importance primordiale à la protection de vos données personnelles. La présente politique de confidentialité a pour objectif de vous informer sur la manière dont nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre plateforme immobilière IMMORent.ma.</p>
                <p>Nous nous engageons à respecter la Loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à garantir la confidentialité de vos informations.</p>
              </div>
            </motion.section>

            {/* 2. Responsable du traitement */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <BuildingOfficeIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  2. Responsable du traitement
                </h2>
              </div>
              <div className="pl-16 p-6 rounded-lg bg-bg-soft border border-border-main space-y-4 text-sm text-text-sub">
                <p className="font-bold text-text-main text-base">IMMORent Maroc SARL</p>
                <p>Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000, Maroc</p>
                <p className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-primary" /> +212 5 24 12 34 56</p>
                <p className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-primary" /> contact@immorent.ma</p>
              </div>
            </motion.section>

            {/* 3. Données collectées */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FingerPrintIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  3. Données collectées
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub mb-4">Nous collectons les catégories de données suivantes :</p>
                <ul className="space-y-3">
                  {[
                    ['Données d\'identification', 'nom, prénom, email, téléphone'],
                    ['Données de connexion', 'adresse IP, logs, navigateur'],
                    ['Données de transaction', 'historique des recherches, annonces consultées'],
                    ['Données de paiement', '(uniquement si nécessaire via des prestataires sécurisés)']
                  ].map(([label, desc], idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-text-main">{label} :</strong> <span className="text-text-sub">{desc}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* 4. Base légale */}
            <motion.section variants={sectionVariants} className="group border-t border-border-main pt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ScaleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  4. Base légale du traitement
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-16">
                {[
                  { title: 'Consentement', desc: 'Pour l\'envoi de newsletters et communications marketing' },
                  { title: 'Contrat', desc: 'Pour l\'exécution de nos services immobiliers' },
                  { title: 'Obligation légale', desc: 'Pour répondre aux exigences réglementaires' },
                  { title: 'Intérêt légitime', desc: 'Pour améliorer nos services et la sécurité' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">{item.title}</h4>
                    <p className="text-sm text-text-sub">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 5. Durée de conservation */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  5. Durée de conservation
                </h2>
              </div>
              <div className="pl-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Comptes inactifs', time: '3 ans' },
                  { label: 'Données de navigation', time: '13 mois' },
                  { label: 'Factures / Documents', time: '10 ans' },
                  { label: 'Demandes de contact', time: '1 an' }
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-4 bg-bg-soft rounded-lg border border-border-main">
                    <div className="text-lg font-black text-text-main mb-1">{item.time}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 6. Sécurité des données */}
            <motion.section variants={sectionVariants} className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  6. Sécurité des données
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub">
                <p>Nous mettons en œuvre les mesures techniques et organisationnelles suivantes :</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3"><LockClosedIcon className="w-4 h-4 text-primary" /> Chiffrement SSL/TLS pour toutes les transmissions de données</li>
                  <li className="flex items-center gap-3"><ServerIcon className="w-4 h-4 text-primary" /> Hébergement sécurisé avec accès restreint</li>
                  <li className="flex items-center gap-3"><ChartBarIcon className="w-4 h-4 text-primary" /> Sauvegardes quotidiennes et monitoring 24/7</li>
                </ul>
              </div>
            </motion.section>

            {/* 7. Cookies */}
            <motion.section variants={sectionVariants} className="group border-t border-border-main pt-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FingerPrintIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  7. Cookies
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub mb-6">Nous utilisons des cookies pour :</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-bg-soft rounded-lg border border-border-main">
                    <CogIcon className="w-6 h-6 text-text-muted mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-main">Fonctionnement du site</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-bg-soft rounded-lg border border-border-main">
                    <ChartBarIcon className="w-6 h-6 text-text-muted mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-main">Analyses statistiques</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-bg-soft rounded-lg border border-border-main">
                    <SparklesIcon className="w-6 h-6 text-text-muted mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-main">Personnalisation des annonces</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-bg-soft rounded-lg border border-border-main">
                    <LockClosedIcon className="w-6 h-6 text-text-muted mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-main">Sécurité et authentification</span>
                  </div>
                </div>
                <p className="text-xs text-text-sub italic">Vous pouvez gérer vos préférences de cookies à tout moment via notre gestionnaire de cookies.</p>
              </div>
            </motion.section>

            {/* 8. Vos droits */}
            <motion.section variants={sectionVariants} className="group border-t border-border-main pt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-tight">
                  8. Vos droits
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub mb-6">Conformément à la Loi n° 09-08 et au RGPD, vous disposez des droits suivants :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: MagnifyingGlassIcon, title: 'Droit d\'accès', desc: 'Obtenir la confirmation que vos données sont traitées et y accéder.' },
                    { icon: PencilSquareIcon, title: 'Droit de rectification', desc: 'Faire rectifier vos données si elles sont inexactes.' },
                    { icon: TrashIcon, title: 'Droit à l\'effacement', desc: 'Demander la suppression de vos données.' },
                    { icon: HandRaisedIcon, title: 'Droit d\'opposition', desc: 'S\'opposer au traitement pour des motifs légitimes.' },
                    { icon: ArchiveBoxIcon, title: 'Droit à la portabilité', desc: 'Recevoir vos données dans un format structuré.' },
                    { icon: PauseCircleIcon, title: 'Droit à la limitation', desc: 'Suspendre le traitement de vos données.' }
                  ].map((right, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-bg-soft border border-border-main">
                      <right.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-text-main mb-1">{right.title}</h4>
                        <p className="text-xs text-text-sub">{right.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-4 text-sm text-text-sub">
                  <EnvelopeIcon className="w-6 h-6 text-primary flex-shrink-0" />
                  <p><strong>Pour exercer vos droits :</strong> Contactez notre DPO à <a href="mailto:dpo@immorent.ma" className="text-primary hover:underline font-bold">dpo@immorent.ma</a> ou par courrier à l'adresse du siège social.</p>
                </div>
              </div>
            </motion.section>

            {/* 9 & 10 */}
            <motion.section variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border-main pt-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <DocumentTextIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-black text-text-main uppercase tracking-widest">9. Modifications de la politique</h2>
                </div>
                <p className="text-xs text-text-sub leading-relaxed pl-8">Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. La version la plus récente est toujours disponible sur cette page. En cas de modification substantielle, nous vous en informerons par email ou via une notification sur notre plateforme.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <PhoneIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-black text-text-main uppercase tracking-widest">10. Nous contacter</h2>
                </div>
                <div className="pl-8 space-y-2 text-xs text-text-sub">
                  <p>Pour toute question relative à cette politique :</p>
                  <p className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-primary" /> confidentialite@immorent.ma</p>
                  <p className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-primary" /> +212 5 24 12 34 56</p>
                  <p className="flex items-center gap-2"><BuildingOfficeIcon className="w-4 h-4 text-primary" /> Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000</p>
                </div>
              </div>
            </motion.section>

            {/* Footer info */}
            <motion.div variants={sectionVariants} className="pt-16 border-t border-border-main flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <CalendarIcon className="w-4 h-4" />
                Mis à jour le : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest">
                Version 3.0 — © IMMORent Maroc
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Back Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <Link to="/" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            ← Retour à l'accueil
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalMentions;