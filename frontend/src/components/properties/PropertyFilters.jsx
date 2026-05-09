import React, { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';

const PropertyFilters = ({ filters, onFilterChange }) => {
  const { t } = useLanguage();
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

  const roomOptions = [
    { value: '', label: t('common.all', 'Toutes') },
    { value: '1', label: `1 ${t('prop.room_singular', 'pièce')}` },
    { value: '2', label: `2 ${t('prop.rooms', 'pièces')}` },
    { value: '3', label: `3 ${t('prop.rooms', 'pièces')}` },
    { value: '4', label: `4 ${t('prop.rooms', 'pièces')}` },
    { value: '5', label: `5+ ${t('prop.rooms', 'pièces')}` },
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
          {t('prop.filters', 'Filtres')}
        </button>
      </div>

      {/* Mobile filter sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsOpen(false)} />
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">{t('prop.filters', 'Filtres')}</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <FilterForm
                filters={localFilters}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onReset={handleReset}
                roomOptions={roomOptions}
                t={t}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop filters */}
      <div className="hidden lg:block bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('prop.filters', 'Filtres')}</h2>
        <FilterForm
          filters={localFilters}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
          roomOptions={roomOptions}
          t={t}
        />
      </div>
    </>
  );
};

const FilterForm = ({ filters, onChange, onSubmit, onReset, roomOptions, t }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
        {t('prop.city', 'Ville')}
      </label>
      <input
        type="text"
        name="city"
        id="city"
        value={filters.city || ''}
        onChange={onChange}
        placeholder={t('prop.city_placeholder', 'Ex: Paris, Lyon...')}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t('prop.price_month', 'Prix (DH / mois)')}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          name="min_price"
          value={filters.min_price || ''}
          onChange={onChange}
          placeholder={t('common.min', 'Min')}
          min="0"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <input
          type="number"
          name="max_price"
          value={filters.max_price || ''}
          onChange={onChange}
          placeholder={t('common.max', 'Max')}
          min="0"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>

    <div>
      <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">
        {t('prop.rooms_label', 'Pièces')}
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
        {t('prop.apply_filters', 'Appliquer les filtres')}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
      >
        {t('common.reset', 'Réinitialiser')}
      </button>
    </div>
  </form>
);

export default PropertyFilters;