/**
 * Bundle optimization utilities for tree-shaking and lazy loading
 */

// Lazy load animation configurations to reduce initial bundle size
export const createLazyAnimationConfig = () => {
  return {
    // Only import what's needed for timing animations
    timing: () =>
      import('react-native-reanimated').then((module) => ({
        withTiming: module.withTiming,
        Easing: module.Easing,
      })),

    // Only import what's needed for spring animations
    spring: () =>
      import('react-native-reanimated').then((module) => ({
        withSpring: module.withSpring,
      })),

    // Only import layout animations when needed
    layout: () =>
      import('react-native-reanimated').then((module) => ({
        FadeInDown: module.FadeInDown,
        FadeOutDown: module.FadeOutDown,
        LinearTransition: module.LinearTransition,
      })),
  };
};

// Tree-shakeable animation presets
export const ANIMATION_PRESETS = {
  fast: {
    type: 'timing' as const,
    duration: 150,
  },
  smooth: {
    type: 'spring' as const,
    damping: 15,
    stiffness: 100,
  },
  bouncy: {
    type: 'spring' as const,
    damping: 10,
    stiffness: 150,
  },
  slow: {
    type: 'timing' as const,
    duration: 500,
  },
} as const;

// Performance optimization flags
export const PERFORMANCE_FLAGS = {
  ENABLE_LAYOUT_ANIMATIONS: true,
  ENABLE_CHARACTER_REUSE: true,
  ENABLE_FONT_SIZE_OPTIMIZATION: true,
  ENABLE_ACCESSIBILITY_FEATURES: true,
  ENABLE_PERFORMANCE_MONITORING: __DEV__,
} as const;

// Memory optimization utilities
export const createMemoryOptimizedConfig = () => ({
  // Limit the number of cached character width ratios
  maxCacheSize: 10,

  // Clear cache after this many renders to prevent memory leaks
  cacheEvictionThreshold: 100,

  // Enable garbage collection hints
  enableGCHints: __DEV__,
});
