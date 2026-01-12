import React from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguages } from '../hooks';
import { useLegacyLocale } from '../contexts/locale.context';
import type { LanguageLevel } from '../types/portfolio-data.types';

const levelColor = (level: LanguageLevel): string => {
  switch (level) {
    case 'native':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'fluent':
      return 'bg-primary/20 text-primary border-primary/30';
    case 'intermediate':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'basic':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const Languages: React.FC = () => {
  const { languages, isLoading } = useLanguages();
  const { t } = useLegacyLocale();

  if (isLoading) {
    return null;
  }

  return (
    <section id="languages" className="py-16 bg-darker">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100">
              {t({ en: 'Languages', pt: 'Idiomas', es: 'Idiomas' })}
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {languages.map((language, index) => (
              <motion.div
                key={language.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${levelColor(language.level)} backdrop-blur-sm`}
              >
                <span className="text-lg">{language.flagEmoji}</span>
                <span className="font-medium">{language.name}</span>
                <span className="text-xs opacity-75">({language.levelDisplay})</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Languages;
