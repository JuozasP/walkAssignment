import {
  Canvas,
  Circle,
  Group,
  Path,
  PolarPoint,
  Rect,
  Skia,
  Vector,
} from '@shopify/react-native-skia';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {Text} from 'react-native-svg';

const {width, height} = Dimensions.get('window');

export const cartesian2Canvas = (v: Vector, center: Vector) => {
  'worklet';
  return {
    x: v.x + center.x,
    y: -1 * v.y + center.y,
  };
};

export const polar2Cartesian = (p: PolarPoint) => {
  'worklet';
  return {
    x: p.radius * Math.cos(p.theta),
    y: p.radius * Math.sin(p.theta),
  };
};

export const polar2Canvas = (p: PolarPoint, center: Vector) => {
  'worklet';
  return cartesian2Canvas(polar2Cartesian(p), center);
};

export const CircularSlider1 = () => {
  const strokeWidth = 20;
  const center = width / 2;
  const r = (width - strokeWidth) / 2 - 40;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const x1 = center - r * Math.cos(startAngle);
  const y1 = -r * Math.sin(startAngle) + center;
  const x2 = center - r * Math.cos(endAngle);
  const y2 = -r * Math.sin(endAngle) + center;
  const rawPath = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`;
  const rawForegroundPath = `M ${x2} ${y2} A ${r} ${r} 1 0 1 ${x1} ${y1}`;
  const skiaBackgroundPath = Skia.Path.MakeFromSVGString(rawPath);
  const skiaForegroundPath = Skia.Path.MakeFromSVGString(rawForegroundPath);

  const movableCx = useSharedValue(x2);
  const movableCy = useSharedValue(y2);
  const previousPositionX = useSharedValue(x2);
  const previousPositionY = useSharedValue(y2);
  const percentComplete = useSharedValue(0);

  const skiaCx = useSharedValue(x2);
  const skiaCy = useSharedValue(y2);
  const skiaPercentComplete = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate(({translationX, translationY, absoluteX}) => {
      const oldCanvasX = translationX + previousPositionX.value;
      const oldCanvasY = translationY + previousPositionY.value;

      const xPrime = oldCanvasX - center;
      const yPrime = -(oldCanvasY - center);
      const rawTheta = Math.atan2(yPrime, xPrime);

      let newTheta;

      if (absoluteX < width / 2 && rawTheta < 0) {
        newTheta = Math.PI;
      } else if (absoluteX > width / 2 && rawTheta <= 0) {
        newTheta = 0;
      } else {
        newTheta = rawTheta;
      }

      const percent = 1 - newTheta / Math.PI;
      percentComplete.value = percent;

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

      movableCx.value = newCoords.x;
      movableCy.value = newCoords.y;
      skiaCx.value = newCoords.x;
      skiaCy.value = newCoords.y;
      skiaPercentComplete.value = percentComplete.value;
    })
    .onEnd(() => {
      previousPositionX.value = movableCx.value;
      previousPositionY.value = movableCy.value;
    });

  //   useSharedValueEffect(
  //     () => {
  //       skiaCx.current = movableCx.value;
  //       skiaCy.current = movableCy.value;
  //       skiaPercentComplete.current = percentComplete.value;
  //     },
  //     movableCx,
  //     movableCy,
  //     percentComplete,
  //   );

  const style = useAnimatedStyle(() => {
    return {height: 200, width: 300, opacity: percentComplete.value};
  }, [percentComplete]);

  if (!skiaBackgroundPath || !skiaForegroundPath) {
    return <View></View>;
  }

  //   return (
  //     <Canvas style={{width, height}}>
  //       <Group blendMode="multiply">
  //         <Circle cx={r1} cy={r1} r={r1} color="cyan" />
  //         <Circle cx={width - r1} cy={r1} r={r1} color="magenta" />
  //         <Circle cx={width / 2} cy={width - r1} r={r1} color="yellow" />
  //       </Group>
  //     </Canvas>
  //   );

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{width, height}}>
        {/* <Rect x={0} y={0} width={width} height={height} color="white" /> */}
        <Path
          path={skiaBackgroundPath}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          color={'grey'}
        />
        <Path
          path={skiaForegroundPath}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          color={'orange'}
          start={0}
          end={skiaPercentComplete}
        />
        <Circle cx={skiaCx} cy={skiaCy} r={20} color="orange" style="fill" />
        <Circle cx={skiaCx} cy={skiaCy} r={15} color="white" style="fill" />
      </Canvas>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {},
  cursor: {
    backgroundColor: 'green',
  },
  ghost: {
    flex: 2,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
