/**
 * useScrollTo Hook
 *
 * Provides programmatic scroll functionality with proper mode tracking.
 * Replaces the fragile scrollToId function in Experience.tsx.
 */

import { useScrollManagerContext } from './scroll-manager.context';
import type { UseScrollToReturn, ScrollToOptions } from './scroll-manager.types';

/**
 * Hook for programmatic scrolling to sections.
 *
 * @returns Object with scrollToSection function and scroll state
 *
 * @example
 * ```tsx
 * function Sidebar() {
 *   const { scrollToSection, isScrolling } = useScrollTo();
 *
 *   const handleClick = (index: number) => {
 *     scrollToSection(`experience-${index}`, {
 *       offset: -100,
 *       onComplete: () => console.log('Scroll complete')
 *     });
 *   };
 *
 *   return (
 *     <button
 *       onClick={() => handleClick(0)}
 *       disabled={isScrolling}
 *     >
 *       Go to Experience 0
 *     </button>
 *   );
 * }
 * ```
 */
export function useScrollTo(): UseScrollToReturn {
  const { scrollToSection, scrollMode } = useScrollManagerContext();

  return {
    scrollToSection,
    scrollMode,
    isScrolling: scrollMode === 'programmatic',
  };
}
