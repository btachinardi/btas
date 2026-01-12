import { useMemo } from 'react';
import { useExperiences } from './use-experiences.hook';

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
  skills: string[];
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

  const legacyExperiences = useMemo((): LegacyExperience[] => {
    return experiences.map((exp) => ({
      company: exp.companyName,
      role: exp.roleTitle,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: exp.achievements,
      skills: exp.skills.map((skill) => skill.name),
    }));
  }, [experiences]);

  return { experiences: legacyExperiences, isLoading };
}
