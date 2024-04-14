import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors, fonts} from '../../styleUtils';
import ChevronRight from '../../images/chevronRight';

export const ShowMoreButton = () => {
  return (
    <TouchableOpacity style={style.container}>
      <View style={style.buttonContainer}>
        <ChevronRight />
      </View>
      <Text style={style.label}>Žiūrėti visus</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  container: {
    gap: 4,
    width: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colors.lightPurple2,
  },
  label: {
    color: colors.lightGrey,
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.satoshiVariable,
    textAlign: 'center',
  },
});
