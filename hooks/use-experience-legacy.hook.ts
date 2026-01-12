import { useMemo } from 'react';
import { useExperiences } from './use-experiences.hook';
import { usePortfolioData } from './use-portfolio-data.hook';

/**
 * Skill with category information for colored display
 */
export interface LegacySkill {
  id: string;
  name: string;
  categoryId: string;
  categoryColor: string;
}

/**
 * Legacy experience format for backward compatibility with Experience.tsx
 * This matches the structure from the old constants file
 */
export interface LegacyExperience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  skills: LegacySkill[];
}

/**
 * Hook that returns experiences in the legacy format expected by Experience.tsx
 * This maintains backward compatibility with the scroll synchronization logic
 * which depends on array indices.
 */
export function useExperienceLegacy(): {
  experiences: LegacyExperience[];
  isLoading: boolean;
} {
  const { experiences, isLoading } = useExperiences();
  const { data } = usePortfolioData();

  const legacyExperiences = useMemo((): LegacyExperience[] => {
    // Create a map of category ID to color
    const categoryColorMap = new Map(
      data?.skillCategories.map((cat) => [cat.id, cat.color]) ?? []
    );

    return experiences.map((exp) => ({
      company: exp.companyName,
      role: exp.roleTitle,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: exp.achievements,
      skills: exp.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        categoryId: skill.categoryId,
        categoryColor: categoryColorMap.get(skill.categoryId) ?? 'slate',
      })),
    }));
  }, [experiences, data]);

  return { experiences: legacyExperiences, isLoading };
}
