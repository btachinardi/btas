/**
 * useActiveSection Hook
 *
 * Provides active section state and helper functions.
 * Used by Experience component for card highlighting.
 */

import { useCallback } from 'react';
import { useScrollManagerContext } from './scroll-manager.context';
import type { UseActiveSectionReturn } from './scroll-manager.types';

/**
 * Hook to get active section state.
 *
 * @returns Object with activeSectionId and isActive helper
 *
 * @example
 * ```tsx
 * function ExperienceCard({ id }: { id: string }) {
 *   const { isActive } = useActiveSection();
 *   const active = isActive(id);
 *
 *   return (
 *     <div className={active ? 'opacity-100' : 'opacity-30'}>
 *       ...
 *     </div>
 *   );
 * }
 * ```
 */
export function useActiveSection(): UseActiveSectionReturn {
  const { activeSectionId } = useScrollManagerContext();

  const isActive = useCallback(
    (sectionId: string): boolean => {
      return activeSectionId === sectionId;
    },
    [activeSectionId]
  );

  return {
    activeSectionId,
    isActive,
  };
}
