import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';
import portfolioData from '../../data/portfolio.json';
import enTranslations from '../../public/data/translations/en.json';
import ptTranslations from '../../public/data/translations/pt.json';
import esTranslations from '../../public/data/translations/es.json';
import type { Locale, PortfolioData, Skill, SkillCategory } from '../../types/portfolio-data.types';
import { getLanguageLevelDisplay } from '../../utils/localization';
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

// Helper to resolve document variant keys (e.g., { cv: "key.cv", coverLetter: "key.cl" })
function td(keys: { cv?: string; coverLetter?: string; portfolio?: string }, locale: Locale, docType: 'cv' | 'coverLetter' | 'portfolio' = 'cv'): string {
  const key = keys[docType] ?? keys.cv ?? '';
  return t(key, locale);
}

// Helper to resolve localized string or translation key
function resolveText(text: { en?: string; pt?: string; es?: string } | string, locale: Locale): string {
  if (typeof text === 'string') {
    // It might be a translation key or direct text
    return t(text, locale) !== text ? t(text, locale) : text;
  }
  // It's a localized string object
  return text[locale] ?? text.en ?? '';
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1f2937',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0ea5e9',
    paddingBottom: 15,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#0ea5e9',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 4,
  },
  contactItem: {
    fontSize: 9,
    color: '#6b7280',
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
    marginBottom: 8,
  },
  jobHeader: {
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  jobCompany: {
    fontSize: 10,
    color: '#0ea5e9',
  },
  jobDate: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 6,
  },
  bulletList: {
    marginLeft: 12,
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 12,
    fontSize: 10,
    color: '#0ea5e9',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: '#374151',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillCategory: {
    width: '48%',
    marginBottom: 10,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  skillItem: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 2,
  },
  link: {
    color: '#0ea5e9',
    textDecoration: 'none',
  },
  awardItem: {
    marginBottom: 8,
  },
  awardTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  awardDetails: {
    fontSize: 9,
    color: '#6b7280',
  },
  techStack: {
    fontSize: 9,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 8,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 30,
  },
});

// Category display names for PDF
const categoryDisplayNames: Record<string, Record<Locale, string>> = {
  'ai-ml': { en: 'AI & Machine Learning', pt: 'IA & Aprendizado de Maquina', es: 'IA & Aprendizaje Automatico' },
  'frontend': { en: 'Frontend Development', pt: 'Desenvolvimento Frontend', es: 'Desarrollo Frontend' },
  'backend': { en: 'Backend Development', pt: 'Desenvolvimento Backend', es: 'Desarrollo Backend' },
  'devops': { en: 'DevOps & Cloud Infrastructure', pt: 'DevOps & Infraestrutura Cloud', es: 'DevOps & Infraestructura Cloud' },
  'healthcare': { en: 'Healthcare & Compliance', pt: 'Saude & Conformidade', es: 'Salud & Cumplimiento' },
  'product': { en: 'Product & Design', pt: 'Produto & Design', es: 'Producto & Diseno' },
  'leadership': { en: 'Leadership', pt: 'Lideranca', es: 'Liderazgo' },
};

// Helper to get category display name
function getCategoryDisplayName(categoryId: string, locale: Locale): string {
  const names = categoryDisplayNames[categoryId];
  if (names) {
    return names[locale] ?? names.en;
  }
  // Fallback to category name from data
  const category = data.skillCategories.find((c: SkillCategory) => c.id === categoryId);
  if (category?.name) {
    return resolveText(category.name, locale);
  }
  return categoryId;
}

