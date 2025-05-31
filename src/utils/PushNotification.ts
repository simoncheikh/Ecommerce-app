import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import React, { useEffect } from 'react';

export async function sendNewProductNotification(productId: string, title: string) {
  await notifee.requestPermission();

  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: 'New Product Added!',
    body: title,
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
    },
    data: {
      productId, 
    },
  });
}

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: any) {
  navigationRef.current?.navigate(name, params);
}


