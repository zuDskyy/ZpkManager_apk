/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Dimensions, ScrollView, StatusBar } from 'react-native';
import {
  Text,
  View,
} from 'react-native';

import NavContainer from './src/NavbarContainer/NavContainer';






function App() {

  

  return (
      <View style={{height:'100%',backgroundColor:'#071526'}}>
      <NavContainer/>
      <StatusBar   backgroundColor="#071526"   />
      
      </View>
  );
}



export default App;
