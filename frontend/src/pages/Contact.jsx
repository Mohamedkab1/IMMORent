import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, CheckCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Contact = () => {
  const { t } = useLanguage();
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
      toast.success(t('contact.success'));
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-soft transition-colors duration-300">
      
      {/* Hero Section */}
      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-[45vh] pt-40 pb-20 bg-gradient-to-br from-[#050a1f] via-[#0a1a1a] to-[#050a1f] overflow-hidden">
        
        {/* Bottom Fade Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-soft to-transparent z-20 pointer-events-none"></div>

        {/* Abstract Background patterns */}
        <div className="absolute inset-0 opacity-20 z-10 mix-blend-overlay pointer-events-none">
          <svg className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 text-white" width="600" height="600" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>
        
        <div className="relative z-20 max-w-4xl mx-auto text-center px-4">
          <RevealOnScroll>
            <span className="inline-block py-1 px-4 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs font-bold mb-6 tracking-widest uppercase shadow-sm">
              {t('nav.contact')}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
              {t('contact.hero.title_p1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">{t('contact.hero.title_p2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              {t('contact.hero.subtitle')}
            </p>
          </RevealOnScroll>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        
        {/* Info Grid */}
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: MapPinIcon, title: t('contact.info.address.title'), line1: t('contact.info.address.l1'), line2: t('contact.info.address.l2'), note: null },
            { icon: PhoneIcon, title: t('contact.info.phone.title'), line1: '+212 5 24 12 34 56', line2: '+212 6 00 00 00 00', note: t('contact.info.phone.note') },
            { icon: EnvelopeIcon, title: t('contact.info.email.title'), line1: 'contact@immorent.ma', line2: 'support@immorent.ma', note: t('contact.info.email.note') },
            { icon: ClockIcon, title: t('contact.info.hours.title'), line1: t('contact.info.hours.l1'), line2: t('contact.info.hours.l2'), note: t('contact.info.hours.note') }
          ].map((info, i) => (
            <RevealOnScroll key={i} delay={i * 100}>
              <div className="bg-bg-card p-6 rounded-xl shadow-sm border border-border-main text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 dark:bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                  <info.icon className="w-8 h-8 text-primary dark:text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-text-main mb-3">{info.title}</h3>
                <p className="text-text-sub text-sm leading-relaxed font-medium">
                  {info.line1} <br /> {info.line2}
                </p>
                {info.note && <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-4">{info.note}</p>}
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          
          {/* Form */}
          <RevealOnScroll delay={200}>
            <div className="bg-bg-card p-8 md:p-12 rounded-xl shadow-sm border border-border-main relative overflow-hidden group hover:shadow-xl transition-shadow duration-500">
               
               {/* Decorative blob */}
               <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 dark:bg-secondary/5 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>

               <h2 className="text-3xl font-extrabold text-text-main mb-2 relative z-10">{t('contact.form.title')}</h2>
               <p className="text-text-sub mb-8 relative z-10 font-medium">{t('contact.form.subtitle')}</p>
               
               {submitted ? (
                 <div className="flex flex-col items-center justify-center py-12 text-center relative z-10 animate-fade-in-up">
                   <CheckCircleIcon className="w-20 h-20 text-green-500 mb-6" />
                   <h3 className="text-2xl font-bold text-text-main mb-4">{t('contact.form.success.title')}</h3>
                   <p className="text-text-sub mb-8 max-w-sm">{t('contact.form.success.desc')}</p>
                   <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-primary text-white hover:bg-primary-hover rounded-lg font-bold transition-colors shadow-md">
                     {t('contact.form.success.btn')}
                   </button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 group/input">
                        <label className="text-sm font-bold text-text-sub uppercase tracking-wider group-focus-within/input:text-primary transition-colors">{t('contact.form.label.name')} <span className="text-rose-500">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder={t('contact.form.placeholder.name')} className="w-full px-4 py-3 bg-bg-soft hover:bg-bg-main border appearance-none outline-none border-border-main rounded-lg text-text-main font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2 group/input">
                        <label className="text-sm font-bold text-text-sub uppercase tracking-wider group-focus-within/input:text-primary transition-colors">{t('contact.form.label.email')} <span className="text-rose-500">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder={t('contact.form.placeholder.email')} className="w-full px-4 py-3 bg-bg-soft hover:bg-bg-main border appearance-none outline-none border-border-main rounded-lg text-text-main font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 group/input">
                        <label className="text-sm font-bold text-text-sub uppercase tracking-wider group-focus-within/input:text-primary transition-colors">{t('contact.form.label.phone')}</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="06 00 00 00 00" className="w-full px-4 py-3 bg-bg-soft hover:bg-bg-main border appearance-none outline-none border-border-main rounded-lg text-text-main font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2 group/input">
                        <label className="text-sm font-bold text-text-sub uppercase tracking-wider group-focus-within/input:text-primary transition-colors">{t('contact.form.label.subject')} <span className="text-rose-500">*</span></label>
                        <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 bg-bg-soft hover:bg-bg-main border outline-none border-border-main rounded-lg text-text-main font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer shadow-inner">
                         <option value="">{t('contact.form.subject.placeholder')}</option>
                         <option value="info">{t('contact.form.subject.opt1')}</option>
                         <option value="support">{t('contact.form.subject.opt2')}</option>
                         <option value="partnership">{t('contact.form.subject.opt3')}</option>
                         <option value="claim">{t('contact.form.subject.opt4')}</option>
                         <option value="visit">{t('contact.form.subject.opt5')}</option>
                       </select>
                     </div>
                   </div>

                   <div className="space-y-2 group/input">
                     <label className="text-sm font-bold text-text-sub uppercase tracking-wider group-focus-within/input:text-primary transition-colors">{t('contact.form.label.message')} <span className="text-rose-500">*</span></label>
                     <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required placeholder={t('contact.form.placeholder.message')} className="w-full px-4 py-3 bg-bg-soft hover:bg-bg-main border appearance-none outline-none border-border-main rounded-lg text-text-main font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y shadow-inner" />
                   </div>

                   <div className="flex items-start gap-3 mt-4">
                     <input type="checkbox" id="consent" required className="mt-1.5 w-5 h-5 rounded border-border-main text-primary focus:ring-primary transition-colors bg-bg-soft" />
                     <label htmlFor="consent" className="text-sm text-text-sub font-medium leading-relaxed">
                       {t('contact.form.consent')}
                     </label>
                   </div>

                   <button type="submit" disabled={submitting} className="w-full py-4 bg-primary text-white dark:bg-secondary dark:text-slate-900 hover:bg-primary-hover dark:hover:bg-yellow-400 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 mt-4">
                     {submitting && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                     {submitting ? t('contact.form.submitting') : <><PaperAirplaneIcon className="w-5 h-5" /> {t('contact.form.submit')}</>}
                   </button>
                 </form>
               )}
            </div>
          </RevealOnScroll>

          {/* Map */}
          <RevealOnScroll delay={400} className="h-full">
            <div className="h-[400px] lg:h-full min-h-[500px] w-full rounded-xl overflow-hidden shadow-sm border border-border-main relative group z-0">
              <MapContainer 
                center={[31.6295, -7.9811]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                className="grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[31.6295, -7.9811]}>
                  <Popup>
                    <div className="p-2 text-center">
                      <p className="font-bold text-primary">IMMORent Marrakech</p>
                      <p className="text-xs text-text-muted mt-1">Siège Social - Centre Ville</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </RevealOnScroll>
          
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-main inline-block relative mb-16 tracking-tight">
              {t('contact.faq.title')}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-secondary"></div>
            </h2>
          </RevealOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
            {[
              { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
              { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
              { q: t('contact.faq.q3'), a: t('contact.faq.a3') },
              { q: t('contact.faq.q4'), a: t('contact.faq.a4') }
            ].map((faq, i) => (
              <RevealOnScroll key={i} delay={i * 150}>
                <div className="bg-bg-card p-6 rounded-xl border border-border-main shadow-sm hover:shadow-lg transition-all duration-300 h-full group">
                  <h3 className="text-lg font-bold text-text-main mb-3 flex items-start gap-3 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                     <div className="mt-1.5 w-2 h-2 rounded-full bg-secondary flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                     {faq.q}
                  </h3>
                  <p className="text-text-sub font-medium pl-5">{faq.a}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;