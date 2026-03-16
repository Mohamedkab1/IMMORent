import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erreur 401 - Non authentifié
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Rediriger vers login si pas déjà sur login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Erreur 403 - Non autorisé
      if (error.response.status === 403) {
        console.error('Accès non autorisé');
      }
      
      // Erreur 422 - Validation
      if (error.response.status === 422) {
        console.error('Erreur de validation', error.response.data.errors);
      }
      
      // Erreur 500 - Serveur
      if (error.response.status >= 500) {
        console.error('Erreur serveur', error.response.data);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;