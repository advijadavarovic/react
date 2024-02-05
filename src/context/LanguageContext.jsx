import {createContext, useContext, useState} from 'react';
import i18n from "../translate/i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
    const [language, setLanguage] = useState('en');
    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
    };
return (
    <LanguageContext.Provider value = {{language, changeLanguage}}>
        {children}
    </LanguageContext.Provider>
);

};

export const useLanguage = () => {
    return useContext(LanguageContext);
};