import React, { createContext, useState, useContext } from 'react';

// Cria o contexto
const FavoritesContext = createContext();

// Cria um provedor do contexto
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState({});

    const toggleFavorite = (movieId, status) => {
        setFavorites(prevFavorites => ({
            ...prevFavorites,
            [movieId]: status
        }));
    };

    const getFavoriteStatus = (movieId) => {
        return favorites[movieId] || false;
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, getFavoriteStatus }}>
            {children}
        </FavoritesContext.Provider>
    );
};

// Hook para usar o contexto
export const useFavorites = () => {
    return useContext(FavoritesContext);
};
