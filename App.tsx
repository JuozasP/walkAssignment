/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MainScreen} from './src/MainScreen';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <MainScreen />
    </GestureHandlerRootView>
  );
}

export default App;
