import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import logo from '../../assets/IMMORent.jpeg';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary dark:bg-slate-900 border-t border-slate-800 text-slate-300 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="IMMORent Logo" className="w-10 h-10 object-cover rounded-xl shadow-sm" />
              <h3 className="text-xl font-bold text-white tracking-tight">IMMORent</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {t('footer.description')}
            </p>
            <div className="flex gap-4 rtl:gap-reverse">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-secondary hover:text-primary transition-all shadow-sm group">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-secondary hover:text-primary transition-all shadow-sm group">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-secondary hover:text-primary transition-all shadow-sm group">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-secondary hover:text-primary transition-all shadow-sm group">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 relative inline-block">
              {t('footer.quickLinks')}
              <span className="absolute -bottom-2 left-0 rtl:left-auto rtl:right-0 w-10 h-1 bg-secondary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('nav.home')}</Link></li>
              <li><Link to="/properties" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('nav.properties')}</Link></li>
              <li><Link to="/about" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
             <h3 className="text-white font-bold mb-6 relative inline-block">
              {t('footer.services')}
              <span className="absolute -bottom-2 left-0 rtl:left-auto rtl:right-0 w-10 h-1 bg-secondary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/properties?type=apartment" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('home.apartments')}</Link></li>
              <li><Link to="/properties?type=house" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('home.houses')}</Link></li>
              <li><Link to="/properties?type=commercial" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('home.commercial')}</Link></li>
              <li><Link to="/properties?type=land" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('home.lands')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
             <h3 className="text-white font-bold mb-6 relative inline-block">
              {t('footer.legal')}
              <span className="absolute -bottom-2 left-0 rtl:left-auto rtl:right-0 w-10 h-1 bg-secondary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link to="/mentions-legales" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('footer.legalMentions')}</Link></li>
              <li><Link to="/confidentialite" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('footer.privacy')}</Link></li>
              <li><Link to="/cgv" className="text-sm hover:text-secondary hover:ps-1 rtl:hover:ps-0 rtl:hover:pe-1 transition-all">{t('footer.terms')}</Link></li>
            </ul>
          </div>
          
        </div>

        {/* Contact Info Bar */}
        <div className="py-8 border-y border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3 text-sm group">
            <div className="p-2 rounded-lg bg-slate-800/50 text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors"><MapPinIcon className="w-5 h-5" /></div>
            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{t('footer.address')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm group">
            <div className="p-2 rounded-lg bg-slate-800/50 text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors"><PhoneIcon className="w-5 h-5" /></div>
            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{t('footer.phone')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm group">
            <div className="p-2 rounded-lg bg-slate-800/50 text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors"><EnvelopeIcon className="w-5 h-5" /></div>
            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{t('footer.email')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm group">
            <div className="p-2 rounded-lg bg-slate-800/50 text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors"><ClockIcon className="w-5 h-5" /></div>
            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{t('footer.hours')}</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} IMMORent Maroc. {t('footer.rights')}</p>
          <div className="flex flex-wrap items-center gap-4 rtl:gap-reverse">
            <Link to="/plan-du-site" className="hover:text-white transition-colors">{t('footer.siteMap')}</Link>
            <span className="w-1 h-1 rounded-full bg-slate-700 block"></span>
            <Link to="/mentions-legales" className="hover:text-white transition-colors">{t('footer.legalMentions')}</Link>
            <span className="w-1 h-1 rounded-full bg-slate-700 block"></span>
            <Link to="/contact" className="hover:text-white transition-colors">{t('footer.contactUs')}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;