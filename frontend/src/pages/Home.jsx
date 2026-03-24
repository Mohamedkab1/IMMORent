import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="immorent-home">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Bienvenue sur <span className="highlight">IMMORent</span></h1>
            <p>La plateforme de référence pour la gestion immobilière et la location en ligne</p>
            <div className="hero-buttons">
              <Link to="/properties" className="btn-hero-primary">
                Explorer les biens
              </Link>
              <Link to="/register" className="btn-hero-secondary">
                Créer un compte
              </Link>
            </div>
          </div>
        </section>

        {/* Statistiques */}
        <section className="stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Biens disponibles</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Clients satisfaits</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Agences partenaires</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">98%</div>
                <div className="stat-label">Taux de satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="services">
          <div className="container">
            <h2 className="section-title">Nos services</h2>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">🔍</div>
                <h3>Recherche avancée</h3>
                <p>Trouvez le bien idéal avec nos filtres par ville, prix, type et superficie</p>
              </div>
              <div className="service-card">
                <div className="service-icon">📄</div>
                <h3>Contrats sécurisés</h3>
                <p>Génération automatique et gestion simplifiée de vos contrats</p>
              </div>
              <div className="service-card">
                <div className="service-icon">💰</div>
                <h3>Paiements en ligne</h3>
                <p>Suivez vos loyers et consultez votre historique financier</p>
              </div>
              <div className="service-card">
                <div className="service-icon">📊</div>
                <h3>Tableaux de bord</h3>
                <p>Visualisez vos statistiques et suivez vos performances</p>
              </div>
            </div>
          </div>
        </section>

        {/* Types de biens */}
        <section className="property-types">
          <div className="container">
            <h2 className="section-title">Types de biens</h2>
            <div className="types-grid">
              <div className="type-card">
                <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400" alt="Appartement" />
                <h3>Appartements</h3>
                <p>Studios, T2, T3, duplex en centre-ville</p>
                <Link to="/properties?type=apartment">Voir les appartements →</Link>
              </div>
              <div className="type-card">
                <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400" alt="Maison" />
                <h3>Maisons</h3>
                <p>Maisons individuelles, mitoyennes avec jardin</p>
                <Link to="/properties?type=house">Voir les maisons →</Link>
              </div>
              <div className="type-card">
                <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400" alt="Commercial" />
                <h3>Locaux commerciaux</h3>
                <p>Bureaux, boutiques, locaux d'activité</p>
                <Link to="/properties?type=commercial">Voir les locaux →</Link>
              </div>
              <div className="type-card">
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400" alt="Terrain" />
                <h3>Terrains</h3>
                <p>Terrains nus, constructibles, agricoles</p>
                <Link to="/properties?type=land">Voir les terrains →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="cta-content">
            <h2>Prêt à commencer votre projet immobilier ?</h2>
            <p>Rejoignez IMMORent et découvrez une nouvelle façon de gérer vos biens</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn-cta-primary">S'inscrire gratuitement</Link>
              <Link to="/contact" className="btn-cta-secondary">Contacter un conseiller</Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .immorent-home {
          min-height: calc(100vh - 70px);
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%);
          padding: 6rem 1.5rem;
          text-align: center;
          color: white;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }

        .hero .highlight {
          color: #d4af37;
        }

        .hero p {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn-hero-primary {
          display: inline-block;
          padding: 0.875rem 2.5rem;
          background-color: #d4af37;
          color: #0f2b4d;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-hero-primary:hover {
          background-color: #c4a52e;
          transform: translateY(-2px);
        }

        .btn-hero-secondary {
          display: inline-block;
          padding: 0.875rem 2.5rem;
          background-color: transparent;
          border: 2px solid white;
          color: white;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-hero-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Stats Section */
        .stats {
          padding: 4rem 1.5rem;
          background-color: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #d4af37;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Services Section */
        .services {
          padding: 4rem 1.5rem;
          background-color: #f8f9fa;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 3rem;
          color: #0f2b4d;
          position: relative;
          padding-bottom: 1rem;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: #d4af37;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .service-card {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .service-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .service-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: #0f2b4d;
        }

        .service-card p {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        /* Property Types Section */
        .property-types {
          padding: 4rem 1.5rem;
          background-color: white;
        }

        .types-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .type-card {
          background: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .type-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .type-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .type-card h3 {
          padding: 1rem 1rem 0.5rem;
          font-size: 1.125rem;
          color: #0f2b4d;
        }

        .type-card p {
          padding: 0 1rem;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .type-card a {
          display: block;
          padding: 0.75rem 1rem;
          color: #d4af37;
          text-decoration: none;
          font-weight: 500;
          border-top: 1px solid #e5e7eb;
          transition: background-color 0.3s ease;
        }

        .type-card a:hover {
          background-color: #f8f9fa;
        }

        /* CTA Section */
        .cta {
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%);
          padding: 4rem 1.5rem;
          text-align: center;
          color: white;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: white;
        }

        .cta p {
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn-cta-primary {
          padding: 0.875rem 2rem;
          background-color: #d4af37;
          color: #0f2b4d;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-cta-primary:hover {
          background-color: #c4a52e;
          transform: translateY(-2px);
        }

        .btn-cta-secondary {
          padding: 0.875rem 2rem;
          background-color: transparent;
          border: 2px solid white;
          color: white;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-cta-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .services-grid,
          .types-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }
          
          .hero p {
            font-size: 1rem;
          }
          
          .hero-buttons {
            flex-direction: column;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .services-grid,
          .types-grid {
            grid-template-columns: 1fr;
          }
          
          .cta-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default Home;