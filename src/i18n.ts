import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ruTranslations from "./locales/ru/translation.json";
import kgTranslations from "./locales/kg/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ruTranslations },
      kg: { translation: kgTranslations },
    },
    lng: localStorage.getItem("language") || "ru", // язык по умолчанию
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
