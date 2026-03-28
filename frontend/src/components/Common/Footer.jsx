import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/IMMORent.jpeg';  // ← Chemin corrigé

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="immorent-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <div className="footer-logo">
                <img 
                  src={logo} 
                  alt="IMMORent Logo" 
                  className="footer-logo-image"
                />
                <h3 className="footer-title">IMMORent</h3>
              </div>
              <p className="footer-description">
                Plateforme de gestion immobilière et location en ligne au Maroc.
                Trouvez votre prochain logement à Marrakech ou gérez vos biens en toute simplicité.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">📘</a>
                <a href="#" className="social-link" aria-label="Twitter">🐦</a>
                <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
                <a href="#" className="social-link" aria-label="Instagram">📷</a>
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
                <li><Link to="/properties?type=house">Maisons / Riads</Link></li>
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
            <div className="contact-item">📍 Avenue Mohammed VI, Guéliz, Marrakech 40000, Maroc</div>
            <div className="contact-item">📞 +212 5 24 12 34 56</div>
            <div className="contact-item">✉️ contact@immorent.ma</div>
            <div className="contact-item">🕒 Lun-Ven: 9h-18h | Sam: 9h-13h</div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {currentYear} IMMORent Maroc. Tous droits réservés.</p>
            <div className="footer-bottom-links">
              <Link to="/plan-du-site">Plan du site</Link>
              <span className="separator">•</span>
              <Link to="/mentions-legales">Mentions légales</Link>
              <span className="separator">•</span>
              <Link to="/contact">Nous contacter</Link>
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

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .footer-logo-image {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .footer-title {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .footer-logo .footer-title {
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .footer-logo .footer-title::after {
          display: none;
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
          flex-wrap: wrap;
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
          transform: translateY(-2px);
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
          padding-left: 0.25rem;
        }

        .footer-contact {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
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
          transition: color 0.3s ease;
        }

        .contact-item:hover {
          color: #d4af37;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-bottom-links {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .footer-bottom-links a {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.3s ease;
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
            gap: 1.5rem;
          }

          .footer-contact {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }

          .footer-bottom-links {
            justify-content: center;
          }

          .footer-logo-image {
            width: 35px;
            height: 35px;
          }
        }

        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          
          .footer-contact {
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;