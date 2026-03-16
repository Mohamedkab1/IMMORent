import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../services/properties';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';
import { 
  MapPinIcon, 
  HomeIcon, 
  CurrencyEuroIcon, 
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await propertyService.getById(id);
      setProperty(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement du bien');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!property) return <div className="text-center py-12">Bien non trouvé</div>;

  const defaultImage = 'https://via.placeholder.com/800x600?text=Immobilier';
  const images = property.images?.length > 0 ? property.images : [null];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="mb-6">
          <Link to="/properties" className="text-primary-600 hover:text-primary-700">
            ← Retour aux biens
          </Link>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Images */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="lg:col-span-2">
              <img
                src={images[selectedImage] ? `http://localhost:8000/storage/${images[selectedImage]}` : defaultImage}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <img
                    src={image ? `http://localhost:8000/storage/${image}` : defaultImage}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Détails */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  <span>{property.full_address}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">
                  {property.price.toLocaleString('fr-FR')} €
                </p>
                <p className="text-sm text-gray-500">par mois</p>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b">
              <div className="text-center">
                <HomeIcon className="h-6 w-6 mx-auto text-primary-600" />
                <p className="text-sm text-gray-600 mt-1">Surface</p>
                <p className="font-semibold">{property.surface} m²</p>
              </div>
              <div className="text-center">
                <CalendarIcon className="h-6 w-6 mx-auto text-primary-600" />
                <p className="text-sm text-gray-600 mt-1">Pièces</p>
                <p className="font-semibold">{property.rooms}</p>
              </div>
              <div className="text-center">
                <UserIcon className="h-6 w-6 mx-auto text-primary-600" />
                <p className="text-sm text-gray-600 mt-1">Chambres</p>
                <p className="font-semibold">{property.bedrooms || 0}</p>
              </div>
              <div className="text-center">
                <CurrencyEuroIcon className="h-6 w-6 mx-auto text-primary-600" />
                <p className="text-sm text-gray-600 mt-1">Charges</p>
                <p className="font-semibold">{property.charges || 0} €</p>
              </div>
            </div>

            {/* Description */}
            <div className="py-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>

            {/* Équipements */}
            {property.features && property.features.length > 0 && (
              <div className="py-6 border-t">
                <h2 className="text-xl font-semibold mb-3">Équipements</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact agent */}
            {property.user && (
              <div className="py-6 border-t">
                <h2 className="text-xl font-semibold mb-3">Contact</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">{property.user.name}</p>
                  <div className="flex items-center mt-2 text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>{property.user.phone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <span>{property.user.email}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {isAuthenticated && user?.isClient && property.status === 'available' && (
              <div className="py-6 border-t">
                <Link
                  to={`/requests/new?property=${property.id}`}
                  className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700"
                >
                  Faire une demande de location
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;