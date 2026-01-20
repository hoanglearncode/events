import { LANGUAGE_CONFIG, type SupportedLanguage } from "@/shared/const/i18n";

// Re-export type for external usage
export type { SupportedLanguage };

interface LanguageWithQuality {
  code: string;
  quality: number;
}

/**
 * Parse Accept-Language header and extract language preferences with quality scores
 */
function parseAcceptLanguageHeader(
  acceptLanguage: string
): LanguageWithQuality[] {
  return acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, quality = "1"] = lang.trim().split(";q=");
      const langCode = code.split("-")[0].toLowerCase(); // Extract language code only
      return {
        code: langCode,
        quality: parseFloat(quality) || 0,
      };
    })
    .sort((a, b) => b.quality - a.quality);
}

/**
 * Find the first supported language from a list of language preferences
 */
function findSupportedLanguage(
  languages: LanguageWithQuality[]
): SupportedLanguage | null {
  for (const lang of languages) {
    if (LANGUAGE_CONFIG.SUPPORTED.includes(lang.code as SupportedLanguage)) {
      return lang.code as SupportedLanguage;
    }
  }
  return null;
}

/**
 * Detect language from cookie value
 */
export function detectLanguageFromCookie(
  cookieValue: string | undefined
): SupportedLanguage | null {
  if (!cookieValue) return null;

  return LANGUAGE_CONFIG.SUPPORTED.includes(cookieValue as SupportedLanguage)
    ? (cookieValue as SupportedLanguage)
    : null;
}

/**
 * Detect language from Accept-Language header
 */
export function detectLanguageFromHeader(
  acceptLanguage: string | null
): SupportedLanguage | null {
  if (!acceptLanguage) return null;

  try {
    const languages = parseAcceptLanguageHeader(acceptLanguage);
    return findSupportedLanguage(languages);
  } catch (error) {
    console.warn("Failed to parse Accept-Language header:", error);
    return null;
  }
}

/**
 * Get the default fallback language
 */
export function getDefaultLanguage(): SupportedLanguage {
  return LANGUAGE_CONFIG.DEFAULT;
}

/**
 * Validate if a language code is supported
 */
export function isLanguageSupported(
  language: string
): language is SupportedLanguage {
  return LANGUAGE_CONFIG.SUPPORTED.includes(language as SupportedLanguage);
}
