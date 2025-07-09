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
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useCharacterWidthRatioAuto } from '../hooks/useCharacterWidthRatioAuto';
import { usePrevious } from '../hooks/usePrevious';
import { CharData, formatNumber, getDigits } from '../utils/numberUtils';
import AnimatedText, { EntryOrExitLayoutType } from './AnimatedText';

export interface AnimatedNumberInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText?: (value: string) => void;
  textStyle?: TextStyle;
  placeholderStyles?: TextStyle;
  containerStyle?: ViewStyle;
  decimalSeparator?: string;
  thousandSeparator?: string;
  prefix?: string;
  suffix?: string;
  precision?: number;
  animationDuration?: number;
  maxFontSize?: number;
  exiting?: EntryOrExitLayoutType;
  entering?: EntryOrExitLayoutType;
  allowLeadingZeros?: boolean;
}

const AnimatedNumberInput: React.FC<AnimatedNumberInputProps> = ({
  value,
  onChangeText,
  textStyle = {},
  containerStyle = {},
  decimalSeparator = '.',
  thousandSeparator = ',',
  precision = 2,
  animationDuration = 100,
  maxFontSize = 64,
  exiting,
  entering,
  prefix,
  suffix,
  allowLeadingZeros = false,
  placeholderStyles = {},
  ...textInputProps
}) => {
  const inputRef = useRef<TextInput>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const handleChangeText = useCallback(
    (text: string) => {
      if (onChangeText) {
        let cleanText = text;
        if (cleanText.startsWith('.')) {
          cleanText = '0.';
        }

        if (cleanText.startsWith('-.')) {
          cleanText = '-0.';
        }

        if (!allowLeadingZeros) {
          // Remove leading zeros except for the case of "0."
          cleanText = cleanText.replace(/^0+(?!\.)/, '0');
        }

        if (!allowLeadingZeros && /^0+\d/.test(cleanText)) {
          // If the text starts with leading zero and followed by a digit, remove the leading zeros
          // Remove leading zeros except for the case of "0."
          cleanText = cleanText.replace(/^0+(?!\.)/, '');
        }

        if (!allowLeadingZeros && /^-0+\d/.test(cleanText)) {
          // If the text starts with a negative sign & a leading zero and followed by a digit, remove the leading zero
          // Remove leading zeros except for the case of "0."
          cleanText = cleanText.replace(/^-0+(?!\.)/, '-');
        }

        const formattedText = formatNumber(
          cleanText,
          decimalSeparator,
          thousandSeparator,
          precision,
        );
        onChangeText(formattedText);
      }
    },
    [
      allowLeadingZeros,
      decimalSeparator,
      onChangeText,
      precision,
      thousandSeparator,
    ],
  );

  const handleContainerPress = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const digits = useMemo(
    () => getDigits(value, decimalSeparator, thousandSeparator),
    [decimalSeparator, value, thousandSeparator],
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

    if (prefix || suffix) {
      totalCharUnits += (prefix?.length || 0) + (suffix?.length || 0);
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

  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={handleContainerPress}
      onLayout={handleLayout}
      accessibilityRole="button"
      accessibilityLabel="Edit number input"
      accessible>
      <TextInput
        ref={inputRef}
        style={[styles.hiddenInput, textStyle]}
        value={value}
        onChangeText={handleChangeText}
        keyboardType="numeric"
        accessibilityLabel="Number input field"
        accessible
        {...textInputProps}
      />
      <View style={styles.visualContainer} pointerEvents="none">
        {value.trim() !== '' &&
          prefix &&
          prefix.length > 0 &&
          prefix
            .split('')
            .map((p) => (
              <AnimatedText
                key={p}
                size={digitWidth}
                value={p}
                fontSize={autoFontSize}
                animationDuration={animationDuration}
                textStyle={[textStyle, styles.digit]}
                entering={entering}
                exiting={exiting}
              />
            ))}
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
          : textInputProps.placeholder && (
              <Text
                style={[
                  styles.placeholder,
                  { fontSize: autoFontSize },
                  placeholderStyles,
                ]}>
                {textInputProps.placeholder}
              </Text>
            )}
        {value.trim() !== '' &&
          suffix &&
          suffix.length > 0 &&
          suffix
            .split('')
            .map((s) => (
              <AnimatedText
                key={s}
                size={digitWidth}
                value={s}
                fontSize={autoFontSize}
                animationDuration={animationDuration}
                textStyle={[textStyle, styles.digit]}
                entering={entering}
                exiting={exiting}
              />
            ))}
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
