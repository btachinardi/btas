import React, { useEffect, useRef } from 'react';
import { ArrowDown, Linkedin, Mail, FileText, Github, Briefcase, Trophy, Globe2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../hooks/use-profile.hook';
import { useLanguages } from '../hooks/use-languages.hook';
import { useAwardsCount } from '../hooks/use-awards.hook';
import { useLegacyLocale } from '../contexts/locale.context';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Data hooks
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { languages, isLoading: isLanguagesLoading } = useLanguages();
  const { count: awardsCount, isLoading: isAwardsLoading } = useAwardsCount();
  const { t } = useLegacyLocale();

  // Combined loading state
  const isLoading = isProfileLoading || isLanguagesLoading || isAwardsLoading;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Mouse state
    const mouse = { x: -1000, y: -1000 }; // Start off screen to prevent interaction on load

    // Set canvas size
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      baseX: number;
      baseY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; // Slow drift velocity
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        // Random opacity for twinkling effect, using the primary blue color
        this.color = `rgba(14, 165, 233, ${Math.random() * 0.4 + 0.1})`;
        this.baseX = this.x;
        this.baseY = this.y;
      }

      update() {
        // Normal drift
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from edges
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse Interaction (Repulsion)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const directionX = dx / distance;
          const directionY = dy / distance;
          
          // Gentle push away
          this.x -= directionX * force * 2;
          this.y -= directionY * force * 2;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Adjust density based on screen size (fewer particles on smaller screens)
      const particleCount = (width * height) / 12000; 
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw connections between nearby particles
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Connect if close enough
          if (distance < 120) {
            ctx.beginPath();
            // Opacity fades as distance increases
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Setup Listeners
    window.addEventListener('resize', handleResize);
    // Attach mouse events to window for smoother interaction even if mouse leaves canvas slightly
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Return null while loading to prevent rendering with undefined data
  if (isLoading || !profile) {
    return null;
  }

  return (
    <section id="profile" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full z-0 opacity-60 pointer-events-none"
      />

      {/* Atmospheric Background Blobs (Behind Canvas) */}
      <div className="absolute top-0 left-0 w-full h-full z-[-1] pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 pointer-events-none">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-8">
          {/* Left Column - Intro */}
          <div className="max-w-2xl pointer-events-auto">
            {/* Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <div className="relative inline-block">
                {/* Glow effect */}
                <div className="absolute -inset-3 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-full blur-xl" />

                {/* Photo container */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-slate-700/50 shadow-2xl">
                  <picture>
                    <source
                      type="image/avif"
                      srcSet="/images/profile-128.avif 128w, /images/profile-256.avif 256w"
                      sizes="(min-width: 768px) 128px, 96px"
                    />
                    <source
                      type="image/webp"
                      srcSet="/images/profile-128.webp 128w, /images/profile-256.webp 256w"
                      sizes="(min-width: 768px) 128px, 96px"
                    />
                    <img
                      src="/images/profile-256.png"
                      srcSet="/images/profile-128.png 128w, /images/profile-256.png 256w"
                      sizes="(min-width: 768px) 128px, 96px"
                      alt={profile.displayName}
                      width={128}
                      height={128}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                    />
                  </picture>
                </div>

                {/* Decorative ring */}
                <div className="absolute -inset-1.5 border-2 border-primary/20 rounded-full" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-primary font-medium tracking-widest uppercase mb-4 text-lg"
            >
              {t({ en: 'Hello, I am', pt: 'Ola, eu sou', es: 'Hola, soy' })}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 50 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight"
            >
              {profile.firstName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">{profile.lastName}</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-slate-400 font-light mb-8"
            >
              {profile.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10"
            >
              {profile.summary}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href={`mailto:${profile.email}`}
                className="px-8 py-4 bg-primary hover:bg-sky-600 text-white text-lg font-semibold rounded-full transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center gap-3 group"
              >
                <Mail size={20} className="group-hover:scale-110 transition-transform" />
                {t({ en: 'Contact Me', pt: 'Contato', es: 'Contacto' })}
              </a>
              {profile.social.linkedin && (
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-transparent border border-slate-600 hover:border-white text-white text-lg font-semibold rounded-full transition-all flex items-center gap-3 group"
                >
                  <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                  LinkedIn
                </a>
              )}
              {profile.social.github && (
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-transparent border border-slate-600 hover:border-white text-white text-lg font-semibold rounded-full transition-all flex items-center gap-3 group"
                >
                  <Github size={20} className="group-hover:scale-110 transition-transform" />
                  GitHub
                </a>
              )}
            </motion.div>

            {/* Document Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex flex-wrap gap-4 mt-6"
            >
              <Link
                to="/cv"
                className="px-6 py-3 bg-card/80 hover:bg-card border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-medium rounded-lg transition-all flex items-center gap-2 group"
              >
                <FileText size={18} className="text-primary group-hover:scale-110 transition-transform" />
                {t({ en: 'View CV', pt: 'Ver Curriculo', es: 'Ver Curriculum' })}
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pointer-events-auto lg:w-[380px] flex-shrink-0"
          >
            <div className="bg-card/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                {t({ en: 'Quick Overview', pt: 'Visao Geral', es: 'Vista Rapida' })}
              </h3>

              {/* Experience */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                  <Briefcase size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-sm text-slate-400">
                    {t({ en: 'Years Experience', pt: 'Anos de Experiencia', es: 'Anos de Experiencia' })}
                  </div>
                </div>
              </div>

              {/* Awards */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400">
                  <Trophy size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{awardsCount}</div>
                  <div className="text-sm text-slate-400">
                    {t({ en: 'Awards & Recognition', pt: 'Premios e Reconhecimentos', es: 'Premios y Reconocimientos' })}
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-violet-500/10 rounded-lg text-violet-400">
                  <Globe2 size={20} />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">
                    {languages.map(l => l.name).join(' \u2022 ')}
                  </div>
                  <div className="text-sm text-slate-400">
                    {t({ en: 'Languages Spoken', pt: 'Idiomas', es: 'Idiomas' })}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">{profile.location}</div>
                  <div className="text-sm text-slate-400">
                    {t({ en: 'Based In', pt: 'Localizado em', es: 'Ubicado en' })}
                  </div>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="pt-4 border-t border-slate-700/50">
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                  {t({ en: 'Focus Areas', pt: 'Areas de Foco', es: 'Areas de Enfoque' })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.focusAreas.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1.5 bg-slate-800/50 text-slate-300 text-sm rounded-full border border-slate-700/50"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-500 z-10"
      >
        <ArrowDown size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;