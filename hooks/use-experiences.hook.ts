import { useMemo } from 'react';
import { usePortfolioData } from './use-portfolio-data.hook';
import { useLocale } from '../contexts/locale.context';
import { formatDateRange, calculateDurationMonths, formatDuration } from '../utils/date';
import type { Experience, Skill, Location } from '../types/portfolio-data.types';

export interface ResolvedExperience {
  id: string;
  companyName: string;
  roleTitle: string;
  period: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
  skills: Skill[];
  isCurrent: boolean;
  sortOrder: number;
}

/**
 * Hook to get resolved experiences with all text localized
 */
export function useExperiences(): {
  experiences: ResolvedExperience[];
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();
  const { locale, documentType, t, td } = useLocale();

  const experiences = useMemo(() => {
    if (!data) return [];

    const skillMap = new Map(data.skills.map((s) => [s.id, s]));

    return data.experiences
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((exp): ResolvedExperience => {
        const currentRole = exp.roles[exp.roles.length - 1];
        const firstRole = exp.roles[0];

        const period = formatDateRange(
          firstRole.startDate,
          currentRole.endDate,
          locale
        );

        const months = calculateDurationMonths(
          firstRole.startDate,
          currentRole.endDate
        );
        const duration = formatDuration(months, locale);

        return {
          id: exp.id,
          companyName: exp.company.name,
          roleTitle: t(currentRole.title),
          period,
          duration,
          location: resolveLocation(exp.location, t, locale),
          description: td(exp.description),
          achievements: exp.achievements.map((a) => td(a.text)),
          skills: exp.skillIds
            .map((id) => skillMap.get(id))
            .filter((s): s is Skill => s !== undefined),
          isCurrent: currentRole.isCurrent,
          sortOrder: exp.sortOrder,
        };
      });
  }, [data, locale, documentType, t, td]);

  return { experiences, isLoading };
}

/**
 * Hook to get only current experiences
 */
export function useCurrentExperiences(): {
  experiences: ResolvedExperience[];
  isLoading: boolean;
} {
  const { experiences, isLoading } = useExperiences();

  const currentExperiences = useMemo(
    () => experiences.filter((exp) => exp.isCurrent),
    [experiences]
  );

  return { experiences: currentExperiences, isLoading };
}

/**
 * Hook to get experiences limited to a specific count
 */
export function useRecentExperiences(count: number): {
  experiences: ResolvedExperience[];
  isLoading: boolean;
} {
  const { experiences, isLoading } = useExperiences();

  const recentExperiences = useMemo(
    () => experiences.slice(0, count),
    [experiences, count]
  );

  return { experiences: recentExperiences, isLoading };
}

function resolveLocation(
  location: Location,
  t: (key: string) => string,
  locale: string
): string {
  if (location.label) {
    return t(location.label);
  }

  if (location.isRemote) {
    // Simple locale-based remote label
    return locale === 'pt' ? 'Remoto' : locale === 'es' ? 'Remoto' : 'Remote';
  }

  const parts = [location.city, location.country].filter(Boolean);
  return parts.join(', ');
}
