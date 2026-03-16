import { useState, useEffect } from 'react';
import { propertyService } from '../services/properties';
import { toast } from 'react-toastify';

export const useProperties = (initialParams = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    fetchProperties();
  }, [params]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await propertyService.getAll(params);
      setProperties(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
      toast.error('Erreur lors du chargement des biens');
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (data) => {
    try {
      const response = await propertyService.create(data);
      toast.success('Bien créé avec succès');
      fetchProperties();
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
      throw err;
    }
  };

  const updateProperty = async (id, data) => {
    try {
      const response = await propertyService.update(id, data);
      toast.success('Bien mis à jour avec succès');
      fetchProperties();
      return response.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deleteProperty = async (id) => {
    try {
      await propertyService.delete(id);
      toast.success('Bien supprimé avec succès');
      fetchProperties();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
      throw err;
    }
  };

  return {
    properties,
    loading,
    error,
    pagination,
    params,
    setParams,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
  };
};