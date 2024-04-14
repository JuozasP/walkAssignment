import {Dimensions, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';

import Animated, {
  Easing,
  SharedValue,
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  withDelay,
  withTiming,
  use,
  LinearTransition,
} from 'react-native-reanimated';
import {RIGHT_CONTENT_WIDTH} from './ParallaxSlider';

const screenWidth = Dimensions.get('screen');

export const ParallaxRow = ({
  scrollDistance,
  children,
  duration,
  contentWidth,
  endOffset,
}: {
  scrollDistance: SharedValue<number>;
  duration: number;
  children: JSX.Element | JSX.Element[];
  contentWidth: SharedValue<number>;
  endOffset: number;
}) => {
  const aref = useAnimatedRef();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(
          // check if end was reached and form half circle according to index
          scrollDistance?.value !==
            screenWidth.width - contentWidth.value - RIGHT_CONTENT_WIDTH
            ? scrollDistance?.value
            : screenWidth.width -
                contentWidth.value -
                RIGHT_CONTENT_WIDTH +
                endOffset,
          {
            duration: duration,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
        ),
      },
    ],
  }));

  useEffect(() => {}, []);
  const transition = LinearTransition.duration(500);

  return (
    <Animated.View
      layout={transition}
      style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
});
