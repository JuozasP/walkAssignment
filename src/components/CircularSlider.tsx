import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
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
  const initialAngle = Math.PI / 2 + Math.PI * 2 * percentComplete.value;
  const width = 168;
  const strokeWidth = 16;
  const center = width / 2;
  const r = (width - strokeWidth) / 2;
  const x1 = center - r * Math.cos(initialAngle);
  const y1 = -r * Math.sin(initialAngle) + center;

  const indicatorX = useSharedValue(x1);
  const indicatorY = useSharedValue(y1);

  const circumference = Math.PI * 2 * 76;

  const previousIndicatorCoords = useSharedValue({x: x1, y: y1});
  const completedCircles = useSharedValue(0);

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
    .onUpdate(({translationX, translationY, velocityX, absoluteX}) => {
      const oldCanvasX = translationX + previousIndicatorCoords.value.x;
      const oldCanvasY = translationY + previousIndicatorCoords.value.y;
      const xPrime = oldCanvasX - center;
      const yPrime = -(oldCanvasY - center);
      const rawTheta = Math.atan2(yPrime, xPrime);
      let newTheta;
      const test = (2 * Math.PI + rawTheta - Math.PI / 2) % (2 * Math.PI);

      // if (absoluteX < width / 2 && rawTheta < 0) {
      //   newTheta = Math.PI;
      // } else if (absoluteX > width / 2 && rawTheta <= 0) {
      //   newTheta = 0;
      // } else {
      // }
      newTheta = rawTheta;

      // 6.27;
      // console.log('rawTheta ', test);

      const test2 = 1 - test / (2 * Math.PI);
      percentComplete.value = test2;
      currentSteps.value = Math.round(maxStepCount * test2);

      // because circumference
      if (Math.round(test2 * 100) / 100 >= 0.99) {
        // if (velocityX < 0 && completedCircles.value > 1) {
        //   completedCircles.value -= 1;
        //   console.log('RATAS MAZIAU', test2);
        // } else {
        //   completedCircles.value += 1;
        //   console.log('RATAS DAUGIAU', test2);
        // }
      }
      //84

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
      // if( Math.round()){

      // }
      console.log('absoluteX ', newCoords.x, ' // ', newCoords.y);

      indicatorX.value = newCoords.x;
      indicatorY.value = newCoords.y;
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
    [],
  );

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
          animateToNumber={mySteps}
          fontStyle={styles.stepsStyles}
        />
        <Text style={styles.goalText}>Dienos tikslas</Text>
        <Text style={styles.stepText}>{maxStepCount.toLocaleString()}</Text>
        <Text style={styles.stepText}>{completedCircles.value}</Text>
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
