"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook to automatically update HTML lang attribute when language changes
 * This helps with SEO and accessibility
 */
export function useLangAttribute() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Update HTML lang attribute when language changes
    const updateLangAttribute = (lng: string) => {
      if (typeof document !== "undefined") {
        document.documentElement.lang = lng;
      }
    };

    // Set initial language
    updateLangAttribute(i18n.language);

    // Listen for language changes
    i18n.on("languageChanged", updateLangAttribute);

    // Cleanup
    return () => {
      i18n.off("languageChanged", updateLangAttribute);
    };
  }, [i18n]);
}
