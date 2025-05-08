import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../../store/AuthContext/AuthContext';
import { AuthStack } from './AuthStack/AuthStack';
import { AppStack } from './AppStack/AppStack';

export const RootStack = () => {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
