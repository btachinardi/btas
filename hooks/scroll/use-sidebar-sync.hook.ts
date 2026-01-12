/**
 * useSidebarSync Hook
 *
 * Automatically scrolls a sidebar container to keep the active item visible.
 * Replaces the manual sidebar scroll logic in Experience.tsx.
 */

import { useEffect, useRef, type RefObject } from 'react';
import { useScrollManagerContext } from './scroll-manager.context';
import type { UseSidebarSyncOptions } from './scroll-manager.types';

const DEFAULT_TARGET_POSITION_RATIO = 1 / 3;
const DEFAULT_JITTER_THRESHOLD = 5;

/**
 * Hook to sync sidebar scroll position with active section.
 *
 * @param containerRef - Ref to the sidebar scroll container
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function Sidebar() {
 *   const sidebarRef = useRef<HTMLDivElement>(null);
 *
 *   useSidebarSync(sidebarRef, {
 *     activeItemSelector: '[data-sidebar-active="true"]',
 *     targetPositionRatio: 1/3,
 *   });
 *
 *   return (
 *     <div ref={sidebarRef} className="overflow-y-auto">
 *       {items.map((item, index) => (
 *         <div
 *           key={index}
 *           data-sidebar-active={isActive(index)}
 *         >
 *           {item.title}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSidebarSync(
  containerRef: RefObject<HTMLElement | null>,
  options: UseSidebarSyncOptions
): void {
  const { activeSectionId, getScrollModeSync } = useScrollManagerContext();

  const {
    activeItemSelector,
    targetPositionRatio = DEFAULT_TARGET_POSITION_RATIO,
    jitterThreshold = DEFAULT_JITTER_THRESHOLD,
  } = options;

  // Track last scroll target to prevent jitter
  const lastTargetRef = useRef<number | null>(null);

  useEffect(() => {
    // Don't sync during programmatic scrolling to prevent interference.
    // IMPORTANT: Use getScrollModeSync() instead of scrollMode state to get
    // the current mode synchronously. The state update is async and may lag
    // behind the ref, causing this effect to run when it shouldn't.
    if (getScrollModeSync() === 'programmatic') return;

    const container = containerRef.current;
    if (!container) return;

    // Find the active item in the sidebar
    const activeItem = container.querySelector(
      activeItemSelector
    ) as HTMLElement | null;

    if (!activeItem) return;

    // Calculate scroll position to place active item at target position
    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    const itemOffsetTop =
      itemRect.top - containerRect.top + container.scrollTop;
    const targetScroll = Math.max(
      0,
      itemOffsetTop - containerRect.height * targetPositionRatio
    );

    // Only update if target changed significantly (prevent jitter)
    if (
      lastTargetRef.current === null ||
      Math.abs(targetScroll - lastTargetRef.current) > jitterThreshold
    ) {
      lastTargetRef.current = targetScroll;
      container.scrollTop = targetScroll;
    }
  }, [
    activeSectionId,
    getScrollModeSync,
    containerRef,
    activeItemSelector,
    targetPositionRatio,
    jitterThreshold,
  ]);
}
