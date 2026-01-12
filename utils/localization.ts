import type {
  Locale,
  DocumentType,
  TranslationMap,
  TranslationKey,
  DocumentVariantKeys,
  LocalizedString,
  DocumentVariant,
  LocalizedDocumentText,
} from '../types/portfolio-data.types';

// ===========================================================================
// Translation Loading
// ===========================================================================

/** Cache for loaded translations */
const translationCache: Partial<Record<Locale, TranslationMap>> = {};

/**
 * Loads translations for a specific locale.
 * Caches the result to avoid repeated fetches.
 */
export async function loadTranslations(locale: Locale): Promise<TranslationMap> {
  // Return cached translations if available
  if (translationCache[locale]) {
    return translationCache[locale]!;
  }

  try {
    const response = await fetch(`/data/translations/${locale}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${locale}: ${response.status}`);
    }
    const translations = (await response.json()) as TranslationMap;
    translationCache[locale] = translations;
    return translations;
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    // Return empty map on error - will cause fallback to keys
    return {};
  }
}

/**
 * Loads translations statically (for Vite bundling).
 * Use this when you want to bundle translations at build time.
 */
export function loadTranslationsSync(locale: Locale): TranslationMap | null {
  return translationCache[locale] ?? null;
}

/**
 * Sets translations in the cache (useful for static imports).
 */
export function setTranslations(locale: Locale, translations: TranslationMap): void {
  translationCache[locale] = translations;
}

/**
 * Clears the translation cache for a specific locale or all locales.
 */
export function clearTranslationCache(locale?: Locale): void {
  if (locale) {
    delete translationCache[locale];
  } else {
    Object.keys(translationCache).forEach((key) => {
      delete translationCache[key as Locale];
    });
  }
}

// ===========================================================================
// Translation Resolution
// ===========================================================================

/**
 * Translates a key using the provided translation map.
 * Returns the key itself if no translation is found.
 *
 * @param key - The translation key (e.g., "profile.title")
 * @param translations - The translation map for the current locale
 * @returns The translated string or the key if not found
 */
export function t(key: TranslationKey, translations: TranslationMap): string {
  return translations[key] ?? key;
}

/**
 * Translates a document-variant key based on document type.
 * Falls back to 'cv' if the requested document type is not available.
 *
 * @param keys - The document variant keys object
 * @param documentType - The desired document type
 * @param translations - The translation map for the current locale
 * @returns The translated string
 */
export function td(
  keys: DocumentVariantKeys,
  documentType: DocumentType,
  translations: TranslationMap
): string {
  // Try the requested document type first
  const key = keys[documentType];
  if (key !== undefined) {
    return t(key, translations);
  }

  // Fall back to cv
  return t(keys.cv, translations);
}

/**
 * Creates a bound translator function for a specific locale's translations.
 * Useful for components that need to translate many strings.
 */
export function createTranslator(translations: TranslationMap) {
  return {
    /** Translate a single key */
    t: (key: TranslationKey) => t(key, translations),
    /** Translate a document-variant key */
    td: (keys: DocumentVariantKeys, documentType: DocumentType) =>
      td(keys, documentType, translations),
  };
}

// ===========================================================================
// Legacy Support Functions
// ===========================================================================

/**
 * @deprecated Use t() with TranslationMap instead.
 * Resolves a localized string to a specific locale with fallback to English.
 */
export function resolveLocalized(
  text: LocalizedString | string,
  locale: Locale = 'en'
): string {
  if (typeof text === 'string') {
    return text;
  }
  return text[locale] ?? text.en;
}

/**
 * @deprecated Use td() with TranslationMap instead.
 * Resolves a document-variant text for a specific document type.
 * Falls back to 'cv' if the requested document type is not available.
 */
export function resolveDocumentVariant(
  variant: DocumentVariant | Partial<DocumentVariant>,
  documentType: DocumentType = 'cv'
): string {
  const result = variant[documentType];
  if (result !== undefined) {
    return result;
  }
  // Fallback to cv
  if (variant.cv !== undefined) {
    return variant.cv;
  }
  // Last resort: return first available
  return variant.coverLetter ?? variant.portfolio ?? '';
}

/**
 * @deprecated Use td() with TranslationMap instead.
 * Resolves a fully localized and document-variant text.
 * Fallback chain: requested locale -> 'en', requested document -> 'cv'
 */
export function resolveLocalizedDocument(
  text: LocalizedDocumentText,
  locale: Locale = 'en',
  documentType: DocumentType = 'cv'
): string {
  // Handle case where text is actually a simple LocalizedString (not document-variant)
  // This happens when td() is called with a LocalizedString instead of LocalizedDocumentText
  if (text && typeof text.en === 'string') {
    // It's a simple LocalizedString, use resolveLocalized instead
    return resolveLocalized(text as unknown as LocalizedString, locale);
  }

  // Try requested locale first
  const localeText = text[locale];
  if (localeText !== undefined) {
    const result = localeText[documentType];
    if (result !== undefined) {
      return result;
    }
    // Try cv fallback for this locale
    if (localeText.cv !== undefined) {
      return localeText.cv;
    }
  }

  // Fall back to English
  const enText = text.en;
  if (!enText) {
    // If no English text, return empty string to avoid crash
    return '';
  }
  const enResult = enText[documentType];
  if (enResult !== undefined) {
    return enResult;
  }

  // Final fallback: English CV
  return enText.cv ?? '';
}

/**
 * Type guard to check if a value is a LocalizedString
 */
export function isLocalizedString(value: unknown): value is LocalizedString {
  return (
    typeof value === 'object' &&
    value !== null &&
    'en' in value &&
    typeof (value as LocalizedString).en === 'string'
  );
}

/**
 * Type guard to check if a value is a LocalizedDocumentText
 */
export function isLocalizedDocumentText(
  value: unknown
): value is LocalizedDocumentText {
  if (typeof value !== 'object' || value === null) return false;
  if (!('en' in value)) return false;

  const enValue = (value as { en: unknown }).en;
  return (
    typeof enValue === 'object' &&
    enValue !== null &&
    'cv' in enValue &&
    typeof (enValue as { cv: unknown }).cv === 'string'
  );
}

/**
 * @deprecated Use createTranslator() instead.
 * Creates a helper function bound to a specific locale.
 * Useful for components that need to resolve many strings.
 */
export function createLocalizer(locale: Locale) {
  return {
    t: (text: LocalizedString | string) => resolveLocalized(text, locale),
    td: (text: LocalizedDocumentText, documentType: DocumentType = 'cv') =>
      resolveLocalizedDocument(text, locale, documentType),
  };
}

// ===========================================================================
// Utility Functions
// ===========================================================================

/**
 * Returns display name for a language level.
 * These are static and don't need external translations.
 */
export function getLanguageLevelDisplay(
  level: 'native' | 'fluent' | 'intermediate' | 'basic',
  locale: Locale = 'en'
): string {
  const labels: Record<typeof level, LocalizedString> = {
    native: { en: 'Native', pt: 'Nativo', es: 'Nativo' },
    fluent: { en: 'Fluent', pt: 'Fluente', es: 'Fluido' },
    intermediate: { en: 'Intermediate', pt: 'Intermediario', es: 'Intermedio' },
    basic: { en: 'Basic', pt: 'Basico', es: 'Basico' },
  };
  return resolveLocalized(labels[level], locale);
}

/**
 * Returns the flag emoji for a country code
 */
export function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
