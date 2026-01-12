import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Image,
} from '@react-pdf/renderer';
import portfolioData from '../../data/portfolio.json';
import enTranslations from '../../public/data/translations/en.json';
import ptTranslations from '../../public/data/translations/pt.json';
import esTranslations from '../../public/data/translations/es.json';
import type { Locale, PortfolioData, Skill, SkillCategory } from '../../types/portfolio-data.types';
import { getLanguageLevelDisplay, resolveLocalized, resolveLocalizedDocument } from '../../utils/localization';
import { formatDateRange } from '../../utils/date';

// Type assertion for imported JSON
const data = portfolioData as PortfolioData;

// Translation maps by locale
const translationMaps: Record<Locale, Record<string, string>> = {
  en: enTranslations as Record<string, string>,
  pt: ptTranslations as Record<string, string>,
  es: esTranslations as Record<string, string>,
};

// Helper to get translation by key
function t(key: string, locale: Locale): string {
  const translations = translationMaps[locale] || translationMaps.en;
  return translations[key] ?? translationMaps.en[key] ?? key;
}

// Helper to resolve document variant keys
function td(keys: { cv?: string; coverLetter?: string; portfolio?: string }, locale: Locale, docType: 'cv' | 'coverLetter' | 'portfolio' = 'cv'): string {
  const key = keys[docType] ?? keys.cv ?? '';
  return t(key, locale);
}

// Helper to resolve localized string or translation key
function resolveText(text: { en?: string; pt?: string; es?: string } | string, locale: Locale): string {
  if (typeof text === 'string') {
    return t(text, locale) !== text ? t(text, locale) : text;
  }
  return text[locale] ?? text.en ?? '';
}

// Color palette - inspired by portfolio but adapted for light theme
const colors = {
  // Primary brand color
  primary: '#0284c7', // sky-600 (slightly darker for print)
  primaryLight: '#e0f2fe', // sky-100
  primaryMuted: '#7dd3fc', // sky-300

  // Neutral palette
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
};

