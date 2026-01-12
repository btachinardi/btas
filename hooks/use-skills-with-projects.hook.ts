import { useMemo } from 'react';
import { usePortfolioData } from './use-portfolio-data.hook';
import { useLocale } from '../contexts/locale.context';
import type { Skill, SkillCategory, Experience } from '../types/portfolio-data.types';

export interface SkillProjectEvidence {
  experienceId: string;
  companyName: string;
  roleTitle: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface SkillWithProjects extends Skill {
  projects: SkillProjectEvidence[];
}

export interface SkillCategoryWithProjects {
  id: string;
  name: string;
  icon: string;
  color: string;
  skills: SkillWithProjects[];
}

/**
 * Hook to get skills with their associated project evidence.
 * This creates an evidence-based view of skills by linking them to experiences.
 */
export function useSkillsWithProjects(): {
  skills: SkillWithProjects[];
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();
  const { t } = useLocale();

  const skills = useMemo(() => {
    if (!data) return [];

    // Build a map of skill ID to experiences that used it
    const skillToExperiences = new Map<string, Experience[]>();

    for (const experience of data.experiences) {
      for (const skillId of experience.skillIds) {
        const existing = skillToExperiences.get(skillId) ?? [];
        existing.push(experience);
        skillToExperiences.set(skillId, existing);
      }
    }

    // Also check internships
    for (const internship of data.internships) {
      for (const skillId of internship.skillIds) {
        const existing = skillToExperiences.get(skillId) ?? [];
        // Convert internship to experience-like structure for consistency
        existing.push({
          id: internship.id,
          company: internship.company,
          roles: [{
            id: `${internship.id}-role`,
            title: internship.role,
            employmentType: 'internship',
            startDate: internship.startDate,
            endDate: internship.endDate,
            isCurrent: false,
          }],
          location: internship.location,
          description: internship.description,
          achievements: internship.achievements,
          skillIds: internship.skillIds,
          sortOrder: 999,
        } as Experience);
        skillToExperiences.set(skillId, existing);
      }
    }

    return data.skills.map((skill): SkillWithProjects => {
      const experiences = skillToExperiences.get(skill.id) ?? [];

      const projects: SkillProjectEvidence[] = experiences
        .sort((a, b) => {
          // Sort by most recent first
          const dateA = a.roles[0]?.endDate ?? '9999-12';
          const dateB = b.roles[0]?.endDate ?? '9999-12';
          return dateB.localeCompare(dateA);
        })
        .map((exp) => {
          const role = exp.roles[0];
          return {
            experienceId: exp.id,
            companyName: exp.company.name,
            roleTitle: t(role?.title ?? ''),
            description: t(exp.description.portfolio ?? exp.description.cv),
            startDate: role?.startDate ?? '',
            endDate: role?.endDate ?? null,
            isCurrent: role?.isCurrent ?? false,
          };
        });

      return {
        ...skill,
        projects,
      };
    });
  }, [data, t]);

  return { skills, isLoading };
}

/**
 * Hook to get skill categories with their skills and associated project evidence.
 */
export function useSkillCategoriesWithProjects(): {
  categories: SkillCategoryWithProjects[];
  isLoading: boolean;
} {
  const { skills, isLoading: skillsLoading } = useSkillsWithProjects();
  const { data, isLoading: dataLoading } = usePortfolioData();
  const { t } = useLocale();

  const categories = useMemo(() => {
    if (!data) return [];

    const skillsByCategory = new Map<string, SkillWithProjects[]>();
    for (const skill of skills) {
      const existing = skillsByCategory.get(skill.categoryId) ?? [];
      existing.push(skill);
      skillsByCategory.set(skill.categoryId, existing);
    }

    return data.skillCategories.map((category): SkillCategoryWithProjects => ({
      id: category.id,
      name: t(category.name),
      icon: category.icon,
      color: category.color,
      skills: (skillsByCategory.get(category.id) ?? []).sort(
        (a, b) => b.projects.length - a.projects.length || b.proficiency - a.proficiency
      ),
    }));
  }, [data, skills, t]);

  return { categories, isLoading: skillsLoading || dataLoading };
}
