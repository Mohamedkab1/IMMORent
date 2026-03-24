import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CurrencyEuroIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    min_price: '',
    max_price: '',
    rooms: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });

  const propertyTypes = [
    { value: '', label: 'Tous types' },
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'studio', label: 'Studio' },
    { value: 'commercial', label: 'Local commercial' },
    { value: 'land', label: 'Terrain' }
  ];

  useEffect(() => {
    fetchProperties();
  }, [pagination.currentPage]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const response = await propertyService.getAll({
        ...activeFilters,
        page: pagination.currentPage,
        per_page: 12
      });
      
      if (response.success) {
        setProperties(response.data.data);
        setPagination({
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          total: response.data.total
        });
      }
    } catch (err) {
      setError('Erreur lors du chargement des biens');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchProperties();
    setShowFilters(false);
  };

  const handleReset = () => {
    setFilters({
      city: '',
      type: '',
      min_price: '',
      max_price: '',
      rooms: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setTimeout(() => fetchProperties(), 100);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';

  return (
    <>
      <div className="properties-page">
        <div className="properties-hero">
          <div className="hero-content">
            <h1>Nos biens immobiliers</h1>
            <p>Découvrez notre sélection de biens à louer partout en France</p>
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-5 w-5" />
              {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
            </button>
          </div>
        </div>

        <div className="properties-container">
          <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h2>Filtres</h2>
              <button onClick={() => setShowFilters(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="filters-form">
              <div className="filter-group">
                <label>Ville</label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Ex: Paris, Lyon..."
                />
              </div>

              <div className="filter-group">
                <label>Type de bien</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Prix (€ / mois)</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    name="min_price"
                    value={filters.min_price}
                    onChange={handleFilterChange}
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="max_price"
                    value={filters.max_price}
                    onChange={handleFilterChange}
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Pièces</label>
                <select
                  name="rooms"
                  value={filters.rooms}
                  onChange={handleFilterChange}
                >
                  <option value="">Toutes</option>
                  <option value="1">1 pièce</option>
                  <option value="2">2 pièces</option>
                  <option value="3">3 pièces</option>
                  <option value="4">4 pièces</option>
                  <option value="5">5+ pièces</option>
                </select>
              </div>

              <div className="filter-actions">
                <button type="submit" className="btn-apply">
                  Appliquer
                </button>
                <button type="button" onClick={handleReset} className="btn-reset">
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>

          <div className="properties-content">
            <div className="results-header">
              <div className="results-info">
                {!loading && !error && (
                  <p><strong>{pagination.total}</strong> bien{pagination.total !== 1 ? 's' : ''} trouvé{pagination.total !== 1 ? 's' : ''}</p>
                )}
              </div>
            </div>

            {loading && (
              <div className="loading-state">
                <ArrowPathIcon className="spinner" />
                <p>Chargement des biens...</p>
              </div>
            )}

            {error && !loading && (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchProperties}>Réessayer</button>
              </div>
            )}

            {!loading && !error && (
              <>
                {properties.length === 0 ? (
                  <div className="no-results">
                    <p>Aucun bien trouvé</p>
                    <button onClick={handleReset}>Réinitialiser les filtres</button>
                  </div>
                ) : (
                  <>
                    <div className="properties-grid">
                      {properties.map(property => (
                        <div key={property.id} className="property-card">
                          <div className="property-image">
                            <img 
                              src={property.images?.[0] ? `http://localhost:8000/storage/${property.images[0]}` : defaultImage} 
                              alt={property.title}
                            />
                            <span className="property-type">{property.type_label}</span>
                          </div>
                          
                          <div className="property-content">
                            <h3>{property.title}</h3>
                            <div className="property-location">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{property.city}</span>
                            </div>
                            <div className="property-features">
                              <span>{property.surface} m²</span>
                              <span>{property.rooms} pièces</span>
                            </div>
                            <div className="property-price">
                              <strong>{property.price?.toLocaleString('fr-FR')}€</strong>
                              <span>/mois</span>
                            </div>
                            <Link to={`/properties/${property.id}`} className="btn-details">
                              Voir détails
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    {pagination.lastPage > 1 && (
                      <div className="pagination">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                          disabled={pagination.currentPage === 1}
                        >
                          Précédent
                        </button>
                        <span>Page {pagination.currentPage} sur {pagination.lastPage}</span>
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                          disabled={pagination.currentPage === pagination.lastPage}
                        >
                          Suivant
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .properties-page {
          min-height: calc(100vh - 70px);
          background: #f8f9fa;
        }

        .properties-hero {
          background: linear-gradient(135deg, #0f2b4d 0%, #1e4a6e 100%);
          padding: 3rem 1.5rem;
          text-align: center;
          color: white;
        }

        .hero-content h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: white;
        }

        .hero-content p {
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }

        .filter-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #d4af37;
          color: #0f2b4d;
          border: none;
          border-radius: 2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-toggle:hover {
          background: #c4a52e;
        }

        .properties-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
        }

        .filters-sidebar {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          height: fit-content;
          position: sticky;
          top: 90px;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .filters-header h2 {
          font-size: 1.25rem;
          color: #0f2b4d;
        }

        .filters-header button {
          background: none;
          border: none;
          cursor: pointer;
          display: none;
        }

        .filter-group {
          margin-bottom: 1.25rem;
        }

        .filter-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .filter-group input,
        .filter-group select {
          width: 100%;
          padding: 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .filter-group input:focus,
        .filter-group select:focus {
          outline: none;
          border-color: #d4af37;
        }

        .price-inputs {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0.5rem;
          align-items: center;
        }

        .price-inputs span {
          color: #6b7280;
        }

        .filter-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .btn-apply,
        .btn-reset {
          padding: 0.625rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-apply {
          background: #d4af37;
          color: #0f2b4d;
        }

        .btn-apply:hover {
          background: #c4a52e;
        }

        .btn-reset {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-reset:hover {
          background: #e5e7eb;
        }

        .properties-content {
          flex: 1;
        }

        .results-header {
          margin-bottom: 1.5rem;
        }

        .results-info p {
          color: #6b7280;
        }

        .results-info strong {
          color: #d4af37;
        }

        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .property-card {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }

        .property-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .property-image {
          position: relative;
          height: 200px;
        }

        .property-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .property-type {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: #d4af37;
          color: #0f2b4d;
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .property-content {
          padding: 1rem;
        }

        .property-content h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #0f2b4d;
        }

        .property-location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #6b7280;
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .property-features {
          display: flex;
          gap: 1rem;
          color: #6b7280;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .property-price {
          margin-bottom: 1rem;
        }

        .property-price strong {
          font-size: 1.125rem;
          color: #d4af37;
        }

        .property-price span {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .btn-details {
          display: block;
          width: 100%;
          padding: 0.625rem;
          background: #0f2b4d;
          color: white;
          text-align: center;
          text-decoration: none;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.3s;
        }

        .btn-details:hover {
          background: #1e4a6e;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .pagination button {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .pagination button:hover:not(:disabled) {
          background: #d4af37;
          color: white;
          border-color: #d4af37;
        }

        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-state,
        .error-state,
        .no-results {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 0.75rem;
        }

        .spinner {
          width: 2rem;
          height: 2rem;
          margin: 0 auto 1rem;
          animation: spin 1s linear infinite;
          color: #d4af37;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .properties-container {
            grid-template-columns: 1fr;
          }

          .filters-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 90%;
            max-width: 320px;
            height: 100vh;
            z-index: 1000;
            border-radius: 0;
            transition: left 0.3s;
          }

          .filters-sidebar.show {
            left: 0;
          }

          .filters-header button {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default Properties;