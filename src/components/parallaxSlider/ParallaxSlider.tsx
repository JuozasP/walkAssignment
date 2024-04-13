import React, {useState, useRef} from 'react';
import {Dimensions, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const {width: screenWidth} = Dimensions.get('window');

const ParallaxRow = ({
  scrollDistance,
  children,
  duration,
}: {
  scrollDistance: SharedValue<number>;
  duration: number;
}) => {
  //   const scrollX = useRef(new Animated.Value(0)).current;
  //   const translateX = scrollX.interpolate({
  //     inputRange: [-screenWidth, 0, screenWidth],
  //     outputRange: [screenWidth * scrollFactor, 0, -screenWidth * scrollFactor],
  //   });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(scrollDistance?.value, {
          duration: duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export const ParallaxSlider = () => {
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollDistance = useSharedValue(0);
  const scrollDistanceEnd = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate(({translationX, translationY, velocityX}) => {
      scrollDistance.value = translationX + scrollDistanceEnd.value;
    })
    .onEnd(() => {
      scrollDistanceEnd.value = scrollDistance.value;
    });

  // const deltaX = event.nativeEvent.pageX - startX;
  // Animated.event([{nativeEvent: {translationX: deltaX}}], {
  //   useNativeDriver: true,
  // })();

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <GestureDetector gesture={gesture}>
      <View style={{flex: 1}}>
        <ParallaxRow
          scrollDistance={scrollDistance}
          scrollFactor={0.9}
          duration={500}
          children={
            <View style={{height: 100, width: 300, backgroundColor: 'red'}} />
          }
        />
        <ParallaxRow
          scrollDistance={scrollDistance}
          scrollFactor={0.7}
          duration={1000}
          children={
            <View style={{height: 100, width: 300, backgroundColor: 'green'}} />
          }
        />
        {/* <ParallaxRow
          scrollFactor={0.5}
          children={
            <View style={{height: 100, width: 300, backgroundColor: 'blue'}} />
          }
        />
        <ParallaxRow
          scrollFactor={0.3}
          children={
            <View
              style={{height: 100, width: 300, backgroundColor: 'yellow'}}
            />
          }
        /> */}
      </View>
    </GestureDetector>
  );
};
