import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeTabs } from '../../navigator/HomeTabs/HomeTabs';
import { MapScreen } from '../../../screens/MapPage/MapScreen';
import { enableScreens } from 'react-native-screens';

enableScreens()

const Stack = createNativeStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator initialRouteName="HomeTabs"
    screenOptions={{
      animation: 'slide_from_right',
      gestureEnabled: true,
    }}
  >
    <Stack.Screen
      name="HomeTabs"
      component={HomeTabs}
      options={{ headerShown: false, animation: 'slide_from_bottom' }}

    />
    <Stack.Screen
      name="Map"
      component={MapScreen}
      options={{ animation: 'slide_from_bottom' }}
    />
  </Stack.Navigator>
);
