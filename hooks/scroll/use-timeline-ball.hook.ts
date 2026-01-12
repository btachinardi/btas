/**
 * useTimelineBall Hook
 *
 * Provides smooth, physics-based animation for a timeline indicator ball.
 * Uses a lerp (linear interpolation) approach instead of duration-based animations
 * to prevent flickering when the target changes rapidly.
 *
 * The ball continuously moves toward its target position using RAF,
 * so new targets don't cancel/restart animations - they just update the destination.
 */

import { useEffect, useRef, useCallback, useState } from 'react';

export interface TimelineBallOptions {
  /**
   * How quickly the ball follows the target (0-1).
   * Higher = faster, snappier. Lower = smoother, more inertia.
   * @default 0.12
   */
  smoothFactor?: number;

  /**
   * Minimum velocity threshold to keep animating.
   * Below this, the animation stops to save resources.
   * @default 0.5
   */
  velocityThreshold?: number;

  /**
   * Whether to use spring physics instead of simple lerp.
   * Springs have overshoot and oscillation for a bouncy feel.
   * @default false
   */
  useSpring?: boolean;

  /**
   * Spring stiffness (only used if useSpring is true).
   * Higher = faster oscillation.
   * @default 180
   */
  stiffness?: number;

  /**
   * Spring damping (only used if useSpring is true).
   * Higher = less oscillation/overshoot.
   * @default 20
   */
  damping?: number;
}

export interface TimelineBallState {
  /** Current Y position of the ball (pixels) */
  y: number;
  /** Whether the ball is currently animating */
  isAnimating: boolean;
}

export interface UseTimelineBallReturn {
  /** Current ball state (position and animation status) */
  state: TimelineBallState;
  /** Set the target Y position the ball should move toward */
  setTarget: (y: number) => void;
  /** Immediately snap to a position (no animation) */
  snapTo: (y: number) => void;
}

/**
 * Hook for smooth, procedural timeline ball animation.
 *
 * @example
 * ```tsx
 * function Timeline({ activeIndex }) {
 *   const { state, setTarget } = useTimelineBall({ smoothFactor: 0.1 });
 *
 *   // Update target when active item changes
 *   useEffect(() => {
 *     const activeElement = containerRef.current?.querySelector(`[data-index="${activeIndex}"]`);
 *     if (activeElement) {
 *       const rect = activeElement.getBoundingClientRect();
 *       setTarget(rect.top + rect.height / 2);
 *     }
 *   }, [activeIndex, setTarget]);
 *
 *   return (
 *     <div
 *       className="timeline-ball"
 *       style={{ transform: `translateY(${state.y}px)` }}
 *     />
 *   );
 * }
 * ```
 */
export function useTimelineBall(
  options: TimelineBallOptions = {}
): UseTimelineBallReturn {
  const {
    smoothFactor = 0.12,
    velocityThreshold = 0.5,
    useSpring = false,
    stiffness = 180,
    damping = 20,
  } = options;

  // Current position and velocity (refs for RAF access without re-renders)
  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const targetRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  // State for React components to consume
  const [state, setState] = useState<TimelineBallState>({
    y: 0,
    isAnimating: false,
  });

  /**
   * Animation loop using requestAnimationFrame.
   * Uses either simple lerp or spring physics based on options.
   */
  const animate = useCallback(
    (currentTime: number) => {
      // Calculate delta time for frame-rate independent animation
      const deltaTime = lastTimeRef.current
        ? Math.min((currentTime - lastTimeRef.current) / 1000, 0.1) // Cap at 100ms to handle tab switching
        : 1 / 60;
      lastTimeRef.current = currentTime;

      const target = targetRef.current;
      const position = positionRef.current;

      let newPosition: number;
      let newVelocity: number;

      if (useSpring) {
        // Spring physics: F = -k * x - c * v
        // Where k is stiffness, c is damping, x is displacement, v is velocity
        const displacement = position - target;
        const springForce = -stiffness * displacement;
        const dampingForce = -damping * velocityRef.current;
        const acceleration = springForce + dampingForce;

        newVelocity = velocityRef.current + acceleration * deltaTime;
        newPosition = position + newVelocity * deltaTime;
      } else {
        // Simple lerp: position += (target - position) * factor
        // Adjust factor based on frame time for consistent speed
        const adjustedFactor = 1 - Math.pow(1 - smoothFactor, deltaTime * 60);
        newPosition = position + (target - position) * adjustedFactor;
        newVelocity = (newPosition - position) / deltaTime;
      }

      // Update refs
      positionRef.current = newPosition;
      velocityRef.current = newVelocity;

      // Check if we should stop animating
      const distanceToTarget = Math.abs(newPosition - target);
      const isMoving = Math.abs(newVelocity) > velocityThreshold || distanceToTarget > 0.5;

      // Update state for React
      setState({
        y: newPosition,
        isAnimating: isMoving,
      });

      // Continue or stop animation loop
      if (isMoving) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        // Snap to exact target when close enough
        positionRef.current = target;
        velocityRef.current = 0;
        setState({
          y: target,
          isAnimating: false,
        });
        rafIdRef.current = null;
        lastTimeRef.current = null;
      }
    },
    [smoothFactor, velocityThreshold, useSpring, stiffness, damping]
  );

  /**
   * Start the animation loop if not already running.
   */
  const startAnimation = useCallback(() => {
    if (rafIdRef.current === null) {
      lastTimeRef.current = null;
      rafIdRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  /**
   * Set the target position the ball should move toward.
   * If the ball is not animating, starts the animation loop.
   */
  const setTarget = useCallback(
    (y: number) => {
      // On first call, snap to position instead of animating from 0
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        positionRef.current = y;
        targetRef.current = y;
        setState({ y, isAnimating: false });
        return;
      }

      targetRef.current = y;
      startAnimation();
    },
    [startAnimation]
  );

  /**
   * Immediately snap to a position without animation.
   */
  const snapTo = useCallback((y: number) => {
    // Cancel any running animation
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    positionRef.current = y;
    velocityRef.current = 0;
    targetRef.current = y;
    lastTimeRef.current = null;
    isInitializedRef.current = true;

    setState({
      y,
      isAnimating: false,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return {
    state,
    setTarget,
    snapTo,
  };
}
