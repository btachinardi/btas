import React from 'react';
import { Brain, Layout, Server, Database, Users, Heart, Lightbulb, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSkillCategoriesWithProjects } from '../hooks';
import { useLegacyLocale } from '../contexts/locale.context';
import ProjectBadge from './ProjectBadge';

const categoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Brain': return <Brain className="text-purple-400" />;
    case 'Layout': return <Layout className="text-pink-400" />;
    case 'Server': return <Server className="text-primary" />;
    case 'Cloud': return <Cloud className="text-cyan-400" />;
    case 'Heart': return <Heart className="text-red-400" />;
    case 'Lightbulb': return <Lightbulb className="text-yellow-400" />;
    case 'Users': return <Users className="text-green-400" />;
    default: return <Database />;
  }
};

const getCategoryColor = (iconName: string): string => {
  switch (iconName) {
    case 'Brain': return 'purple';
    case 'Layout': return 'pink';
    case 'Server': return 'blue';
    case 'Cloud': return 'cyan';
    case 'Heart': return 'red';
    case 'Lightbulb': return 'yellow';
    case 'Users': return 'green';
    default: return 'primary';
  }
};

const Skills: React.FC = () => {
  const { categories, isLoading } = useSkillCategoriesWithProjects();
  const { t } = useLegacyLocale();

  if (isLoading) {
    return null;
  }

  return (
    <section id="skills" className="py-24 bg-darker">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white relative inline-block">
            {t({ en: 'Technical Expertise', pt: 'Expertise Tecnica', es: 'Experiencia Tecnica' })}
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: "33%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute bottom-0 left-0 h-1 bg-primary rounded-full"
            />
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl">
            {t({
              en: 'Skills validated through real-world projects. Hover over any project badge to see details.',
              pt: 'Habilidades validadas atraves de projetos reais. Passe o mouse sobre qualquer badge para ver detalhes.',
              es: 'Habilidades validadas a traves de proyectos reales. Pase el cursor sobre cualquier insignia para ver detalles.',
            })}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-slate-900 rounded-lg">
                  {categoryIcon(category.icon)}
                </div>
                <h3 className="text-xl font-bold text-slate-100">{category.name}</h3>
              </div>

              <div className="space-y-5">
                {category.skills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-200 font-medium text-sm leading-tight">
                        {skill.name}
                      </span>
                      {skill.projects.length > 0 && (
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {skill.projects.length} {skill.projects.length === 1 ? 'project' : 'projects'}
                        </span>
                      )}
                    </div>

                    {skill.projects.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {skill.projects.slice(0, 5).map((project) => (
                          <ProjectBadge
                            key={project.experienceId}
                            project={project}
                            color={getCategoryColor(category.icon)}
                          />
                        ))}
                        {skill.projects.length > 5 && (
                          <span className="inline-flex items-center px-2 py-1 text-xs text-slate-500">
                            +{skill.projects.length - 5} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs text-slate-500 bg-slate-800/50 border border-slate-700/50">
                          {t({ en: 'Continuous learning', pt: 'Aprendizado continuo', es: 'Aprendizaje continuo' })}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
