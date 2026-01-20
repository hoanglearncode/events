"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "@/locales/en.json";
import vi from "@/locales/vi.json";
import { LANGUAGE_CONFIG } from "@/shared/const/i18n";

let initialized = false;

// Use external JSON resources via HTTP backend for better maintainability
const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
} as const;

export function initI18n(initialLanguage?: string) {
  if (initialized) {
    // If already initialized but need to change language, do it immediately
    if (initialLanguage && i18next.language !== initialLanguage) {
      i18next.changeLanguage(initialLanguage);
    }
    return i18next;
  }
  initialized = true;

  // Determine initial language: use provided language or let detector handle it
  const lng = initialLanguage || undefined;

  // Init i18n - this is async but we'll handle it properly
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      lng, // Set initial language if provided (overrides detector)
      fallbackLng: LANGUAGE_CONFIG.DEFAULT,
      supportedLngs: [...LANGUAGE_CONFIG.SUPPORTED],
      load: "languageOnly",
      nonExplicitSupportedLngs: true,
      // Single-file per language (default namespace 'translation')
      ns: ["translation"],
      defaultNS: "translation",
      interpolation: { escapeValue: false },
      detection: {
        order: ["cookie", "localStorage", "navigator"],
        lookupCookie: LANGUAGE_CONFIG.COOKIE_NAME,
        lookupLocalStorage: LANGUAGE_CONFIG.COOKIE_NAME,
        caches: ["localStorage", "cookie"],
      },
      react: {
        useSuspense: false,
      },
    })
    .catch(() => {});

  return i18next;
}

export { i18next };
