// ===========================================================================
// Core Locale Types
// ===========================================================================

/** Supported locales */
export type Locale = 'en' | 'pt' | 'es';

/** Document types for text variations */
export type DocumentType = 'cv' | 'coverLetter' | 'portfolio';

/** Employment type enumeration */
export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'freelance'
  | 'internship';

/** Language proficiency levels */
export type LanguageLevel = 'native' | 'fluent' | 'intermediate' | 'basic';

// ===========================================================================
// Translation Types
// ===========================================================================

/**
 * A flat key-value object containing translations.
 * Keys are dot-notation paths like "profile.title" or "experience.biomedhub-2025.description.cv"
 */
export type TranslationMap = Record<string, string>;

/**
 * Translation key string - represents a key to look up in translations.
 * Used where text fields were previously LocalizedString objects.
 */
export type TranslationKey = string;

/**
 * Keys for document-variant text (cv, coverLetter, portfolio).
 * Each value is a translation key, not the actual text.
 */
export interface DocumentVariantKeys {
  cv: TranslationKey;
  coverLetter?: TranslationKey;
  portfolio?: TranslationKey;
}

// ===========================================================================
// Legacy Types (for backwards compatibility during migration)
// ===========================================================================

/**
 * @deprecated Use TranslationKey instead. This type is kept for reference.
 * A value that can be localized across supported locales.
 * English (en) is required, others are optional.
 */
export interface LocalizedString {
  en: string;
  pt?: string;
  es?: string;
}

/**
 * A value that varies by document type.
 * At minimum, 'cv' should be provided.
 */
export interface DocumentVariant {
  cv: string;
  coverLetter?: string;
  portfolio?: string;
}

/**
 * @deprecated Use DocumentVariantKeys instead. This type is kept for reference.
 * A fully localized and document-variant text.
 * Structure: locale -> documentType -> text
 */
export interface LocalizedDocumentText {
  en: DocumentVariant;
  pt?: Partial<DocumentVariant>;
  es?: Partial<DocumentVariant>;
}

// ===========================================================================
// Data Model Interfaces
// ===========================================================================

/** Root schema for the portfolio data */
export interface PortfolioData {
  $schema?: string;
  version: string;
  defaultLocale: Locale;
  supportedLocales: Locale[];

  profile: Profile;
  languages: Language[];
  skillCategories: SkillCategory[];
  skillGroups: SkillGroup[];
  skills: Skill[];
  experiences: Experience[];
  awards: Award[];
  publications: Publication[];
  education: Education[];
  internships: Internship[];
}

/** Personal profile information */
export interface Profile {
  id: string;
  name: PersonName;
  displayName: string;
  /** Translation key for title (e.g., "profile.title") */
  title: TranslationKey;
  email: string;
  phone: string;
  location: Location;
  photo: string;
  social: SocialLinks;
  /** Translation keys for summary variants */
  summary: DocumentVariantKeys;
  /** Array of translation keys for focus areas */
  focusAreas: TranslationKey[];
}

export interface PersonName {
  first: string;
  last: string;
  middle?: string;
}

export interface Location {
  city: string | null;
  country: string | null;
  isRemote: boolean;
  /** Translation key for location label (optional) */
  label?: TranslationKey;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  youtube?: string;
  twitter?: string;
  website?: string;
}

/** Spoken language with proficiency */
export interface Language {
  id: string;
  /** Translation key for language name */
  name: TranslationKey;
  level: LanguageLevel;
  flagCode: string;
}

/** Category for grouping skills */
export interface SkillCategory {
  id: string;
  /** Translation key for category name */
  name: TranslationKey;
  icon: string;
  color: string;
}

/** Group for related skills within a category (e.g., "Databases" within "Backend") */
export interface SkillGroup {
  id: string;
  name: string;
  categoryId: string;
}

/** Technical or soft skill */
export interface Skill {
  id: string;
  name: string;
  categoryId: string;
  /** Optional group for related skills (e.g., PostgreSQL -> "databases" group) */
  groupId?: string;
  proficiency: number;
}

/** Work experience entry */
export interface Experience {
  id: string;
  company: Company;
  roles: Role[];
  location: Location;
  /** Translation keys for description variants */
  description: DocumentVariantKeys;
  achievements: Achievement[];
  /** Role-level skills (leadership, strategy, etc.) */
  skillIds: string[];
  /** Projects/products worked on in this role */
  projects?: Project[];
  /** Media assets for this experience */
  media?: Media[];
  /** External links (websites, app stores, press) */
  externalLinks?: ExternalLink[];
  /** Client information for client work */
  client?: Client | null;
  sortOrder: number;
}

/** Project or product within an experience */
export interface Project {
  id: string;
  name: string;
  /** Translation keys for project description */
  description?: DocumentVariantKeys;
  /** Project-specific technical skills */
  skillIds: string[];
  /** Project-specific achievements */
  achievements?: Achievement[];
  /** Media assets for this project */
  media?: Media[];
  /** External links for this project */
  externalLinks?: ExternalLink[];
}

/** External link (app store, website, press, etc.) */
export interface ExternalLink {
  type: 'website' | 'app-store' | 'press' | 'case-study' | 'client' | 'demo' | 'video';
  label: string;
  url: string;
}

/** Media asset (screenshot, image, video thumbnail) */
export interface Media {
  id: string;
  type: 'screenshot' | 'image' | 'video-thumbnail' | 'logo';
  url: string;
  alt: string;
  caption?: string;
}

/** Client information for client work */
export interface Client {
  name: string;
  department?: string;
  logoUrl: string | null;
}

export interface Company {
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  industry: string | null;
}

export interface Role {
  id: string;
  /** Translation key for role title */
  title: TranslationKey;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface Achievement {
  id: string;
  /** Translation keys for achievement text variants */
  text: DocumentVariantKeys;
}

/** Award or recognition */
export interface Award {
  id: string;
  /** Translation key for award title */
  title: TranslationKey;
  organization: string;
  date: string;
  /** Translation keys for description variants */
  description: DocumentVariantKeys;
  link: string | null;
  investment: string | null;
}

/** Academic publication */
export interface Publication {
  id: string;
  /** Translation key for publication title */
  title: TranslationKey;
  venue: string;
  date: string;
  /** Translation keys for description variants */
  description: DocumentVariantKeys;
  link: string | null;
}

/** Educational qualification */
export interface Education {
  id: string;
  /** Translation key for degree */
  degree: TranslationKey;
  institution: string;
  location: {
    city: string;
    country: string;
  };
  startDate: string;
  endDate: string;
  achievements: EducationAchievement[];
}

export interface EducationAchievement {
  id: string;
  /** Translation key for achievement text */
  text: TranslationKey;
}

/** Internship entry */
export interface Internship {
  id: string;
  company: Company;
  /** Translation key for role title */
  role: TranslationKey;
  startDate: string;
  endDate: string;
  location: Location;
  /** Translation keys for description variants */
  description: DocumentVariantKeys;
  achievements: Achievement[];
  skillIds: string[];
}
