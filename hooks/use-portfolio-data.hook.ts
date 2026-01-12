import { useState, useEffect } from 'react';
import type { PortfolioData, TranslationMap, Locale } from '../types/portfolio-data.types';

// Import the JSON data statically for Vite
import portfolioData from '../data/portfolio.json';

// Static import of English translations (always available)
import enTranslations from '../data/translations/en.json';

interface UsePortfolioDataResult {
  data: PortfolioData;
  isLoading: boolean;
  error: Error | null;
}

interface UseTranslationsResult {
  translations: TranslationMap;
  isLoading: boolean;
  error: Error | null;
}

interface UsePortfolioWithTranslationsResult {
  data: PortfolioData;
  translations: TranslationMap;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to access the portfolio data.
 * Data is loaded statically from the JSON file.
 */
export function usePortfolioData(): UsePortfolioDataResult {
  // Data is imported statically, so no async loading needed
  // This approach works well with Vite's JSON import
  return {
    data: portfolioData as PortfolioData,
    isLoading: false,
    error: null,
  };
}

/**
 * Hook to load translations for a specific locale.
 * English is bundled statically, other locales are loaded dynamically.
 */
export function useTranslations(locale: Locale): UseTranslationsResult {
  const [translations, setTranslations] = useState<TranslationMap>(
    locale === 'en' ? enTranslations : {}
  );
  const [isLoading, setIsLoading] = useState(locale !== 'en');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // English is bundled statically
    if (locale === 'en') {
      setTranslations(enTranslations);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Load other locales dynamically
    async function loadLocaleTranslations() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/data/translations/${locale}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${locale}: ${response.status}`);
        }
        const data = (await response.json()) as TranslationMap;
        setTranslations(data);
      } catch (err) {
        console.error(`Error loading translations for ${locale}:`, err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        // Fall back to English translations on error
        setTranslations(enTranslations);
      } finally {
        setIsLoading(false);
      }
    }

    loadLocaleTranslations();
  }, [locale]);

  return {
    translations,
    isLoading,
    error,
  };
}

/**
 * Combined hook to access both portfolio data and translations.
 * This is the recommended hook for most use cases.
 */
export function usePortfolioWithTranslations(locale: Locale): UsePortfolioWithTranslationsResult {
  const { data } = usePortfolioData();
  const { translations, isLoading, error } = useTranslations(locale);

  return {
    data,
    translations,
    isLoading,
    error,
  };
}

/**
 * Alternative hook for dynamic loading (if needed for SSR or lazy loading)
 */
export function usePortfolioDataAsync(): UsePortfolioDataResult {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/data/portfolio.json');
        if (!response.ok) {
          throw new Error(`Failed to load portfolio data: ${response.status}`);
        }
        const portfolioData = (await response.json()) as PortfolioData;
        setData(portfolioData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return {
    data: data as PortfolioData,
    isLoading,
    error,
  };
}

/**
 * Alternative combined hook for dynamic loading of both data and translations.
 */
export function usePortfolioWithTranslationsAsync(locale: Locale): UsePortfolioWithTranslationsResult {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [translations, setTranslations] = useState<TranslationMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadAll() {
      setIsLoading(true);
      setError(null);

      try {
        // Load both in parallel
        const [portfolioResponse, translationsResponse] = await Promise.all([
          fetch('/data/portfolio.json'),
          fetch(`/data/translations/${locale}.json`),
        ]);

        if (!portfolioResponse.ok) {
          throw new Error(`Failed to load portfolio data: ${portfolioResponse.status}`);
        }

        const portfolioData = (await portfolioResponse.json()) as PortfolioData;
        setData(portfolioData);

        if (translationsResponse.ok) {
          const translationsData = (await translationsResponse.json()) as TranslationMap;
          setTranslations(translationsData);
        } else {
          // Fall back to English if the requested locale fails
          if (locale !== 'en') {
            const enResponse = await fetch('/data/translations/en.json');
            if (enResponse.ok) {
              const enData = (await enResponse.json()) as TranslationMap;
              setTranslations(enData);
            }
          }
          console.warn(`Translations for ${locale} not available, using fallback`);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    loadAll();
  }, [locale]);

  return {
    data: data as PortfolioData,
    translations,
    isLoading,
    error,
  };
}
