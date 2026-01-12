import React from 'react';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEducation } from '../hooks';
import { useLegacyLocale } from '../contexts/locale.context';

const Education: React.FC = () => {
  const { education, isLoading } = useEducation();
  const { t } = useLegacyLocale();

  if (isLoading || education.length === 0) {
    return null;
  }

  const edu = education[0];

  return (
    <section id="education" className="py-24 bg-darker">
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-16 relative inline-block"
        >
          {t({ en: 'Education', pt: 'Educacao', es: 'Educacion' })}
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: "33%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-0 left-0 h-1 bg-primary rounded-full"
          />
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-card to-slate-900 p-10 rounded-2xl border border-slate-800 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1 max-w-3xl"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <GraduationCap size={28} />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
            {edu.degree}
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-400 text-base mb-6">
            <div className="flex items-center gap-2 uppercase tracking-wider font-medium">
              <Award size={16} />
              <span>{edu.institution}</span>
            </div>
            <span className="hidden sm:block">|</span>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{edu.location}</span>
            </div>
            <span className="hidden sm:block">|</span>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{edu.period}</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">
              {t({ en: 'Key Achievements', pt: 'Conquistas Principais', es: 'Logros Principales' })}
              <span className="h-px bg-slate-800 flex-1"></span>
            </h4>
            <div className="space-y-4">
              {edu.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 group/item"
                >
                  <div className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />
                  <p className="text-slate-400 leading-relaxed text-lg group-hover/item:text-slate-200 transition-colors">
                    {achievement}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
