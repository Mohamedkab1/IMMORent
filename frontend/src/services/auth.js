import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async logout() {
    const response = await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/me');
    return response.data;
  },

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};