import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {SliderHeader} from './SliderHeader';
import {RowItem} from './RowItem';
import {ShowMoreButton} from './ShowMoreButton';
import {ParallaxRow} from './ParallaxRow';

const borealisLogoSource = require('../../images/borealisLogo.png');
const audiotekaLogo = require('../../images/audiotekaLogo.png');
const ikiLogoSource = require('../../images/ikiLogo.png');
const sportasLogoSource = require('../../images/sportasLogo.png');
const corepetitusLogoSource = require('../../images/corepetitusLogo.png');

const CONTENT = [
  [
    {
      label: '-20%',
      image: ikiLogoSource,
    },
    {
      label: 'Knyga nemokamai',
      image: audiotekaLogo,
    },
    {
      label: '3 savaitės nemokamai',
      image: borealisLogoSource,
    },
    {
      label: '3 savaitės nemokamai',
      image: borealisLogoSource,
    },
  ],
  [
    {
      label: '-20% nuolaida',
      image: sportasLogoSource,
    },
    {
      label: '15% nuolaida',
      image: corepetitusLogoSource,
    },
    {
      label: '-20 % nuolaida',
      image: sportasLogoSource,
    },
    {
      label: 'Knyga nemokamai',
      image: audiotekaLogo,
    },
  ],
  [
    {
      label: '3 savaitės nemokamai',
      image: borealisLogoSource,
    },
    {
      label: '-20% nuolaida',
      image: sportasLogoSource,
    },
    {
      label: 'Knyga nemokamai',
      image: audiotekaLogo,
    },
    {
      label: '-20% nuolaida',
      image: sportasLogoSource,
    },
  ],
  [
    {
      label: '15% nuolaida',
      image: corepetitusLogoSource,
    },
    {
      label: '-20% nuolaida',
      image: sportasLogoSource,
    },
    {
      label: '15% nuolaida',
      image: corepetitusLogoSource,
    },
    {
      label: 'Knyga nemokamai',
      image: audiotekaLogo,
    },
  ],
];

const MIN_ANIMATION_DURATION = 800;
const MAX_ANIMATION_DURATION = 1200;
export const RIGHT_CONTENT_WIDTH = 60;
const screenWidth = Dimensions.get('screen');

const offsetArr = [10, 20, -30, 60];

export const ParallaxSlider = () => {
  const scrollDistance = useSharedValue(0);
  const scrollDistanceEnd = useSharedValue(0);
  const buttonTranslateX = useSharedValue(RIGHT_CONTENT_WIDTH);
  const aref = useAnimatedRef();
  const contentWidth = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate(({translationX, velocityX}) => {
      if (scrollDistance.value <= 0 && velocityX > 0) {
        scrollDistance.value = 0;
        buttonTranslateX.value = RIGHT_CONTENT_WIDTH;
      } else if (
        contentWidth.value +
          scrollDistance.value -
          screenWidth.width +
          RIGHT_CONTENT_WIDTH >=
        0
      ) {
        scrollDistance.value =
          screenWidth.width - contentWidth.value - RIGHT_CONTENT_WIDTH;
        buttonTranslateX.value = 0;
      } else {
        scrollDistance.value = translationX + scrollDistanceEnd.value;
      }
    })
    .onEnd(() => {
      scrollDistanceEnd.value = scrollDistance.value;
    });

  const getAnimationDuration = () => {
    return Math.floor(
      Math.random() * (MAX_ANIMATION_DURATION - MIN_ANIMATION_DURATION + 1) +
        MIN_ANIMATION_DURATION,
    );
  };

  const onLayout = () => {
    runOnUI(() => {
      const measurement = measure(aref);
      if (measurement === null) {
        return;
      }
      contentWidth.value = measurement.width;
    })();
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    right: contentWidth.value - screenWidth.width,

    transform: [
      {
        translateX: withDelay(
          buttonTranslateX.value === 0 ? 550 : 0,
          withTiming(buttonTranslateX.value),
        ),
      },
    ],
  }));

  return (
    <View>
      <SliderHeader />

      <GestureDetector gesture={gesture}>
        <View style={styles.rowContainer}>
          <Animated.View
            style={styles.parallaxContainer}
            ref={aref}
            onLayout={onLayout}>
            {CONTENT.map((row, rowIndex) => (
              <ParallaxRow
                contentWidth={contentWidth}
                endOffset={offsetArr[rowIndex]}
                key={rowIndex}
                scrollDistance={scrollDistance}
                duration={getAnimationDuration()}
                children={row.map((item, index) => (
                  <RowItem
                    key={`${item.label}-${index}`}
                    label={item.label}
                    imageSource={item.image}
                  />
                ))}
              />
            ))}
            <Animated.View
              style={[styles.animatedButtonWrapper, animatedButtonStyle]}>
              <ShowMoreButton />
            </Animated.View>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  parallaxContainer: {
    paddingLeft: 20,
    gap: 8,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  animatedButtonWrapper: {
    position: 'absolute',
    width: RIGHT_CONTENT_WIDTH,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
