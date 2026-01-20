"use client";

import { type ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { initI18n, i18next } from "@/lib/i18n";
import { useLangAttribute } from "@/hooks/shared/use-lang-attribute";
import { type SupportedLanguage } from "@/shared/const/i18n";

// Component that uses the lang attribute hook inside I18nextProvider
function I18nContent({ children }: { children: ReactNode }) {
  useLangAttribute();
  return <>{children}</>;
}

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
}

/**
 * I18nProvider - Initializes i18n with server-side detected language
 *
 * This ensures the correct language is set immediately without flash
 * of wrong language. We wait for init to complete before rendering.
 */
export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Get initial language from server-side detection or HTML lang attribute
    const detectedLang =
      initialLanguage ||
      (typeof document !== "undefined"
        ? (document.documentElement.lang as SupportedLanguage)
        : undefined);

    // Initialize i18n with detected language
    const i18nInstance = initI18n(detectedLang);

    // Wait for initialization to complete
    if (i18nInstance.isInitialized) {
      setIsReady(true);
    } else {
      const handleInitialized = () => {
        setIsReady(true);
      };

      i18nInstance.on("initialized", handleInitialized);

      // Fallback: proceed after a short delay if init takes too long
      const timeout = setTimeout(() => {
        setIsReady(true);
      }, 100);

      return () => {
        i18nInstance.off("initialized", handleInitialized);
        clearTimeout(timeout);
      };
    }
  }, [initialLanguage]);

  // Don't render until i18n is ready to prevent language flash
  if (!isReady) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18next}>
      <I18nContent>{children}</I18nContent>
    </I18nextProvider>
  );
}
