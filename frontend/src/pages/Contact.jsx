import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
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
      toast.success('Message envoyé avec succès !');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <>
      <div className="contact-page">
        <div className="contact-hero">
          <div className="hero-content">
            <h1>Contactez-nous</h1>
            <p>Notre équipe est à votre disposition pour répondre à toutes vos questions à Marrakech</p>
          </div>
        </div>

        <div className="contact-container">
          <div className="contact-info-grid">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Adresse</h3>
              <p>Avenue Mohammed VI, Guéliz<br />Marrakech 40000, Maroc</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Téléphone</h3>
              <p>+212 5 24 12 34 56</p>
              <p className="info-note">Lun-Ven, 9h-18h</p>
            </div>
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>Email</h3>
              <p>contact@immorent.ma</p>
              <p>support@immorent.ma</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🕐</div>
              <h3>Horaires</h3>
              <p>Lundi - Jeudi : 9h - 18h</p>
              <p>Vendredi : 9h - 13h | 15h - 18h</p>
              <p>Samedi : 10h - 14h</p>
              <p className="info-note">Dimanche : Fermé</p>
            </div>
          </div>

          <div className="contact-main">
            <div className="contact-form-container">
              <h2>Envoyez-nous un message</h2>
              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Message envoyé !</h3>
                  <p>Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-new">Nouveau message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nom complet *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="06 12 34 56 78" />
                    </div>
                    <div className="form-group">
                      <label>Sujet *</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required>
                        <option value="">Sélectionnez un sujet</option>
                        <option value="info">Demande d'information</option>
                        <option value="support">Support technique</option>
                        <option value="partnership">Partenariat</option>
                        <option value="claim">Réclamation</option>
                        <option value="visit">Demande de visite</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required placeholder="Votre message..." />
                  </div>
                  <div className="form-checkbox">
                    <input type="checkbox" id="consent" required />
                    <label htmlFor="consent">J'accepte que mes données soient traitées conformément à la <a href="/confidentialite">politique de confidentialité</a></label>
                  </div>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Envoi...' : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </div>
            <div className="map-container">
              <iframe 
                title="Carte Marrakech"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217009.8920852963!2d-8.04298672152276!3d31.646783331007564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakech%2C%20Maroc!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
              />
            </div>
          </div>

          <div className="faq-section">
            <h2>Questions fréquentes</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Comment créer un compte ?</h3>
                <p>Cliquez sur "Inscription" en haut à droite et remplissez le formulaire avec vos informations.</p>
              </div>
              <div className="faq-item">
                <h3>Comment faire une demande de location ?</h3>
                <p>Connectez-vous, trouvez le bien à Marrakech et cliquez sur "Faire une demande".</p>
              </div>
              <div className="faq-item">
                <h3>Les paiements sont-ils sécurisés ?</h3>
                <p>Oui, tous les paiements sont traités de manière sécurisée via notre partenaire HPS (Payment Center).</p>
              </div>
              <div className="faq-item">
                <h3>Comment contacter un agent ?</h3>
                <p>Sur chaque fiche de bien, vous trouverez les coordonnées de l'agent immobilier.</p>
              </div>
              <div className="faq-item">
                <h3>Proposez-vous des visites virtuelles ?</h3>
                <p>Oui, certains biens proposent des visites virtuelles. Contactez-nous pour plus d'informations.</p>
              </div>
              <div className="faq-item">
                <h3>Quels sont les quartiers disponibles ?</h3>
                <p>Nous couvrons tous les quartiers de Marrakech : Guéliz, Hivernage, Medina, Palmeraie, etc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-page { 
          min-height: calc(100vh - 70px); 
          background: #f8f9fa; 
        }

        .contact-hero { 
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%); 
          padding: 4rem 1.5rem; 
          text-align: center; 
          color: white; 
        }

        .hero-content h1 { 
          font-size: 2.5rem; 
          margin-bottom: 1rem; 
          color: white; 
        }

        .hero-content p { 
          font-size: 1.125rem; 
          opacity: 0.9; 
        }

        .contact-container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 3rem 1.5rem; 
        }

        .contact-info-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 2rem; 
          margin-bottom: 3rem; 
        }

        .info-card { 
          background: white; 
          padding: 1.5rem; 
          border-radius: 0.75rem; 
          text-align: center; 
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); 
          transition: all 0.3s; 
        }

        .info-card:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); 
        }

        .info-icon { 
          font-size: 2rem; 
          margin-bottom: 1rem; 
        }

        .info-card h3 { 
          font-size: 1.125rem; 
          color: #0f2b4d; 
          margin-bottom: 0.5rem; 
        }

        .info-card p { 
          color: #6b7280; 
          font-size: 0.875rem; 
          line-height: 1.5;
        }

        .info-note { 
          font-size: 0.75rem; 
          color: #9ca3af; 
          margin-top: 0.25rem; 
        }

        .contact-main { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 2rem; 
          margin-bottom: 3rem; 
        }

        .contact-form-container { 
          background: white; 
          padding: 2rem; 
          border-radius: 0.75rem; 
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); 
        }

        .contact-form-container h2 { 
          font-size: 1.5rem; 
          color: #0f2b4d; 
          margin-bottom: 1.5rem; 
        }

        .form-row { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 1rem; 
          margin-bottom: 1rem; 
        }

        .form-group { 
          margin-bottom: 1rem; 
        }

        .form-group label { 
          display: block; 
          margin-bottom: 0.5rem; 
          font-weight: 500; 
          color: #374151; 
          font-size: 0.875rem; 
        }

        .form-group input, 
        .form-group select, 
        .form-group textarea { 
          width: 100%; 
          padding: 0.625rem; 
          border: 1px solid #d1d5db; 
          border-radius: 0.5rem; 
          font-size: 0.875rem; 
          transition: all 0.3s;
        }

        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus { 
          outline: none; 
          border-color: #d4af37;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .form-checkbox { 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          margin: 1rem 0; 
        }

        .form-checkbox label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .form-checkbox a { 
          color: #d4af37; 
          text-decoration: none; 
        }

        .form-checkbox a:hover {
          text-decoration: underline;
        }

        .btn-submit { 
          width: 100%; 
          padding: 0.75rem; 
          background: #d4af37; 
          color: #0f2b4d; 
          border: none; 
          border-radius: 0.5rem; 
          font-weight: 600; 
          cursor: pointer; 
          transition: all 0.3s; 
          font-size: 0.875rem;
        }

        .btn-submit:hover:not(:disabled) { 
          background: #c4a52e; 
        }

        .btn-submit:disabled { 
          opacity: 0.5; 
          cursor: not-allowed; 
        }

        .success-message { 
          text-align: center; 
          padding: 2rem; 
        }

        .success-icon { 
          width: 3rem; 
          height: 3rem; 
          background: #10b981; 
          color: white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 1.5rem; 
          margin: 0 auto 1rem; 
        }

        .success-message h3 { 
          color: #0f2b4d; 
          margin-bottom: 0.5rem; 
        }

        .btn-new { 
          margin-top: 1rem; 
          padding: 0.5rem 1rem; 
          background: #d4af37; 
          border: none; 
          border-radius: 0.5rem; 
          cursor: pointer; 
          font-size: 0.875rem;
        }

        .map-container { 
          height: 100%; 
          min-height: 450px; 
          border-radius: 0.75rem; 
          overflow: hidden; 
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); 
        }

        .faq-section { 
          background: white; 
          padding: 2rem; 
          border-radius: 0.75rem; 
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); 
        }

        .faq-section h2 { 
          font-size: 1.5rem; 
          color: #0f2b4d; 
          text-align: center; 
          margin-bottom: 2rem; 
        }

        .faq-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 1.5rem; 
        }

        .faq-item { 
          padding: 1rem; 
          background: #f8f9fa; 
          border-radius: 0.5rem; 
          transition: all 0.3s;
        }

        .faq-item:hover {
          transform: translateY(-2px);
        }

        .faq-item h3 { 
          font-size: 1rem; 
          color: #0f2b4d; 
          margin-bottom: 0.5rem; 
        }

        .faq-item p { 
          color: #6b7280; 
          font-size: 0.875rem; 
          line-height: 1.5;
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
          .contact-main { 
            grid-template-columns: 1fr; 
          } 
          .form-row { 
            grid-template-columns: 1fr; 
          } 
          .contact-info-grid { 
            grid-template-columns: 1fr; 
          }
          .hero-content h1 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default Contact;