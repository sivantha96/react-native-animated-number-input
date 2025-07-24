import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { MaskedTextInput, MaskedTextInputProps } from 'react-native-mask-text';

import { useCharacterWidthRatioAuto } from '../hooks/useCharacterWidthRatioAuto';
import { usePrevious } from '../hooks/usePrevious';
import { CharData, getDigits } from '../utils/numberUtils';
import AnimatedText, { EntryOrExitLayoutType } from './AnimatedText';

export type NumberFormatOptions = {
  prefix?: string;
  decimalSeparator?: string;
  groupSeparator?: string;
  precision?: number;
  groupSize?: number;
  secondaryGroupSize?: number;
  fractionGroupSeparator?: string;
  fractionGroupSize?: number;
  suffix?: string;
};

export interface AnimatedNumberInputProps
  extends Omit<MaskedTextInputProps, 'type'> {
  textStyle?: TextStyle;
  placeholderStyles?: TextStyle;
  containerStyle?: ViewStyle;
  animationDuration?: number;
  maxFontSize?: number;
  exiting?: EntryOrExitLayoutType;
  entering?: EntryOrExitLayoutType;
  allowLeadingZeros?: boolean;
  options?: NumberFormatOptions;
}

const AnimatedNumberInput: React.FC<AnimatedNumberInputProps> = ({
  textStyle = {},
  containerStyle = {},
  animationDuration = 100,
  maxFontSize = 64,
  exiting,
  entering,
  placeholderStyles = {},
  options,
  onChangeText,
  placeholder,
  ...props
}) => {
  const inputRef = useRef<TextInput>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [maskedValue, setMaskedValue] = useState('');

  const handleContainerPress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const decimalSeparator = useMemo(
    () => options?.decimalSeparator || '.',
    [options?.decimalSeparator],
  );
  const thousandSeparator = useMemo(
    () => options?.groupSeparator || ',',
    [options?.groupSeparator],
  );

  const digits = useMemo(
    () => getDigits(maskedValue, decimalSeparator, thousandSeparator),
    [maskedValue, decimalSeparator, thousandSeparator],
  );

  const prevDigits = usePrevious(digits);
  const [renderedDigits, setRenderedDigits] = useState<CharData[]>(digits);

  useEffect(() => {
    const next = digits.map((d) => d.key);
    const prev = prevDigits?.map((d) => d.key) ?? [];
    const exitingD = prev.filter((k) => !next.includes(k));
    const updated = digits.map((d) => ({ ...d, isExiting: false }));
    const exitingDigits =
      prevDigits
        ?.filter((d) => exitingD.includes(d.key))
        ?.map((d) => ({ ...d, isExiting: true })) ?? [];
    setRenderedDigits([...updated, ...exitingDigits]);
  }, [digits, prevDigits]);
  const ratio = useCharacterWidthRatioAuto();
  const charWidthRatio = useMemo(
    () => (typeof ratio === 'number' ? ratio : 0.65),
    [ratio],
  );

  const { autoFontSize, digitWidth } = useMemo(() => {
    let totalCharUnits = digits.reduce(
      (acc, digit) =>
        acc +
        (digit.char === decimalSeparator || digit.char === thousandSeparator
          ? 0.4
          : 1),
      0,
    );

    if (options?.prefix || options?.suffix) {
      totalCharUnits +=
        (options?.prefix?.length || 0) + (options?.suffix?.length || 0);
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
    charWidthRatio,
    containerWidth,
    decimalSeparator,
    digits,
    maxFontSize,
    options?.prefix,
    options?.suffix,
    thousandSeparator,
  ]);

  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={handleContainerPress}
      onLayout={handleLayout}
      accessibilityRole="button"
      accessibilityLabel="Edit number input"
      accessible>
      <MaskedTextInput
        {...props}
        ref={inputRef}
        type="currency"
        options={options}
        onChangeText={(text, rawText) => {
          setMaskedValue(text);
          onChangeText?.(text, rawText);
        }}
        style={[styles.hiddenInput, textStyle]}
        keyboardType="numeric"
        accessibilityLabel="Number input field"
      />
      <View style={styles.visualContainer} pointerEvents="none">
        {renderedDigits.length > 0
          ? renderedDigits.map((digit) => {
              const charWidth = digitWidth
                ? digit.isSeparator
                  ? digitWidth * 0.4
                  : digitWidth
                : undefined;
              return (
                <AnimatedText
                  key={digit.key}
                  size={charWidth}
                  value={digit.char}
                  fontSize={autoFontSize}
                  animationDuration={animationDuration}
                  textStyle={[
                    textStyle,
                    styles.digit,
                    digit.isSeparator && styles.separator,
                  ]}
                  entering={entering}
                  exiting={exiting}
                />
              );
            })
          : placeholder && (
              <Text
                style={[
                  styles.placeholder,
                  { fontSize: autoFontSize },
                  placeholderStyles,
                ]}>
                {placeholder}
              </Text>
            )}
      </View>
      {typeof ratio !== 'number' ? ratio : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    minHeight: 20,
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
  visualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: 'flex-end',
  },
  digit: {
    textAlign: 'center',
  },
  separator: {
    textAlign: 'center',
  },
  placeholder: {
    textAlign: 'right',
    fontWeight: '800',
  },
});

export default React.memo(AnimatedNumberInput);
