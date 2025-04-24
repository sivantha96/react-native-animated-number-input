import React, { useEffect, useRef } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Animated, {
  BaseAnimationBuilder,
  Easing,
  EntryExitAnimationFunction,
  FadeInDown,
  FadeOutDown,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import { ReanimatedKeyframe } from 'react-native-reanimated/lib/typescript/layoutReanimation/animationBuilder/Keyframe';

export type EntryOrExitLayoutType =
  | BaseAnimationBuilder
  | typeof BaseAnimationBuilder
  | EntryExitAnimationFunction
  | ReanimatedKeyframe;

const AnimatedText = ({
  value,
  size = 50,
  textStyle,
  fontSize,
  animationDuration,
  exiting = FadeOutDown.duration(animationDuration),
  entering = FadeInDown.duration(animationDuration),
}: {
  value: string;
  size?: number;
  fontSize: number;
  textStyle?: StyleProp<TextStyle>;
  animationDuration: number;
  exiting?: EntryOrExitLayoutType;
  entering?: EntryOrExitLayoutType;
}): React.JSX.Element => {
  const isFirstRender = useRef(true);
  const animatedWidth = useSharedValue(size);
  const animatedFontSize = useSharedValue(fontSize);

  useEffect(() => {
    const animationConfig: WithTimingConfig = {
      duration: animationDuration,
      easing: Easing.linear,
    };
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      animatedWidth.value = withTiming(size, animationConfig);
      animatedFontSize.value = withTiming(fontSize, animationConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, fontSize, animationDuration]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: size,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'scroll',
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    fontSize: animatedFontSize.value,
    lineHeight: animatedFontSize.value * 1.2,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      layout={LinearTransition.duration(animationDuration)}
      exiting={exiting}
      entering={entering}>
      <Animated.Text
        style={[textStyle, animatedTextStyle]}
        numberOfLines={1}
        ellipsizeMode="clip"
        accessible={false}>
        {value}
      </Animated.Text>
    </Animated.View>
  );
};

export default React.memo(AnimatedText);
