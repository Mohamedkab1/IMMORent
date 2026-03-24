import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <>
      <div className="about-page">
        <div className="about-hero">
          <div className="hero-content">
            <h1>À propos d'IMMORent</h1>
            <p>La plateforme qui révolutionne la gestion immobilière</p>
          </div>
        </div>

        <div className="about-container">
          <div className="story-section">
            <div className="story-image">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" alt="Notre histoire" />
            </div>
            <div className="story-content">
              <h2>Notre histoire</h2>
              <p>
                IMMORent est né d'un constat simple : la gestion immobilière est souvent complexe 
                et chronophage. En 2020, notre fondateur, fort de 15 ans d'expérience dans l'immobilier, 
                a décidé de créer une plateforme qui simplifierait la vie des propriétaires, 
                des agents et des locataires.
              </p>
              <p>
                Aujourd'hui, IMMORent compte plus de 10 000 utilisateurs et 500 biens référencés 
                à travers la France. Notre équipe de passionnés travaille chaque jour pour améliorer 
                nos services et offrir la meilleure expérience possible.
              </p>
              <div className="story-stats">
                <div className="stat"><span className="stat-number">500+</span><span className="stat-label">Biens</span></div>
                <div className="stat"><span className="stat-number">10k+</span><span className="stat-label">Utilisateurs</span></div>
                <div className="stat"><span className="stat-number">50+</span><span className="stat-label">Agences</span></div>
              </div>
            </div>
          </div>

          <div className="values-section">
            <h2>Nos valeurs</h2>
            <div className="values-grid">
              <div className="value-card"><div className="value-icon">🤝</div><h3>Confiance</h3><p>Relations durables basées sur la transparence</p></div>
              <div className="value-card"><div className="value-icon">💡</div><h3>Innovation</h3><p>Technologies pour simplifier la gestion</p></div>
              <div className="value-card"><div className="value-icon">⭐</div><h3>Excellence</h3><p>Service de qualité à tous nos utilisateurs</p></div>
              <div className="value-card"><div className="value-icon">❤️</div><h3>Passion</h3><p>Nous aimons ce que nous faisons</p></div>
            </div>
          </div>

          <div className="team-section">
            <h2>Notre équipe</h2>
            <div className="team-grid">
              <div className="team-card"><img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Jean Martin" /><h3>Jean Martin</h3><p>Fondateur & CEO</p></div>
              <div className="team-card"><img src="https://randomuser.me/api/portraits/women/2.jpg" alt="Sophie Bernard" /><h3>Sophie Bernard</h3><p>Directrice Commerciale</p></div>
              <div className="team-card"><img src="https://randomuser.me/api/portraits/men/3.jpg" alt="Pierre Dubois" /><h3>Pierre Dubois</h3><p>CTO</p></div>
              <div className="team-card"><img src="https://randomuser.me/api/portraits/women/4.jpg" alt="Marie Lambert" /><h3>Marie Lambert</h3><p>Responsable Clientèle</p></div>
            </div>
          </div>

          <div className="cta-section">
            <div className="cta-content">
              <h2>Rejoignez l'aventure IMMORent</h2>
              <p>Que vous soyez propriétaire, agent ou locataire, notre plateforme est faite pour vous.</p>
              <div className="cta-buttons">
                <Link to="/register" className="btn-primary">Créer un compte</Link>
                <Link to="/contact" className="btn-secondary">Nous contacter</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-page { min-height: calc(100vh - 70px); background: #f8f9fa; }
        .about-hero { background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%); padding: 4rem 1.5rem; text-align: center; color: white; }
        .hero-content h1 { font-size: 2.5rem; margin-bottom: 1rem; color: white; }
        .hero-content p { font-size: 1.125rem; opacity: 0.9; }
        .about-container { max-width: 1200px; margin: 0 auto; padding: 3rem 1.5rem; }
        .story-section { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; margin-bottom: 4rem; }
        .story-image img { width: 100%; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .story-content h2 { font-size: 2rem; color: #0f2b4d; margin-bottom: 1rem; }
        .story-content p { color: #6b7280; line-height: 1.6; margin-bottom: 1rem; }
        .story-stats { display: flex; gap: 2rem; margin-top: 1.5rem; }
        .stat { text-align: center; }
        .stat-number { display: block; font-size: 1.75rem; font-weight: 700; color: #d4af37; }
        .stat-label { color: #6b7280; font-size: 0.875rem; }
        .values-section { text-align: center; margin-bottom: 4rem; }
        .values-section h2 { font-size: 2rem; color: #0f2b4d; margin-bottom: 2rem; position: relative; display: inline-block; padding-bottom: 0.75rem; }
        .values-section h2::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 3px; background: #d4af37; }
        .values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .value-card { background: white; padding: 2rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: all 0.3s; }
        .value-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
        .value-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .value-card h3 { font-size: 1.125rem; color: #0f2b4d; margin-bottom: 0.5rem; }
        .value-card p { color: #6b7280; font-size: 0.875rem; }
        .team-section { text-align: center; margin-bottom: 4rem; }
        .team-section h2 { font-size: 2rem; color: #0f2b4d; margin-bottom: 2rem; position: relative; display: inline-block; padding-bottom: 0.75rem; }
        .team-section h2::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 3px; background: #d4af37; }
        .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        .team-card { background: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: all 0.3s; }
        .team-card:hover { transform: translateY(-4px); }
        .team-card img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 3px solid #d4af37; }
        .team-card h3 { color: #0f2b4d; margin-bottom: 0.25rem; }
        .team-card p { color: #6b7280; font-size: 0.875rem; }
        .cta-section { background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%); padding: 4rem 1.5rem; text-align: center; border-radius: 0.75rem; }
        .cta-content h2 { color: white; font-size: 2rem; margin-bottom: 1rem; }
        .cta-content p { color: #e0e7ff; margin-bottom: 2rem; }
        .cta-buttons { display: flex; gap: 1rem; justify-content: center; }
        .btn-primary { padding: 0.75rem 2rem; background: #d4af37; color: #0f2b4d; text-decoration: none; border-radius: 0.5rem; font-weight: 600; transition: all 0.3s; }
        .btn-primary:hover { background: #c4a52e; transform: translateY(-2px); }
        .btn-secondary { padding: 0.75rem 2rem; background: transparent; border: 2px solid white; color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600; transition: all 0.3s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }
        @media (max-width: 1024px) { .values-grid, .team-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .story-section { grid-template-columns: 1fr; } .values-grid, .team-grid { grid-template-columns: 1fr; } .cta-buttons { flex-direction: column; } }
      `}</style>
    </>
  );
};

export default About;