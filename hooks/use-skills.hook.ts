import { useMemo } from 'react';
import { usePortfolioData } from './use-portfolio-data.hook';
import { useLocale } from '../contexts/locale.context';
import type { Skill, SkillCategory } from '../types/portfolio-data.types';

export interface ResolvedSkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  skills: Skill[];
}

/**
 * Hook to get all skills
 */
export function useSkills(): {
  skills: Skill[];
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();

  return {
    skills: data?.skills ?? [],
    isLoading,
  };
}

/**
 * Hook to get skill categories with their skills
 */
export function useSkillCategories(): {
  categories: ResolvedSkillCategory[];
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();
  const { t } = useLocale();

  const categories = useMemo(() => {
    if (!data) return [];

    const skillsByCategory = new Map<string, Skill[]>();
    for (const skill of data.skills) {
      const existing = skillsByCategory.get(skill.categoryId) ?? [];
      existing.push(skill);
      skillsByCategory.set(skill.categoryId, existing);
    }

    return data.skillCategories.map((category): ResolvedSkillCategory => ({
      id: category.id,
      name: t(category.name),
      icon: category.icon,
      color: category.color,
      skills: (skillsByCategory.get(category.id) ?? []).sort(
        (a, b) => b.proficiency - a.proficiency
      ),
    }));
  }, [data, t]);

  return { categories, isLoading };
}

/**
 * Hook to get skills by category ID
 */
export function useSkillsByCategory(categoryId: string): {
  skills: Skill[];
  category: SkillCategory | null;
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();

  const result = useMemo(() => {
    if (!data) {
      return { skills: [], category: null };
    }

    const category = data.skillCategories.find((c) => c.id === categoryId) ?? null;
    const skills = data.skills
      .filter((s) => s.categoryId === categoryId)
      .sort((a, b) => b.proficiency - a.proficiency);

    return { skills, category };
  }, [data, categoryId]);

  return { ...result, isLoading };
}

/**
 * Hook to get top skills (by proficiency)
 */
export function useTopSkills(count: number = 10): {
  skills: Skill[];
  isLoading: boolean;
} {
  const { skills, isLoading } = useSkills();

  const topSkills = useMemo(
    () =>
      [...skills]
        .sort((a, b) => b.proficiency - a.proficiency)
        .slice(0, count),
    [skills, count]
  );

  return { skills: topSkills, isLoading };
}

/**
 * Hook to search skills by name
 */
export function useSearchSkills(query: string): {
  skills: Skill[];
  isLoading: boolean;
} {
  const { skills, isLoading } = useSkills();

  const filteredSkills = useMemo(() => {
    if (!query.trim()) return skills;

    const lowerQuery = query.toLowerCase();
    return skills.filter((s) =>
      s.name.toLowerCase().includes(lowerQuery)
    );
  }, [skills, query]);

  return { skills: filteredSkills, isLoading };
}
