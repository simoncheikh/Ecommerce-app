import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeTabs } from '../../navigator/HomeTabs/HomeTabs';

const Stack = createNativeStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeTabs" component={HomeTabs} />
  </Stack.Navigator>
);
