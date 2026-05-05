import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, CheckCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

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
      <div className="bg-gradient-to-br from-primary via-primary-hover to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 py-20 px-4 text-center border-b border-primary/20 dark:border-slate-800 relative z-10 overflow-hidden">
        {/* Abstract Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 text-white" width="600" height="600" fill="currentColor" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
            {t('contact.hero.title_p1')}<span className="text-secondary">{t('contact.hero.title_p2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto drop-shadow-sm">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: MapPinIcon, title: t('contact.info.address.title'), line1: t('contact.info.address.l1'), line2: t('contact.info.address.l2'), note: null },
            { icon: PhoneIcon, title: t('contact.info.phone.title'), line1: '+212 5 24 12 34 56', line2: '+212 6 00 00 00 00', note: t('contact.info.phone.note') },
            { icon: EnvelopeIcon, title: t('contact.info.email.title'), line1: 'contact@immorent.ma', line2: 'support@immorent.ma', note: t('contact.info.email.note') },
            { icon: ClockIcon, title: t('contact.info.hours.title'), line1: t('contact.info.hours.l1'), line2: t('contact.info.hours.l2'), note: t('contact.info.hours.note') }
          ].map((info, i) => (
            <div key={i} className="bg-bg-card p-6 rounded-3xl shadow-sm border border-border-main text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-primary/10 dark:bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                <info.icon className="w-8 h-8 text-primary dark:text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-3">{info.title}</h3>
              <p className="text-text-sub text-sm leading-relaxed font-medium">
                {info.line1} <br /> {info.line2}
              </p>
              {info.note && <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-4">{info.note}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          
          {/* Form */}
          <div className="bg-bg-card p-8 md:p-12 rounded-3xl shadow-sm border border-border-main relative overflow-hidden">
             
             {/* Decorative blob */}
             <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl rounded-full"></div>

             <h2 className="text-3xl font-extrabold text-text-main mb-2 relative z-10">{t('contact.form.title')}</h2>
             <p className="text-text-sub mb-8 relative z-10">{t('contact.form.subtitle')}</p>
             
             {submitted ? (
               <div className="flex flex-col items-center justify-center py-12 text-center relative z-10 animate-fade-in-up">
                 <CheckCircleIcon className="w-20 h-20 text-green-500 mb-6" />
                 <h3 className="text-2xl font-bold text-text-main mb-4">{t('contact.form.success.title')}</h3>
                 <p className="text-text-sub mb-8 max-w-sm">{t('contact.form.success.desc')}</p>
                 <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-text-main text-bg-card hover:opacity-90 rounded-xl font-bold transition-colors">
                   {t('contact.form.success.btn')}
                 </button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-sub">{t('contact.form.label.name')} <span className="text-rose-500">*</span></label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder={t('contact.form.placeholder.name')} className="w-full px-4 py-3 bg-bg-soft border appearance-none outline-none border-border-main rounded-xl text-text-main font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-sub">{t('contact.form.label.email')} <span className="text-rose-500">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder={t('contact.form.placeholder.email')} className="w-full px-4 py-3 bg-bg-soft border appearance-none outline-none border-border-main rounded-xl text-text-main font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-sub">{t('contact.form.label.phone')}</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="06 00 00 00 00" className="w-full px-4 py-3 bg-bg-soft border appearance-none outline-none border-border-main rounded-xl text-text-main font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-sub">{t('contact.form.label.subject')} <span className="text-rose-500">*</span></label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 bg-bg-soft border outline-none border-border-main rounded-xl text-text-main font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer">
                       <option value="">{t('contact.form.subject.placeholder')}</option>
                       <option value="info">{t('contact.form.subject.opt1')}</option>
                       <option value="support">{t('contact.form.subject.opt2')}</option>
                       <option value="partnership">{t('contact.form.subject.opt3')}</option>
                       <option value="claim">{t('contact.form.subject.opt4')}</option>
                       <option value="visit">{t('contact.form.subject.opt5')}</option>
                     </select>
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-text-sub">{t('contact.form.label.message')} <span className="text-rose-500">*</span></label>
                   <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required placeholder={t('contact.form.placeholder.message')} className="w-full px-4 py-3 bg-bg-soft border appearance-none outline-none border-border-main rounded-xl text-text-main font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y" />
                 </div>

                 <div className="flex items-start gap-3 mt-4">
                   <input type="checkbox" id="consent" required className="mt-1 w-5 h-5 rounded border-border-main text-primary focus:ring-primary transition-colors bg-bg-soft" />
                   <label htmlFor="consent" className="text-sm text-text-sub font-medium">
                     {t('contact.form.consent')}
                   </label>
                 </div>

                 <button type="submit" disabled={submitting} className="w-full py-4 bg-primary text-white hover:bg-primary-hover active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-bold shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 mt-4">
                   {submitting && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                   {submitting ? t('contact.form.submitting') : <><PaperAirplaneIcon className="w-5 h-5" /> {t('contact.form.submit')}</>}
                 </button>
               </form>
             )}
          </div>

          {/* Map */}
          <div className="h-[400px] lg:h-full min-h-[500px] w-full rounded-3xl overflow-hidden shadow-sm border border-border-main relative group">
            {/* Map Placeholder or Google maps Embed */}
            <div className="absolute inset-0 bg-bg-soft animate-pulse pointer-events-none -z-10"></div>
            <iframe 
              title="Carte localisation agence Marrakech"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217009.8920852963!2d-8.04298672152276!3d31.646783331007564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakech%2C%20Maroc!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              className="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 z-10 relative"
            />
          </div>
          
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-text-main inline-block relative mb-12">
            {t('contact.faq.title')}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-secondary rounded-full"></div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
            {[
              { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
              { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
              { q: t('contact.faq.q3'), a: t('contact.faq.a3') },
              { q: t('contact.faq.q4'), a: t('contact.faq.a4') }
            ].map((faq, i) => (
              <div key={i} className="bg-bg-card p-6 rounded-2xl border border-border-main shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-text-main mb-3 flex items-start gap-3">
                   <div className="mt-1 w-2 h-2 rounded-full bg-secondary flex-shrink-0"></div>
                   {faq.q}
                </h3>
                <p className="text-text-sub font-medium pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;