/**
 * useSkillsBarVisibility Hook
 *
 * Provides skills bar visibility state from the scroll manager.
 * Shows the sticky skills bar after first experience is halfway scrolled.
 */

import { useScrollManagerContext } from './scroll-manager.context';
import type { UseSkillsBarVisibilityReturn } from './scroll-manager.types';

/**
 * Hook to get skills bar visibility state.
 *
 * @returns Object with showSkillsBar boolean
 *
 * @example
 * ```tsx
 * function SkillsBar() {
 *   const { showSkillsBar } = useSkillsBarVisibility();
 *
 *   if (!showSkillsBar) return null;
 *
 *   return (
 *     <div className="sticky bottom-0">
 *       ...
 *     </div>
 *   );
 * }
 * ```
 */
export function useSkillsBarVisibility(): UseSkillsBarVisibilityReturn {
  const { showSkillsBar } = useScrollManagerContext();

  return { showSkillsBar };
}
