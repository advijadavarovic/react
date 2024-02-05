import { createContext, useContext, useState } from 'react';

export const FlightContext = createContext();
export const FlightProvider = ({ children }) => {
    const [itineraries, setItineraries] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [previousSearchResults, setPreviousSearchResults] = useState([]);
    const [favoritesData, setFavoritesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <FlightContext.Provider value={{ itineraries, setItineraries,
                                         favorites, setFavorites,
                                         previousSearchResults, setPreviousSearchResults,
                                         favoritesData, setFavoritesData,
                                         loading, setLoading,
                                         error, setError
        }}>
            {children}
        </FlightContext.Provider>
    );
};

export const useFlightContext = () => {
    return useContext(FlightContext);
};