import type { Locale, LocalizedString } from '../types/portfolio-data.types';
import { resolveLocalized } from './localization';

/**
 * Parses an ISO 8601 partial date (YYYY-MM) into a Date object.
 * Sets the date to the first day of the month.
 */
export function parseISODate(isoDate: string): Date {
  const [year, month] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * Formats a date for display with locale-aware month names.
 * @param isoDate - ISO 8601 partial date (YYYY-MM)
 * @param locale - Target locale for formatting
 * @param format - 'short' for "Jan 2025", 'long' for "January 2025"
 */
export function formatDate(
  isoDate: string,
  locale: Locale = 'en',
  format: 'short' | 'long' = 'short'
): string {
  const date = parseISODate(isoDate);

  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    pt: 'pt-BR',
    es: 'es-ES',
  };

  return date.toLocaleDateString(localeMap[locale], {
    month: format,
    year: 'numeric',
  });
}

/**
 * Formats a date range for display.
 * Handles current positions by displaying "Present" in the appropriate locale.
 */
export function formatDateRange(
  startDate: string,
  endDate: string | null,
  locale: Locale = 'en',
  format: 'short' | 'long' = 'short'
): string {
  const start = formatDate(startDate, locale, format);

  if (endDate === null) {
    const presentLabel: LocalizedString = {
      en: 'Present',
      pt: 'Atual',
      es: 'Actual',
    };
    return `${start} - ${resolveLocalized(presentLabel, locale)}`;
  }

  const end = formatDate(endDate, locale, format);
  return `${start} - ${end}`;
}

/**
 * Calculates the duration between two dates in months.
 */
export function calculateDurationMonths(
  startDate: string,
  endDate: string | null
): number {
  const start = parseISODate(startDate);
  const end = endDate ? parseISODate(endDate) : new Date();

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  return Math.max(1, months);
}

/**
 * Formats a duration in months to a human-readable string.
 */
export function formatDuration(
  months: number,
  locale: Locale = 'en'
): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const labels: Record<string, LocalizedString> = {
    year: { en: 'year', pt: 'ano', es: 'ano' },
    years: { en: 'years', pt: 'anos', es: 'anos' },
    month: { en: 'month', pt: 'mes', es: 'mes' },
    months: { en: 'months', pt: 'meses', es: 'meses' },
  };

  const parts: string[] = [];

  if (years > 0) {
    const yearLabel = years === 1 ? 'year' : 'years';
    parts.push(`${years} ${resolveLocalized(labels[yearLabel], locale)}`);
  }

  if (remainingMonths > 0) {
    const monthLabel = remainingMonths === 1 ? 'month' : 'months';
    parts.push(`${remainingMonths} ${resolveLocalized(labels[monthLabel], locale)}`);
  }

  return parts.join(' ');
}

/**
 * Calculates and formats the duration between two dates.
 */
export function formatDateRangeWithDuration(
  startDate: string,
  endDate: string | null,
  locale: Locale = 'en'
): { range: string; duration: string } {
  const range = formatDateRange(startDate, endDate, locale);
  const months = calculateDurationMonths(startDate, endDate);
  const duration = formatDuration(months, locale);

  return { range, duration };
}

/**
 * Gets the year from an ISO date string.
 */
export function getYear(isoDate: string): number {
  return parseInt(isoDate.split('-')[0], 10);
}

/**
 * Sorts items by date (newest first).
 */
export function sortByDateDesc<T extends { startDate: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = parseISODate(a.startDate);
    const dateB = parseISODate(b.startDate);
    return dateB.getTime() - dateA.getTime();
  });
}
