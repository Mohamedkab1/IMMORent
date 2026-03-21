import React from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  HeartIcon,
  ScaleIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* À propos */}
          <div className="footer-section">
            <h3 className="footer-title">ImmoGest</h3>
            <p className="footer-description">
              Plateforme de gestion immobilière et location en ligne. 
              Trouvez votre prochain logement ou gérez vos biens en toute simplicité.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-section">
            <h3 className="footer-title">Navigation</h3>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/properties">Biens immobiliers</Link></li>
              <li><Link to="/about">À propos</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-links">
              <li><Link to="/properties?type=apartment">Appartements</Link></li>
              <li><Link to="/properties?type=house">Maisons</Link></li>
              <li><Link to="/properties?type=commercial">Locaux commerciaux</Link></li>
              <li><Link to="/properties?type=land">Terrains</Link></li>
              <li><Link to="/properties?type=studio">Studios</Link></li>
            </ul>
          </div>

          {/* Informations légales */}
          <div className="footer-section">
            <h3 className="footer-title">Informations légales</h3>
            <ul className="footer-links">
              <li>
                <Link to="/mentions-legales">
                  <ScaleIcon className="link-icon" />
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/confidentialite">
                  <ShieldCheckIcon className="link-icon" />
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cgv">
                  <DocumentTextIcon className="link-icon" />
                  CGV
                </Link>
              </li>
              <li>
                <Link to="/cookies">
                  <HeartIcon className="link-icon" />
                  Gestion des cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <div className="contact-item">
            <MapPinIcon className="contact-icon" />
            <span>123 rue de l'Immobilier, 75001 Paris, France</span>
          </div>
          <div className="contact-item">
            <PhoneIcon className="contact-icon" />
            <span>+33 1 23 45 67 89</span>
          </div>
          <div className="contact-item">
            <EnvelopeIcon className="contact-icon" />
            <span>contact@immogest.com</span>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3 className="newsletter-title">Restez informé</h3>
          <p className="newsletter-text">
            Inscrivez-vous à notre newsletter pour recevoir les dernières annonces
          </p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Votre email" 
              className="newsletter-input"
              aria-label="Adresse email"
            />
            <button type="submit" className="newsletter-button">
              S'abonner
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} ImmoGest. Tous droits réservés. 
            Conçu et développé avec ❤️ pour l'immobilier.
          </p>
          <div className="footer-bottom-links">
            <Link to="/plan-du-site">Plan du site</Link>
            <span className="separator">•</span>
            <Link to="/mentions-legales">Mentions légales</Link>
            <span className="separator">•</span>
            <Link to="/confidentialite">Confidentialité</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: #0f172a;
          color: #f8fafc;
          padding: 60px 0 20px;
          margin-top: 60px;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .footer-title {
          color: #f8fafc;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 40px;
          height: 2px;
          background: #2563eb;
        }

        .footer-description {
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .footer-social {
          display: flex;
          gap: 15px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: #1e2937;
          border-radius: 50%;
          color: #94a3b8;
          transition: all 0.3s;
        }

        .social-link:hover {
          background: #2563eb;
          color: white;
          transform: translateY(-3px);
        }

        .social-icon {
          width: 18px;
          height: 18px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-links a:hover {
          color: #2563eb;
        }

        .link-icon {
          width: 16px;
          height: 16px;
        }

        .footer-contact {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px 0;
          border-top: 1px solid #1e2937;
          border-bottom: 1px solid #1e2937;
          margin-bottom: 30px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #94a3b8;
          font-size: 14px;
        }

        .contact-icon {
          width: 18px;
          height: 18px;
          color: #2563eb;
        }

        .footer-newsletter {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px;
          background: #1e2937;
          border-radius: 10px;
        }

        .newsletter-title {
          color: #f8fafc;
          font-size: 20px;
          margin-bottom: 10px;
        }

        .newsletter-text {
          color: #94a3b8;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .newsletter-form {
          display: flex;
          max-width: 400px;
          margin: 0 auto;
          gap: 10px;
        }

        .newsletter-input {
          flex: 1;
          padding: 12px 15px;
          border: 1px solid #334155;
          border-radius: 5px;
          background: #0f172a;
          color: #f8fafc;
          font-size: 14px;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #2563eb;
        }

        .newsletter-input::placeholder {
          color: #64748b;
        }

        .newsletter-button {
          padding: 12px 25px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
          white-space: nowrap;
        }

        .newsletter-button:hover {
          background: #1d4ed8;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          color: #64748b;
          font-size: 13px;
        }

        .copyright {
          margin: 0;
        }

        .footer-bottom-links {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .footer-bottom-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-bottom-links a:hover {
          color: #2563eb;
        }

        .separator {
          color: #475569;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-contact {
            flex-wrap: wrap;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }

          .footer-contact {
            flex-direction: column;
            align-items: flex-start;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }

          .footer-bottom-links {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;