import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LayoutRectangle, StyleSheet, Text, View } from 'react-native';

interface CharWidthContextValue {
  getCharWidthRatio: (fontFamily?: string) => number | React.JSX.Element;
}

const CharWidthContext = createContext<CharWidthContextValue | null>(null);

interface CharWidthProviderProps {
  children: React.ReactNode;
  defaultCharacters?: string;
  defaultFontSize?: number;
}

export const CharWidthProvider: React.FC<CharWidthProviderProps> = ({
  children,
  defaultCharacters = '1234567890',
  defaultFontSize = 5,
}) => {
  const [ratioCache, setRatioCache] = useState<Map<string, number>>(new Map());
  const [pendingMeasurements, setPendingMeasurements] = useState<Set<string>>(
    new Set(),
  );
  const textRefs = useRef<Map<string, Text>>(new Map());

  const onLayout = useCallback(
    (fontFamily: string = 'default') =>
      (e: { nativeEvent: { layout: LayoutRectangle } }) => {
        const width = e.nativeEvent.layout.width;
        const avgCharWidth = width / defaultCharacters.length;
        const ratio = avgCharWidth / defaultFontSize;

        setRatioCache((prev) => new Map(prev).set(fontFamily, ratio));
        setPendingMeasurements((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fontFamily);
          return newSet;
        });
      },
    [defaultCharacters, defaultFontSize],
  );

  const getCharWidthRatio = useCallback(
    (fontFamily?: string): number | React.JSX.Element => {
      const key = fontFamily || 'default';

      // Return cached ratio if available
      if (ratioCache.has(key)) {
        return ratioCache.get(key)!;
      }

      // If already measuring, return fallback
      if (pendingMeasurements.has(key)) {
        return 0.65; // Fallback ratio
      }

      // Start measurement
      setPendingMeasurements((prev) => new Set(prev).add(key));

      const Measurer = (
        <View key={key} style={styles.hidden} pointerEvents="none">
          <Text
            ref={(ref) => {
              if (ref) {
                textRefs.current.set(key, ref);
              }
            }}
            onLayout={onLayout(key)}
            style={{ fontSize: defaultFontSize, fontFamily }}>
            {defaultCharacters}
          </Text>
        </View>
      );

      return Measurer;
    },
    [
      ratioCache,
      pendingMeasurements,
      onLayout,
      defaultCharacters,
      defaultFontSize,
    ],
  );

  const contextValue = useMemo(
    () => ({
      getCharWidthRatio,
    }),
    [getCharWidthRatio],
  );

  return (
    <CharWidthContext.Provider value={contextValue}>
      {children}
    </CharWidthContext.Provider>
  );
};

export const useCharWidthContext = (): CharWidthContextValue => {
  const context = useContext(CharWidthContext);
  if (!context) {
    throw new Error(
      'useCharWidthContext must be used within a CharWidthProvider',
    );
  }
  return context;
};

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    opacity: 0,
  },
});
