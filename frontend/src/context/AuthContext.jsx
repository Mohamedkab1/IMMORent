import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      const token = localStorage.getItem('token');
      
      console.log('Init Auth - Token présent:', !!token);
      console.log('Stored user:', storedUser);
      
      if (storedUser && token) {
        setUser(storedUser);
        try {
          // Vérifier que le token est toujours valide
          const response = await authService.getCurrentUser();
          console.log('Current user response:', response);
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
          console.error('Session expirée', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    console.log('Login response:', response);
    if (response.success && response.data.user) {
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response.success && response.data.user) {
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Créer les méthodes de vérification
  const isAdmin = user?.role?.slug === 'admin';
  const isAgent = user?.role?.slug === 'agent';
  const isClient = user?.role?.slug === 'client';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    isAgent,
    isClient,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};