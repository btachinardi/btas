import { useMemo } from 'react';
import { usePortfolioData } from './use-portfolio-data.hook';
import { useLocale } from '../contexts/locale.context';

export interface ResolvedAward {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  link: string | null;
  investment: string | null;
}

/**
 * Hook to get all awards with localized text
 */
export function useAwards(): {
  awards: ResolvedAward[];
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();
  const { t, td } = useLocale();

  const awards = useMemo(() => {
    if (!data) return [];

    return data.awards.map((award): ResolvedAward => ({
      id: award.id,
      title: t(award.title),
      organization: award.organization,
      date: award.date,
      description: td(award.description),
      link: award.link,
      investment: award.investment,
    }));
  }, [data, t, td]);

  return { awards, isLoading };
}

/**
 * Hook to get awards with investment amounts
 */
export function useAwardsWithInvestment(): {
  awards: ResolvedAward[];
  isLoading: boolean;
} {
  const { awards, isLoading } = useAwards();

  const awardsWithInvestment = useMemo(
    () => awards.filter((award) => award.investment !== null),
    [awards]
  );

  return { awards: awardsWithInvestment, isLoading };
}

/**
 * Hook to get total number of awards
 */
export function useAwardsCount(): {
  count: number;
  isLoading: boolean;
} {
  const { awards, isLoading } = useAwards();

  return { count: awards.length, isLoading };
}

/**
 * Hook to get awards by year
 */
export function useAwardsByYear(): {
  awardsByYear: Map<string, ResolvedAward[]>;
  years: string[];
  isLoading: boolean;
} {
  const { awards, isLoading } = useAwards();

  const result = useMemo(() => {
    const awardsByYear = new Map<string, ResolvedAward[]>();

    for (const award of awards) {
      const existing = awardsByYear.get(award.date) ?? [];
      existing.push(award);
      awardsByYear.set(award.date, existing);
    }

    const years = Array.from(awardsByYear.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    return { awardsByYear, years };
  }, [awards]);

  return { ...result, isLoading };
}
