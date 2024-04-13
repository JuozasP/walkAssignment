import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {Circle, Defs, G, RadialGradient, Stop, Svg} from 'react-native-svg';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {polar2Canvas} from '../utils';
import AnimatedNumbers from 'react-native-animated-numbers';
import {throttle} from 'lodash';
import {colors} from '../styleUtils';
import {MiniLogo} from '../images/miniLogo';

export type Props = {};

const maxSteps = 10000;

export const CircularSlider = () => {
  const initialAngle = Math.PI / 2;

  const width = 168;
  const strokeWidth = 16;
  const center = width / 2;
  const r = (width - strokeWidth) / 2;
  const x1 = center - r * Math.cos(initialAngle);
  const y1 = -r * Math.sin(initialAngle) + center;

  const indicatorX = useSharedValue(x1);
  const indicatorY = useSharedValue(y1);
  const indicatorXPrevious = useSharedValue(x1);
  const indicatorYPrevious = useSharedValue(y1);

  const percent = 10;

  const circumference = Math.PI * 2 * 76;

  const previousIndicatorCoords = useSharedValue({x: x1, y: y1});
  const percentComplete = useSharedValue(0);
  const completedCircles = useSharedValue(0);
  const currentSteps = useSharedValue(0);
  const [mySteps, setMySteps] = useState(0);

  const gesture = Gesture.Pan()
    .onUpdate(({translationX, translationY, velocityX}) => {
      const oldCanvasX = translationX + previousIndicatorCoords.value.x;
      const oldCanvasY = translationY + previousIndicatorCoords.value.y;
      const xPrime = oldCanvasX - center;
      const yPrime = -(oldCanvasY - center);
      const rawTheta = Math.atan2(yPrime, xPrime);
      let newTheta;
      // if (absoluteX < width / 2 && rawTheta < 0) {
      //   newTheta = Math.PI;
      // } else if (absoluteX > width / 2 && rawTheta <= 0) {
      //   newTheta = 0;
      // } else {
      newTheta = rawTheta;
      // }
      const percent1 = 1 - newTheta / Math.PI;
      const test = (2 * Math.PI + rawTheta - Math.PI / 2) % (2 * Math.PI);
      const test2 = 1 - test / (2 * Math.PI);
      console.log('percent1', test2);
      //   console.log('velocityX ', velocityX);
      percentComplete.value = test2;
      currentSteps.value = Math.round(maxSteps * test2);

      const newCoords = polar2Canvas(
        {
          theta: newTheta,
          radius: r,
        },
        {
          x: center,
          y: center,
        },
      );
      indicatorX.value = newCoords.x;
      indicatorY.value = newCoords.y;
      //   skiaPercentComplete.value = percentComplete.value;
    })
    .onEnd(() => {
      previousIndicatorCoords.value = {
        x: indicatorX.value,
        y: indicatorY.value,
      };
    });

  const onSteps = (result: number) => {
    setMySteps(result);
  };

  const debounceOnSteps = useMemo(
    () => throttle(onSteps, 500, {trailing: true}),
    [],
  );

  useDerivedValue(() => {
    runOnJS(debounceOnSteps)(currentSteps.value);
  });

  const animatedProps2 = useAnimatedProps(
    () => ({
      x: indicatorX.value,
      y: indicatorY.value,
    }),
    [percent],
  );

  const animatedProps = useAnimatedProps(
    () => ({
      strokeDashoffset: circumference - circumference * percentComplete.value,
    }),
    [percentComplete],
  );

  const animatedTextProps = useAnimatedProps(() => ({
    text: currentSteps.value + '',
  }));

  const x2 = center - r * Math.cos(Math.PI);
  const y2 = -r * Math.sin(Math.PI) + center;
  const animationDuration = 100;

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <GestureDetector gesture={gesture}>
        <Svg width="168" height="168" viewBox="0 0 168 168" fill="none">
          <Circle
            cx="84"
            cy="84"
            r="76"
            stroke="#E8DFF7"
            strokeWidth={strokeWidth}
          />
          <AnimatedCircle
            cx="84"
            cy="84"
            r="76"
            // stroke="red"
            stroke="url(#grad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            animatedProps={animatedProps}
            rotation={'-90'}
            origin={168 / 2}
          />

          <Defs>
            <RadialGradient id="grad" cx="0" cy="0" r="1">
              <Stop offset="0" stopColor={colors.purple} />
              <Stop offset="1" stopColor={colors.lightPurple} />
            </RadialGradient>
          </Defs>

          <AnimatedGroup animatedProps={animatedProps2}>
            <AnimatedCircle r="8" fill={colors.purple} />
            <Circle r="6" fill={colors.white} />
          </AnimatedGroup>
        </Svg>
      </GestureDetector>
      <View style={styles.innerContainer}>
        <MiniLogo />
        <AnimatedNumbers
          animateToNumber={mySteps}
          fontStyle={styles.stepsStyles}
        />
        <Text>Dienos tikslas</Text>
        <Text>{maxSteps.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedGroup = Animated.createAnimatedComponent(G);

const styles = StyleSheet.create({
  innerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  stepsStyles: {
    fontWeight: 'bold',
    fontSize: 48,
    lineHeight: 57.6,
  },
});
