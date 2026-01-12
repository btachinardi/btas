/**
 * useSectionRegistration Hook
 *
 * Registers a section element with the scroll manager for tracking.
 * Auto-registers on mount, auto-unregisters on unmount.
 */

import { useEffect, useRef, useCallback, type RefObject } from 'react';
import { useScrollManagerContext } from './scroll-manager.context';
import type { UseSectionRegistrationReturn } from './scroll-manager.types';

/**
 * Hook to register a section for scroll tracking.
 *
 * @param sectionId - Unique identifier for this section (e.g., 'experience-0')
 * @returns Object with ref and isActive state
 *
 * @example
 * ```tsx
 * function ExperienceCard({ index }: { index: number }) {
 *   const { ref, isActive } = useSectionRegistration(`experience-${index}`);
 *
 *   return (
 *     <div
 *       ref={ref}
 *       id={`experience-${index}`}
 *       data-section-id={`experience-${index}`}
 *       className={isActive ? 'opacity-100' : 'opacity-30'}
 *     >
 *       ...
 *     </div>
 *   );
 * }
 * ```
 */
export function useSectionRegistration(
  sectionId: string
): UseSectionRegistrationReturn {
  const {
    registerSection,
    unregisterSection,
    activeSectionId,
  } = useScrollManagerContext();

  const elementRef = useRef<HTMLElement | null>(null);

  // Create a callback ref that handles registration
  const setRef = useCallback(
    (element: HTMLElement | null) => {
      // Unregister previous element if exists
      if (elementRef.current && elementRef.current !== element) {
        unregisterSection(sectionId);
      }

      elementRef.current = element;

      // Register new element
      if (element) {
        // Ensure the element has the data attribute for IntersectionObserver
        element.setAttribute('data-section-id', sectionId);
        registerSection(sectionId, element);
      }
    },
    [sectionId, registerSection, unregisterSection]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unregisterSection(sectionId);
    };
  }, [sectionId, unregisterSection]);

  // Create a ref object that uses our callback
  const ref: RefObject<HTMLElement | null> = {
    get current() {
      return elementRef.current;
    },
    set current(value: HTMLElement | null) {
      setRef(value);
    },
  };

  return {
    ref,
    isActive: activeSectionId === sectionId,
  };
}
