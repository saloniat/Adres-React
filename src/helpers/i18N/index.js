import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: sessionStorage.getItem("i18nextLng") || "en",
        detection: {
            order: ["sessionStorage"],
            caches: ["sessionStorage"],
        },
        // debug: process.env.NODE_ENV === "development",
        fallbackLng: "en",
        keySeparator: ".",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