// PDF Styles - Modern two-column layout
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: colors.gray700,
    backgroundColor: colors.white,
  },

  // Sidebar styles
  sidebar: {
    width: 170,
    backgroundColor: colors.gray900,
    padding: 18,
    paddingTop: 25,
    color: colors.white,
  },
  sidebarSection: {
    marginBottom: 18,
  },
  sidebarSectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray700,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 12,
    objectFit: 'cover',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sidebarName: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 3,
  },
  sidebarTitle: {
    fontSize: 8,
    color: colors.primaryMuted,
    textAlign: 'center',
    marginBottom: 18,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  contactIconBox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  contactIconText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: colors.white,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 7.5,
    color: colors.gray300,
    flex: 1,
  },
  contactLink: {
    fontSize: 7.5,
    color: colors.primaryMuted,
    textDecoration: 'none',
  },
  skillCategory: {
    marginBottom: 10,
  },
  skillCategoryName: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray200,
    marginBottom: 3,
  },
  sidebarSkillItem: {
    fontSize: 7,
    color: colors.gray400,
    marginBottom: 1.5,
    paddingLeft: 6,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  languageName: {
    fontSize: 7.5,
    color: colors.gray200,
  },
  languageLevel: {
    fontSize: 6.5,
    color: colors.gray400,
  },

  // Main content styles
  main: {
    flex: 1,
    padding: 22,
    paddingTop: 25,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray900,
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    color: colors.primary,
    marginBottom: 6,
  },
  headerContactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  headerContactItem: {
    fontSize: 7.5,
    color: colors.gray500,
  },

  section: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray900,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  profileText: {
    fontSize: 8.5,
    lineHeight: 1.55,
    color: colors.gray600,
    textAlign: 'justify',
  },

  // Job entry styles
  jobEntry: {
    marginBottom: 12,
  },
  jobHeader: {
    marginBottom: 3,
  },
  jobTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  jobTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray800,
    flex: 1,
  },
  jobDate: {
    fontSize: 7.5,
    color: colors.gray500,
    textAlign: 'right',
  },
  jobCompanyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  jobCompany: {
    fontSize: 8.5,
    color: colors.primary,
  },
  jobLocation: {
    fontSize: 7.5,
    color: colors.gray500,
    marginLeft: 5,
  },
  jobDescription: {
    fontSize: 8,
    lineHeight: 1.45,
    color: colors.gray600,
    marginBottom: 3,
  },

  // Bullet list styles
  bulletList: {
    marginLeft: 2,
    marginBottom: 3,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 1.5,
  },
  bullet: {
    width: 8,
    fontSize: 7,
    color: colors.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: 7.5,
    lineHeight: 1.4,
    color: colors.gray600,
  },

  // Tech stack badge row
  techStackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginTop: 3,
  },
  techBadge: {
    fontSize: 6.5,
    color: colors.gray500,
    backgroundColor: colors.gray100,
    paddingVertical: 1.5,
    paddingHorizontal: 4,
    borderRadius: 2,
  },

  // Award styles
  awardItem: {
    marginBottom: 8,
  },
  awardTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray800,
  },
  awardOrg: {
    fontSize: 7.5,
    color: colors.primary,
  },
  awardDate: {
    fontSize: 6.5,
    color: colors.gray500,
    marginLeft: 6,
  },
  awardDescription: {
    fontSize: 7.5,
    lineHeight: 1.4,
    color: colors.gray600,
    marginTop: 2,
  },

  // Education styles
  educationItem: {
    marginBottom: 8,
  },
  educationDegree: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray800,
  },
  educationInstitution: {
    fontSize: 8,
    color: colors.primary,
    marginBottom: 1,
  },
  educationDetails: {
    fontSize: 7,
    color: colors.gray500,
  },

  // Link style
  link: {
    color: colors.primary,
    textDecoration: 'none',
  },

  // Page continuation header
  pageHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageHeaderName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.gray700,
  },
  pageHeaderPage: {
    fontSize: 8,
    color: colors.gray400,
  },
});

// Category display names for PDF
const categoryDisplayNames: Record<string, Record<Locale, string>> = {
  'ai-ml': { en: 'AI & ML', pt: 'IA & ML', es: 'IA & ML' },
  'frontend': { en: 'Frontend', pt: 'Frontend', es: 'Frontend' },
  'backend': { en: 'Backend', pt: 'Backend', es: 'Backend' },
  'devops': { en: 'DevOps & Cloud', pt: 'DevOps & Cloud', es: 'DevOps & Cloud' },
  'healthcare': { en: 'Healthcare', pt: 'Saúde', es: 'Salud' },
  'product': { en: 'Product', pt: 'Produto', es: 'Producto' },
  'leadership': { en: 'Leadership', pt: 'Liderança', es: 'Liderazgo' },
};

// Helper to get category display name
function getCategoryDisplayName(categoryId: string, locale: Locale): string {
  const names = categoryDisplayNames[categoryId];
  if (names) {
    return names[locale] ?? names.en;
  }
  const category = data.skillCategories.find((c: SkillCategory) => c.id === categoryId);
  if (category?.name) {
    return resolveText(category.name, locale);
  }
  return categoryId;
}

// Group skills by category
function getSkillsByCategory(): Record<string, string[]> {
  return data.skills.reduce((acc: Record<string, string[]>, skill: Skill) => {
    const categoryId = skill.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(skill.name);
    return acc;
  }, {});
}

// Helper to format location
function formatLocation(location: { city: string | null; country: string | null; isRemote: boolean; label?: { en: string; pt?: string; es?: string } | string }, locale: Locale): string {
  if (location.label) {
    return resolveText(location.label, locale);
  }
  if (location.isRemote) {
    const remoteLabels: Record<Locale, string> = { en: 'Remote', pt: 'Remoto', es: 'Remoto' };
    return remoteLabels[locale];
  }
  const parts = [location.city, location.country].filter(Boolean);
  return parts.join(', ');
}

