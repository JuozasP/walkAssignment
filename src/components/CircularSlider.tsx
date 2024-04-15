import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Circle, Defs, G, RadialGradient, Stop, Svg} from 'react-native-svg';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
  useAnimatedReaction,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {polar2Canvas} from '../utils';
import AnimatedNumbers from 'react-native-animated-numbers';
import {throttle} from 'lodash';
import {colors, fonts} from '../styleUtils';
import {MiniLogo} from '../images/miniLogo';

export type Props = {
  initialStepCount?: number;
  maxStepCount?: number;
};
const MAX_STEP = 10000;

export const CircularSlider = ({
  initialStepCount = 0,
  maxStepCount = MAX_STEP,
}: Props) => {
  const initialPercent = initialStepCount / maxStepCount;
  const percentComplete = useSharedValue(initialPercent);
  const oldPercentComplete = useSharedValue(initialPercent);

  const initialAngle = Math.PI / 2 + Math.PI * 2 * percentComplete.value;
  const width = 168;
  const strokeWidth = 16;
  const center = width / 2;
  const r = (width - strokeWidth) / 2;
  const initialX = center - r * Math.cos(initialAngle);
  const initialY = -r * Math.sin(initialAngle) + center;

  const circumference = Math.PI * 2 * 76;

  const previousIndicatorCoords = useSharedValue({x: initialX, y: initialY});
  const completedCircles = useSharedValue(0);
  const initialTheta = useSharedValue(
    Math.atan2(initialX - center, -(initialY - center)),
  );
  const theta = useSharedValue(
    Math.atan2(initialX - center, -(initialY - center)) + Math.PI,
  );

  const currentSteps = useSharedValue(0);
  const [mySteps, setMySteps] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      // limitation of react-native-animated-numbers
      // added timeout to set initial steps
      setMySteps(Math.floor(initialStepCount));
    }, 1000);
  }, []);

  const gesture = Gesture.Pan()
    .onUpdate(({translationX, translationY}) => {
      const oldCanvasX = translationX + previousIndicatorCoords.value.x;
      const oldCanvasY = translationY + previousIndicatorCoords.value.y;
      const xPrime = oldCanvasX - center;
      const yPrime = -(oldCanvasY - center);
      const rawTheta = Math.atan2(yPrime, xPrime);
      const normalisedAngle =
        (2 * Math.PI + rawTheta - Math.PI / 2) % (2 * Math.PI);

      theta.value = rawTheta;

      const newPercentValue = 1 - normalisedAngle / (2 * Math.PI);
      percentComplete.value = newPercentValue;
      currentSteps.value = Math.round(maxStepCount * newPercentValue);
    })
    .onFinalize(() => {
      percentComplete.value = withTiming(oldPercentComplete.value, {
        duration: 500,
      });

      // theta.value = rawTheta;
      const TAU = 2 * Math.PI;
      const rest = initialTheta.value % TAU;
      const rest1 = theta.value > Math.PI / 2 ? rest + Math.PI : rest - Math.PI;
      theta.value = withTiming(rest1, {duration: 500});
      completedCircles.value = 0;
      currentSteps.value = initialStepCount;
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

  useAnimatedReaction(
    () => {
      return circumference - circumference * percentComplete.value;
    },
    (result, previous) => {
      if (!previous) return;

      if (result - previous >= circumference - 80) {
        completedCircles.value += 1;
      } else if (
        Math.round(result - previous) < -80 &&
        result - previous <= circumference - 80
      ) {
        if (completedCircles.value > 0) {
          completedCircles.value -= 1;
        }
      }
    },
  );

  const animatedProps2 = useAnimatedProps(() => {
    const newCoords = polar2Canvas(
      {
        theta: theta.value,
        radius: r,
      },
      {
        x: center,
        y: center,
      },
    );

    return {
      x: newCoords.x,
      y: newCoords.y,
    };
  }, []);

  const animatedDasharrayOffset = useAnimatedProps(
    () => ({
      strokeDashoffset: circumference - circumference * percentComplete.value,
    }),
    [percentComplete],
  );

  return (
    <View style={styles.constainer}>
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
            stroke="url(#grad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            animatedProps={animatedDasharrayOffset}
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
          animateToNumber={mySteps + completedCircles.value * MAX_STEP}
          fontStyle={styles.stepsStyles}
        />
        <Text style={styles.goalText}>Dienos tikslas</Text>
        <Text style={styles.stepText}>{maxStepCount.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedGroup = Animated.createAnimatedComponent(G);

const styles = StyleSheet.create({
  constainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  stepsStyles: {
    fontSize: 48,
    lineHeight: 57.6,
    fontFamily: fonts.dinCondensedBold,
    color: colors.textBlack,
  },
  goalText: {
    fontFamily: fonts.satoshiVariable,
    fontSize: 12,
    lineHeight: 14,
    color: colors.textGrey,
  },
  stepText: {
    fontFamily: fonts.satoshiVariable,
    fontSize: 12,
    lineHeight: 14,
    color: colors.textBlack,
    fontWeight: 'bold',
    paddingTop: 2,
  },
});
