import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Cache from "i18next-localstorage-cache";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
 
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(Cache)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
