import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, HomeIcon, CurrencyEuroIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const PropertyCard = ({ property }) => {
  const defaultImage = 'https://via.placeholder.com/400x300?text=Immobilier';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={property.images?.[0] ? `http://localhost:8000/storage/${property.images[0]}` : defaultImage}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-md text-sm">
          {property.type_label}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="line-clamp-1">{property.city}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <HomeIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{property.surface} m² • {property.rooms} pièces</span>
          </div>
          
          <div className="flex items-center text-gray-900 font-semibold">
            <CurrencyEuroIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{property.price.toLocaleString('fr-FR')} € / mois</span>
          </div>
        </div>
        
        <Link
          to={`/properties/${property.id}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
        >
          Voir détails
          <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;