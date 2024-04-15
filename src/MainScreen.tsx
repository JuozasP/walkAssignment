import {View, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {CircularSlider} from './components/CircularSlider';
import {Logo} from './images/logo';
import {ParallaxSlider} from './components/parallaxSlider/ParallaxSlider';
import {colors} from './styleUtils';

export const MainScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.circularContainer}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <CircularSlider initialStepCount={3658} />
      </View>
      <ParallaxSlider />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  circularContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 24,
  },
});
