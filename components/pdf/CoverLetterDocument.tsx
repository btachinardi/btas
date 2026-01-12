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
import type { Locale, PortfolioData } from '../../types/portfolio-data.types';
import { formatDateRange } from '../../utils/date';

// Cast imported JSON to typed data
const data = portfolioData as unknown as PortfolioData;

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
function td(keys: { cv?: string; coverLetter?: string; portfolio?: string }, locale: Locale, docType: 'cv' | 'coverLetter' | 'portfolio' = 'coverLetter'): string {
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

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1f2937',
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#0ea5e9',
    paddingBottom: 20,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#0ea5e9',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 15,
  },
  contactItem: {
    fontSize: 9,
    color: '#6b7280',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 10,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.7,
    color: '#374151',
    marginBottom: 10,
    textAlign: 'justify',
  },
  highlight: {
    fontFamily: 'Helvetica-Bold',
    color: '#0ea5e9',
  },
  link: {
    color: '#0ea5e9',
    textDecoration: 'none',
  },
  projectItem: {
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  projectDetails: {
    fontSize: 9.5,
    color: '#374151',
    lineHeight: 1.6,
  },
  closing: {
    marginTop: 20,
  },
});

interface CoverLetterDocumentProps {
  locale?: Locale;
}

const CoverLetterDocument: React.FC<CoverLetterDocumentProps> = ({ locale = 'en' }) => {
  // Get profile data
  const profile = data.profile;
  const locationStr = profile.location.city && profile.location.country
    ? `${profile.location.city}, ${profile.location.country}`
    : profile.location.label
      ? resolveText(profile.location.label, locale)
      : '';

  // Get recent projects (first 3 from experiences, which are the most recent by sortOrder)
  const recentProjects = [...data.experiences]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 3)
    .map((exp) => ({
      company: exp.company.name,
      period: formatDateRange(
        exp.roles[0].startDate,
        exp.roles[0].endDate,
        locale,
        'short'
      ),
      description: td(exp.description as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'coverLetter'),
    }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Dynamic from profile */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.displayName}</Text>
          <Text style={styles.title}>{resolveText(profile.title, locale)}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{locationStr}</Text>
            <Text style={styles.contactItem}>{profile.phone}</Text>
            <Text style={styles.contactItem}>{profile.email}</Text>
          </View>
        </View>

        {/* Opening - Uses profile.summary */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            {td(profile.summary as { cv?: string; coverLetter?: string; portfolio?: string }, locale, 'coverLetter')}
          </Text>
          <Text style={styles.paragraph}>
            At Fofuuu, I designed and built patient management systems for autism therapy clinics, including claims-based access control, remote activity monitoring, clinical dashboards, AI-driven adaptive therapy plans, and analytics pipelines. This work resulted in a published clinical study and a platform that serves therapists and families across Brazil (<Link src={profile.social.youtube ?? ''} style={styles.link}>1 Minute Product Showcase</Link>).
          </Text>
          <Text style={styles.paragraph}>
            These experiences taught me that successful products address specific user needs, whether alleviating pain points like cost and time, or amplifying gains like revenue and satisfaction. I lead teams with a culture of experimentation: distinguishing hypotheses from validated insights, aligning around shared objectives, and making data-driven decisions.
          </Text>
        </View>

        {/* Journey */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            I started programming at 13, teaching myself to build tools and games. That early curiosity laid the foundation for everything that followed.
          </Text>
          <Text style={styles.paragraph}>
            My entrepreneurial path began with <Text style={styles.highlight}>Betri Studio</Text>, where I grew into a product manager and full-stack developer. I led projects including an HR expense system with OCR invoice scanning, a gamified rewards app integrated with sales performance metrics that drove engagement and revenue growth, and immersive digital training experiences for enterprise clients.
          </Text>
          <Text style={styles.paragraph}>
            I co-founded <Text style={styles.highlight}>Fofuuu</Text> to tackle digital health, building prototypes and MVPs for speech therapy activities. I developed real-time sound signal analysis systems and managed large-scale development efforts. Our work earned the <Link src="https://gizmodo.uol.com.br/com-premio-no-big-festival-fofuu-mostra-que-games-podem-ser-mui" style={styles.link}>Best Educational Game Award (BIG Festival/BNDES)</Link> and the <Link src="https://www.pptasaude.com.br/noticias/3501/startup-fofuuu-e-vencedora-do-premio-empreend" style={styles.link}>Health Entrepreneurship Award (Sirio-Libanes Institute and Everis Brazil)</Link>.
          </Text>
          <Text style={styles.paragraph}>
            After securing funding and transitioning to a dedicated CTO role, I led the development of Fofuuu Fono, a gamified digital therapy platform for speech therapists and caregivers. In partnership with Unifesp's Speech Therapy Ambulatory, I supervised a clinical study published at the <Link src="https://www.forl.org.br/" style={styles.link}>16th Congress of the Otorhinolaryngology Foundation</Link>.
          </Text>
          <Text style={styles.paragraph}>
            I directed the <Text style={styles.highlight}>PhoneNet</Text> project, a deep learning model for isolated phoneme classification designed to run on mobile devices. I led the full lifecycle: implementing a ResNet-based architecture with international collaborators, orchestrating a nationwide campaign to collect and label phoneme samples, and publishing findings at the <Link src="https://www.sbfa.org.br/" style={styles.link}>26th CBFa</Link>.
          </Text>
          <Text style={styles.paragraph}>
            When Fofuuu pivoted to broader autism therapies, I took on dual CEO and CTO responsibilities. I secured funding from <Link src="https://news.samsung.com/br/samsung-acelera-startup-que-estimula-a-fala-das-criancas-com-jo" style={styles.link}>Samsung Creative Startups</Link> and a larger round from <Link src="https://finep.gov.br/" style={styles.link}>Finep Startup</Link>, then led the design of Fofuuu Edu, expanding to Behavioral Psychology, Psycho-pedagogy, Speech Therapy, and Occupational Therapy.
          </Text>
          <Text style={styles.paragraph}>
            When the pandemic disrupted healthcare delivery, I adapted our platform for remote therapy sessions and secured funding from the <Link src="https://revistapegn.globo.com/Startups/noticia/2020/04/prefeitura-de-sp-anuncia-startups-que-" style={styles.link}>Covid-19 Rapid Innovation Cycle (City of Sao Paulo)</Link> and the <Link src="https://www.santanderx.com/en/blog/fofuuu-tricia-araujo-bruno-tachinardi" style={styles.link}>Santander X Tomorrow Challenge</Link>. I transitioned the team to remote work and guided the company through restructuring during the industry-wide financial crisis.
          </Text>
          <Text style={styles.paragraph}>
            When our B2C model proved unsustainable, I made the difficult decision to restructure and pause operations. I then joined <Text style={styles.highlight}>Nubank</Text> as a product consultant, applying my entrepreneurial experience to a gamified loyalty program, providing strategic UX insights and supporting the project manager in aligning the initiative with business objectives.
          </Text>
        </View>

        {/* Recent Projects - Dynamic from experiences */}
        <Text style={styles.sectionTitle}>Recent Projects</Text>
        <View style={styles.section}>
          {recentProjects.map((project, idx) => (
            <View key={idx} style={styles.projectItem}>
              <Text style={styles.projectTitle}>{project.company} ({project.period})</Text>
              <Text style={styles.projectDetails}>
                {project.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Closing */}
        <View style={styles.closing}>
          <Text style={styles.paragraph}>
            Throughout my career, I have applied technology to create meaningful change, from e-learning and gamification to digital health and AI-powered clinical tools. I build systems that enhance lives, empower users, and deliver measurable business results.
          </Text>
          <Text style={styles.paragraph}>
            I am looking for opportunities where I can combine technical depth with product leadership to solve complex problems. Whether architecting systems, leading teams, or guiding product strategy, I bring a founder's mindset: ownership, pragmatism, and a relentless focus on impact.
          </Text>
          <Text style={styles.paragraph}>
            I would welcome the chance to discuss how my experience can contribute to your team.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CoverLetterDocument;
