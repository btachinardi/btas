import { useMemo } from 'react';
import { usePortfolioData } from './use-portfolio-data.hook';
import { useLocale } from '../contexts/locale.context';
import { getLanguageLevelDisplay, getFlagEmoji } from '../utils/localization';
import type { LanguageLevel } from '../types/portfolio-data.types';

export interface ResolvedLanguage {
  id: string;
  name: string;
  level: LanguageLevel;
  levelDisplay: string;
  flagCode: string;
  flagEmoji: string;
}

/**
 * Hook to get all languages with localized names and levels
 */
export function useLanguages(): {
  languages: ResolvedLanguage[];
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();
  const { locale, t } = useLocale();

  const languages = useMemo(() => {
    if (!data) return [];

    return data.languages.map((lang): ResolvedLanguage => ({
      id: lang.id,
      name: t(lang.name),
      level: lang.level,
      levelDisplay: getLanguageLevelDisplay(lang.level, locale),
      flagCode: lang.flagCode,
      flagEmoji: getFlagEmoji(lang.flagCode),
    }));
  }, [data, locale, t]);

  return { languages, isLoading };
}

/**
 * Hook to get a summary of languages as a formatted string
 */
export function useLanguagesSummary(): {
  summary: string;
  isLoading: boolean;
} {
  const { languages, isLoading } = useLanguages();

  const summary = useMemo(() => {
    return languages
      .map((lang) => `${lang.name} (${lang.levelDisplay})`)
      .join(', ');
  }, [languages]);

  return { summary, isLoading };
}
