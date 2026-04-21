import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <div className="not-found">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page non trouvée</h2>
          <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
          <Link to="/" className="btn-home">Retour à l'accueil</Link>
        </div>
      </div>

      <style>{`
        .not-found { min-height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center; background: #f8f9fa; padding: 2rem; }
        .not-found-content { text-align: center; max-width: 500px; }
        .not-found-content h1 { font-size: 8rem; font-weight: 700; color: #d4af37; margin-bottom: 1rem; }
        .not-found-content h2 { font-size: 2rem; color: #0f2b4d; margin-bottom: 1rem; }
        .not-found-content p { color: #6b7280; margin-bottom: 2rem; }
        .btn-home { display: inline-block; padding: 0.75rem 2rem; background: #d4af37; color: #0f2b4d; text-decoration: none; border-radius: 0.5rem; font-weight: 600; transition: all 0.3s; }
        .btn-home:hover { background: #c4a52e; transform: translateY(-2px); }
      `}</style>
    </>
  );
};

export default NotFound;