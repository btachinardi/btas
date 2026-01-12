/**
 * useNavbarScroll Hook
 *
 * Provides navbar scroll state from the centralized scroll manager.
 * Replaces the standalone scroll listener in Navbar.tsx.
 */

import { useScrollManagerContext } from './scroll-manager.context';
import type { UseNavbarScrollReturn } from './scroll-manager.types';

/**
 * Hook to get navbar scroll state.
 *
 * @returns Object containing isScrolled boolean
 *
 * @example
 * ```tsx
 * function Navbar() {
 *   const { isScrolled } = useNavbarScroll();
 *
 *   return (
 *     <nav className={isScrolled ? 'bg-dark/90 backdrop-blur-md' : 'transparent'}>
 *       ...
 *     </nav>
 *   );
 * }
 * ```
 */
export function useNavbarScroll(): UseNavbarScrollReturn {
  const { isScrolled } = useScrollManagerContext();

  return { isScrolled };
}
