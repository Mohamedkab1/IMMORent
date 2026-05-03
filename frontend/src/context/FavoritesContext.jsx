import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { favoriteService } from '../services/favorites';

const FavoritesContext = createContext();

export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Initialisation synchrone depuis localStorage pour éviter le clignotement
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('immo_favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  // Flag pour éviter les boucles de sauvegarde au chargement initial
  const [isInitialized, setIsInitialized] = useState(false);

  // Synchronisation avec le backend lorsque l'utilisateur est connecté
  useEffect(() => {
    let isMounted = true;
    const syncFavorites = async () => {
      if (user) {
        try {
          const response = await favoriteService.getFavorites();
          if (response.success && isMounted) {
            const backendFavs = response.data || [];
            
            // Stratégie de fusion : identifier les favoris locaux absents du backend
            const localOnly = favorites.filter(lf => !backendFavs.some(bf => bf.id === lf.id));
            
            if (localOnly.length > 0) {
              // On synchronise chaque favori local manquant vers le backend
              for (const fav of localOnly) {
                try {
                  await favoriteService.toggleFavorite(fav.id);
                } catch (e) {
                  console.error(`Erreur synchro favori ${fav.id}:`, e);
                }
              }
              // Après la synchro, on récupère la liste finale à jour
              const finalResponse = await favoriteService.getFavorites();
              if (finalResponse.success && isMounted) {
                setFavorites(finalResponse.data || []);
              }
            } else {
              setFavorites(backendFavs);
            }
          }
        } catch (error) {
          console.error("Erreur sync favorites backend:", error);
        }
      } else {
        // Utilisateur non connecté ou déconnecté
        if (isInitialized) {
          setFavorites([]);
          localStorage.removeItem('immo_favorites');
        }
      }
      if (isMounted) setIsInitialized(true);
    };

    syncFavorites();
    
    return () => { isMounted = false; };
  }, [user]);

  // Sauvegarder dans localStorage à chaque modification si on a passé l'initialisation
  useEffect(() => {
    if (isInitialized && !user) {
       localStorage.setItem('immo_favorites', JSON.stringify(favorites));
    } else if (isInitialized && user) {
       // Si utilisateur connecté, on pourrait ne pas utiliser localStorage,
       // mais ça ne fait pas de mal pour la persistance locale
       localStorage.setItem('immo_favorites', JSON.stringify(favorites));
    }
  }, [favorites, isInitialized, user]);

  const addFavorite = async (property) => {
    if (!favorites.find(f => f.id === property.id)) {
      setFavorites(prev => [...prev, property]);
      toast.success(t('favorites.added', 'Propriété ajoutée aux favoris'));
      
      if (user) {
        try {
          await favoriteService.toggleFavorite(property.id);
        } catch (e) {
          console.error("Erreur ajout favori backend:", e);
        }
      }
    }
  };

  const removeFavorite = async (propertyId) => {
    setFavorites(prev => prev.filter(f => f.id !== propertyId));
    toast.info(t('favorites.removed', 'Propriété retirée des favoris'));
    
    if (user) {
      try {
        await favoriteService.toggleFavorite(propertyId);
      } catch (e) {
         console.error("Erreur suppression favori backend:", e);
      }
    }
  };

  const toggleFavorite = (property) => {
    const isFav = favorites.find(f => f.id === property.id);
    if (isFav) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  const isFavorite = (propertyId) => {
    return favorites.some(f => f.id === propertyId);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
