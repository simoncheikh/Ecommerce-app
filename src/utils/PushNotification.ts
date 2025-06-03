import { createNavigationContainerRef } from '@react-navigation/native';
import axios from 'axios';

export const navigationRef = createNavigationContainerRef();

export const sendPushNotification = async (productId: string, title: string) => {
  try {
    const response = await axios.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: '0d9d7f69-5888-4518-8266-96839a7632d5',
        included_segments: ['All'],
        headings: { en: 'New Product Added!' },
        contents: { en: title },
        data: { productId },
      },
      {
        headers: {
          Authorization: 'os_v2_app_bwox62kyrbcrratgs2bzu5rs2udo5l5yw6zuuwmp3p5dwfkxyuhnioe2oudwdrsv2cgafeykekgje5xsfrdeso7lfjc7escngtd3i7q', // <- replace with your actual OneSignal REST API key
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
