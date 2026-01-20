export const SUPPORTED_LANGUAGES = ["en", "vi", "ja"] as const;
export const DEFAULT_LANGUAGE = "en" as const;
export const LANGUAGE_COOKIE = "chatweb-language" as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_CONFIG = {
  SUPPORTED: SUPPORTED_LANGUAGES,
  DEFAULT: DEFAULT_LANGUAGE,
  COOKIE_NAME: LANGUAGE_COOKIE,
  COOKIE_MAX_AGE: 60 * 60 * 24 * 365, // 1 year
  DETECTION_TIMEOUT: 1000, // 1 second
} as const;

export const LANGUAGE_NAMES = {
  en: "English",
  vi: "Tiếng Việt",
} as const;

export const LANGUAGE_FLAGS = {
  en: "🇺🇸",
  vi: "🇻🇳",
} as const;

export const LANGUAGE_TO_COUNTRY_CODE = {
  auto: null,
  en: "us",
  vi: "vn",
} as const;
