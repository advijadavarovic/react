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
