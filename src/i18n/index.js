import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en/translation.json";
import arTranslations from "./locales/ar/translation.json";
import deTranslations from "./locales/de/translation.json";
import plTranslations from "./locales/pl/translation.json";
import csTranslations from "./locales/cs/translation.json";
import nlTranslations from "./locales/nl/translation.json";
import huTranslations from "./locales/hu/translation.json";
import roTranslations from "./locales/ro/translation.json";
import ruTranslations from "./locales/ru/translation.json";
import frTranslations from "./locales/fr/translation.json";

const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
  de: { translation: deTranslations },
  pl: { translation: plTranslations },
  cs: { translation: csTranslations },
  nl: { translation: nlTranslations },
  hu: { translation: huTranslations },
  ro: { translation: roTranslations },
  ru: { translation: ruTranslations },
  fr: { translation: frTranslations },
};

// The URL is the single source of truth for language (e.g. /de/about,
// /fr/projects/xyz). English lives at the root with no prefix. This is a
// self-contained, in-house i18n setup — no third-party translation plugin
// or service is involved in serving the site; it only reads the language
// straight from the path, once, before the app renders.
export const SUPPORTED_LANGUAGES = ["ar", "de", "pl", "cs", "nl", "hu", "ro", "ru", "fr"];
export const DEFAULT_LANGUAGE = "en";

export const detectLanguageFromPath = (pathname) => {
  if (!pathname) return DEFAULT_LANGUAGE;
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return SUPPORTED_LANGUAGES.includes(firstSegment) ? firstSegment : DEFAULT_LANGUAGE;
};

const initialLanguage =
  typeof window !== "undefined" ? detectLanguageFromPath(window.location.pathname) : DEFAULT_LANGUAGE;

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

