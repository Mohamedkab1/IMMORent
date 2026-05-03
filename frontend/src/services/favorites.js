import api from './api';

export const favoriteService = {
  getFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Erreur réseau' };
    }
  },

  toggleFavorite: async (propertyId) => {
    try {
      const response = await api.post('/favorites/toggle', { property_id: propertyId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Erreur réseau' };
    }
  }
};
