import React, { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PropertyFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      city: '',
      type: '',
      min_price: '',
      max_price: '',
      rooms: '',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const propertyTypes = [
    { value: '', label: 'Tous types' },
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'studio', label: 'Studio' },
    { value: 'commercial', label: 'Local commercial' },
    { value: 'land', label: 'Terrain' },
  ];

  const roomOptions = [
    { value: '', label: 'Toutes' },
    { value: '1', label: '1 pièce' },
    { value: '2', label: '2 pièces' },
    { value: '3', label: '3 pièces' },
    { value: '4', label: '4 pièces' },
    { value: '5', label: '5+ pièces' },
  ];

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
          Filtres
        </button>
      </div>

      {/* Mobile filter sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsOpen(false)} />
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filtres</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <FilterForm
                filters={localFilters}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onReset={handleReset}
                propertyTypes={propertyTypes}
                roomOptions={roomOptions}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop filters */}
      <div className="hidden lg:block bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtres</h2>
        <FilterForm
          filters={localFilters}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
          propertyTypes={propertyTypes}
          roomOptions={roomOptions}
        />
      </div>
    </>
  );
};

const FilterForm = ({ filters, onChange, onSubmit, onReset, propertyTypes, roomOptions }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
        Ville
      </label>
      <input
        type="text"
        name="city"
        id="city"
        value={filters.city || ''}
        onChange={onChange}
        placeholder="Ex: Paris, Lyon..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    </div>

    <div>
      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
        Type de bien
      </label>
      <select
        name="type"
        id="type"
        value={filters.type || ''}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        {propertyTypes.map(type => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Prix (€ / mois)
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          name="min_price"
          value={filters.min_price || ''}
          onChange={onChange}
          placeholder="Min"
          min="0"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <input
          type="number"
          name="max_price"
          value={filters.max_price || ''}
          onChange={onChange}
          placeholder="Max"
          min="0"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>

    <div>
      <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">
        Pièces
      </label>
      <select
        name="rooms"
        id="rooms"
        value={filters.rooms || ''}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        {roomOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>

    <div className="pt-4 space-y-2">
      <button
        type="submit"
        className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200"
      >
        Appliquer les filtres
      </button>
      <button
        type="button"
        onClick={onReset}
        className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
      >
        Réinitialiser
      </button>
    </div>
  </form>
);

export default PropertyFilters;