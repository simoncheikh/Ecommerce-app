import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStack } from './src/navigation/stacks/RootStack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { navigate, sendPushNotification } from './src/utils/PushNotification';
import BootSplash from "react-native-bootsplash";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    OneSignal.initialize('0d9d7f69-5888-4518-8266-96839a7632d5');

    OneSignal.Debug.setLogLevel(6); // VERBOSE

    OneSignal.Notifications.requestPermission(true);

    const listener = OneSignal.Notifications.addEventListener('click', (event) => {
      const productId = event.notification.additionalData?.productId;
      console.log('Notification tapped. productId:', productId);

      if (productId) {
        navigate('ProductDetails', { _id: productId });
      }
    });

    return () => {
      OneSignal.Notifications.removeEventListener('click', listener);
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootStack />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
