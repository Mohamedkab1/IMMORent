import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { propertyService } from '../services/properties';

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
    rooms: '',
    surface_min: '',
    surface_max: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 12
  });

  const propertyTypes = [
    { value: '', label: 'Tous types', icon: HomeIcon },
    { value: 'apartment', label: 'Appartement', icon: BuildingOfficeIcon },
    { value: 'house', label: 'Maison', icon: HomeIcon },
    { value: 'studio', label: 'Studio', icon: BuildingOfficeIcon },
    { value: 'commercial', label: 'Local commercial', icon: BuildingStorefrontIcon },
    { value: 'land', label: 'Terrain', icon: BuildingOfficeIcon }
  ];

  const roomOptions = [
    { value: '', label: 'Toutes' },
    { value: '1', label: '1 pièce' },
    { value: '2', label: '2 pièces' },
    { value: '3', label: '3 pièces' },
    { value: '4', label: '4 pièces' },
    { value: '5', label: '5+ pièces' }
  ];

  useEffect(() => {
    fetchProperties();
  }, [pagination.currentPage]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      // Nettoyer les filtres vides
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const response = await propertyService.getAll({
        ...activeFilters,
        page: pagination.currentPage,
        per_page: pagination.perPage
      });
      
      if (response.success) {
        setProperties(response.data.data);
        setPagination({
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          total: response.data.total,
          perPage: response.data.per_page
        });
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (err) {
      console.error('Erreur de chargement:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré (php artisan serve).');
      } else if (err.response?.status === 500) {
        setError('Erreur serveur. Vérifiez que la base de données est accessible et que les migrations sont faites.');
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement des biens');
      }
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
      rooms: '',
      surface_min: '',
      surface_max: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setTimeout(() => fetchProperties(), 100);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTypeIcon = (type) => {
    const found = propertyTypes.find(t => t.value === type);
    const Icon = found?.icon || HomeIcon;
    return <Icon className="h-4 w-4" />;
  };

  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop';

  return (
    <div className="properties-page">
      {/* Hero Section */}
      <div className="properties-hero">
        <div className="hero-content">
          <h1>Biens immobiliers disponibles</h1>
          <p>Découvrez notre sélection de biens à louer partout en France</p>
          
          {/* Search Bar Mobile */}
          <div className="mobile-search">
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-5 w-5" />
              {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
            </button>
          </div>
        </div>
      </div>

      <div className="properties-container">
        {/* Sidebar Filters */}
        <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="filters-header">
            <h2>
              <FunnelIcon className="h-5 w-5" />
              Filtres
            </h2>
            <button 
              className="close-filters"
              onClick={() => setShowFilters(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="filters-form">
            {/* Ville */}
            <div className="filter-group">
              <label htmlFor="city">
                <MapPinIcon className="h-4 w-4" />
                Ville
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Ex: Paris, Lyon..."
                className="filter-input"
              />
            </div>

            {/* Type de bien */}
            <div className="filter-group">
              <label htmlFor="type">
                <HomeIcon className="h-4 w-4" />
                Type de bien
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="filter-select"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prix */}
            <div className="filter-group">
              <label>
                <CurrencyEuroIcon className="h-4 w-4" />
                Prix (€ / mois)
              </label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  min="0"
                  className="filter-input"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  min="0"
                  className="filter-input"
                />
              </div>
            </div>

            {/* Surface */}
            <div className="filter-group">
              <label>Surface (m²)</label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="surface_min"
                  value={filters.surface_min}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  min="0"
                  className="filter-input"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  name="surface_max"
                  value={filters.surface_max}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  min="0"
                  className="filter-input"
                />
              </div>
            </div>

            {/* Pièces */}
            <div className="filter-group">
              <label>Pièces</label>
              <select
                name="rooms"
                value={filters.rooms}
                onChange={handleFilterChange}
                className="filter-select"
              >
                {roomOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="filter-actions">
              <button type="submit" className="btn-apply">
                Appliquer les filtres
              </button>
              <button type="button" onClick={handleReset} className="btn-reset">
                Réinitialiser
              </button>
            </div>
          </form>
        </div>

        {/* Main Content */}
        <div className="properties-content">
          {/* Results Header */}
          <div className="results-header">
            <div className="results-info">
              {!loading && !error && (
                <p>
                  <strong>{pagination.total}</strong> bien{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="results-actions">
              <select className="sort-select">
                <option value="created_at_desc">Plus récents</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="surface_desc">Surface décroissante</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <ArrowPathIcon className="spinner" />
              <p>Chargement des biens...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="error-state">
              <ExclamationTriangleIcon className="error-icon" />
              <h3>Erreur de chargement</h3>
              <p>{error}</p>
              <div className="error-actions">
                <button onClick={fetchProperties} className="btn-retry">
                  Réessayer
                </button>
                <Link to="/" className="btn-home">
                  Retour à l'accueil
                </Link>
              </div>
              
              {/* Debug Info */}
              <div className="debug-info">
                <h4>Solutions possibles :</h4>
                <ul>
                  <li>✓ Vérifiez que le backend Laravel est démarré : <code>php artisan serve</code></li>
                  <li>✓ Vérifiez que la base de données est créée : <code>mysql -u root -p -e "CREATE DATABASE immobilier_db"</code></li>
                  <li>✓ Exécutez les migrations : <code>php artisan migrate:fresh --seed</code></li>
                  <li>✓ Vérifiez l'URL de l'API dans <code>frontend/.env</code> : <code>VITE_API_URL=http://localhost:8000/api</code></li>
                </ul>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && (
            <>
              {properties.length === 0 ? (
                <div className="no-results">
                  <HomeIcon className="no-results-icon" />
                  <h3>Aucun bien trouvé</h3>
                  <p>Essayez de modifier vos critères de recherche</p>
                  <button onClick={handleReset} className="btn-reset-search">
                    Réinitialiser les filtres
                  </button>
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
                          <span className="property-type">
                            {getTypeIcon(property.type)}
                            {property.type_label}
                          </span>
                        </div>
                        
                        <div className="property-content">
                          <h3 className="property-title">{property.title}</h3>
                          
                          <div className="property-location">
                            <MapPinIcon className="h-4 w-4" />
                            <span>{property.city}</span>
                          </div>
                          
                          <div className="property-features">
                            <span className="feature">
                              <HomeIcon className="h-4 w-4" />
                              {property.surface} m²
                            </span>
                            <span className="feature">
                              <BuildingOfficeIcon className="h-4 w-4" />
                              {property.rooms} pièce{property.rooms > 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          <div className="property-price">
                            <strong>{property.price?.toLocaleString('fr-FR')}€</strong>
                            <span>/mois</span>
                          </div>
                          
                          <Link 
                            to={`/properties/${property.id}`}
                            className="btn-view-property"
                          >
                            Voir détails
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.lastPage > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="pagination-prev"
                      >
                        Précédent
                      </button>
                      
                      <div className="pagination-pages">
                        {[...Array(pagination.lastPage)].map((_, i) => {
                          const page = i + 1;
                          // Afficher seulement quelques pages
                          if (
                            page === 1 ||
                            page === pagination.lastPage ||
                            (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`pagination-page ${pagination.currentPage === page ? 'active' : ''}`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === pagination.currentPage - 3 ||
                            page === pagination.currentPage + 3
                          ) {
                            return <span key={page} className="pagination-dots">...</span>;
                          }
                          return null;
                        })}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.lastPage}
                        className="pagination-next"
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

      <style >{`
        .properties-page {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
        }

        .properties-hero {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          padding: 60px 20px;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .hero-content p {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 30px;
        }

        .mobile-search {
          display: none;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 auto;
          padding: 12px 24px;
          background: white;
          color: #2563eb;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
        }

        .properties-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
        }

        /* Filters Sidebar */
        .filters-sidebar {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          height: fit-content;
          position: sticky;
          top: 90px;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e5e7eb;
        }

        .filters-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #1f2937;
          font-size: 18px;
        }

        .close-filters {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
        }

        .filter-group {
          margin-bottom: 20px;
        }

        .filter-group label {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #374151;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .filter-input,
        .filter-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .price-inputs {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 10px;
          align-items: center;
        }

        .price-separator {
          color: #6b7280;
          font-weight: 500;
        }

        .filter-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 25px;
        }

        .btn-apply,
        .btn-reset {
          padding: 12px;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-apply {
          background: #2563eb;
          color: white;
        }

        .btn-apply:hover {
          background: #1d4ed8;
        }

        .btn-reset {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-reset:hover {
          background: #e5e7eb;
        }

        /* Results Header */
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          background: white;
          padding: 15px 20px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .results-info p {
          color: #6b7280;
        }

        .results-info strong {
          color: #2563eb;
          font-size: 18px;
        }

        .sort-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 14px;
          color: #374151;
          background: white;
          cursor: pointer;
        }

        .sort-select:focus {
          outline: none;
          border-color: #2563eb;
        }

        /* Loading State */
        .loading-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 10px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          margin: 0 auto 20px;
          color: #2563eb;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-state p {
          color: #6b7280;
        }

        /* Error State */
        .error-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 10px;
        }

        .error-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          color: #dc2626;
        }

        .error-state h3 {
          color: #1f2937;
          font-size: 20px;
          margin-bottom: 10px;
        }

        .error-state p {
          color: #6b7280;
          margin-bottom: 25px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .error-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .btn-retry,
        .btn-home {
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s;
        }

        .btn-retry {
          background: #2563eb;
          color: white;
        }

        .btn-retry:hover {
          background: #1d4ed8;
        }

        .btn-home {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-home:hover {
          background: #e5e7eb;
        }

        .debug-info {
          text-align: left;
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background: #f8fafc;
          border-radius: 5px;
        }

        .debug-info h4 {
          color: #1f2937;
          margin-bottom: 15px;
        }

        .debug-info ul {
          list-style: none;
          padding: 0;
        }

        .debug-info li {
          color: #059669;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .debug-info code {
          background: #e5e7eb;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 12px;
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 10px;
        }

        .no-results-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          color: #9ca3af;
        }

        .no-results h3 {
          color: #1f2937;
          font-size: 20px;
          margin-bottom: 10px;
        }

        .no-results p {
          color: #6b7280;
          margin-bottom: 25px;
        }

        .btn-reset-search {
          padding: 12px 30px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-reset-search:hover {
          background: #1d4ed8;
        }

        /* Properties Grid */
        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .property-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .property-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .property-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .property-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .property-card:hover .property-image img {
          transform: scale(1.05);
        }

        .property-type {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(37, 99, 235, 0.9);
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .property-content {
          padding: 20px;
        }

        .property-title {
          color: #1f2937;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .property-location {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .property-features {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #4b5563;
          font-size: 13px;
        }

        .property-price {
          margin-bottom: 15px;
        }

        .property-price strong {
          font-size: 20px;
          color: #2563eb;
        }

        .property-price span {
          color: #6b7280;
          font-size: 14px;
          margin-left: 5px;
        }

        .btn-view-property {
          display: block;
          width: 100%;
          padding: 10px;
          background: #2563eb;
          color: white;
          text-align: center;
          text-decoration: none;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .btn-view-property:hover {
          background: #1d4ed8;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 40px;
        }

        .pagination-prev,
        .pagination-next {
          padding: 10px 20px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }

        .pagination-prev:hover:not(:disabled),
        .pagination-next:hover:not(:disabled) {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .pagination-prev:disabled,
        .pagination-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-pages {
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .pagination-page {
          min-width: 40px;
          height: 40px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }

        .pagination-page:hover:not(.active) {
          background: #f3f4f6;
        }

        .pagination-page.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .pagination-dots {
          color: #6b7280;
          padding: 0 5px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .properties-container {
            grid-template-columns: 1fr;
          }

          .filters-sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 90%;
            max-width: 350px;
            height: 100vh;
            border-radius: 0;
            z-index: 1000;
            transition: left 0.3s;
            overflow-y: auto;
          }

          .filters-sidebar.show {
            left: 0;
          }

          .close-filters {
            display: block;
          }

          .mobile-search {
            display: block;
          }

          .properties-hero {
            padding: 40px 20px;
          }

          .hero-content h1 {
            font-size: 28px;
          }

          .hero-content p {
            font-size: 16px;
          }
        }

        @media (max-width: 768px) {
          .results-header {
            flex-direction: column;
            gap: 15px;
          }

          .error-actions {
            flex-direction: column;
          }

          .pagination {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Properties;