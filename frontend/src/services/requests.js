import api from './api';

export const requestService = {
  async getAll(params = {}) {
    try {
      const response = await api.get('/requests', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur requestService.getAll:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur requestService.getById:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await api.post('/requests', data);
      return response.data;
    } catch (error) {
      console.error('Erreur requestService.create:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/requests/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur requestService.update:', error);
      throw error;
    }
  },

  async cancel(id) {
    try {
      const response = await api.delete(`/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur requestService.cancel:', error);
      throw error;
    }
  },

  async process(id, data) {
    try {
      const response = await api.put(`/requests/${id}/process`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur requestService.process:', error);
      throw error;
    }
  },

  async getMyRequests() {
    try {
      const response = await api.get('/my/requests');
      return response.data;
    } catch (error) {
      console.error('Erreur requestService.getMyRequests:', error);
      throw error;
    }
  },
};