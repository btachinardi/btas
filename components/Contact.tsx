import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile } from '../hooks';
import { useLegacyLocale } from '../contexts/locale.context';

const Contact: React.FC = () => {
  const { profile, isLoading } = useProfile();
  const { t } = useLegacyLocale();

  if (isLoading || !profile) {
    return null;
  }

  return (
    <footer id="contact" className="py-24 bg-dark border-t border-slate-800">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              {t({ en: "Let's build something", pt: "Vamos construir algo", es: "Construyamos algo" })} <br/>
              <span className="text-primary">{t({ en: 'impactful', pt: 'impactante', es: 'impactante' })}</span> {t({ en: 'together.', pt: 'juntos.', es: 'juntos.' })}
            </h2>
            <p className="text-slate-400 text-xl mb-10 max-w-md">
              {t({
                en: 'Open to leadership roles, technical consulting, and innovative ventures.',
                pt: 'Aberto a cargos de lideranca, consultoria tecnica e empreendimentos inovadores.',
                es: 'Abierto a roles de liderazgo, consultoria tecnica y emprendimientos innovadores.'
              })}
            </p>
            <div className="flex gap-6">
              {profile.social.linkedin && (
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-slate-800 rounded-full text-white hover:bg-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={28} />
                </a>
              )}
              {profile.social.github && (
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-slate-800 rounded-full text-white hover:bg-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={28} />
                </a>
              )}
              <a
                href={`mailto:${profile.email}`}
                className="p-4 bg-slate-800 rounded-full text-white hover:bg-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={28} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card p-10 rounded-3xl border border-slate-800"
          >
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-slate-500 text-sm uppercase tracking-wide font-bold">
                    {t({ en: 'Email', pt: 'E-mail', es: 'Correo' })}
                  </p>
                  <a href={`mailto:${profile.email}`} className="text-white text-xl font-medium hover:text-primary transition-colors">{profile.email}</a>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-slate-500 text-sm uppercase tracking-wide font-bold">
                    {t({ en: 'Phone', pt: 'Telefone', es: 'Telefono' })}
                  </p>
                  <p className="text-white text-xl font-medium">{profile.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-slate-500 text-sm uppercase tracking-wide font-bold">
                    {t({ en: 'Location', pt: 'Localizacao', es: 'Ubicacion' })}
                  </p>
                  <p className="text-white text-xl font-medium">{profile.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-24 pt-8 border-t border-slate-800 text-center text-slate-600 text-lg"
        >
          <p>&copy; {new Date().getFullYear()} {profile.displayName}. {t({ en: 'All rights reserved.', pt: 'Todos os direitos reservados.', es: 'Todos los derechos reservados.' })}</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Contact;
