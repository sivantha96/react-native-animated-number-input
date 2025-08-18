import {
  EasingFunction,
  LayoutAnimationFunction,
} from 'react-native-reanimated';

export interface TimingOptions {
  type: 'timing';
  duration?: number;
  easing?: EasingFunction;
}

export interface SpringOptions {
  type: 'spring';
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamp?: boolean;
}

export type SeparatorType = 'comma' | 'dot';
export type SeparatorAnimationType = 'swap' | 'translate';
export type AnimationConfigs = TimingOptions | SpringOptions;

export interface CharWithId {
  id: string;
  char: string;
}

export interface LayoutAnimations {
  entering: any;
  exiting: any;
  layout: LayoutAnimationFunction;
}

export interface PerformanceMetrics {
  animationStartTime?: number;
  animationEndTime?: number;
  renderCount: number;
  lastRenderTime: number;
}

export interface AccessibilityConfig {
  announceChanges?: boolean;
  customAccessibilityLabel?: string;
  customAccessibilityHint?: string;
  reduceMotion?: boolean;
}

export const separatorMap = {
  comma: ',',
  dot: '.',
} as const;
