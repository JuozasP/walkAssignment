import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors, fonts} from '../../styleUtils';
import Chevron from '../../images/chevron';

export const SliderHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Įsigyk už žingsnius</Text>
      <TouchableOpacity style={styles.rightButton}>
        <Text>Visi</Text>
        <Chevron />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    marginTop: 40,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
    fontFamily: fonts.satoshiVariable,
    color: colors.textBlack,
  },
  righttitle: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: fonts.satoshiVariable,
    color: colors.textGrey,
  },
  rightButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 1,
  },
});
