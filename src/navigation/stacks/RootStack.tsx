import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack/AuthStack';
import { UnAuthStack } from './UnAuthStack/UnAuthStack';
import { useAuthStore } from '../../store/sessionStore/AuthStore';
import { linking } from '../../constants/deepLinking';
import { RootStackParamList } from './RootStack.type';
import { navigationRef } from '../../utils/PushNotification';
import { Linking } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const { isLoggedIn } = useAuthStore();
  const [showLanding, setShowLanding] = useState(true);
  const [openFromDeepLinking, setOpenFromDeepLinking] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLanding(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        console.log("App launched via deep link:", url);
        setOpenFromDeepLinking(true);
        setShowLanding(false);
      }
    }
    checkInitialUrl();
  }, []);

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {
          isLoggedIn ? (
            <Stack.Screen name="AuthStack" component={AuthStack} />
          ) : (
            <Stack.Screen name="UnAuthStack" component={UnAuthStack} />
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};