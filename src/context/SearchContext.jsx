import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [fromValue, setFromValue] = useState('');
    const [toValue, setToValue] = useState('');
    const [departureValue, setDepartureValue] = useState('');
    const [returnValue, setReturnValue] = useState('');
    const [travelers, setTravelers] = useState('');

    return (
        <SearchContext.Provider
            value={{
                fromValue,setFromValue,
                toValue, setToValue,
                departureValue, setDepartureValue,
                returnValue,setReturnValue,
                travelers,setTravelers
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    return useContext(SearchContext);
};