/**
 * Scroll Management Module
 *
 * Centralized scroll state management for the portfolio prototype.
 * Replaces multiple competing scroll listeners with a single coordinated system.
 *
 * @example
 * ```tsx
 * // In App.tsx
 * import { ScrollManagerProvider } from './hooks/scroll';
 *
 * function App() {
 *   return (
 *     <ScrollManagerProvider>
 *       <Navbar />
 *       <Experience />
 *     </ScrollManagerProvider>
 *   );
 * }
 *
 * // In Navbar.tsx
 * import { useNavbarScroll } from './hooks/scroll';
 *
 * function Navbar() {
 *   const { isScrolled } = useNavbarScroll();
 *   // ...
 * }
 *
 * // In Experience.tsx
 * import {
 *   useActiveSection,
 *   useScrollTo,
 *   useSidebarSync,
 *   useSkillsBarVisibility,
 *   useSectionRegistration,
 * } from './hooks/scroll';
 * ```
 */

// Provider
export { ScrollManagerProvider } from './scroll-manager.provider';

// Context (for advanced usage)
export {
  ScrollManagerContext,
  useScrollManagerContext,
} from './scroll-manager.context';

// Hooks
export { useNavbarScroll } from './use-navbar-scroll.hook';
export { useActiveSection } from './use-active-section.hook';
export { useScrollTo } from './use-scroll-to.hook';
export { useSidebarSync } from './use-sidebar-sync.hook';
export { useSkillsBarVisibility } from './use-skills-bar-visibility.hook';
export { useSectionRegistration } from './use-section-registration.hook';
export { useTimelineBall } from './use-timeline-ball.hook';

// Types
export type {
  ScrollMode,
  SectionInfo,
  ScrollManagerState,
  ScrollManagerActions,
  ScrollManagerContextValue,
  ScrollManagerProviderProps,
  ScrollToOptions,
  UseNavbarScrollReturn,
  UseActiveSectionReturn,
  UseScrollToReturn,
  UseSidebarSyncOptions,
  UseSkillsBarVisibilityReturn,
  UseSectionRegistrationReturn,
} from './scroll-manager.types';

export type {
  TimelineBallOptions,
  TimelineBallState,
  UseTimelineBallReturn,
} from './use-timeline-ball.hook';
