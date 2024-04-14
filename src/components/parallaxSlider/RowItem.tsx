import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  LayoutChangeEvent,
} from 'react-native';
import React from 'react';
import {colors, fonts} from '../../styleUtils';
import {SharedValue, runOnJS, useDerivedValue} from 'react-native-reanimated';

type Props = {
  label: string;
  imageSource: ImageSourcePropType;
};

export const RowItem = ({imageSource, label}: Props) => {
  useDerivedValue(() => {
    // runOnJS(debounceOnSteps)(currentSteps.value);
  });

  const onLayout = ({
    nativeEvent: {
      layout: {width},
    },
  }: LayoutChangeEvent) => {
    // console.log('width', width);
    // console.log('rowIndex', rowIndex);
    // contentWidth.value[rowIndex] = contentWidth.value[rowIndex] + width;
    // console.log('rowIndex', contentWidth.value[rowIndex] + width);
  };

  return (
    <TouchableOpacity onLayout={onLayout} style={styles.container}>
      <Image style={styles.image} source={imageSource} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 8,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 2,
  },
  image: {
    height: 24,
    width: 24,
  },
  label: {
    fontSize: 13,
    lineHeight: 15,
    fontFamily: fonts.satoshiVariable,
    color: colors.black,
  },
});
