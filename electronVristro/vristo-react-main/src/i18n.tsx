import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import themeConfig from './theme.config';
import path from 'path';
import { app } from 'electron';

// Determine if running in Electron
const isElectron = () => {
    const userAgent = window.navigator.userAgent;
    return userAgent.includes('Electron');
};

// Define the load path for translations based on the environment
const loadPath = isElectron()
    ? `file://${path.join(app.getAppPath(), 'locales/{{lng}}/{{ns}}.json')}`
    : '/locales/{{lng}}/{{ns}}.json'; // Vite serves from public

i18n
    // Load translation using http or file protocol
    .use(Backend)
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        fallbackLng: themeConfig.locale || 'en',
        debug: false,
        load: 'languageOnly',
        backend: {
            loadPath: loadPath, // Use the dynamic loadPath
        },
    });

export default i18n;
