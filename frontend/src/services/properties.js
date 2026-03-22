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
      // Ne pas mettre de Content-Type, laisser axios le gérer automatiquement
      const response = await api.post('/properties', data, {
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
      const response = await api.post(`/properties/${id}?_method=PUT`, data, {
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
  }
};