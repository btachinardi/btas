import { useMemo } from 'react';
import { usePortfolioData } from './use-portfolio-data.hook';
import { useLocale } from '../contexts/locale.context';
import { formatDateRange } from '../utils/date';

export interface ResolvedEducation {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  achievements: string[];
}

export interface ResolvedInternship {
  id: string;
  companyName: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
}

/**
 * Hook to get education entries with localized text
 */
export function useEducation(): {
  education: ResolvedEducation[];
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();
  const { locale, t } = useLocale();

  const education = useMemo(() => {
    if (!data) return [];

    return data.education.map((edu): ResolvedEducation => ({
      id: edu.id,
      degree: t(edu.degree),
      institution: edu.institution,
      location: `${edu.location.city}, ${edu.location.country}`,
      period: formatDateRange(edu.startDate, edu.endDate, locale),
      achievements: edu.achievements.map((a) => t(a.text)),
    }));
  }, [data, locale, t]);

  return { education, isLoading };
}

/**
 * Hook to get internship entries with localized text
 */
export function useInternships(): {
  internships: ResolvedInternship[];
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();
  const { locale, t, td } = useLocale();

  const internships = useMemo(() => {
    if (!data) return [];

    // Simple locale-based remote label
    const remoteLabel = locale === 'pt' ? 'Remoto' : locale === 'es' ? 'Remoto' : 'Remote';

    return data.internships.map((intern): ResolvedInternship => {
      const location = intern.location.isRemote
        ? remoteLabel
        : `${intern.location.city}, ${intern.location.country}`;

      return {
        id: intern.id,
        companyName: intern.company.name,
        role: t(intern.role),
        period: formatDateRange(intern.startDate, intern.endDate, locale),
        location,
        description: td(intern.description),
        achievements: intern.achievements.map((a) => td(a.text)),
      };
    });
  }, [data, locale, t, td]);

  return { internships, isLoading };
}
