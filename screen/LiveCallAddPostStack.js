import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LiveCalls from './LiveCalls';
import AddPostScreen from './CrimeStory/AddPostScreen';

const Stack = createStackNavigator();

const LiveCallAddPostStack = () => {
  return (
      <Stack.Navigator initialRouteName="LiveCalls">
        <Stack.Screen name="LiveCalls" component={LiveCalls} />
        <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
      </Stack.Navigator>
  );
};

export default LiveCallAddPostStack;