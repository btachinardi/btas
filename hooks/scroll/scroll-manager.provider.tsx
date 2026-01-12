/**
 * Scroll Manager Provider
 *
 * Provides centralized scroll state management with:
 * - Single RAF-throttled scroll listener
 * - IntersectionObserver for section visibility
 * - Scroll mode tracking (user vs programmatic)
 * - Focus point-based active section detection
 */

import {
  useReducer,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import {
  ScrollManagerContext,
  initialScrollManagerState,
  scrollManagerReducer,
} from './scroll-manager.context';
import type {
  ScrollManagerProviderProps,
  ScrollManagerContextValue,
  ScrollToOptions,
  SectionInfo,
  ScrollMode,
} from './scroll-manager.types';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_NAVBAR_THRESHOLD = 50;
const DEFAULT_FOCUS_POINT_RATIO = 1 / 3;
const DEFAULT_NAVBAR_OFFSET = -100;
const SCROLL_END_FALLBACK_MS = 800;

// ============================================================================
// Provider Component
// ============================================================================

export function ScrollManagerProvider({
  children,
  navbarThreshold = DEFAULT_NAVBAR_THRESHOLD,
  focusPointRatio = DEFAULT_FOCUS_POINT_RATIO,
  navbarOffset = DEFAULT_NAVBAR_OFFSET,
}: ScrollManagerProviderProps): ReactNode {
  const [state, dispatch] = useReducer(
    scrollManagerReducer,
    initialScrollManagerState
  );

  // Refs for tracking scroll state without causing re-renders
  const scrollModeRef = useRef<ScrollMode>('idle');
  const rafIdRef = useRef<number | null>(null);
  const scrollEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsMapRef = useRef<Map<string, HTMLElement>>(new Map());

  // ========================================================================
  // Calculate Active Section
  // ========================================================================

  const calculateActiveSection = useCallback((): string | null => {
    const sections = sectionsMapRef.current;
    if (sections.size === 0) return null;

    const viewportHeight = window.innerHeight;
    const focusPoint = viewportHeight * focusPointRatio;

    let closestId: string | null = null;
    let minDistance = Infinity;

    sections.forEach((element, id) => {
      const rect = element.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(elementCenter - focusPoint);

      if (distance < minDistance) {
        minDistance = distance;
        closestId = id;
      }
    });

    return closestId;
  }, [focusPointRatio]);

  // ========================================================================
  // Calculate Skills Bar Visibility
  // ========================================================================

  const calculateSkillsBarVisibility = useCallback((): boolean => {
    // Find the first experience section
    const firstExperience = sectionsMapRef.current.get('experience-0');
    if (!firstExperience) return false;

    const rect = firstExperience.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const halfwayPoint = rect.top + rect.height / 2;

    // Show skills bar when first experience is at least halfway scrolled
    return halfwayPoint < viewportHeight / 2;
  }, []);

  // ========================================================================
  // Recalculate State (used after section registration)
  // ========================================================================

  const recalculateState = useCallback(() => {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > navbarThreshold;
    const activeSectionId = calculateActiveSection();
    const showSkillsBar = calculateSkillsBarVisibility();

    console.log('[ScrollManager] recalculateState:', {
      sectionsCount: sectionsMapRef.current.size,
      activeSectionId,
      showSkillsBar,
    });

    dispatch({
      type: 'BATCH_UPDATE',
      payload: {
        scrollY,
        isScrolled,
        activeSectionId,
        showSkillsBar,
      },
    });
  }, [navbarThreshold, calculateActiveSection, calculateSkillsBarVisibility]);

  // ========================================================================
  // Scroll Handler (RAF-throttled)
  // ========================================================================

  const handleScroll = useCallback(() => {
    // Skip updates during programmatic scrolling
    if (scrollModeRef.current === 'programmatic') return;

    // Throttle via RAF
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;

      const scrollY = window.scrollY;
      const isScrolled = scrollY > navbarThreshold;
      const activeSectionId = calculateActiveSection();
      const showSkillsBar = calculateSkillsBarVisibility();

      // Batch update to minimize re-renders
      dispatch({
        type: 'BATCH_UPDATE',
        payload: {
          scrollY,
          isScrolled,
          activeSectionId,
          showSkillsBar,
          scrollMode: 'user',
        },
      });

      scrollModeRef.current = 'user';
    });
  }, [navbarThreshold, calculateActiveSection, calculateSkillsBarVisibility]);

  // ========================================================================
  // Programmatic Scroll
  // ========================================================================

  const scrollToSection = useCallback(
    (sectionId: string, options?: ScrollToOptions) => {
      const element = sectionsMapRef.current.get(sectionId);
      if (!element) {
        console.warn(`[ScrollManager] Section "${sectionId}" not found`);
        return;
      }

      const offset = options?.offset ?? navbarOffset;
      const behavior = options?.behavior ?? 'smooth';

      // Set programmatic mode to prevent interference
      scrollModeRef.current = 'programmatic';
      dispatch({ type: 'SET_SCROLL_MODE', payload: 'programmatic' });

      // IMMEDIATELY set active section so UI updates on click, not after scroll completes
      dispatch({ type: 'SET_ACTIVE_SECTION', payload: sectionId });

      // Clear any existing timeout
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }

      // Calculate target position
      const rect = element.getBoundingClientRect();
      const targetY = Math.round(rect.top + window.scrollY + offset);
      const tolerance = 5; // pixels

      // Perform scroll
      window.scrollTo({ top: targetY, behavior });

      // Handle scroll completion - verify we've reached target
      const handleScrollEnd = () => {
        scrollModeRef.current = 'idle';
        dispatch({ type: 'SET_SCROLL_MODE', payload: 'idle' });
        dispatch({ type: 'SET_ACTIVE_SECTION', payload: sectionId });
        options?.onComplete?.();
      };

      // Verify scroll reached target before completing
      const verifyAndComplete = () => {
        const currentY = Math.round(window.scrollY);
        const reachedTarget = Math.abs(currentY - targetY) <= tolerance;

        if (reachedTarget) {
          handleScrollEnd();
        } else {
          // Not at target yet - the scrollend event fired prematurely
          // Wait a bit more and check again, or use RAF to poll
          const pollForCompletion = () => {
            if (scrollModeRef.current !== 'programmatic') return; // Already completed

            const nowY = Math.round(window.scrollY);
            if (Math.abs(nowY - targetY) <= tolerance) {
              handleScrollEnd();
            } else {
              // Keep polling
              requestAnimationFrame(pollForCompletion);
            }
          };
          requestAnimationFrame(pollForCompletion);
        }
      };

      // Use scrollend event if supported, with fallback timeout
      const scrollEndHandler = () => {
        if (scrollEndTimeoutRef.current) {
          clearTimeout(scrollEndTimeoutRef.current);
        }
        verifyAndComplete();
      };

      window.addEventListener('scrollend', scrollEndHandler, { once: true });

      // Fallback for browsers without scrollend support
      scrollEndTimeoutRef.current = setTimeout(() => {
        window.removeEventListener('scrollend', scrollEndHandler);
        verifyAndComplete();
      }, SCROLL_END_FALLBACK_MS);
    },
    [navbarOffset]
  );

  /**
   * Scroll to any element by its DOM ID.
   * Unlike scrollToSection, this doesn't require the element to be registered.
   * Use this for navbar navigation to non-experience sections.
   */
  const scrollToElement = useCallback(
    (elementId: string, options?: ScrollToOptions) => {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`[ScrollManager] Element with ID "${elementId}" not found`);
        return;
      }

      const offset = options?.offset ?? navbarOffset;
      const behavior = options?.behavior ?? 'smooth';

      // Set programmatic mode to prevent interference
      scrollModeRef.current = 'programmatic';
      dispatch({ type: 'SET_SCROLL_MODE', payload: 'programmatic' });

      // Clear any existing timeout
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }

      // Calculate target position
      const rect = element.getBoundingClientRect();
      const targetY = Math.round(rect.top + window.scrollY + offset);
      const tolerance = 5; // pixels

      // Perform scroll
      window.scrollTo({ top: targetY, behavior });

      // Handle scroll completion
      const handleScrollEnd = () => {
        scrollModeRef.current = 'idle';
        dispatch({ type: 'SET_SCROLL_MODE', payload: 'idle' });
        // Don't set active section - this is for non-tracked sections
        options?.onComplete?.();
      };

      // Verify scroll reached target before completing
      const verifyAndComplete = () => {
        const currentY = Math.round(window.scrollY);
        const reachedTarget = Math.abs(currentY - targetY) <= tolerance;

        if (reachedTarget) {
          handleScrollEnd();
        } else {
          // Not at target yet - poll until we reach it
          const pollForCompletion = () => {
            if (scrollModeRef.current !== 'programmatic') return;

            const nowY = Math.round(window.scrollY);
            if (Math.abs(nowY - targetY) <= tolerance) {
              handleScrollEnd();
            } else {
              requestAnimationFrame(pollForCompletion);
            }
          };
          requestAnimationFrame(pollForCompletion);
        }
      };

      // Use scrollend event if supported, with fallback timeout
      const scrollEndHandler = () => {
        if (scrollEndTimeoutRef.current) {
          clearTimeout(scrollEndTimeoutRef.current);
        }
        verifyAndComplete();
      };

      window.addEventListener('scrollend', scrollEndHandler, { once: true });

      // Fallback for browsers without scrollend support
      scrollEndTimeoutRef.current = setTimeout(() => {
        window.removeEventListener('scrollend', scrollEndHandler);
        verifyAndComplete();
      }, SCROLL_END_FALLBACK_MS);
    },
    [navbarOffset]
  );

  // ========================================================================
  // Section Registration
  // ========================================================================

  const registerSection = useCallback(
    (id: string, element: HTMLElement) => {
      console.log('[ScrollManager] registerSection:', id);
      sectionsMapRef.current.set(id, element);

      const sectionInfo: SectionInfo = {
        id,
        element,
        isVisible: false,
        intersectionRatio: 0,
      };

      dispatch({ type: 'REGISTER_SECTION', payload: sectionInfo });

      // Observe the element
      observerRef.current?.observe(element);

      // Recalculate state now that we have a new section
      // Use setTimeout to batch multiple registrations
      setTimeout(() => {
        recalculateState();
      }, 0);
    },
    [recalculateState]
  );

  const unregisterSection = useCallback((id: string) => {
    const element = sectionsMapRef.current.get(id);
    if (element) {
      observerRef.current?.unobserve(element);
      sectionsMapRef.current.delete(id);
    }
    dispatch({ type: 'UNREGISTER_SECTION', payload: id });
  }, []);

  // ========================================================================
  // Manual Active Section (for sidebar clicks)
  // ========================================================================

  const setActiveSection = useCallback((sectionId: string) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: sectionId });
  }, []);

  // ========================================================================
  // Synchronous Scroll Mode Getter
  // ========================================================================

  /**
   * Returns the current scroll mode from the ref (synchronous).
   * This is useful for effects that need to check the mode immediately
   * without waiting for state updates.
   */
  const getScrollModeSync = useCallback(() => {
    return scrollModeRef.current;
  }, []);

  // ========================================================================
  // Setup Effects
  // ========================================================================

  // Setup IntersectionObserver
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section-id');
          if (id) {
            dispatch({
              type: 'UPDATE_SECTION_VISIBILITY',
              payload: {
                id,
                isVisible: entry.isIntersecting,
                intersectionRatio: entry.intersectionRatio,
              },
            });
          }
        });
      },
      {
        // Observe when 10% of the element is visible
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Setup scroll listener
  useEffect(() => {
    // Reset RAF ref on mount (fixes HMR issues)
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // ========================================================================
  // Context Value
  // ========================================================================

  const contextValue = useMemo<ScrollManagerContextValue>(
    () => ({
      ...state,
      scrollToSection,
      scrollToElement,
      registerSection,
      unregisterSection,
      setActiveSection,
      getScrollModeSync,
    }),
    [state, scrollToSection, scrollToElement, registerSection, unregisterSection, setActiveSection, getScrollModeSync]
  );

  return (
    <ScrollManagerContext.Provider value={contextValue}>
      {children}
    </ScrollManagerContext.Provider>
  );
}
