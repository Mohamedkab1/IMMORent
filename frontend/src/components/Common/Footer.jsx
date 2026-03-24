import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="immorent-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3 className="footer-title">IMMORent</h3>
              <p className="footer-description">
                Plateforme de gestion immobilière et location en ligne.
                Trouvez votre prochain logement ou gérez vos biens en toute simplicité.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">📘</a>
                <a href="#" className="social-link" aria-label="Twitter">🐦</a>
                <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
              </div>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Liens rapides</h3>
              <ul className="footer-links">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/properties">Biens immobiliers</Link></li>
                <li><Link to="/about">À propos</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Services</h3>
              <ul className="footer-links">
                <li><Link to="/properties?type=apartment">Appartements</Link></li>
                <li><Link to="/properties?type=house">Maisons</Link></li>
                <li><Link to="/properties?type=commercial">Locaux commerciaux</Link></li>
                <li><Link to="/properties?type=land">Terrains</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Informations légales</h3>
              <ul className="footer-links">
                <li><Link to="/mentions-legales">Mentions légales</Link></li>
                <li><Link to="/confidentialite">Confidentialité</Link></li>
                <li><Link to="/cgv">CGV</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-contact">
            <div className="contact-item">📍 123 rue de l'Immobilier, 75001 Paris</div>
            <div className="contact-item">📞 +33 1 23 45 67 89</div>
            <div className="contact-item">✉️ contact@immorent.com</div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {currentYear} IMMORent. Tous droits réservés.</p>
            <div className="footer-bottom-links">
              <Link to="/plan-du-site">Plan du site</Link>
              <span className="separator">•</span>
              <Link to="/mentions-legales">Mentions légales</Link>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .immorent-footer {
          background-color: #0f2b4d;
          color: #9ca3af;
          padding: 3rem 0 1.5rem;
          margin-top: 3rem;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-title {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: #d4af37;
        }

        .footer-description {
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .footer-social {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          background-color: #1e4a6e;
          border-radius: 0.5rem;
          color: #9ca3af;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .social-link:hover {
          background-color: #d4af37;
          color: #0f2b4d;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: white;
        }

        .footer-contact {
          display: flex;
          justify-content: space-between;
          padding: 1.5rem 0;
          border-top: 1px solid #1e4a6e;
          border-bottom: 1px solid #1e4a6e;
          margin-bottom: 1.5rem;
        }

        .contact-item {
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
        }

        .footer-bottom-links {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .footer-bottom-links a {
          color: #9ca3af;
          text-decoration: none;
        }

        .footer-bottom-links a:hover {
          color: white;
        }

        .separator {
          color: #4b5563;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-contact {
            flex-direction: column;
            gap: 0.75rem;
            align-items: center;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;