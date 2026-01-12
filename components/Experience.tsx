import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { MapPin, Calendar, Briefcase, Cpu, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useActiveSection,
  useScrollTo,
  useSidebarSync,
  useSkillsBarVisibility,
  useScrollManagerContext,
  useTimelineBall,
} from '../hooks/scroll';
import { useExperienceLegacy, type LegacySkill } from '../hooks';
import { useLegacyLocale } from '../contexts/locale.context';

/**
 * Maps category color names to Tailwind CSS classes
 */
const getCategoryColorClasses = (color: string): { bg: string; border: string; text: string; glow: string } => {
  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    purple: {
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/50 hover:border-purple-400',
      text: 'text-purple-200',
      glow: 'hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    },
    pink: {
      bg: 'bg-pink-500/20',
      border: 'border-pink-500/50 hover:border-pink-400',
      text: 'text-pink-200',
      glow: 'hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]',
    },
    blue: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50 hover:border-blue-400',
      text: 'text-blue-200',
      glow: 'hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    },
    cyan: {
      bg: 'bg-cyan-500/20',
      border: 'border-cyan-500/50 hover:border-cyan-400',
      text: 'text-cyan-200',
      glow: 'hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    },
    red: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/50 hover:border-red-400',
      text: 'text-red-200',
      glow: 'hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/50 hover:border-yellow-400',
      text: 'text-yellow-200',
      glow: 'hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]',
    },
    green: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/50 hover:border-green-400',
      text: 'text-green-200',
      glow: 'hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]',
    },
  };
  return colorMap[color] ?? {
    bg: 'bg-slate-700/90',
    border: 'border-slate-600/50 hover:border-slate-500',
    text: 'text-slate-200',
    glow: 'hover:shadow-[0_0_15px_rgba(100,116,139,0.3)]',
  };
};

/**
 * Renders a colored skill badge based on its category
 */
