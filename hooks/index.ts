// Data hooks
export { usePortfolioData, usePortfolioDataAsync } from './use-portfolio-data.hook';

// Profile hooks
export { useProfile, useContactInfo, useSocialLinks } from './use-profile.hook';
export type { ResolvedProfile } from './use-profile.hook';

// Experience hooks
export {
  useExperiences,
  useCurrentExperiences,
  useRecentExperiences,
} from './use-experiences.hook';
export type { ResolvedExperience } from './use-experiences.hook';

// Legacy experience hook (backward compatibility)
export { useExperienceLegacy } from './use-experience-legacy.hook';
export type { LegacyExperience } from './use-experience-legacy.hook';

// Skills hooks
export {
  useSkills,
  useSkillCategories,
  useSkillsByCategory,
  useTopSkills,
  useSearchSkills,
} from './use-skills.hook';
export type { ResolvedSkillCategory } from './use-skills.hook';

// Skills with Projects hooks (evidence-based)
export {
  useSkillsWithProjects,
  useSkillCategoriesWithProjects,
} from './use-skills-with-projects.hook';
export type {
  SkillWithProjects,
  SkillCategoryWithProjects,
  SkillProjectEvidence,
} from './use-skills-with-projects.hook';

// Awards hooks
export {
  useAwards,
  useAwardsWithInvestment,
  useAwardsCount,
  useAwardsByYear,
} from './use-awards.hook';
export type { ResolvedAward } from './use-awards.hook';

// Language hooks
export { useLanguages, useLanguagesSummary } from './use-languages.hook';
export type { ResolvedLanguage } from './use-languages.hook';

// Education hooks
export { useEducation, useInternships } from './use-education.hook';
export type { ResolvedEducation, ResolvedInternship } from './use-education.hook';
