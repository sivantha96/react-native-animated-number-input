import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';

import { useCharWidthContext } from '../context/CharWidthContext';
import { usePerformanceMonitoring } from '../hooks/usePerformanceMonitoring';
import {
  AccessibilityConfig,
  AnimationConfigs,
  LayoutAnimations,
  SeparatorAnimationType,
  SeparatorType,
  TimingOptions,
} from '../types';
import {
  createLayoutAnimation,
  formatNumber,
  getDigits,
  updateCharList,
} from '../utils/numberUtils';
import { AnimatedChar } from './AnimatedChar';
import { AnimatedNumberErrorBoundary } from './AnimatedNumberErrorBoundary';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type AnimatedNumberProps = {
  number: string;
  separator?: SeparatorType;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  separatorAnimation?: SeparatorAnimationType;
  animationConfig?: AnimationConfigs;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  maxFontSize?: number;
  onChangeText?: (value: string) => void;
  precision?: number;
  decimalSeparator?: string;
  thousandSeparator?: string;
  accessibilityConfig?: AccessibilityConfig;
  enablePerformanceMonitoring?: boolean;
  onError?: (error: Error) => void;
  fallbackComponent?: React.ReactNode;
};

const defaultAnimationConfigs = {
  type: 'timing',
  duration: 300,
} as TimingOptions;

