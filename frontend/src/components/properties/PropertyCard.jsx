import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, HomeIcon, CurrencyEuroIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';

const PropertyCard = ({ property }) => {
  const { t } = useLanguage();
  const defaultImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop';
  
  // S'assurer que l'ID est un nombre
  const propertyId = property?.id;
  
  if (!propertyId) {
    console.error('PropertyCard: propriété sans ID', property);
    return null;
  }

  return (
    <div className="property-card">
      <div className="property-image">
        <img
          src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `/storage/${property.images[0]}`) : defaultImage}
          alt={property.title}
        />
        <span className="property-type">{property.type_label || property.type}</span>
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
            <HomeIcon className="h-4 w-4" />
            {property.rooms} {t('prop.rooms', 'pièces')}
          </span>
        </div>
        
        <div className="property-price">
          <strong>{property.price?.toLocaleString('fr-FR')}DH</strong>
          <span>{property.status === 'rent' ? t('prop.per_month', '/mois') : ''}</span>
        </div>

        
        <Link 
          to={`/properties/${propertyId}`}  // Utilisation de l'ID numérique
          className="btn-view-property"
        >
          {t('prop.view_details', 'Voir détails')}
        </Link>

      </div>
    </div>
  );
};

export default PropertyCard;