import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      icon: <BuildingOfficeIcon className="h-8 w-8" />,
      title: "Large choix de biens",
      description: "Appartements, maisons, locaux commerciaux : une sélection variée pour tous les besoins."
    },
    {
      icon: <MagnifyingGlassIcon className="h-8 w-8" />,
      title: "Recherche intelligente",
      description: "Filtres avancés par ville, prix, type, superficie et équipements."
    },
    {
      icon: <DocumentTextIcon className="h-8 w-8" />,
      title: "Contrats sécurisés",
      description: "Génération automatique de contrats et gestion des documents."
    },
    {
      icon: <CurrencyEuroIcon className="h-8 w-8" />,
      title: "Paiements en ligne",
      description: "Suivi des loyers et historique des paiements."
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Sécurité des données",
      description: "Protection des informations personnelles et des transactions."
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "Tableaux de bord",
      description: "Statistiques et indicateurs pour une gestion optimale."
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: "Gestion multi-rôles",
      description: "Interfaces adaptées pour administrateurs, agents et clients."
    },
    {
      icon: <CalendarIcon className="h-8 w-8" />,
      title: "Suivi des locations",
      description: "Historique complet des locations et des contrats."
    }
  ];

  const stats = [
    { value: "500+", label: "Biens disponibles" },
    { value: "1000+", label: "Clients satisfaits" },
    { value: "50+", label: "Agences partenaires" },
    { value: "98%", label: "Taux de satisfaction" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Plateforme de Gestion Immobilière et Location en Ligne</h1>
          <p>Gérez vos biens immobiliers, suivez vos locations et trouvez le logement idéal en toute simplicité</p>
          
          <div className="hero-search">
            <input 
              type="text" 
              placeholder="Rechercher par ville, code postal..."
              className="search-input"
            />
            <select className="search-select">
              <option>Type de bien</option>
              <option>Appartement</option>
              <option>Maison</option>
              <option>Local commercial</option>
              <option>Terrain</option>
              <option>Studio</option>
            </select>
            <button className="search-button">
              <MagnifyingGlassIcon className="h-5 w-5" />
              Rechercher
            </button>
          </div>

          <div className="hero-buttons">
            <Link to="/properties" className="btn-primary-large">
              Voir tous les biens
            </Link>
            <Link to="/register" className="btn-secondary-large">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="features-section">
        <div className="section-header">
          <h2>Fonctionnalités de la plateforme</h2>
          <p>Une solution complète pour tous vos besoins immobiliers</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Types de biens */}
      <section className="property-types-section">
        <div className="section-header">
          <h2>Types de biens disponibles</h2>
          <p>Trouvez le bien qui correspond à vos besoins</p>
        </div>
        <div className="property-types-grid">
          <div className="property-type-card">
            <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400" alt="Appartement" />
            <h3>Appartements</h3>
            <p>Studios, T2, T3, duplex en centre-ville</p>
            <Link to="/properties?type=apartment">Voir les appartements →</Link>
          </div>
          <div className="property-type-card">
            <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400" alt="Maison" />
            <h3>Maisons</h3>
            <p>Maisons individuelles, mitoyennes, villas</p>
            <Link to="/properties?type=house">Voir les maisons →</Link>
          </div>
          <div className="property-type-card">
            <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400" alt="Local commercial" />
            <h3>Locaux commerciaux</h3>
            <p>Bureaux, boutiques, locaux d'activité</p>
            <Link to="/properties?type=commercial">Voir les locaux →</Link>
          </div>
          <div className="property-type-card">
            <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400" alt="Terrain" />
            <h3>Terrains</h3>
            <p>Terrains nus, constructibles, agricoles</p>
            <Link to="/properties?type=land">Voir les terrains →</Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Prêt à commencer votre projet immobilier ?</h2>
          <p>Rejoignez notre plateforme et découvrez une nouvelle façon de gérer vos biens immobiliers</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-cta-primary">
              S'inscrire gratuitement
            </Link>
            <Link to="/contact" className="btn-cta-secondary">
              Contacter un conseiller
            </Link>
          </div>
        </div>
      </section>

      {/* Styles CSS intégrés */}
      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 80px 20px;
          position: relative;
          text-align: center;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920') center/cover;
          opacity: 0.1;
        }

        .hero-content {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          z-index: 1;
        }

        .hero-content h1 {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .hero-content p {
          font-size: 20px;
          opacity: 0.9;
          margin-bottom: 40px;
        }

        .hero-search {
          display: flex;
          gap: 10px;
          max-width: 600px;
          margin: 0 auto 30px;
          background: white;
          padding: 5px;
          border-radius: 50px;
        }

        .search-input {
          flex: 2;
          padding: 15px 20px;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          outline: none;
        }

        .search-select {
          flex: 1;
          padding: 15px;
          border: none;
          border-left: 1px solid #e5e7eb;
          font-size: 16px;
          outline: none;
          background: white;
        }

        .search-button {
          flex: 0.5;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 0 20px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background-color 0.3s;
        }

        .search-button:hover {
          background: #1d4ed8;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .btn-primary-large {
          padding: 15px 40px;
          background: white;
          color: #2563eb;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          transition: transform 0.3s;
        }

        .btn-primary-large:hover {
          transform: translateY(-2px);
        }

        .btn-secondary-large {
          padding: 15px 40px;
          background: transparent;
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          border: 2px solid white;
          transition: background-color 0.3s;
        }

        .btn-secondary-large:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .stats-section {
          background: white;
          padding: 60px 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .stats-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          text-align: center;
        }

        .stat-card h3 {
          font-size: 36px;
          font-weight: 800;
          color: #2563eb;
          margin-bottom: 10px;
        }

        .stat-card p {
          color: #6b7280;
          font-size: 16px;
        }

        .features-section {
          padding: 80px 20px;
          background: #f9fafb;
        }

        .section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 60px;
        }

        .section-header h2 {
          font-size: 36px;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .section-header p {
          color: #6b7280;
          font-size: 18px;
        }

        .features-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .feature-card {
          background: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: transform 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .feature-icon {
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

        .feature-card h3 {
          font-size: 18px;
          color: #1f2937;
          margin-bottom: 15px;
        }

        .feature-card p {
          color: #6b7280;
          line-height: 1.6;
          font-size: 14px;
        }

        .property-types-section {
          padding: 80px 20px;
          background: white;
        }

        .property-types-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .property-type-card {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: transform 0.3s;
        }

        .property-type-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .property-type-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .property-type-card h3 {
          padding: 20px 20px 10px;
          color: #1f2937;
        }

        .property-type-card p {
          padding: 0 20px;
          color: #6b7280;
          font-size: 14px;
        }

        .property-type-card a {
          display: block;
          padding: 20px;
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .property-type-card a:hover {
          background: #f9fafb;
        }

        .cta-section {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          padding: 80px 20px;
          text-align: center;
          color: white;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: 36px;
          margin-bottom: 20px;
        }

        .cta-content p {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 30px;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .btn-cta-primary {
          padding: 15px 40px;
          background: white;
          color: #2563eb;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          transition: transform 0.3s;
        }

        .btn-cta-primary:hover {
          transform: translateY(-2px);
        }

        .btn-cta-secondary {
          padding: 15px 40px;
          background: transparent;
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          border: 2px solid white;
          transition: background-color 0.3s;
        }

        .btn-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 36px;
          }

          .hero-search {
            flex-direction: column;
            border-radius: 10px;
            background: transparent;
          }

          .search-input, .search-select, .search-button {
            border-radius: 10px;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .stats-grid,
          .features-grid,
          .property-types-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .stats-grid,
          .features-grid,
          .property-types-grid {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;