// Helper to get skill names from IDs
function getSkillNamesFromIds(skillIds: string[]): string[] {
  return skillIds
    .map((id: string) => {
      const skill = data.skills.find((s: Skill) => s.id === id);
      return skill?.name;
    })
    .filter((name): name is string => name !== undefined);
}

// Section translations
const sectionLabels: Record<string, Record<Locale, string>> = {
  profile: { en: 'Profile', pt: 'Perfil', es: 'Perfil' },
  experience: { en: 'Professional Experience', pt: 'Experiência Profissional', es: 'Experiencia Profesional' },
  education: { en: 'Education', pt: 'Educação', es: 'Educación' },
  skills: { en: 'Skills', pt: 'Competências', es: 'Habilidades' },
  languages: { en: 'Languages', pt: 'Idiomas', es: 'Idiomas' },
  awards: { en: 'Awards & Honors', pt: 'Prêmios e Honras', es: 'Premios y Honores' },
  contact: { en: 'Contact', pt: 'Contato', es: 'Contacto' },
  internships: { en: 'Internships', pt: 'Estágios', es: 'Pasantías' },
};

// Helper component for job entries
const JobEntry: React.FC<{
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  skills?: string[];
  compact?: boolean;
}> = ({ role, company, location, period, description, achievements, skills, compact = false }) => (
  <View style={styles.jobEntry} wrap={false}>
    <View style={styles.jobHeader}>
      <View style={styles.jobTitleRow}>
        <Text style={styles.jobTitle}>{role}</Text>
        <Text style={styles.jobDate}>{period}</Text>
      </View>
      <View style={styles.jobCompanyRow}>
        <Text style={styles.jobCompany}>{company}</Text>
        <Text style={styles.jobLocation}>• {location}</Text>
      </View>
    </View>
    <Text style={styles.jobDescription}>{description}</Text>
    <View style={styles.bulletList}>
      {achievements.slice(0, compact ? 3 : 4).map((achievement, idx) => (
        <View key={idx} style={styles.bulletItem}>
          <Text style={styles.bullet}>▸</Text>
          <Text style={styles.bulletText}>{achievement}</Text>
        </View>
      ))}
    </View>
    {skills && skills.length > 0 && (
      <View style={styles.techStackRow}>
        {skills.slice(0, compact ? 4 : 6).map((skill, idx) => (
          <Text key={idx} style={styles.techBadge}>{skill}</Text>
        ))}
      </View>
    )}
  </View>
);

interface CVDocumentProps {
  locale?: Locale;
}

