import api from './api';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      // Envoyer le rôle dans les données d'inscription
      const response = await api.post('/register', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Erreur register:', error);
      throw error;
    }
  },

  async logout() {
    // Always clear local state first so the user is never stuck logged in
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      // Log but don't rethrow — local logout already succeeded
      console.warn('Erreur logout API (ignorée, déconnexion locale effectuée):', error?.response?.status);
      return { success: true };
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      throw error;
    }
  },

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};