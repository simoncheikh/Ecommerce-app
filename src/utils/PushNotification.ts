import { createNavigationContainerRef } from '@react-navigation/native';
import axios from 'axios';
import Config from 'react-native-config';

export const navigationRef = createNavigationContainerRef();

export const sendPushNotification = async (productId: string, title: string) => {
  try {
    const response = await axios.post(
      `${Config.ONESIGNAL_API_URL}`,
      {
        app_id: `${Config.ONESIGNAL_API_ID}`,
        included_segments: ['All'],
        headings: { en: 'New Product Added!' },
        contents: { en: title },
        data: { productId },
      },
      {
        headers: {
          Authorization: `${Config.ONESIGNAL_REST_API}`, // <- replace with your actual OneSignal REST API key
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Notification sent', response.data);
  } catch (error) {
    console.error('Failed to send notification', error);
  }
};

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
}