const SkillBadge: React.FC<{ skill: LegacySkill; animated?: boolean; index?: number; activeId?: number }> = ({
  skill,
  animated = false,
  index = 0,
  activeId = 0,
}) => {
  const colors = getCategoryColorClasses(skill.categoryColor);

  if (animated) {
    return (
      <motion.span
        key={`${activeId}-${skill.id}`}
        initial={{ opacity: 0, scale: 0.8, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: 10 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className={`px-4 py-2 text-sm font-semibold ${colors.text} ${colors.bg} border ${colors.border} rounded-xl shadow-sm ${colors.glow} transition-all cursor-default`}
      >
        {skill.name}
      </motion.span>
    );
  }

  return (
    <span
      className={`px-3 py-1 text-sm font-medium ${colors.text} ${colors.bg} border ${colors.border} rounded-lg transition-all`}
    >
      {skill.name}
    </span>
  );
};

const Experience: React.FC = () => {
  // Get data from centralized data system
  const { experiences: EXPERIENCE, isLoading } = useExperienceLegacy();
  const { t } = useLegacyLocale();

  // Get scroll state from centralized manager
  const { activeSectionId, isActive } = useActiveSection();
  const { scrollToSection } = useScrollTo();
  const { showSkillsBar } = useSkillsBarVisibility();
  const { registerSection, unregisterSection } = useScrollManagerContext();

  // Local state for sidebar visibility indicators
  const [itemsAbove, setItemsAbove] = useState(0);
  const [itemsBelow, setItemsBelow] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Timeline visual state - calculated from DOM measurements
  const [timelineReady, setTimelineReady] = useState(false);
  const [lineHeight, setLineHeight] = useState(0);
  const ballOffsetRef = useRef(0); // Offset needed to align ball with dots
  const hasScrolledRef = useRef(false); // Track first scroll to force ball position


  // Use sidebar sync hook for auto-scrolling
  useSidebarSync(sidebarRef, {
    activeItemSelector: '[data-sidebar-active="true"]',
    targetPositionRatio: 1 / 3,
    jitterThreshold: 5,
  });

  // Procedural timeline ball animation - uses lerp for smooth following
  const { state: ballState, setTarget: setBallTarget, snapTo: snapBallTo } = useTimelineBall({
    smoothFactor: 0.15, // Slightly faster than default for responsive feel
    useSpring: true,    // Spring physics for natural motion
    stiffness: 200,     // Responsive but not too snappy
    damping: 22,        // Enough damping to prevent excessive oscillation
  });

  // Get numeric active index from section ID
  const activeId = activeSectionId
    ? parseInt(activeSectionId.replace('experience-', ''), 10)
    : 0;

  // Update timeline ball position when active section changes or sidebar scrolls
  const updateBallPosition = useCallback(() => {
    if (!sidebarRef.current) return;

    // Find the active sidebar item
    const activeItem = sidebarRef.current.querySelector(
      `[data-sidebar-index="${activeId}"]`
    ) as HTMLElement | null;

    if (!activeItem) return;

    // Get the timeline dot within this item (the circle element)
    const timelineDot = activeItem.querySelector('.timeline-dot') as HTMLElement | null;
    if (!timelineDot) return;

    // Calculate the target position relative to the sidebar container
    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    const dotRect = timelineDot.getBoundingClientRect();

    // Calculate dot center position in content coordinates
    const dotTopInContent = dotRect.top - sidebarRect.top + sidebarRef.current.scrollTop;
    const dotCenterInContent = dotTopInContent + dotRect.height / 2;

    // The ball (12px tall) needs its TOP positioned so its CENTER aligns with dot center
    // Ball center = ball top + 6, so ball top = dot center - 6
    const ballTopPosition = dotCenterInContent - 6;

    setBallTarget(ballTopPosition);
  }, [activeId, setBallTarget]);

  // Measure timeline dimensions from DOM - calculates ball offset and initial position
  const measureTimeline = useCallback(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar || EXPERIENCE.length === 0) return;

    // Find the active dot (or first dot if none active)
    const activeDot = sidebar.querySelector(`[data-sidebar-index="${activeId}"] .timeline-dot`) as HTMLElement;
    if (!activeDot) return;

    // Use getBoundingClientRect for accurate measurements
    const sidebarRect = sidebar.getBoundingClientRect();
    const dotRect = activeDot.getBoundingClientRect();

    // Calculate position in content coordinates
    const dotTopInContent = dotRect.top - sidebarRect.top + sidebar.scrollTop;
    const dotCenterInContent = dotTopInContent + dotRect.height / 2;
    const ballTopPosition = dotCenterInContent - 6; // Center the 12px ball

    // The -24 offset was empirically determined to align with actual dot positions
    ballOffsetRef.current = -24;

    // Set line height to full scrollable content height
    setLineHeight(sidebar.scrollHeight);

    // Snap ball to correct position immediately (no animation on initial load)
    snapBallTo(ballTopPosition);

    setTimelineReady(true);
  }, [EXPERIENCE.length, activeId, snapBallTo]);

  // Update ball position when active section changes
  useLayoutEffect(() => {
    updateBallPosition();
  }, [updateBallPosition]);

  // Measure timeline on mount and when data changes
  useEffect(() => {
    // Double rAF ensures DOM is fully rendered and painted
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        measureTimeline();
      });
    });
    window.addEventListener('resize', measureTimeline);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measureTimeline);
    };
  }, [measureTimeline]);

  // Also update ball position when sidebar scrolls (from useSidebarSync auto-scroll)
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleScroll = () => {
      // On first scroll, force remeasure and snap to correct position
      if (!hasScrolledRef.current) {
        hasScrolledRef.current = true;
        measureTimeline();
      }
      updateBallPosition();
    };

    sidebar.addEventListener('scroll', handleScroll, { passive: true });
    return () => sidebar.removeEventListener('scroll', handleScroll);
  }, [updateBallPosition, measureTimeline]);

  // Continuous ball position sync - ensures ball stays aligned with active item
  useEffect(() => {
    if (!timelineReady) return;

    const syncBallPosition = () => {
      updateBallPosition();
    };

    // Check position every 100ms to catch any drift
    const intervalId = setInterval(syncBallPosition, 100);

    // Also sync immediately
    syncBallPosition();

    return () => clearInterval(intervalId);
  }, [timelineReady, updateBallPosition]);


  // Debug logging
  console.log('[Experience] Render state:', { activeSectionId, activeId, showSkillsBar });

  // Register all experience sections on mount
  useEffect(() => {
    if (isLoading || EXPERIENCE.length === 0) return;

    console.log('[Experience] Registering sections...');
    const elements: Array<{ id: string; element: HTMLElement }> = [];

    EXPERIENCE.forEach((_, index) => {
      const id = `experience-${index}`;
      const element = document.getElementById(id);
      console.log(`[Experience] Looking for ${id}:`, element ? 'found' : 'NOT FOUND');
      if (element) {
        element.setAttribute('data-section-id', id);
        registerSection(id, element);
        elements.push({ id, element });
      }
    });

    console.log('[Experience] Registered', elements.length, 'sections');

    return () => {
      elements.forEach(({ id }) => unregisterSection(id));
    };
  }, [EXPERIENCE, isLoading, registerSection, unregisterSection]);

  // Calculate items above/below visible area in sidebar
  const updateVisibleItems = useCallback(() => {
    if (!sidebarRef.current) return;

    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    let above = 0;
    let below = 0;

    EXPERIENCE.forEach((_, index) => {
      const item = sidebarRef.current?.querySelector(
        `[data-sidebar-index="${index}"]`
      );
      if (item) {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;

        if (itemCenter < sidebarRect.top + 40) {
          above++;
        } else if (itemCenter > sidebarRect.bottom - 40) {
          below++;
        }
      }
    });

    setItemsAbove(above);
    setItemsBelow(below);
  }, [EXPERIENCE]);

  // Update visible items when active section changes or on sidebar scroll
  useEffect(() => {
    updateVisibleItems();
  }, [activeSectionId, updateVisibleItems]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleSidebarScroll = () => {
      updateVisibleItems();
    };

    sidebar.addEventListener('scroll', handleSidebarScroll, { passive: true });
    return () => sidebar.removeEventListener('scroll', handleSidebarScroll);
  }, [updateVisibleItems]);

  // Handle sidebar item click
  const handleScrollToExperience = (index: number) => {
    scrollToSection(`experience-${index}`);
  };

  // Safe access to current experience for skills bar
  const currentExperience = EXPERIENCE[activeId] ?? EXPERIENCE[0];

  // Loading state
  if (isLoading || EXPERIENCE.length === 0) {
    return (
      <section id="experience" className="pt-24 bg-dark relative">
        <div className="container mx-auto px-6 md:px-12 pb-24 relative z-10">
          <div className="animate-pulse">
            <div className="h-12 bg-slate-800 rounded w-1/3 mb-6" />
            <div className="h-6 bg-slate-800 rounded w-2/3 mb-24" />
            <div className="flex gap-24">
              <div className="w-1/3 hidden lg:block">
                <div className="space-y-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-800 rounded w-1/2" />
                        <div className="h-6 bg-slate-800 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-2/3 space-y-24">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-slate-800/40 rounded-3xl p-8 h-96" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="pt-24 bg-dark relative">
      <div className="container mx-auto px-6 md:px-12 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t({ en: 'Professional', pt: 'Jornada', es: 'Trayectoria' })}{' '}
            <span className="text-primary">
              {t({ en: 'Journey', pt: 'Profissional', es: 'Profesional' })}
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-xl">
            {t({
              en: 'A chronological timeline of leadership, product development, and technical innovation.',
              pt: 'Uma linha do tempo cronologica de lideranca, desenvolvimento de produtos e inovacao tecnica.',
              es: 'Una linea de tiempo cronologica de liderazgo, desarrollo de productos e innovacion tecnica.',
            })}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Sticky Sidebar Navigation (Desktop) */}
          <div className="hidden lg:block lg:w-1/3 relative">
            <div className="sticky top-32 relative">
              {/* Top indicator - positioned outside scroll area */}
              <div className="absolute -top-2 left-0 right-4 z-20 flex items-center justify-center pointer-events-none">
                <div className="bg-dark/95 backdrop-blur-sm px-3 py-1.5 rounded-b-lg border-x border-b border-slate-800/50">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    {itemsAbove > 0 ? (
                      <>
                        <ChevronUp size={12} />
                        {itemsAbove} {t({ en: 'more above', pt: 'acima', es: 'mas arriba' })}
                      </>
                    ) : (
                      <span className="text-slate-600">
                        {t({ en: 'Latest', pt: 'Mais recente', es: 'Mas reciente' })}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Bottom indicator - positioned outside scroll area */}
              <div className="absolute -bottom-2 left-0 right-4 z-20 flex items-center justify-center pointer-events-none">
                <div className="bg-dark/95 backdrop-blur-sm px-3 py-1.5 rounded-t-lg border-x border-t border-slate-800/50">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    {itemsBelow > 0 ? (
                      <>
                        <ChevronDown size={12} />
                        {itemsBelow} {t({ en: 'more below', pt: 'abaixo', es: 'mas abajo' })}
                      </>
                    ) : (
                      <span className="text-slate-600">
                        {t({ en: 'Begin', pt: 'Inicio', es: 'Inicio' })}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Timeline List - Scrollable with hidden scrollbar and fade edges */}
              <div className="relative">
                {/* Top fade gradient */}
                <div className="absolute top-0 left-0 right-4 h-8 bg-gradient-to-b from-dark to-transparent z-10 pointer-events-none" />
                {/* Bottom fade gradient */}
                <div className="absolute bottom-0 left-0 right-4 h-12 bg-gradient-to-t from-dark to-transparent z-10 pointer-events-none" />

                <div
                  ref={sidebarRef}
                  className="relative space-y-6 pt-4 pb-12 pl-1 max-h-[calc(100vh-300px)] overflow-y-auto pr-4 scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {/* Timeline line - spans full height of scrollable content */}
                  <div
                    className="absolute left-[23px] top-0 w-0.5 bg-slate-800 rounded-full pointer-events-none"
                    style={{ height: `${lineHeight}px` }}
                  />

                  {/* Floating ball that follows active item - procedural animation */}
                  <div
                    className="absolute left-[18px] top-0 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)] z-20 pointer-events-none transition-opacity duration-200"
                    style={{
                      transform: `translateY(${ballState.y + ballOffsetRef.current}px)`,
                      opacity: timelineReady ? 1 : 0,
                      willChange: ballState.isAnimating ? 'transform' : 'auto',
                    }}
                  />

                  {EXPERIENCE.map((exp, index) => {
                    const isItemActive = isActive(`experience-${index}`);
                    return (
                      <div
                        key={index}
                        data-sidebar-index={index}
                        data-sidebar-active={isItemActive}
                        className="relative group"
                      >
                        <button
                          onClick={() => handleScrollToExperience(index)}
                          className="flex items-start gap-6 w-full text-left outline-none group"
                        >
                          {/* Timeline Dot - ring that highlights when active */}
                          <div
                            className={`timeline-dot relative z-10 w-10 h-10 mt-1.5 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${isItemActive ? 'bg-dark border-primary scale-110' : 'bg-dark border-slate-700 group-hover:border-slate-500'}`}
                          >
                            {/* Static inactive indicator - hidden when active since floating ball shows through */}
                            {!isItemActive && (
                              <div className="w-2 h-2 bg-slate-700 rounded-full group-hover:bg-slate-500 transition-colors" />
                            )}
                          </div>

                          {/* Text Content */}
                          <div
                            className={`transition-all duration-300 pt-1 ${isItemActive ? 'opacity-100 translate-x-0' : 'opacity-40 hover:opacity-70'}`}
                          >
                            <span className="text-sm font-bold uppercase tracking-wider block mb-1 text-slate-500">
                              {exp.period}
                            </span>
                            <h3
                              className={`text-xl font-bold leading-tight ${isItemActive ? 'text-white' : 'text-slate-300'}`}
                            >
                              {exp.role}
                            </h3>
                            {isItemActive && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-primary text-base font-medium mt-1"
                              >
                                {exp.company}
                              </motion.p>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="lg:w-2/3 flex flex-col gap-24">
            {EXPERIENCE.map((exp, index) => {
              const isCardActive = isActive(`experience-${index}`);
              return (
                <motion.div
                  key={index}
                  id={`experience-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6 }}
                  className="relative group"
                >
                  {/* Mobile Header (replaces sidebar on small screens) */}
                  <div className="lg:hidden mb-6 flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <span className="text-primary font-bold tracking-widest uppercase text-base">
                      {exp.period}
                    </span>
                  </div>

                  <div
                    className={`bg-card/40 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl transition-all duration-700 relative overflow-hidden
                      ${
                        isCardActive
                          ? 'opacity-100 scale-100 shadow-2xl border-slate-600'
                          : 'opacity-30 scale-95 blur-[1px] border-transparent grayscale-[0.8]'
                      }
                    `}
                  >
                    {/* Decorative faint glow */}
                    <div
                      className={`absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500 ${isCardActive ? 'opacity-100' : 'opacity-0'}`}
                    />

                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                        <div>
                          <h3
                            className={`text-4xl font-bold mb-2 transition-colors duration-300 ${isCardActive ? 'text-white' : 'text-slate-400'}`}
                          >
                            {exp.role}
                          </h3>
                          <div className="flex items-center gap-2 text-2xl text-slate-300 font-medium">
                            <Briefcase
                              size={24}
                              className={
                                isCardActive ? 'text-primary' : 'text-slate-500'
                              }
                            />
                            <span>{exp.company}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 text-slate-500 text-base font-medium sm:text-right shrink-0">
                          <div className="flex items-center sm:justify-end gap-2 whitespace-nowrap">
                            <Calendar size={16} className="shrink-0" />
                            {exp.period}
                          </div>
                          <div className="flex items-center sm:justify-end gap-2">
                            <MapPin size={16} />
                            {exp.location}
                          </div>
                        </div>
                      </div>

                      <div className="mb-8 border-l-2 border-slate-700 pl-6 py-2">
                        <p
                          className={`text-xl leading-relaxed italic ${isCardActive ? 'text-slate-300' : 'text-slate-500'}`}
                        >
                          "{exp.description}"
                        </p>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                          {t({ en: 'Key Achievements', pt: 'Principais Conquistas', es: 'Logros Clave' })}{' '}
                          <span className="h-px bg-slate-800 flex-1"></span>
                        </h4>
                        <div className="space-y-4">
                          {exp.achievements.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-4 group/item"
                            >
                              <div
                                className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-300 ${isCardActive ? 'bg-primary' : 'bg-slate-600'}`}
                              />
                              <p
                                className={`text-lg leading-relaxed transition-colors ${isCardActive ? 'text-slate-400 group-hover/item:text-slate-200' : 'text-slate-600'}`}
                              >
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mobile Only Skills Display */}
                      <div className="lg:hidden mt-8 pt-6 border-t border-slate-800">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                          {t({ en: 'Applied Skills', pt: 'Habilidades Aplicadas', es: 'Habilidades Aplicadas' })}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill) => (
                            <SkillBadge key={skill.id} skill={skill} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Skills Bar (Desktop) - scrolls with section */}
      <AnimatePresence>
        {showSkillsBar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block sticky bottom-0 left-0 right-0 z-40"
          >
            {/* Glow effect behind the bar */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent blur-xl pointer-events-none" />

            <div className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-t border-primary/30 shadow-[0_-10px_60px_rgba(14,165,233,0.15)]">
              <div className="container mx-auto px-6 md:px-12 py-5">
                <div className="flex items-center gap-6">
                  {/* Label */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Cpu size={20} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {t({ en: 'Applied Skills', pt: 'Habilidades Aplicadas', es: 'Habilidades Aplicadas' })}
                      </span>
                      <span className="text-primary font-semibold text-lg">
                        {currentExperience?.company}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />

                  {/* Skills - animate container as a whole to prevent layout thrashing */}
                  <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-wrap gap-2"
                      >
                        {currentExperience?.skills.map((skill, i) => (
                          <motion.span
                            key={skill.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.15, delay: i * 0.02 }}
                          >
                            <SkillBadge skill={skill} />
                          </motion.span>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Experience;
