import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLocale } from '../contexts/locale.context';
import { usePortfolioData } from '../hooks/use-portfolio-data.hook';
import { formatDateRange } from '../utils/date';
import type { Locale } from '../types/portfolio-data.types';

// Import translations statically
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
  docType: 'cv' | 'coverLetter' | 'portfolio' = 'coverLetter'
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
const labels: Record<string, Record<Locale, string>> = {
  recentProjects: { en: 'Recent Projects', pt: 'Projetos Recentes', es: 'Proyectos Recientes' },
};

const CoverLetterPreview: React.FC = () => {
  const { locale } = useLocale();
  const { data, isLoading } = usePortfolioData();

  if (isLoading || !data) {
    return <div className="text-slate-400">Loading...</div>;
  }

  const { profile, experiences } = data;

  const profileLocation = profile.location.city && profile.location.country
    ? `${profile.location.city}, ${profile.location.country}`
    : profile.location.label
    ? resolveText(profile.location.label, locale)
    : '';

  // Get recent projects (first 3)
  const recentProjects = [...experiences]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 3)
    .map((exp) => ({
      company: exp.company.name,
      period: formatDateRange(exp.roles[0].startDate, exp.roles[0].endDate, locale, 'short'),
      description: td(exp.description as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'coverLetter'),
    }));

  return (
    <article className="prose prose-invert prose-slate max-w-none">
      {/* Header */}
      <div className="border-b-2 border-primary pb-4 mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">{profile.displayName}</h1>
        <p className="text-primary text-lg mb-3">{resolveText(profile.title, locale)}</p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span>{profileLocation}</span>
          <span>{profile.phone}</span>
          <span>{profile.email}</span>
        </div>
      </div>

      {/* Opening */}
      <section className="mb-6">
        <p className="text-slate-300 leading-relaxed mb-4">
          {td(profile.summary as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'coverLetter')}
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          At Fofuuu, I designed and built patient management systems for autism therapy clinics, including claims-based access control, remote activity monitoring, clinical dashboards, AI-driven adaptive therapy plans, and analytics pipelines. This work resulted in a published clinical study and a platform that serves therapists and families across Brazil (
          <a href={profile.social.youtube ?? '#'} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
            1 Minute Product Showcase <ExternalLink size={12} />
          </a>
          ).
        </p>
        <p className="text-slate-300 leading-relaxed">
          These experiences taught me that successful products address specific user needs, whether alleviating pain points like cost and time, or amplifying gains like revenue and satisfaction. I lead teams with a culture of experimentation: distinguishing hypotheses from validated insights, aligning around shared objectives, and making data-driven decisions.
        </p>
      </section>

      {/* Journey */}
      <section className="mb-6">
        <p className="text-slate-300 leading-relaxed mb-4">
          I started programming at 13, teaching myself to build tools and games. That early curiosity laid the foundation for everything that followed.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          My entrepreneurial path began with <span className="text-primary font-medium">Betri Studio</span>, where I grew into a product manager and full-stack developer. I led projects including an HR expense system with OCR invoice scanning, a gamified rewards app integrated with sales performance metrics that drove engagement and revenue growth, and immersive digital training experiences for enterprise clients.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          I co-founded <span className="text-primary font-medium">Fofuuu</span> to tackle digital health, building prototypes and MVPs for speech therapy activities. I developed real-time sound signal analysis systems and managed large-scale development efforts. Our work earned the{' '}
          <a href="https://gizmodo.uol.com.br/com-premio-no-big-festival-fofuu-mostra-que-games-podem-ser-mui" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Best Educational Game Award (BIG Festival/BNDES)
          </a>{' '}
          and the{' '}
          <a href="https://www.pptasaude.com.br/noticias/3501/startup-fofuuu-e-vencedora-do-premio-empreend" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Health Entrepreneurship Award (Sirio-Libanes Institute and Everis Brazil)
          </a>
          .
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          After securing funding and transitioning to a dedicated CTO role, I led the development of Fofuuu Fono, a gamified digital therapy platform for speech therapists and caregivers. In partnership with Unifesp's Speech Therapy Ambulatory, I supervised a clinical study published at the{' '}
          <a href="https://www.forl.org.br/" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            16th Congress of the Otorhinolaryngology Foundation
          </a>
          .
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          I directed the <span className="text-primary font-medium">PhoneNet</span> project, a deep learning model for isolated phoneme classification designed to run on mobile devices. I led the full lifecycle: implementing a ResNet-based architecture with international collaborators, orchestrating a nationwide campaign to collect and label phoneme samples, and publishing findings at the{' '}
          <a href="https://www.sbfa.org.br/" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            26th CBFa
          </a>
          .
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          When Fofuuu pivoted to broader autism therapies, I took on dual CEO and CTO responsibilities. I secured funding from{' '}
          <a href="https://news.samsung.com/br/samsung-acelera-startup-que-estimula-a-fala-das-criancas-com-jo" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Samsung Creative Startups
          </a>{' '}
          and a larger round from{' '}
          <a href="https://finep.gov.br/" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Finep Startup
          </a>
          , then led the design of Fofuuu Edu, expanding to Behavioral Psychology, Psycho-pedagogy, Speech Therapy, and Occupational Therapy.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          When the pandemic disrupted healthcare delivery, I adapted our platform for remote therapy sessions and secured funding from the{' '}
          <a href="https://revistapegn.globo.com/Startups/noticia/2020/04/prefeitura-de-sp-anuncia-startups-que-" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Covid-19 Rapid Innovation Cycle (City of Sao Paulo)
          </a>{' '}
          and the{' '}
          <a href="https://www.santanderx.com/en/blog/fofuuu-tricia-araujo-bruno-tachinardi" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Santander X Tomorrow Challenge
          </a>
          . I transitioned the team to remote work and guided the company through restructuring during the industry-wide financial crisis.
        </p>
        <p className="text-slate-300 leading-relaxed">
          When our B2C model proved unsustainable, I made the difficult decision to restructure and pause operations. I then joined <span className="text-primary font-medium">Nubank</span> as a product consultant, applying my entrepreneurial experience to a gamified loyalty program, providing strategic UX insights and supporting the project manager in aligning the initiative with business objectives.
        </p>
      </section>

      {/* Recent Projects */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-2 mb-4">
          {labels.recentProjects[locale]}
        </h2>
        {recentProjects.map((project, idx) => (
          <div key={idx} className="mb-4">
            <h3 className="text-lg font-semibold text-white">
              {project.company} <span className="text-slate-500 text-sm font-normal">({project.period})</span>
            </h3>
            <p className="text-slate-400 text-sm">{project.description}</p>
          </div>
        ))}
      </section>

      {/* Closing */}
      <section>
        <p className="text-slate-300 leading-relaxed mb-4">
          Throughout my career, I have applied technology to create meaningful change, from e-learning and gamification to digital health and AI-powered clinical tools. I build systems that enhance lives, empower users, and deliver measurable business results.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          I am looking for opportunities where I can combine technical depth with product leadership to solve complex problems. Whether architecting systems, leading teams, or guiding product strategy, I bring a founder's mindset: ownership, pragmatism, and a relentless focus on impact.
        </p>
        <p className="text-slate-300 leading-relaxed">
          I would welcome the chance to discuss how my experience can contribute to your team.
        </p>
      </section>
    </article>
  );
};

export default CoverLetterPreview;
