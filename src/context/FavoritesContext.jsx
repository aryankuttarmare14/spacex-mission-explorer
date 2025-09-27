import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

const FAVORITES_STORAGE_KEY = 'spacex_favorites';

/**
 * FavoritesProvider component that manages favorites state and localStorage persistence
 */
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  /**
   * Toggle favorite status for a launch
   * @param {string} launchId - The ID of the launch to toggle
   */
  const toggleFavorite = (launchId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(launchId)) {
        // Remove from favorites
        return prevFavorites.filter(id => id !== launchId);
      } else {
        // Add to favorites
        return [...prevFavorites, launchId];
      }
    });
  };

  /**
   * Check if a launch is favorited
   * @param {string} launchId - The ID of the launch to check
   * @returns {boolean} True if the launch is favorited
   */
  const isFavorite = (launchId) => {
    return favorites.includes(launchId);
  };

  /**
   * Get the number of favorites
   * @returns {number} The number of favorited launches
   */
  const getFavoritesCount = () => {
    return favorites.length;
  };

  /**
   * Clear all favorites
   */
  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Hook to use the FavoritesContext
 * @returns {object} The favorites context value
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
