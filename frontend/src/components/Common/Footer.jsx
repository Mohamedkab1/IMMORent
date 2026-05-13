import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  
  const isAuthPage = ['/login', '/register', '/register/role'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <footer className="bg-gradient-to-r from-[#050a1f] via-[#0a1a1a] to-[#050a1f] text-white py-8 border-t border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-tighter">
              IMMO<span className="opacity-50">Rent</span>
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
              &copy; {currentYear} IMMORent Maroc.
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/mentions-legales" className="text-[10px] text-gray-400 hover:text-white uppercase tracking-[0.2em] font-bold transition-colors">{t('footer.legalMentions')}</Link>
            <Link to="/confidentialite" className="text-[10px] text-gray-400 hover:text-white uppercase tracking-[0.2em] font-bold transition-colors">{t('footer.privacy')}</Link>
            <Link to="/contact" className="text-[10px] text-gray-400 hover:text-white uppercase tracking-[0.2em] font-bold transition-colors">{t('nav.contact')}</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-bg-main text-white py-12 border-t border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="space-y-8">
            <div className="text-3xl font-bold tracking-tighter">
              IMMO<span className="opacity-50">Rent</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-light max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {[
                { label: 'FB', icon: 'facebook' },
                { label: 'TW', icon: 'twitter' },
                { label: 'IG', icon: 'instagram' }
              ].map((social) => (
                <a key={social.label} href="#" className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-xs font-black hover:bg-white hover:text-[#0a1a1a] transition-all border border-white/10 uppercase tracking-widest">
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">{t('nav.navigation', 'Navigation')}</h4>
            <ul className="space-y-4">
              {['home', 'properties', 'about', 'contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item === 'home' ? '' : item}`} className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-[11px]">
                    {t(`nav.${item}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services / Categories */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">{t('footer.services')}</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/properties?type=apartment" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">{t('home.apartments')}</Link></li>
              <li><Link to="/properties?type=house" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">{t('home.houses')}</Link></li>
              <li><Link to="/properties?type=commercial" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">{t('home.commercial')}</Link></li>
              <li><Link to="/properties?type=land" className="hover:text-white transition-colors uppercase tracking-widest text-[11px]">{t('home.lands')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">{t('nav.contact')}</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <MapPinIcon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-400 leading-relaxed font-light">{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <PhoneIcon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-400 font-light">{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-400 font-light">{t('footer.email')}</span>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
            &copy; {currentYear} IMMORent Maroc. {t('footer.rights')}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <Link to="/mentions-legales" className="text-[10px] text-gray-500 hover:text-white uppercase tracking-[0.2em] font-bold transition-colors">{t('footer.legalMentions')}</Link>
            <Link to="/confidentialite" className="text-[10px] text-gray-500 hover:text-white uppercase tracking-[0.2em] font-bold transition-colors">{t('footer.privacy')}</Link>
            <div className="w-px h-6 bg-white/10 hidden md:block"></div>
            <div className="text-white text-3xl font-bold tracking-tighter">
              IMMO<span className="opacity-50">Rent</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;