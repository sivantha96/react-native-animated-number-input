import { useEffect, useMemo, useRef } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Animated, {
  LayoutAnimationFunction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  AccessibilityConfig,
  AnimationConfigs,
  LayoutAnimations,
  SeparatorAnimationType,
  separatorMap,
  SeparatorType,
} from '../types';
import { estimateSpringDuration } from '../utils/numberUtils';

interface AnimatedCharProps {
  char: string;
  textStyle?: StyleProp<TextStyle>;
  separatorAnimation: SeparatorAnimationType;
  animationConfig: AnimationConfigs;
  separator: SeparatorType;
  layoutAnimations: LayoutAnimations;
  fontSize: number;
  size: number;
  accessibilityConfig?: AccessibilityConfig;
}

export const AnimatedChar = ({
  char,
  textStyle,
  animationConfig,
  separatorAnimation,
  separator,
  layoutAnimations,
  fontSize,
  size,
  accessibilityConfig,
}: AnimatedCharProps) => {
  const animatedWidth = useSharedValue(size);
  const animatedFontSize = useSharedValue(fontSize);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      animatedWidth.value = withTiming(size, { duration: 200 });
      animatedFontSize.value = withTiming(fontSize, { duration: 200 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize, size]);

  const animatedTextStyle = useAnimatedStyle(() => ({
    fontSize: animatedFontSize.value,
    lineHeight: animatedFontSize.value * 1.2,
  }));

  const customLayoutAnimation = useMemo(() => {
    let springAnimationDuration = null;

    if (animationConfig.type === 'spring') {
      springAnimationDuration = estimateSpringDuration(
        animationConfig.mass,
        animationConfig.stiffness,
        animationConfig.damping,
      );
    }

    const CustomLayout: LayoutAnimationFunction = (values) => {
      'worklet';
      const { type, ...animationConfigs } = animationConfig;
      const isSpring = animationConfig.type === 'spring';
      const isTiming = animationConfig.type === 'timing';

      const halfDuration =
        isTiming && typeof animationConfig.duration === 'number'
          ? animationConfig.duration / 2
          : springAnimationDuration
            ? springAnimationDuration / 2
            : 200;

      const animFunction = isSpring ? withSpring : withTiming;

      return {
        initialValues: {
          opacity: 1,
          transform: [{ translateY: 0 }],
          originX: values.currentOriginX,
        },
        animations: {
          originX: animFunction(values.targetOriginX, animationConfigs),
          transform: [
            {
              translateY: withSequence(
                withTiming(15, {
                  duration: halfDuration,
                  ...(isTiming &&
                    typeof animationConfig.easing === 'function' && {
                      easing: animationConfig.easing,
                    }),
                }),
                animFunction(
                  0,
                  isSpring
                    ? animationConfigs
                    : { ...animationConfigs, duration: halfDuration },
                ),
              ),
            },
          ],
        },
      };
    };

    return CustomLayout;
  }, [animationConfig]);

  // Enhanced accessibility support
  const accessibilityLabel = useMemo(() => {
    if (accessibilityConfig?.customAccessibilityLabel) {
      return accessibilityConfig.customAccessibilityLabel;
    }

    if (char === separatorMap.comma) return 'comma';
    if (char === separatorMap.dot) return 'decimal point';
    if (char === ' ') return 'space';
    return char;
  }, [char, accessibilityConfig?.customAccessibilityLabel, separator]);

  return (
    <Animated.Text
      entering={layoutAnimations.entering}
      exiting={layoutAnimations.exiting}
      layout={
        char === separatorMap[separator] && separatorAnimation === 'swap'
          ? customLayoutAnimation
          : layoutAnimations.layout
      }
      style={[textStyle, animatedTextStyle]}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityConfig?.customAccessibilityHint}
      accessibilityRole="text"
      importantForAccessibility="yes">
      {char}
    </Animated.Text>
  );
};