// Group skills by category
function getSkillsByCategory(locale: Locale): Record<string, string[]> {
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

// Helper component for job entries
const JobEntry: React.FC<{
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  skills?: string[];
}> = ({ role, company, location, period, description, achievements, skills }) => (
  <View style={styles.section} wrap={false}>
    <View style={styles.jobHeader}>
      <Text style={styles.jobTitle}>{role}</Text>
      <Text style={styles.jobCompany}>{company} • {location}</Text>
      <Text style={styles.jobDate}>{period}</Text>
    </View>
    <Text style={styles.paragraph}>{description}</Text>
    <View style={styles.bulletList}>
      {achievements.map((achievement, idx) => (
        <View key={idx} style={styles.bulletItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{achievement}</Text>
        </View>
      ))}
    </View>
    {skills && skills.length > 0 && (
      <Text style={styles.techStack}>Technologies: {skills.join(', ')}</Text>
    )}
  </View>
);

interface CVDocumentProps {
  locale?: Locale;
}

const CVDocument: React.FC<CVDocumentProps> = ({ locale = 'en' }) => {
  const { profile, experiences, education, languages, awards, internships } = data;
  const skillsByCategory = getSkillsByCategory(locale);

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

  return (
    <Document>
      {/* Page 1 - Header, Profile, Skills, First Jobs */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.displayName}</Text>
          <Text style={styles.title}>{resolveText(profile.title, locale)}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{profileLocation}</Text>
            <Text style={styles.contactItem}>{profile.phone}</Text>
            <Text style={styles.contactItem}>{profile.email}</Text>
          </View>
          <View style={styles.contactRow}>
            {profile.social.linkedin && (
              <Link src={profile.social.linkedin} style={styles.link}>
                <Text style={styles.contactItem}>LinkedIn</Text>
              </Link>
            )}
            {profile.social.github && (
              <Link src={profile.social.github} style={styles.link}>
                <Text style={styles.contactItem}>GitHub</Text>
              </Link>
            )}
            {profile.social.youtube && (
              <Link src={profile.social.youtube} style={styles.link}>
                <Text style={styles.contactItem}>Fofuuu Product Showcase</Text>
              </Link>
            )}
          </View>
        </View>

        {/* Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text style={styles.paragraph}>
            {td(profile.summary as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv')}
          </Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsGrid}>
            {Object.entries(skillsByCategory).map(([categoryId, skills]) => (
              <View key={categoryId} style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>
                  {getCategoryDisplayName(categoryId, locale)}
                </Text>
                {skills.map((skill, idx) => (
                  <Text key={idx} style={styles.skillItem}>• {skill}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Employment History - First entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment History</Text>
          {mappedExperiences.slice(0, 2).map((job) => (
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

      {/* Page 2 - More Employment */}
      <Page size="A4" style={styles.page}>
        {mappedExperiences.slice(2, 6).map((job) => (
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
      </Page>

      {/* Page 3 - More Employment */}
      <Page size="A4" style={styles.page}>
        {mappedExperiences.slice(6).map((job) => (
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
      </Page>

      {/* Page 4 - Education, Languages, Awards, Internships */}
      <Page size="A4" style={styles.page}>
        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu) => (
            <View key={edu.id}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{resolveText(edu.degree, locale)}</Text>
                <Text style={styles.jobCompany}>{edu.institution} • {edu.location.city}, {edu.location.country}</Text>
                <Text style={styles.jobDate}>{formatDateRange(edu.startDate, edu.endDate, locale)}</Text>
              </View>
              <View style={styles.bulletList}>
                {edu.achievements.map((achievement) => (
                  <View key={achievement.id} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{resolveText(achievement.text, locale)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languageRow}>
            {languages.map((lang) => (
              <Text key={lang.id} style={styles.skillItem}>
                {resolveText(lang.name, locale)} ({getLanguageLevelDisplay(lang.level, locale)})
              </Text>
            ))}
          </View>
        </View>

        {/* Awards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Awards & Honors</Text>
          {awards.map((award) => (
            <View key={award.id} style={styles.awardItem}>
              <Text style={styles.awardTitle}>{resolveText(award.title, locale)}</Text>
              <Text style={styles.awardDetails}>{award.date} | {award.organization}</Text>
              <Text style={styles.paragraph}>{td(award.description as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv')}</Text>
            </View>
          ))}
        </View>

        {/* Internships */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Internships</Text>
          {mappedInternships.map((internship) => (
            <View key={internship.id}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{internship.role}</Text>
                <Text style={styles.jobCompany}>{internship.company} • {internship.location}</Text>
                <Text style={styles.jobDate}>{internship.period}</Text>
              </View>
              <Text style={styles.paragraph}>{internship.description}</Text>
              <View style={styles.bulletList}>
                {internship.achievements.map((achievement, aidx) => (
                  <View key={aidx} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{achievement}</Text>
                  </View>
                ))}
              </View>
              {internship.skills && internship.skills.length > 0 && (
                <Text style={styles.techStack}>Technologies: {internship.skills.join(', ')}</Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default CVDocument;
