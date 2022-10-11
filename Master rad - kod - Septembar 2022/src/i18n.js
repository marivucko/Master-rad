import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enUS, sr, it, hu } from "date-fns/locale";

import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import translationUS from "./assets/languages/us.json";
import translationRS from "./assets/languages/rs.json";
import translationIT from "./assets/languages/it.json";
import translationHU from "./assets/languages/hu.json";

const resources = {
  us: {
    translation: translationUS,
  },
  rs: {
    translation: translationRS,
  },
  it: {
    translation: translationIT,
  },
  hu: {
    translation: translationHU,
    // locale: hu,
  },
};

// const languages = ["us", "rs", "it", "hu"];
const languages = [
  { countryCode: "us", locale: enUS, localeCustomCal: "us-US" },
  { countryCode: "rs", locale: sr, localeCustomCal: "sr-SR" },
  { countryCode: "it", locale: it, localeCustomCal: "it-IT" },
  { countryCode: "hu", locale: hu, localeCustomCal: "hu-HU" },
];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "us",
    debug: true,

    interpolation: {
      escapeValue: false,
    },
  });

export { i18n, languages };
