import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  InformationCircleIcon,
  UserIcon,
  DocumentDuplicateIcon,
  ScaleIcon,
  ClockIcon,
  ShieldCheckIcon,
  CogIcon,
  ChartBarIcon,
  SparklesIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  NoSymbolIcon,
  ArchiveBoxIcon,
  PauseIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const Privacy = () => {
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
            Politique de <span className="text-primary">Confidentialité</span>
          </h1>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-bg-card border border-border-main rounded-xl shadow-xl overflow-hidden backdrop-blur-sm text-text-main"
        >
          <div className="p-8 md:p-12 space-y-12">

            {/* 1. Introduction */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <InformationCircleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  1. Introduction
                </h2>
              </div>
              <div className="pl-16 space-y-4 text-sm text-text-sub leading-relaxed">
                <p>IMMORent Maroc SARL (ci-après "IMMORent", "nous", "notre") accorde une importance primordiale à la protection de vos données personnelles. La présente politique de confidentialité a pour objectif de vous informer sur la manière dont nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre plateforme immobilière IMMORent.ma.</p>
                <p>Nous nous engageons à respecter la Loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à garantir la confidentialité de vos informations.</p>
              </div>
            </motion.section>

            {/* 2. Responsable du traitement */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  2. Responsable du traitement
                </h2>
              </div>
              <div className="pl-16 space-y-2 text-sm text-text-sub">
                <p className="font-bold text-text-main">IMMORent Maroc SARL</p>
                <p>Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000, Maroc</p>
                <p>Téléphone : +212 5 24 12 34 56</p>
                <p>Email : <a href="mailto:contact@immorent.ma" className="text-primary hover:underline">contact@immorent.ma</a></p>
              </div>
            </motion.section>

            {/* 3. Données collectées */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <DocumentDuplicateIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  3. Données collectées
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub mb-4">Nous collectons les catégories de données suivantes :</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-sub">
                  <li><strong>Données d'identification :</strong> nom, prénom, email, téléphone</li>
                  <li><strong>Données de connexion :</strong> adresse IP, logs, navigateur</li>
                  <li><strong>Données de transaction :</strong> historique des recherches, annonces consultées</li>
                  <li><strong>Données de paiement :</strong> (uniquement si nécessaire via des prestataires sécurisés)</li>
                </ul>
              </div>
            </motion.section>

            {/* 4. Base légale du traitement */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ScaleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  4. Base légale du traitement
                </h2>
              </div>
              <div className="pl-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-text-main mb-2">Consentement</h4>
                  <p className="text-xs text-text-muted">Pour l'envoi de newsletters et communications marketing</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-text-main mb-2">Contrat</h4>
                  <p className="text-xs text-text-muted">Pour l'exécution de nos services immobiliers</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-text-main mb-2">Obligation légale</h4>
                  <p className="text-xs text-text-muted">Pour répondre aux exigences réglementaires</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-text-main mb-2">Intérêt légitime</h4>
                  <p className="text-xs text-text-muted">Pour améliorer nos services et la sécurité</p>
                </div>
              </div>
            </motion.section>

            {/* 5. Durée de conservation */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  5. Durée de conservation
                </h2>
              </div>
              <div className="pl-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 border border-border-main rounded-lg bg-bg-soft">
                  <span className="text-sm font-medium text-text-sub">Comptes inactifs</span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">3 ans</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-border-main rounded-lg bg-bg-soft">
                  <span className="text-sm font-medium text-text-sub">Données de navigation</span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">13 mois</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-border-main rounded-lg bg-bg-soft">
                  <span className="text-sm font-medium text-text-sub">Factures et documents légaux</span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">10 ans</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-border-main rounded-lg bg-bg-soft">
                  <span className="text-sm font-medium text-text-sub">Demandes de contact</span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">1 an</span>
                </div>
              </div>
            </motion.section>

            {/* 6. Sécurité des données */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  6. Sécurité des données
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub mb-4">Nous mettons en œuvre les mesures techniques et organisationnelles suivantes :</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-text-sub">
                  <li>Chiffrement SSL/TLS pour toutes les transmissions de données</li>
                  <li>Hébergement sécurisé avec accès restreint</li>
                  <li>Sauvegardes quotidiennes et monitoring 24/7</li>
                </ul>
              </div>
            </motion.section>

            {/* 7. Cookies */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CogIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  7. Cookies
                </h2>
              </div>
              <div className="pl-16 space-y-4">
                <p className="text-sm text-text-sub">Nous utilisons des cookies pour :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border border-border-main rounded-lg bg-bg-soft">
                    <CogIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-sub">Fonctionnement du site</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border-main rounded-lg bg-bg-soft">
                    <ChartBarIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-sub">Analyses statistiques</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border-main rounded-lg bg-bg-soft">
                    <SparklesIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-sub">Personnalisation des annonces</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border-main rounded-lg bg-bg-soft">
                    <LockClosedIcon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-text-sub">Sécurité et authentification</span>
                  </div>
                </div>
                <p className="text-sm text-text-sub mt-4">Vous pouvez gérer vos préférences de cookies à tout moment via notre gestionnaire de cookies. Médias.</p>
              </div>
            </motion.section>

            {/* 8. Vos droits */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ScaleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  8. Vos droits
                </h2>
              </div>
              <div className="pl-16 space-y-6">
                <p className="text-sm text-text-sub">Conformément à la Loi n° 09-08 et au RGPD, vous disposez des droits suivants :</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <MagnifyingGlassIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">Droit d'accès</h4>
                    </div>
                    <p className="text-xs text-text-muted">Obtenir la confirmation que vos données sont traitées et y accéder.</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <PencilIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">Droit de rectification</h4>
                    </div>
                    <p className="text-xs text-text-muted">Faire rectifier vos données si elles sont inexactes.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <TrashIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">Droit à l'effacement</h4>
                    </div>
                    <p className="text-xs text-text-muted">Demander la suppression de vos données.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <NoSymbolIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">Droit d'opposition</h4>
                    </div>
                    <p className="text-xs text-text-muted">S'opposer au traitement pour des motifs légitimes.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <ArchiveBoxIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">Droit à la portabilité</h4>
                    </div>
                    <p className="text-xs text-text-muted">Recevoir vos données dans un format structuré.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-bg-soft border border-border-main">
                    <div className="flex items-center gap-2 mb-2">
                      <PauseIcon className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-text-main">Droit à la limitation</h4>
                    </div>
                    <p className="text-xs text-text-muted">Suspendre le traitement de vos données.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3">
                  <EnvelopeIcon className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-text-main mb-1">Pour exercer vos droits :</h4>
                    <p className="text-sm text-text-sub">Contactez notre DPO à <a href="mailto:dpo@immorent.ma" className="text-primary hover:underline">dpo@immorent.ma</a> ou par courrier à l'adresse du siège social.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 9. Modifications de la politique */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  9. Modifications de la politique
                </h2>
              </div>
              <div className="pl-16">
                <p className="text-sm text-text-sub leading-relaxed">
                  Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. La version la plus récente est toujours disponible sur cette page. En cas de modification substantielle, nous vous en informerons par email ou via une notification sur notre plateforme.
                </p>
              </div>
            </motion.section>

            {/* 10. Nous contacter */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  10. Nous contacter
                </h2>
              </div>
              <div className="pl-16 space-y-4">
                <p className="text-sm text-text-sub">Pour toute question relative à cette politique :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-soft border border-border-main">
                    <EnvelopeIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm">
                      <p className="text-text-muted text-xs mb-1">Email</p>
                      <a href="mailto:confidentialite@immorent.ma" className="text-text-main font-medium hover:text-primary">confidentialite@immorent.ma</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-soft border border-border-main">
                    <PhoneIcon className="w-5 h-5 text-primary" />
                    <div className="text-sm">
                      <p className="text-text-muted text-xs mb-1">Téléphone</p>
                      <span className="text-text-main font-medium">+212 5 24 12 34 56</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-soft border border-border-main">
                    <MapPinIcon className="w-8 h-8 text-primary flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-text-muted text-xs mb-1">Adresse</p>
                      <span className="text-text-main font-medium">Avenue Mohammed VI, Immobilier Guéliz, Marrakech 40000</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

          </div>
        </motion.div>

        {/* Footer links */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8"
        >
          <Link to="/legal-mentions" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            Mentions Légales
          </Link>
          <Link to="/cgv" className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">
            Conditions de Vente
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;