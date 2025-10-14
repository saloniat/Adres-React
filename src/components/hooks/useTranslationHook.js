// useTranslationHook.js
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
const useTranslationHook = () => {
    const { t, i18n } = useTranslation();
    // Change the document direction based on the selected language

    // useEffect(() => {
    //     document.documentElement.dir = i18n.dir(); // Set the direction for the entire document
    //     //eslint-disable-next-line
    // }, [i18n.language]);

    // Function to change language (for example, via button clicks)
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return { t, changeLanguage };
};
export default useTranslationHook;
