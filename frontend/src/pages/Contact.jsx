import React, { useState } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Message envoyé avec succès !');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Réinitialiser l'état de succès après 5 secondes
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-content">
          <h1>Contactez-nous</h1>
          <p>Notre équipe est à votre disposition pour répondre à toutes vos questions</p>
        </div>
      </div>

      <div className="contact-container">
        {/* Informations de contact */}
        <div className="contact-info-grid">
          <div className="info-card">
            <div className="info-icon">
              <MapPinIcon className="h-6 w-6" />
            </div>
            <h3>Adresse</h3>
            <p>123 rue de l'Immobilier<br />75001 Paris, France</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <PhoneIcon className="h-6 w-6" />
            </div>
            <h3>Téléphone</h3>
            <p>+33 1 23 45 67 89</p>
            <p className="info-note">Lun-Ven, 9h-18h</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <EnvelopeIcon className="h-6 w-6" />
            </div>
            <h3>Email</h3>
            <p>contact@immogest.com</p>
            <p>support@immogest.com</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <ClockIcon className="h-6 w-6" />
            </div>
            <h3>Horaires</h3>
            <p>Lundi - Vendredi : 9h - 18h</p>
            <p>Samedi : 10h - 16h</p>
            <p className="info-note">Dimanche : Fermé</p>
          </div>
        </div>

        {/* Formulaire de contact et carte */}
        <div className="contact-main">
          <div className="contact-form-container">
            <h2>Envoyez-nous un message</h2>
            
            {submitted ? (
              <div className="success-message">
                <CheckCircleIcon className="h-16 w-16 text-green-500" />
                <h3>Message envoyé !</h3>
                <p>Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="btn-new-message"
                >
                  Envoyer un nouveau message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      <UserIcon className="h-4 w-4" />
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <EnvelopeIcon className="h-4 w-4" />
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="jean.dupont@email.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">
                      <PhoneIcon className="h-4 w-4" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="info">Demande d'information</option>
                      <option value="support">Support technique</option>
                      <option value="partnership">Partenariat</option>
                      <option value="claim">Réclamation</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Votre message..."
                  />
                </div>

                <div className="form-checkbox">
                  <input type="checkbox" id="consent" required />
                  <label htmlFor="consent">
                    J'accepte que mes données soient traitées conformément à la{' '}
                    <a href="/confidentialite">politique de confidentialité</a>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>

          <div className="map-container">
            <iframe
              title="Carte Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.874102318142!2d2.335455315674362!3d48.86061107928789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671d877937b0f%3A0xb975fcfa192f84d4!2sMus%C3%A9e%20du%20Louvre!5e0!3m2!1sfr!2sfr!4v1645567890123!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Questions fréquentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Comment puis-je créer un compte ?</h3>
              <p>Cliquez sur le bouton "Inscription" en haut à droite de la page et remplissez le formulaire. C'est gratuit et simple !</p>
            </div>
            <div className="faq-item">
              <h3>Comment faire une demande de location ?</h3>
              <p>Connectez-vous à votre compte, trouvez le bien qui vous intéresse et cliquez sur "Faire une demande de location".</p>
            </div>
            <div className="faq-item">
              <h3>Les paiements sont-ils sécurisés ?</h3>
              <p>Oui, tous les paiements sont traités de manière sécurisée via des plateformes certifiées.</p>
            </div>
            <div className="faq-item">
              <h3>Comment contacter un agent ?</h3>
              <p>Sur chaque fiche de bien, vous trouverez les coordonnées de l'agent en charge. Vous pouvez aussi utiliser notre formulaire de contact.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
        }

        .contact-hero {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .hero-content p {
          font-size: 20px;
          opacity: 0.9;
        }

        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          margin-bottom: 60px;
        }

        .info-card {
          background: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .info-icon {
          width: 60px;
          height: 60px;
          background: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #2563eb;
        }

        .info-card h3 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .info-card p {
          color: #6b7280;
          line-height: 1.6;
        }

        .info-note {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 5px;
        }

        .contact-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 60px;
        }

        .contact-form-container {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .contact-form-container h2 {
          color: #1f2937;
          font-size: 24px;
          margin-bottom: 30px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #374151;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 16px;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0;
        }

        .form-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .form-checkbox label {
          color: #4b5563;
          font-size: 14px;
        }

        .form-checkbox a {
          color: #2563eb;
          text-decoration: none;
        }

        .form-checkbox a:hover {
          text-decoration: underline;
        }

        .btn-submit {
          width: 100%;
          padding: 14px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-submit:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .success-message {
          text-align: center;
          padding: 40px;
        }

        .success-message h3 {
          color: #1f2937;
          font-size: 24px;
          margin: 20px 0 10px;
        }

        .success-message p {
          color: #6b7280;
          margin-bottom: 30px;
        }

        .btn-new-message {
          padding: 12px 30px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
        }

        .map-container {
          height: 100%;
          min-height: 500px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .faq-section {
          background: white;
          padding: 60px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .faq-section h2 {
          color: #1f2937;
          font-size: 32px;
          text-align: center;
          margin-bottom: 40px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }

        .faq-item {
          padding: 20px;
          background: #f9fafb;
          border-radius: 5px;
        }

        .faq-item h3 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .faq-item p {
          color: #6b7280;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .contact-info-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 36px;
          }

          .hero-content p {
            font-size: 18px;
          }

          .contact-main {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .contact-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;