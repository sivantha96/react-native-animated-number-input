import { EasingFunction } from 'react-native-reanimated';

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

export const separatorMap = {
  comma: ',',
  dot: '.',
};
