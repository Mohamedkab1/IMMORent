import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  PaperAirplaneIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
  }
};

const Contact = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success(t('contact.success', 'Message envoyé avec succès'));
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-soft font-outfit">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-border-main/50">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-bg-soft to-bg-soft opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <ArrowLeftIcon className="w-3 h-3" />
              {t('common.prev', 'Retour')}
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter leading-none mb-6">
              {t('contact.hero.title_p1', 'Parlons')} <span className="text-primary">{t('contact.hero.title_p2', 'Ensemble')}</span>
            </h1>
            <p className="text-sm md:text-lg text-text-sub font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto opacity-60">
              {t('contact.hero.subtitle', 'Notre équipe est à votre disposition pour toute question ou accompagnement.')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">
        
        {/* Info Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: MapPinIcon, title: t('contact.info.address.title', 'Adresse'), line1: 'Avenue Mohammed VI', line2: 'Marrakech 40000', color: 'text-primary' },
            { icon: PhoneIcon, title: t('contact.info.phone.title', 'Téléphone'), line1: '+212 5 24 12 34 56', line2: '+212 6 00 00 00 00', color: 'text-blue-500' },
            { icon: EnvelopeIcon, title: t('contact.info.email.title', 'Email'), line1: 'contact@immorent.ma', line2: 'support@immorent.ma', color: 'text-emerald-500' },
            { icon: ClockIcon, title: t('contact.info.hours.title', 'Horaires'), line1: 'Lun - Ven: 9h - 18h', line2: 'Sam: 9h - 13h', color: 'text-amber-500' }
          ].map((info) => (
            <motion.div key={info.title} variants={itemVariants} className="bg-bg-card border border-border-main p-8 rounded-xl shadow-sm hover:shadow-xl transition-all group text-center">
              <div className={`w-12 h-12 rounded-lg bg-bg-soft flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-primary group-hover:text-white ${info.color}`}>
                <info.icon className="w-6 h-6" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-text-main mb-4 opacity-40">{info.title}</h3>
              <p className="text-sm font-black text-text-sub tracking-tight leading-relaxed">
                {info.line1} <br /> {info.line2}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-bg-card border border-border-main p-8 md:p-12 rounded-xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <CheckCircleIcon className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-text-main tracking-tight">{t('contact.form.success.title', 'Merci !')}</h3>
                  <p className="text-text-sub font-bold uppercase tracking-widest text-[10px] opacity-60 max-w-xs mx-auto">
                    {t('contact.form.success.desc', 'Votre message a bien été transmis. Notre équipe reviendra vers vous très prochainement.')}
                  </p>
                  <button onClick={() => setSubmitted(false)} className="px-10 py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
                    {t('contact.form.success.btn', 'Envoyer un autre message')}
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit} 
                  className="space-y-8 relative z-10"
                >
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-text-main tracking-tight">{t('contact.form.title', 'Contactez-nous')}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">{t('contact.form.subtitle', 'Remplissez le formulaire ci-dessous.')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{t('contact.form.label.name', 'Nom')}</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-6 py-4 rounded-xl border border-border-main bg-bg-soft/30 font-bold text-text-main outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{t('contact.form.label.email', 'Email')}</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-6 py-4 rounded-xl border border-border-main bg-bg-soft/30 font-bold text-text-main outline-none focus:border-primary transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{t('contact.form.label.subject', 'Sujet')}</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-6 py-4 rounded-xl border border-border-main bg-bg-soft/30 font-bold text-text-main outline-none focus:border-primary transition-all appearance-none cursor-pointer">
                      <option value="">{t('contact.form.subject.placeholder', 'Sélectionnez un sujet')}</option>
                      <option value="info">Information</option>
                      <option value="support">Support</option>
                      <option value="partnership">Partenariat</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{t('contact.form.label.message', 'Message')}</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required className="w-full px-6 py-4 rounded-xl border border-border-main bg-bg-soft/30 font-bold text-text-main outline-none focus:border-primary transition-all resize-none" />
                  </div>

                  <button type="submit" disabled={submitting} className="w-full py-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3">
                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><PaperAirplaneIcon className="w-5 h-5" /> {t('contact.form.submit', 'Envoyer le message')}</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Map Container */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border-main overflow-hidden shadow-2xl relative z-0 h-[400px] lg:h-auto"
          >
            <MapContainer 
              center={[31.6295, -7.9811]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[31.6295, -7.9811]}>
                <Popup>IMMORent Marrakech</Popup>
              </Marker>
            </MapContainer>
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-bg-card/80 backdrop-blur-md border border-border-main rounded-xl shadow-xl z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Siège Social</p>
              <p className="text-sm font-black text-text-main tracking-tight">Immeuble Kabbaj, Avenue Mohammed VI, Marrakech</p>
            </div>
          </motion.div>
          
        </div>

      </div>
    </div>
  );
};

export default Contact;