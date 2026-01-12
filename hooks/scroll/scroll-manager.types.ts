/**
 * Scroll Manager Types
 *
 * Centralized type definitions for the scroll management system.
 * Replaces multiple competing scroll listeners with a single source of truth.
 */

import type { RefObject } from 'react';

// ============================================================================
// Scroll Mode
// ============================================================================

/**
 * Tracks the current scroll mode to prevent conflicts between
 * user-initiated and programmatic scrolling.
 *
 * State machine: idle -> programmatic -> user -> idle
 */
export type ScrollMode = 'idle' | 'user' | 'programmatic';

// ============================================================================
// Section Registration
// ============================================================================

/**
 * Information about a registered scrollable section.
 */
export interface SectionInfo {
  /** Unique identifier for the section (e.g., 'experience-0') */
  id: string;
  /** Reference to the section's DOM element */
  element: HTMLElement;
  /** Whether the section is currently visible in the viewport */
  isVisible: boolean;
  /** How much of the section is visible (0-1) */
  intersectionRatio: number;
}

// ============================================================================
// Scroll Manager State
// ============================================================================

/**
 * Central state for the scroll management system.
 */
export interface ScrollManagerState {
  /** Current scroll mode */
  scrollMode: ScrollMode;

  /** ID of the currently active section (closest to focus point) */
  activeSectionId: string | null;

  /** Map of registered sections by ID */
  sections: Map<string, SectionInfo>;

  /** Whether page has scrolled past navbar threshold (50px) */
  isScrolled: boolean;

  /** Current scroll Y position (throttled) */
  scrollY: number;

  /** Whether the skills bar should be visible */
  showSkillsBar: boolean;
}

// ============================================================================
// Scroll Manager Actions
// ============================================================================

/**
 * Options for programmatic scrolling.
 */
export interface ScrollToOptions {
  /** Offset from target position (for navbar). Default: -100 */
  offset?: number;
  /** Scroll behavior. Default: 'smooth' */
  behavior?: ScrollBehavior;
  /** Callback when scroll completes */
  onComplete?: () => void;
}

/**
 * Actions available through the scroll manager.
 */
export interface ScrollManagerActions {
  /** Scroll to a registered section by ID */
  scrollToSection: (sectionId: string, options?: ScrollToOptions) => void;

  /**
   * Scroll to any element by its DOM ID.
   * Unlike scrollToSection, this doesn't require the element to be registered.
   * Use this for navbar navigation to non-experience sections.
   */
  scrollToElement: (elementId: string, options?: ScrollToOptions) => void;

  /** Register a section element for tracking */
  registerSection: (id: string, element: HTMLElement) => void;

  /** Unregister a section element */
  unregisterSection: (id: string) => void;

  /** Manually set the active section (e.g., for sidebar clicks) */
  setActiveSection: (sectionId: string) => void;

  /**
   * Get the current scroll mode synchronously from the ref.
   * Use this instead of scrollMode state when you need immediate/sync access
   * (e.g., in effects that shouldn't run during programmatic scroll).
   */
  getScrollModeSync: () => ScrollMode;
}

// ============================================================================
// Context Value
// ============================================================================

/**
 * Combined state and actions provided by ScrollManagerContext.
 */
export interface ScrollManagerContextValue
  extends ScrollManagerState,
    ScrollManagerActions {}

// ============================================================================
// Provider Props
// ============================================================================

/**
 * Configuration options for ScrollManagerProvider.
 */
export interface ScrollManagerProviderProps {
  children: React.ReactNode;
  /** Navbar scroll threshold in pixels. Default: 50 */
  navbarThreshold?: number;
  /** Focus point as fraction of viewport height. Default: 1/3 */
  focusPointRatio?: number;
  /** Offset for navbar when scrolling to sections. Default: -100 */
  navbarOffset?: number;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * Return type for useNavbarScroll hook.
 */
export interface UseNavbarScrollReturn {
  /** Whether page has scrolled past threshold */
  isScrolled: boolean;
}

/**
 * Return type for useActiveSection hook.
 */
export interface UseActiveSectionReturn {
  /** ID of the currently active section */
  activeSectionId: string | null;
  /** Check if a specific section is active */
  isActive: (sectionId: string) => boolean;
}

/**
 * Return type for useScrollTo hook.
 */
export interface UseScrollToReturn {
  /** Scroll to a section by ID */
  scrollToSection: (sectionId: string, options?: ScrollToOptions) => void;
  /** Current scroll mode */
  scrollMode: ScrollMode;
  /** Whether a programmatic scroll is in progress */
  isScrolling: boolean;
}

/**
 * Options for useSidebarSync hook.
 */
export interface UseSidebarSyncOptions {
  /** CSS selector for active item within sidebar */
  activeItemSelector: string;
  /** Position active item at this fraction of sidebar height. Default: 1/3 */
  targetPositionRatio?: number;
  /** Minimum scroll distance to trigger update. Default: 5 */
  jitterThreshold?: number;
}

/**
 * Return type for useSkillsBarVisibility hook.
 */
export interface UseSkillsBarVisibilityReturn {
  /** Whether the skills bar should be visible */
  showSkillsBar: boolean;
}

/**
 * Return type for useSectionRegistration hook.
 */
export interface UseSectionRegistrationReturn {
  /** Ref to attach to the section element */
  ref: RefObject<HTMLElement | null>;
  /** Whether this section is currently active */
  isActive: boolean;
}

// ============================================================================
// Reducer Types
// ============================================================================

export type ScrollManagerAction =
  | { type: 'SET_SCROLL_MODE'; payload: ScrollMode }
  | { type: 'SET_ACTIVE_SECTION'; payload: string | null }
  | { type: 'SET_IS_SCROLLED'; payload: boolean }
  | { type: 'SET_SCROLL_Y'; payload: number }
  | { type: 'SET_SHOW_SKILLS_BAR'; payload: boolean }
  | { type: 'REGISTER_SECTION'; payload: SectionInfo }
  | { type: 'UNREGISTER_SECTION'; payload: string }
  | {
      type: 'UPDATE_SECTION_VISIBILITY';
      payload: { id: string; isVisible: boolean; intersectionRatio: number };
    }
  | { type: 'BATCH_UPDATE'; payload: Partial<ScrollManagerState> };
