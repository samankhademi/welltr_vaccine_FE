import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enPhrases from "./locales/en/en.json";
import faPhrases from "./locales/fa/fa.json";
import esPhrases from "./locales/es/es.json";


const resources = {
    en: enPhrases,
    fa: faPhrases,
    es: esPhrases
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    lng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
