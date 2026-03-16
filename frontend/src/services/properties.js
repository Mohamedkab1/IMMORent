import api from './api';

export const propertyService = {
  async getAll(params = {}) {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  async create(data) {
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
  },

  async update(id, data) {
    const response = await api.put(`/properties/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  async uploadImages(id, images) {
    const formData = new FormData();
    images.forEach(image => formData.append('images[]', image));
    const response = await api.post(`/properties/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getMyProperties() {
    const response = await api.get('/my/properties');
    return response.data;
  },
};