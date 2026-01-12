/**
 * Scroll Manager Context
 *
 * Creates the React context for centralized scroll state management.
 */

import { createContext, useContext } from 'react';
import type {
  ScrollManagerContextValue,
  ScrollManagerState,
  ScrollManagerAction,
} from './scroll-manager.types';

// ============================================================================
// Initial State
// ============================================================================

export const initialScrollManagerState: ScrollManagerState = {
  scrollMode: 'idle',
  activeSectionId: null,
  sections: new Map(),
  isScrolled: false,
  scrollY: 0,
  showSkillsBar: false,
};

// ============================================================================
// Context
// ============================================================================

/**
 * Context for scroll manager state and actions.
 * Must be used within ScrollManagerProvider.
 */
export const ScrollManagerContext =
  createContext<ScrollManagerContextValue | null>(null);

ScrollManagerContext.displayName = 'ScrollManagerContext';

// ============================================================================
// Hook
// ============================================================================

/**
 * Access the scroll manager context.
 * Throws if used outside of ScrollManagerProvider.
 */
export function useScrollManagerContext(): ScrollManagerContextValue {
  const context = useContext(ScrollManagerContext);

  if (context === null) {
    throw new Error(
      'useScrollManagerContext must be used within a ScrollManagerProvider'
    );
  }

  return context;
}

// ============================================================================
// Reducer
// ============================================================================

export function scrollManagerReducer(
  state: ScrollManagerState,
  action: ScrollManagerAction
): ScrollManagerState {
  switch (action.type) {
    case 'SET_SCROLL_MODE':
      return { ...state, scrollMode: action.payload };

    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSectionId: action.payload };

    case 'SET_IS_SCROLLED':
      return { ...state, isScrolled: action.payload };

    case 'SET_SCROLL_Y':
      return { ...state, scrollY: action.payload };

    case 'SET_SHOW_SKILLS_BAR':
      return { ...state, showSkillsBar: action.payload };

    case 'REGISTER_SECTION': {
      const newSections = new Map(state.sections);
      newSections.set(action.payload.id, action.payload);
      return { ...state, sections: newSections };
    }

    case 'UNREGISTER_SECTION': {
      const newSections = new Map(state.sections);
      newSections.delete(action.payload);
      return { ...state, sections: newSections };
    }

    case 'UPDATE_SECTION_VISIBILITY': {
      const section = state.sections.get(action.payload.id);
      if (!section) return state;

      const newSections = new Map(state.sections);
      newSections.set(action.payload.id, {
        ...section,
        isVisible: action.payload.isVisible,
        intersectionRatio: action.payload.intersectionRatio,
      });
      return { ...state, sections: newSections };
    }

    case 'BATCH_UPDATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
