import React from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '60px 0 30px',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* À propos */}
          <div>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '20px',
              color: '#f3f4f6'
            }}>ImmoGest</h3>
            <p style={{
              color: '#9ca3af',
              lineHeight: '1.6'
            }}>
              Plateforme de gestion immobilière et location en ligne. 
              Trouvez votre prochain logement ou gérez vos biens en toute simplicité.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '20px',
              color: '#f3f4f6'
            }}>Liens rapides</h3>
            <ul style={{
              listStyle: 'none',
              padding: 0
            }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px'
                }} onMouseEnter={(e) => e.target.style.color = 'white'}
                   onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Accueil
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/properties" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px'
                }} onMouseEnter={(e) => e.target.style.color = 'white'}
                   onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Biens disponibles
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/about" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px'
                }} onMouseEnter={(e) => e.target.style.color = 'white'}
                   onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  À propos
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/contact" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px'
                }} onMouseEnter={(e) => e.target.style.color = 'white'}
                   onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '20px',
              color: '#f3f4f6'
            }}>Contact</h3>
            <ul style={{
              listStyle: 'none',
              padding: 0
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#9ca3af',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                <EnvelopeIcon style={{ width: '20px', height: '20px' }} />
                <span>contact@immogest.com</span>
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#9ca3af',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                <PhoneIcon style={{ width: '20px', height: '20px' }} />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#9ca3af',
                fontSize: '14px'
              }}>
                <MapPinIcon style={{ width: '20px', height: '20px' }} />
                <span>123 rue de l'Immobilier<br />75001 Paris, France</span>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 style={{
              fontSize: '18px',
              marginBottom: '20px',
              color: '#f3f4f6'
            }}>Légal</h3>
            <ul style={{
              listStyle: 'none',
              padding: 0
            }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/mentions-legales" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px'
                }} onMouseEnter={(e) => e.target.style.color = 'white'}
                   onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Mentions légales
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/confidentialite" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px'
                }} onMouseEnter={(e) => e.target.style.color = 'white'}
                   onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Politique de confidentialité
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/cgv" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px'
                }} onMouseEnter={(e) => e.target.style.color = 'white'}
                   onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Conditions générales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '30px',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            &copy; {currentYear} ImmoGest. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;