import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStack } from './src/navigation/stacks/RootStack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { navigate } from './src/utils/PushNotification';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';


const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification?.data?.productId) {
        navigate('ProductDetails', { productId: detail.notification.data.productId });
      }
    });
  }, []);

  useEffect(() => {
  async function checkInitialNotification() {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification?.notification?.data?.productId) {
      navigate('ProductDetails', {
        productId: initialNotification.notification.data.productId,
      });
    }
  }

  checkInitialNotification();
}, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootStack />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
