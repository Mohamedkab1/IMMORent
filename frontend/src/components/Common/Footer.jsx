import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState(null);
  
  const isAuthPage = ['/login', '/register', '/register/role'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <footer className="relative bg-gradient-to-r from-[#050a1f] via-[#0a1a1a] to-[#050a1f] text-white pt-16 pb-8 transition-colors duration-300">
        {/* Top Fade Transition */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-bg-soft to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-tighter">
              IMMO<span className="text-yellow-400">Rent</span>
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
              &copy; {currentYear} IMMORent Maroc.
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/mentions-legales" className="text-[10px] text-gray-400 hover:text-yellow-400 uppercase tracking-[0.2em] font-bold transition-colors">{t('footer.legalMentions')}</Link>
            <Link to="/confidentialite" className="text-[10px] text-gray-400 hover:text-yellow-400 uppercase tracking-[0.2em] font-bold transition-colors">{t('footer.privacy')}</Link>
            <Link to="/cgv" className="text-[10px] text-gray-400 hover:text-yellow-400 uppercase tracking-[0.2em] font-bold transition-colors">{t('footer.cgv', 'CGV')}</Link>
            <Link to="/contact" className="text-[10px] text-gray-400 hover:text-yellow-400 uppercase tracking-[0.2em] font-bold transition-colors">{t('nav.contact')}</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative bg-bg-main text-white pt-24 pb-12 transition-colors duration-300">
      {/* Top Fade Transition */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-soft to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="space-y-8">
            <div className="text-3xl font-bold tracking-tighter">
              IMMO<span className="text-yellow-400">Rent</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-light max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-[#0a1a1a] transition-all border border-white/10" title="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-[#0a1a1a] transition-all border border-white/10" title="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.92H5.078z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-[#0a1a1a] transition-all border border-white/10" title="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">{t('nav.navigation', 'Navigation')}</h4>
            <ul className="space-y-4">
              {['home', 'properties', 'about', 'contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item === 'home' ? '' : item}`} 
                    onMouseEnter={() => setHoveredLink(item)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="relative inline-block py-1 text-sm font-medium text-gray-400 hover:text-yellow-400 transition-colors uppercase tracking-widest text-[11px]"
                  >
                    {t(`nav.${item}`)}
                    {hoveredLink === item && (
                      <motion.div
                        layoutId="footerNavHoverIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services / Categories */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">{t('footer.services')}</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/properties?type=apartment" className="hover:text-yellow-400 transition-colors uppercase tracking-widest text-[11px]">{t('home.apartments')}</Link></li>
              <li><Link to="/properties?type=house" className="hover:text-yellow-400 transition-colors uppercase tracking-widest text-[11px]">{t('home.houses')}</Link></li>
              <li><Link to="/properties?type=commercial" className="hover:text-yellow-400 transition-colors uppercase tracking-widest text-[11px]">{t('home.commercial')}</Link></li>
              <li><Link to="/properties?type=land" className="hover:text-yellow-400 transition-colors uppercase tracking-widest text-[11px]">{t('home.lands')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">{t('nav.contact')}</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <MapPinIcon className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                <span className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-white transition-colors">{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <PhoneIcon className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                <span className="text-sm text-gray-400 font-light group-hover:text-white transition-colors">{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                <span className="text-sm text-gray-400 font-light group-hover:text-white transition-colors">{t('footer.email')}</span>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
            &copy; {currentYear} IMMORent Maroc. {t('footer.rights')}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <Link to="/mentions-legales" className="text-[10px] text-gray-500 hover:text-yellow-400 uppercase tracking-[0.2em] font-bold transition-colors">{t('footer.legalMentions')}</Link>
            <Link to="/confidentialite" className="text-[10px] text-gray-500 hover:text-yellow-400 uppercase tracking-[0.2em] font-bold transition-colors">{t('footer.privacy')}</Link>
            <Link to="/cgv" className="text-[10px] text-gray-500 hover:text-yellow-400 uppercase tracking-[0.2em] font-bold transition-colors">{t('footer.cgv', 'CGV')}</Link>
            <div className="w-px h-6 bg-white/10 hidden md:block"></div>
            <div className="text-white text-3xl font-bold tracking-tighter">
              IMMO<span className="text-yellow-400">Rent</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;