const CVDocument: React.FC<CVDocumentProps> = ({ locale = 'en' }) => {
  const { profile, experiences, education, languages, awards, internships } = data;
  const skillsByCategory = getSkillsByCategory();

  // Format profile location
  const profileLocation = `${profile.location.city}, ${profile.location.country}`;

  // Map experiences to the format expected by JobEntry
  const mappedExperiences = experiences.map((exp) => {
    const primaryRole = exp.roles[0];
    return {
      id: exp.id,
      role: resolveText(primaryRole.title, locale),
      company: exp.company.name,
      location: formatLocation(exp.location, locale),
      period: formatDateRange(primaryRole.startDate, primaryRole.endDate, locale),
      description: td(exp.description as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv'),
      achievements: exp.achievements.map((a) => td(a.text as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv')),
      skills: getSkillNamesFromIds(exp.skillIds),
    };
  });

  // Map internships
  const mappedInternships = internships.map((intern) => ({
    id: intern.id,
    role: resolveText(intern.role, locale),
    company: intern.company.name,
    location: formatLocation(intern.location, locale),
    period: formatDateRange(intern.startDate, intern.endDate, locale),
    description: td(intern.description as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv'),
    achievements: intern.achievements.map((a) => td(a.text as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv')),
    skills: getSkillNamesFromIds(intern.skillIds),
  }));

  // Priority order for skill categories
  const categoryOrder = ['ai-ml', 'backend', 'frontend', 'devops', 'product', 'healthcare', 'leadership'];

  return (
    <Document>
      {/* Page 1 - Header and First Jobs with Sidebar */}
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {/* Profile Section */}
          <View style={styles.sidebarSection}>
            <View style={styles.profileImageContainer}>
              <Image src="/images/profile-256.png" style={styles.profileImage} />
            </View>
            <Text style={styles.sidebarName}>{profile.displayName}</Text>
            <Text style={styles.sidebarTitle}>{resolveText(profile.title, locale)}</Text>
          </View>

          {/* Contact Section */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>{sectionLabels.contact[locale]}</Text>
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <Text style={styles.contactIconText}>@</Text>
              </View>
              <Text style={styles.contactText}>{profile.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <Text style={styles.contactIconText}>#</Text>
              </View>
              <Text style={styles.contactText}>{profile.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIconBox}>
                <Text style={styles.contactIconText}>O</Text>
              </View>
              <Text style={styles.contactText}>{profileLocation}</Text>
            </View>
            {profile.social.linkedin && (
              <View style={styles.contactItem}>
                <View style={styles.contactIconBox}>
                  <Text style={styles.contactIconText}>in</Text>
                </View>
                <Link src={profile.social.linkedin} style={styles.contactLink}>
                  <Text>LinkedIn</Text>
                </Link>
              </View>
            )}
            {profile.social.github && (
              <View style={styles.contactItem}>
                <View style={styles.contactIconBox}>
                  <Text style={styles.contactIconText}>&lt;/&gt;</Text>
                </View>
                <Link src={profile.social.github} style={styles.contactLink}>
                  <Text>GitHub</Text>
                </Link>
              </View>
            )}
          </View>

          {/* Skills Section */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>{sectionLabels.skills[locale]}</Text>
            {categoryOrder
              .filter(catId => skillsByCategory[catId])
              .map((categoryId) => (
                <View key={categoryId} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryName}>
                    {getCategoryDisplayName(categoryId, locale)}
                  </Text>
                  {skillsByCategory[categoryId].slice(0, 4).map((skill, idx) => (
                    <Text key={idx} style={styles.sidebarSkillItem}>• {skill}</Text>
                  ))}
                </View>
              ))}
          </View>

          {/* Languages Section */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>{sectionLabels.languages[locale]}</Text>
            {languages.map((lang) => (
              <View key={lang.id} style={styles.languageItem}>
                <Text style={styles.languageName}>{resolveText(lang.name, locale)}</Text>
                <Text style={styles.languageLevel}>{getLanguageLevelDisplay(lang.level, locale)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.name}>{profile.displayName}</Text>
            <Text style={styles.title}>{resolveText(profile.title, locale)}</Text>
            <View style={styles.headerContactRow}>
              <Text style={styles.headerContactItem}>{profileLocation}</Text>
              <Text style={styles.headerContactItem}>{profile.email}</Text>
              <Text style={styles.headerContactItem}>{profile.phone}</Text>
            </View>
          </View>

          {/* Profile Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sectionLabels.profile[locale]}</Text>
            </View>
            <Text style={styles.profileText}>
              {td(profile.summary as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv')}
            </Text>
          </View>

          {/* Experience Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sectionLabels.experience[locale]}</Text>
            </View>
            {mappedExperiences.slice(0, 3).map((job) => (
              <JobEntry
                key={job.id}
                role={job.role}
                company={job.company}
                location={job.location}
                period={job.period}
                description={job.description}
                achievements={job.achievements}
                skills={job.skills}
              />
            ))}
          </View>
        </View>
      </Page>

      {/* Page 2 - More Experience */}
      <Page size="A4" style={styles.page}>
        {/* Sidebar continuation */}
        <View style={[styles.sidebar, { backgroundColor: colors.gray800 }]}>
          <View style={styles.sidebarSection}>
            <View style={styles.profileImageContainer}>
              <Image src="/images/profile-256.png" style={styles.profileImage} />
            </View>
            <Text style={styles.sidebarName}>{profile.displayName}</Text>
            <Text style={[styles.sidebarTitle, { marginBottom: 25 }]}>Page 2</Text>
          </View>

          {/* Awards in sidebar */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>{sectionLabels.awards[locale]}</Text>
            {awards.map((award) => (
              <View key={award.id} style={{ marginBottom: 8 }}>
                <Text style={[styles.languageName, { fontSize: 7, marginBottom: 1 }]}>
                  {resolveText(award.title, locale)}
                </Text>
                <Text style={[styles.languageLevel, { fontSize: 6 }]}>
                  {award.organization}
                </Text>
                <Text style={[styles.languageLevel, { fontSize: 6 }]}>
                  {award.date}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageHeaderName}>{profile.displayName}</Text>
            <Text style={styles.pageHeaderPage}>{sectionLabels.experience[locale]} (continued)</Text>
          </View>

          {/* Continue Experience Section */}
          {mappedExperiences.slice(3, 7).map((job) => (
            <JobEntry
              key={job.id}
              role={job.role}
              company={job.company}
              location={job.location}
              period={job.period}
              description={job.description}
              achievements={job.achievements}
              skills={job.skills}
            />
          ))}
        </View>
      </Page>

      {/* Page 3 - Remaining Experience, Internships, and Education */}
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={[styles.sidebar, { backgroundColor: colors.gray800 }]}>
          <View style={styles.sidebarSection}>
            <View style={styles.profileImageContainer}>
              <Image src="/images/profile-256.png" style={styles.profileImage} />
            </View>
            <Text style={styles.sidebarName}>{profile.displayName}</Text>
            <Text style={[styles.sidebarTitle, { marginBottom: 25 }]}>Page 3</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Page Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageHeaderName}>{profile.displayName}</Text>
            <Text style={styles.pageHeaderPage}>Page 3</Text>
          </View>

          {/* Remaining Experience */}
          {mappedExperiences.length > 7 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{sectionLabels.experience[locale]} (continued)</Text>
              </View>
              {mappedExperiences.slice(7).map((job) => (
                <JobEntry
                  key={job.id}
                  role={job.role}
                  company={job.company}
                  location={job.location}
                  period={job.period}
                  description={job.description}
                  achievements={job.achievements}
                  skills={job.skills}
                  compact
                />
              ))}
            </View>
          )}

          {/* Internships */}
          {mappedInternships.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{sectionLabels.internships[locale]}</Text>
              </View>
              {mappedInternships.map((internship) => (
                <JobEntry
                  key={internship.id}
                  role={internship.role}
                  company={internship.company}
                  location={internship.location}
                  period={internship.period}
                  description={internship.description}
                  achievements={internship.achievements}
                  skills={internship.skills}
                  compact
                />
              ))}
            </View>
          )}

          {/* Education Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sectionLabels.education[locale]}</Text>
            </View>
            {education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <Text style={styles.educationDegree}>{resolveText(edu.degree, locale)}</Text>
                <Text style={styles.educationInstitution}>{edu.institution}</Text>
                <Text style={styles.educationDetails}>
                  {edu.location.city}, {edu.location.country} • {formatDateRange(edu.startDate, edu.endDate, locale)}
                </Text>
                <View style={[styles.bulletList, { marginTop: 3 }]}>
                  {edu.achievements.slice(0, 2).map((achievement) => (
                    <View key={achievement.id} style={styles.bulletItem}>
                      <Text style={styles.bullet}>▸</Text>
                      <Text style={styles.bulletText}>{resolveText(achievement.text, locale)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CVDocument;
