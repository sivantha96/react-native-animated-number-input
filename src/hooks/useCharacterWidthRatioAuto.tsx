import React, { useCallback, useRef, useState } from 'react';
import { LayoutRectangle, StyleSheet, Text, View } from 'react-native';

type Options = {
  characters?: string;
  fontFamily?: string;
  defaultFontSize?: number;
};

export function useCharacterWidthRatioAuto({
  characters = '1234567890',
  fontFamily,
  defaultFontSize = 5,
}: Options = {}): number | React.JSX.Element {
  const [ratio, setRatio] = useState<number | null>(null);
  const textRef = useRef<Text>(null);
  const onLayout = useCallback(
    (e: { nativeEvent: { layout: LayoutRectangle } }) => {
      const width = e.nativeEvent.layout.width;
      const avgCharWidth = width / characters.length;
      setRatio(avgCharWidth / defaultFontSize);
    },
    [characters, defaultFontSize],
  );

  const Measurer = React.useMemo(
    () => (
      <View style={styles.hidden} pointerEvents="none">
        <Text
          ref={textRef}
          onLayout={onLayout}
          style={{ fontSize: defaultFontSize, fontFamily }}>
          {characters}
        </Text>
      </View>
    ),
    [characters, defaultFontSize, fontFamily, onLayout],
  );

  return ratio !== null ? ratio : Measurer;
}

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    opacity: 0,
  },
});
