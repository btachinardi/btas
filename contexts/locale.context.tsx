import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { ReactNode } from 'react';
import type {
  Locale,
  DocumentType,
  TranslationMap,
  TranslationKey,
  DocumentVariantKeys,
  LocalizedString,
  LocalizedDocumentText,
} from '../types/portfolio-data.types';
import {
  t as translate,
  td as translateDocument,
  resolveLocalized,
  resolveLocalizedDocument,
} from '../utils/localization';
import { useTranslations } from '../hooks/use-portfolio-data.hook';

interface LocaleContextValue {
  /** Current locale */
  locale: Locale;
  /** Current document type context */
  documentType: DocumentType;
  /** Current translations map */
  translations: TranslationMap;
  /** Whether translations are loading */
  isLoadingTranslations: boolean;
  /** Set the current locale */
  setLocale: (locale: Locale) => void;
  /** Set the current document type */
  setDocumentType: (type: DocumentType) => void;
  /** Translate a key to the current locale */
  t: (key: TranslationKey) => string;
  /** Translate a document-variant key based on current document type */
  td: (keys: DocumentVariantKeys) => string;
  /** List of supported locales */
  supportedLocales: Locale[];
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
  defaultDocumentType?: DocumentType;
}

export function LocaleProvider({
  children,
  defaultLocale = 'en',
  defaultDocumentType = 'portfolio',
}: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [documentType, setDocumentType] = useState<DocumentType>(defaultDocumentType);

  // Load translations for the current locale
  const { translations, isLoading: isLoadingTranslations } = useTranslations(locale);

  const t = useCallback(
    (key: TranslationKey) => translate(key, translations),
    [translations]
  );

  const td = useCallback(
    (keys: DocumentVariantKeys) => translateDocument(keys, documentType, translations),
    [translations, documentType]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      documentType,
      translations,
      isLoadingTranslations,
      setLocale,
      setDocumentType,
      t,
      td,
      supportedLocales: ['en', 'pt', 'es'],
    }),
    [locale, documentType, translations, isLoadingTranslations, t, td]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/**
 * Hook to access the locale context.
 * Must be used within a LocaleProvider.
 */
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

/**
 * Hook to get locale display names
 */
export function useLocaleNames(): Record<Locale, string> {
  const { locale } = useLocale();

  return useMemo(() => {
    const names: Record<Locale, LocalizedString> = {
      en: { en: 'English', pt: 'Ingles', es: 'Ingles' },
      pt: { en: 'Portuguese', pt: 'Portugues', es: 'Portugues' },
      es: { en: 'Spanish', pt: 'Espanhol', es: 'Espanol' },
    };

    return {
      en: resolveLocalized(names.en, locale),
      pt: resolveLocalized(names.pt, locale),
      es: resolveLocalized(names.es, locale),
    };
  }, [locale]);
}

/**
 * Hook to get document type display names
 */
export function useDocumentTypeNames(): Record<DocumentType, string> {
  const { locale } = useLocale();

  return useMemo(() => {
    const names: Record<DocumentType, LocalizedString> = {
      cv: { en: 'CV', pt: 'Curriculo', es: 'Curriculum' },
      coverLetter: { en: 'Cover Letter', pt: 'Carta de Apresentacao', es: 'Carta de Presentacion' },
      portfolio: { en: 'Portfolio', pt: 'Portfolio', es: 'Portafolio' },
    };

    return {
      cv: resolveLocalized(names.cv, locale),
      coverLetter: resolveLocalized(names.coverLetter, locale),
      portfolio: resolveLocalized(names.portfolio, locale),
    };
  }, [locale]);
}

// ===========================================================================
// Legacy Support Types and Hooks
// ===========================================================================

/**
 * @deprecated Legacy context value interface for backwards compatibility.
 * Use LocaleContextValue instead.
 */
interface LegacyLocaleContextValue {
  locale: Locale;
  documentType: DocumentType;
  setLocale: (locale: Locale) => void;
  setDocumentType: (type: DocumentType) => void;
  /** @deprecated Use t(key) with TranslationKey instead */
  t: (text: LocalizedString | string) => string;
  /** @deprecated Use td(keys) with DocumentVariantKeys instead */
  td: (text: LocalizedDocumentText) => string;
  supportedLocales: Locale[];
}

/**
 * @deprecated Legacy hook for backwards compatibility.
 * Use useLocale() instead with the new t() and td() signatures.
 */
export function useLegacyLocale(): LegacyLocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLegacyLocale must be used within a LocaleProvider');
  }

  const { locale, documentType, setLocale, setDocumentType, supportedLocales } = context;

  // Legacy t function that accepts LocalizedString objects
  const legacyT = useCallback(
    (text: LocalizedString | string) => resolveLocalized(text, locale),
    [locale]
  );

  // Legacy td function that accepts LocalizedDocumentText objects
  const legacyTd = useCallback(
    (text: LocalizedDocumentText) => resolveLocalizedDocument(text, locale, documentType),
    [locale, documentType]
  );

  return useMemo(
    () => ({
      locale,
      documentType,
      setLocale,
      setDocumentType,
      t: legacyT,
      td: legacyTd,
      supportedLocales,
    }),
    [locale, documentType, setLocale, setDocumentType, legacyT, legacyTd, supportedLocales]
  );
}
