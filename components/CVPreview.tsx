import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLocale } from '../contexts/locale.context';
import { usePortfolioData } from '../hooks/use-portfolio-data.hook';
import { getLanguageLevelDisplay } from '../utils/localization';
import { formatDateRange } from '../utils/date';
import type { Locale } from '../types/portfolio-data.types';

// Import translations statically for synchronous access
import enTranslations from '../public/data/translations/en.json';
import ptTranslations from '../public/data/translations/pt.json';
import esTranslations from '../public/data/translations/es.json';

const translationMaps: Record<Locale, Record<string, string>> = {
  en: enTranslations as Record<string, string>,
  pt: ptTranslations as Record<string, string>,
  es: esTranslations as Record<string, string>,
};

function t(key: string, locale: Locale): string {
  const translations = translationMaps[locale] || translationMaps.en;
  return translations[key] ?? translationMaps.en[key] ?? key;
}

function td(
  keys: { cv?: string; coverLetter?: string; portfolio?: string },
  locale: Locale,
  docType: 'cv' | 'coverLetter' | 'portfolio' = 'cv'
): string {
  const key = keys[docType] ?? keys.cv ?? '';
  return t(key, locale);
}

function resolveText(
  text: { en?: string; pt?: string; es?: string } | string,
  locale: Locale
): string {
  if (typeof text === 'string') {
    const translated = t(text, locale);
    return translated !== text ? translated : text;
  }
  return text[locale] ?? text.en ?? '';
}

// Section labels
const sectionLabels: Record<string, Record<Locale, string>> = {
  profile: { en: 'Profile', pt: 'Perfil', es: 'Perfil' },
  experience: { en: 'Professional Experience', pt: 'Experiencia Profissional', es: 'Experiencia Profesional' },
  education: { en: 'Education', pt: 'Educacao', es: 'Educacion' },
  skills: { en: 'Skills', pt: 'Competencias', es: 'Habilidades' },
  languages: { en: 'Languages', pt: 'Idiomas', es: 'Idiomas' },
  awards: { en: 'Awards & Honors', pt: 'Premios e Honras', es: 'Premios y Honores' },
  internships: { en: 'Internships', pt: 'Estagios', es: 'Pasantias' },
};

const CVPreview: React.FC = () => {
  const { locale } = useLocale();
  const { data, isLoading } = usePortfolioData();

  if (isLoading || !data) {
    return <div className="text-slate-400">Loading...</div>;
  }

  const { profile, experiences, education, languages, awards, internships, skills, skillCategories } = data;

  const profileLocation = `${profile.location.city}, ${profile.location.country}`;

  // Map experiences
  const mappedExperiences = experiences.map((exp) => {
    const primaryRole = exp.roles[0];
    return {
      id: exp.id,
      role: resolveText(primaryRole.title, locale),
      company: exp.company.name,
      location: exp.location.label
        ? resolveText(exp.location.label, locale)
        : exp.location.isRemote
        ? locale === 'pt' ? 'Remoto' : locale === 'es' ? 'Remoto' : 'Remote'
        : `${exp.location.city}, ${exp.location.country}`,
      period: formatDateRange(primaryRole.startDate, primaryRole.endDate, locale),
      description: td(exp.description as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv'),
      achievements: exp.achievements.map((a) =>
        td(a.text as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv')
      ),
      skillIds: exp.skillIds,
    };
  });

  // Map internships
  const mappedInternships = internships.map((intern) => ({
    id: intern.id,
    role: resolveText(intern.role, locale),
    company: intern.company.name,
    location: intern.location.label
      ? resolveText(intern.location.label, locale)
      : `${intern.location.city}, ${intern.location.country}`,
    period: formatDateRange(intern.startDate, intern.endDate, locale),
    description: td(intern.description as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv'),
    achievements: intern.achievements.map((a) =>
      td(a.text as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv')
    ),
  }));

  // Get skill name by ID
  const getSkillName = (id: string) => skills.find((s) => s.id === id)?.name ?? id;

  return (
    <article className="prose prose-invert prose-slate max-w-none">
      {/* Header */}
      <div className="border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">{profile.displayName}</h1>
        <p className="text-primary text-lg mb-3">{resolveText(profile.title, locale)}</p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span>{profileLocation}</span>
          <span>{profile.email}</span>
          <span>{profile.phone}</span>
          {profile.social.linkedin && (
            <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
              LinkedIn <ExternalLink size={12} />
            </a>
          )}
          {profile.social.github && (
            <a href={profile.social.github} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
              GitHub <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Profile Summary */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-2 mb-4">
          {sectionLabels.profile[locale]}
        </h2>
        <p className="text-slate-300 leading-relaxed">
          {td(profile.summary as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv')}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-2 mb-4">
          {sectionLabels.experience[locale]}
        </h2>
        {mappedExperiences.map((exp) => (
          <div key={exp.id} className="mb-6">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
              <span className="text-sm text-slate-500">{exp.period}</span>
            </div>
            <p className="text-primary text-sm mb-2">
              {exp.company} <span className="text-slate-500">• {exp.location}</span>
            </p>
            <p className="text-slate-400 text-sm mb-2">{exp.description}</p>
            <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 mb-2">
              {exp.achievements.slice(0, 4).map((achievement, idx) => (
                <li key={idx}>{achievement}</li>
              ))}
            </ul>
            {exp.skillIds.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {exp.skillIds.slice(0, 6).map((skillId) => (
                  <span key={skillId} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    {getSkillName(skillId)}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Internships */}
      {mappedInternships.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-2 mb-4">
            {sectionLabels.internships[locale]}
          </h2>
          {mappedInternships.map((intern) => (
            <div key={intern.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-semibold text-white">{intern.role}</h3>
                <span className="text-sm text-slate-500">{intern.period}</span>
              </div>
              <p className="text-primary text-sm mb-2">
                {intern.company} <span className="text-slate-500">• {intern.location}</span>
              </p>
              <p className="text-slate-400 text-sm mb-2">{intern.description}</p>
              <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
                {intern.achievements.map((achievement, idx) => (
                  <li key={idx}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-2 mb-4">
          {sectionLabels.education[locale]}
        </h2>
        {education.map((edu) => (
          <div key={edu.id} className="mb-4">
            <h3 className="text-lg font-semibold text-white">{resolveText(edu.degree, locale)}</h3>
            <p className="text-primary text-sm">{edu.institution}</p>
            <p className="text-slate-500 text-sm mb-2">
              {edu.location.city}, {edu.location.country} • {formatDateRange(edu.startDate, edu.endDate, locale)}
            </p>
            <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
              {edu.achievements.map((achievement) => (
                <li key={achievement.id}>{resolveText(achievement.text, locale)}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Languages */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-2 mb-4">
          {sectionLabels.languages[locale]}
        </h2>
        <div className="flex flex-wrap gap-4">
          {languages.map((lang) => (
            <div key={lang.id} className="text-slate-300">
              <span className="font-medium">{resolveText(lang.name, locale)}</span>
              <span className="text-slate-500 ml-2">({getLanguageLevelDisplay(lang.level, locale)})</span>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-2 mb-4">
          {sectionLabels.awards[locale]}
        </h2>
        {awards.map((award) => (
          <div key={award.id} className="mb-4">
            <h3 className="text-lg font-semibold text-white">{resolveText(award.title, locale)}</h3>
            <p className="text-sm text-slate-500 mb-1">
              {award.organization} • {award.date}
            </p>
            <p className="text-slate-400 text-sm">
              {td(award.description as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'cv')}
            </p>
          </div>
        ))}
      </section>
    </article>
  );
};

export default CVPreview;
