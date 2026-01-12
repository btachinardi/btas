import React from 'react';
import { Trophy, Award as AwardIcon, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAwards } from '../hooks';
import { useLegacyLocale } from '../contexts/locale.context';

const getLinkLabel = (url: string): { en: string; pt: string; es: string } => {
  if (url.includes('youtu.be') || url.includes('youtube.com')) {
    return { en: 'Watch Video', pt: 'Assistir Vídeo', es: 'Ver Video' };
  }
  if (url.includes('linkedin.com/pulse')) {
    return { en: 'Read Post', pt: 'Ler Publicação', es: 'Leer Publicación' };
  }
  return { en: 'Read Article', pt: 'Ler Artigo', es: 'Leer Artículo' };
};

const Awards: React.FC = () => {
  const { awards, isLoading } = useAwards();
  const { t } = useLegacyLocale();

  if (isLoading) {
    return null;
  }

  return (
    <section id="awards" className="py-24 bg-darker">
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-16 relative inline-block"
        >
          {t({ en: 'Awards & Recognition', pt: 'Premios & Reconhecimentos', es: 'Premios & Reconocimientos' })}
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: "33%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-0 left-0 h-1 bg-primary rounded-full"
          />
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {awards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-card to-slate-900 p-10 rounded-2xl border border-slate-800 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="mb-6">
                <div className="p-4 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors inline-block">
                  <Trophy size={28} />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                {award.title}
              </h3>

              <div className="flex items-center gap-2 text-slate-400 text-base mb-6 uppercase tracking-wider font-medium">
                <AwardIcon size={16} />
                <span>{award.organization}</span>
                <span className="mx-2">•</span>
                <span>{award.date}</span>
              </div>

              <p className="text-slate-400 leading-relaxed text-lg">
                {award.description}
              </p>

              {award.link && (
                <a
                  href={award.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  {t(getLinkLabel(award.link))}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
