import React from 'react';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const team = [
    { name: 'Jean Martin', role: 'Fondateur & CEO', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { name: 'Sophie Bernard', role: 'Directrice Commerciale', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { name: 'Pierre Dubois', role: 'CTO', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { name: 'Marie Lambert', role: 'Responsable Clientèle', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
  ];

  const values = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: 'Confiance',
      description: 'Nous construisons des relations durables basées sur la transparence et l\'honnêteté.'
    },
    {
      icon: <SparklesIcon className="h-8 w-8" />,
      title: 'Innovation',
      description: 'Nous utilisons les dernières technologies pour simplifier la gestion immobilière.'
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: 'Excellence',
      description: 'Nous nous engageons à fournir un service de qualité à tous nos utilisateurs.'
    },
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: 'Passion',
      description: 'Nous aimons ce que nous faisons et cela se reflète dans notre travail.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content">
          <h1>À propos d'ImmoGest</h1>
          <p>La plateforme qui révolutionne la gestion immobilière</p>
        </div>
      </div>

      {/* Story Section */}
      <div className="story-section">
        <div className="story-container">
          <div className="story-image">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" 
              alt="Notre histoire"
            />
          </div>
          <div className="story-content">
            <h2>Notre histoire</h2>
            <p>
              ImmoGest est né d'un constat simple : la gestion immobilière est souvent complexe 
              et chronophage. En 2020, notre fondateur Jean Martin, fort de 15 ans d'expérience 
              dans l'immobilier, a décidé de créer une plateforme qui simplifierait la vie des 
              propriétaires, des agents et des locataires.
            </p>
            <p>
              Aujourd'hui, ImmoGest compte plus de 10 000 utilisateurs et 500 biens référencés 
              à travers la France. Notre équipe de passionnés travaille chaque jour pour améliorer 
              nos services et offrir la meilleure expérience possible.
            </p>
            <div className="story-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Biens</span>
              </div>
              <div className="stat">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Utilisateurs</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Agences</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <h2>Nos valeurs</h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <h2>Notre équipe</h2>
        <div className="team-grid">
          {team.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="about-cta">
        <div className="cta-content">
          <h2>Rejoignez l'aventure ImmoGest</h2>
          <p>Que vous soyez propriétaire, agent ou locataire, notre plateforme est faite pour vous.</p>
          <div className="cta-buttons">
            <a href="/register" className="btn-primary">Créer un compte</a>
            <a href="/contact" className="btn-secondary">Nous contacter</a>
          </div>
        </div>
      </div>

      <style>{`
        .about-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
        }

        .about-hero {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 100px 20px;
          text-align: center;
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

        .story-section {
          padding: 80px 20px;
          background: white;
        }

        .story-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .story-image img {
          width: 100%;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .story-content h2 {
          color: #1f2937;
          font-size: 36px;
          margin-bottom: 20px;
        }

        .story-content p {
          color: #6b7280;
          line-height: 1.8;
          margin-bottom: 20px;
        }

        .story-stats {
          display: flex;
          gap: 40px;
          margin-top: 30px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 32px;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #6b7280;
          font-size: 14px;
        }

        .values-section {
          padding: 80px 20px;
          background: #f9fafb;
          text-align: center;
        }

        .values-section h2 {
          color: #1f2937;
          font-size: 36px;
          margin-bottom: 50px;
        }

        .values-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .value-card {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s;
        }

        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .value-icon {
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

        .value-card h3 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 15px;
        }

        .value-card p {
          color: #6b7280;
          line-height: 1.6;
        }

        .team-section {
          padding: 80px 20px;
          background: white;
          text-align: center;
        }

        .team-section h2 {
          color: #1f2937;
          font-size: 36px;
          margin-bottom: 50px;
        }

        .team-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .team-card {
          text-align: center;
        }

        .team-card img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 0 auto 20px;
          object-fit: cover;
          border: 3px solid #2563eb;
        }

        .team-card h3 {
          color: #1f2937;
          font-size: 18px;
          margin-bottom: 5px;
        }

        .team-card p {
          color: #6b7280;
        }

        .about-cta {
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

        .btn-primary {
          padding: 15px 40px;
          background: white;
          color: #2563eb;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          transition: transform 0.3s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        .btn-secondary {
          padding: 15px 40px;
          background: transparent;
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          border: 2px solid white;
          transition: background-color 0.3s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 1024px) {
          .values-grid,
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 36px;
          }

          .story-container {
            grid-template-columns: 1fr;
          }

          .values-grid,
          .team-grid {
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

export default About;