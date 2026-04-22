import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import logo from '../../assets/IMMORent.jpeg';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--card-bg)] border-t border-[var(--border-color)] text-[var(--text-muted)] pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="IMMORent Logo" className="w-10 h-10 object-cover rounded-xl shadow-sm" />
              <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">IMMORent</h3>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-muted)]">
              {t('footer.description')}
            </p>
            <div className="flex gap-4 rtl:gap-reverse">
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-muted)] hover:bg-secondary hover:text-primary transition-all shadow-sm">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-muted)] hover:bg-secondary hover:text-primary transition-all shadow-sm">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-muted)] hover:bg-secondary hover:text-primary transition-all shadow-sm">
                <span className="sr-only">LinkedIn</span>
                <BuildingOfficeIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-muted)] hover:bg-secondary hover:text-primary transition-all shadow-sm">
                <span className="sr-only">Instagram</span>
                📷
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[var(--text-main)] font-bold mb-6 relative inline-block">
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
             <h3 className="text-[var(--text-main)] font-bold mb-6 relative inline-block">
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
             <h3 className="text-[var(--text-main)] font-bold mb-6 relative inline-block">
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
        <div className="py-8 border-y border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3 text-sm group">
            <div className="p-2 rounded-lg bg-[var(--bg-muted)] text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors"><MapPinIcon className="w-5 h-5" /></div>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">{t('footer.address')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm group">
            <div className="p-2 rounded-lg bg-[var(--bg-muted)] text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors"><PhoneIcon className="w-5 h-5" /></div>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">{t('footer.phone')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm group">
            <div className="p-2 rounded-lg bg-[var(--bg-muted)] text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors"><EnvelopeIcon className="w-5 h-5" /></div>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">{t('footer.email')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm group">
            <div className="p-2 rounded-lg bg-[var(--bg-muted)] text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors"><ClockIcon className="w-5 h-5" /></div>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">{t('footer.hours')}</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)]">
          <p>&copy; {currentYear} IMMORent Maroc. {t('footer.rights')}</p>
          <div className="flex flex-wrap items-center gap-4 rtl:gap-reverse">
            <Link to="/plan-du-site" className="hover:text-[var(--text-main)] transition-colors">{t('footer.siteMap')}</Link>
            <span className="w-1 h-1 rounded-full bg-[var(--border-color)] block"></span>
            <Link to="/mentions-legales" className="hover:text-[var(--text-main)] transition-colors">{t('footer.legalMentions')}</Link>
            <span className="w-1 h-1 rounded-full bg-[var(--border-color)] block"></span>
            <Link to="/contact" className="hover:text-[var(--text-main)] transition-colors">{t('footer.contactUs')}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;