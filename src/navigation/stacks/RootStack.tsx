import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LandingPage } from '../../screens/LandingPage/LandingPage';
import { AuthStack } from './AuthStack/AuthStack';
import { UnAuthStack } from './UnAuthStack/UnAuthStack';
import { useAuthStore } from '../../store/sessionStore/AuthStore';

const Stack = createNativeStackNavigator();

export const RootStack = () => {
  const { isLoggedIn } = useAuthStore();
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLanding(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      {showLanding ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LandingPage" component={LandingPage} />
        </Stack.Navigator>
      ) : isLoggedIn ? (
        <AuthStack />
      ) : (
        <UnAuthStack />
      )}
    </NavigationContainer>
  );
};
