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
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'images' && data[key]) {
          data[key].forEach(image => formData.append('images[]', image));
        } else {
          formData.append(key, data[key]);
        }
      });
      const response = await api.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur propertyService.create:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/properties/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur propertyService.update(${id}):`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur propertyService.delete(${id}):`, error);
      throw error;
    }
  },

  async uploadImages(id, images) {
    try {
      const formData = new FormData();
      images.forEach(image => formData.append('images[]', image));
      const response = await api.post(`/properties/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur propertyService.uploadImages(${id}):`, error);
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