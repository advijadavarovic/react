import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import baTranslation from './baTranslation.json';
import enTranslation from './enTranslation.json'

i18n.use(initReactI18next).init({
    lng: 'en',
    debug: true,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    },
    resources: {
        en: { translation: enTranslation },
        ba: { translation: baTranslation }
    },
});


export const convertCurrency = (priceString, fromCurrency, toCurrency) => {
    const cleanedPriceString = priceString.replace('$', '').replace(',', '');
    const amount = parseFloat(cleanedPriceString);
    const conversionRate = 1.81;
    const convertedAmount = amount * conversionRate;
    return convertedAmount.toFixed(2);
};