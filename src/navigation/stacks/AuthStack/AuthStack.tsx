import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeTabs } from '../../navigator/HomeTabs/HomeTabs';
import { MapScreen } from '../../../screens/MapPage/MapScreen';

const Stack = createNativeStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator initialRouteName="HomeTabs">
    <Stack.Screen
      name="HomeTabs"
      component={HomeTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Map"
      component={MapScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);
