import api from './api';

export const propertyService = {
  async getAll(params = {}) {
    try {
      const response = await api.get('/properties', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur propertyService.getAll:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur propertyService.getById(${id}):`, error);
      throw error;
    }
  },

  async create(data) {
    try {
      console.log('Envoi des données au serveur...');
      
      // Si data est déjà FormData, l'utiliser directement
      if (data instanceof FormData) {
        const response = await api.post('/properties', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      }
      
      // Sinon, créer un FormData
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('transaction_type', data.transaction_type || 'rent');
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('postal_code', data.postal_code);
      formData.append('surface', data.surface);
      formData.append('rooms', data.rooms);
      formData.append('bedrooms', data.bedrooms || 0);
      formData.append('bathrooms', data.bathrooms || 0);
      formData.append('type', data.type);
      formData.append('category_id', data.category_id);
      formData.append('features', JSON.stringify(data.features || []));
      
      if (data.images && data.images.length > 0) {
        data.images.forEach(image => {
          formData.append('images[]', image);
        });
      }
      
      const response = await api.post('/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur propertyService.create:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('transaction_type', data.transaction_type || 'rent');
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('postal_code', data.postal_code);
      formData.append('surface', data.surface);
      formData.append('rooms', data.rooms);
      formData.append('bedrooms', data.bedrooms || 0);
      formData.append('bathrooms', data.bathrooms || 0);
      formData.append('type', data.type);
      formData.append('category_id', data.category_id);
      formData.append('status', data.status || 'available');
      formData.append('features', JSON.stringify(data.features || []));
      
      if (data.images && data.images.length > 0) {
        data.images.forEach(image => {
          formData.append('images[]', image);
        });
      }
      
      const response = await api.post(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur propertyService.update:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur propertyService.delete:', error);
      throw error;
    }
  },

  async uploadImages(id, images) {
    try {
      const formData = new FormData();
      images.forEach(image => formData.append('images[]', image));
      const response = await api.post(`/properties/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur propertyService.uploadImages:', error);
      throw error;
    }
  },

  async getMyProperties() {
    try {
      const response = await api.get('/my/properties');
      return response.data;
    } catch (error) {
      console.error('Erreur propertyService.getMyProperties:', error);
      throw error;
    }
  },
};