export const AnimatedNumber = ({
  number,
  separator = 'comma',
  textStyle,
  containerStyle,
  separatorAnimation = 'swap',
  animationConfig = defaultAnimationConfigs,
  prefix,
  suffix,
  placeholder,
  maxFontSize = 64,
  onChangeText,
  precision = 2,
  decimalSeparator = '.',
  thousandSeparator = ',',
  accessibilityConfig,
  enablePerformanceMonitoring = __DEV__,
  onError,
  fallbackComponent,
  ...textInputProps
}: AnimatedNumberProps) => {
  const prevList = useRef<any>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const inputRef = useRef<TextInput>(null);
  const { getCharWidthRatio } = useCharWidthContext();
  const { startAnimation, endAnimation, getMetrics } = usePerformanceMonitoring(
    {
      enableLogging: enablePerformanceMonitoring,
    },
  );

  const handleChangeText = useCallback(
    (text: string) => {
      if (onChangeText) {
        const formattedText = formatNumber(
          text,
          decimalSeparator,
          thousandSeparator,
          precision,
        );
        onChangeText(formattedText);
      }
    },
    [decimalSeparator, onChangeText, precision, thousandSeparator],
  );

  const handleContainerPress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const units = useMemo(() => {
    const newList = updateCharList(number, prevList.current, separator);
    prevList.current = newList;
    return newList;
  }, [number, separator]);

  const layoutAnimations = useMemo((): LayoutAnimations => {
    return {
      entering: createLayoutAnimation(FadeInDown, animationConfig),
      exiting: createLayoutAnimation(FadeOutDown, animationConfig),
      layout: createLayoutAnimation(LinearTransition, animationConfig),
    };
  }, [animationConfig]);

  const digits = useMemo(
    () => getDigits(number, decimalSeparator, thousandSeparator),
    [decimalSeparator, number, thousandSeparator],
  );

  const charWidthRatio = useMemo(() => {
    const ratio = getCharWidthRatio();
    return typeof ratio === 'number' ? ratio : 0.65;
  }, [getCharWidthRatio]);

  const { autoFontSize, digitWidth } = useMemo(() => {
    let totalCharUnits = digits.reduce(
      (acc, digit) =>
        acc +
        (digit.char === decimalSeparator || digit.char === thousandSeparator
          ? 0.4
          : 1),
      0,
    );

    if (prefix || suffix) {
      totalCharUnits += (prefix?.length ?? 0) + (suffix?.length ?? 0);
    }

    const _autoFontSize =
      containerWidth > 0 && totalCharUnits > 0
        ? Math.min(
            containerWidth / (totalCharUnits * charWidthRatio),
            maxFontSize,
          )
        : maxFontSize;
    const naturalFontSize = maxFontSize;
    const baseCharWidth = naturalFontSize * charWidthRatio;
    const naturalTotalWidth = totalCharUnits * baseCharWidth;
    const shouldScaleDown = naturalTotalWidth > containerWidth;
    const effectiveFontSize = shouldScaleDown
      ? containerWidth / totalCharUnits / charWidthRatio
      : naturalFontSize;
    const calculatedDigitWidth =
      baseCharWidth *
      (shouldScaleDown ? effectiveFontSize / naturalFontSize : 1);
    return { autoFontSize: _autoFontSize, digitWidth: calculatedDigitWidth };
  }, [
    digits,
    prefix,
    suffix,
    containerWidth,
    charWidthRatio,
    maxFontSize,
    decimalSeparator,
    thousandSeparator,
  ]);

  // Enhanced accessibility for the main component
  const mainAccessibilityLabel = useMemo(() => {
    if (accessibilityConfig?.customAccessibilityLabel) {
      return accessibilityConfig.customAccessibilityLabel;
    }
    return `Number input with value ${number || placeholder || 'empty'}`;
  }, [accessibilityConfig?.customAccessibilityLabel, number, placeholder]);

  const renderContent = () => (
    <AnimatedPressable
      style={[styles.container, containerStyle]}
      layout={LinearTransition}
      onLayout={handleLayout}
      onPress={handleContainerPress}
      accessibilityLabel={mainAccessibilityLabel}
      accessibilityHint={
        accessibilityConfig?.customAccessibilityHint || 'Tap to edit number'
      }
      accessibilityRole="button">
      <TextInput
        ref={inputRef}
        style={[styles.hiddenInput, textStyle]}
        value={number}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        accessibilityLabel="Number input field"
        accessible
        {...textInputProps}
      />

      {prefix
        ?.split('')
        .map((e, idx) => (
          <AnimatedChar
            char={e}
            key={`prefix-${e}-${idx}`}
            textStyle={textStyle}
            animationConfig={animationConfig}
            separator={separator}
            separatorAnimation={separatorAnimation}
            layoutAnimations={layoutAnimations}
            fontSize={autoFontSize}
            size={digitWidth}
            accessibilityConfig={accessibilityConfig}
          />
        ))}

      {placeholder && units.length === 0
        ? placeholder
            ?.split('')
            .map((e, idx) => (
              <AnimatedChar
                char={e}
                key={`placeholder-${e}-${idx}`}
                textStyle={textStyle}
                animationConfig={animationConfig}
                separator={separator}
                separatorAnimation={separatorAnimation}
                layoutAnimations={layoutAnimations}
                fontSize={autoFontSize}
                size={digitWidth}
                accessibilityConfig={accessibilityConfig}
              />
            ))
        : null}

      {units.map((item) => {
        return (
          <AnimatedChar
            char={item.char}
            key={item.id}
            textStyle={textStyle}
            animationConfig={animationConfig}
            separator={separator}
            separatorAnimation={separatorAnimation}
            layoutAnimations={layoutAnimations}
            fontSize={autoFontSize}
            size={digitWidth}
            accessibilityConfig={accessibilityConfig}
          />
        );
      })}

      {suffix
        ?.split('')
        .map((e, idx) => (
          <AnimatedChar
            char={e}
            key={`suffix-${e}-${idx}`}
            textStyle={textStyle}
            animationConfig={animationConfig}
            separator={separator}
            separatorAnimation={separatorAnimation}
            layoutAnimations={layoutAnimations}
            fontSize={autoFontSize}
            size={digitWidth}
            accessibilityConfig={accessibilityConfig}
          />
        ))}
    </AnimatedPressable>
  );

  return (
    <AnimatedNumberErrorBoundary fallback={fallbackComponent} onError={onError}>
      {renderContent()}
    </AnimatedNumberErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    zIndex: 1,
  },
});

export default memo(AnimatedNumber);
