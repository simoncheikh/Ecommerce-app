import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';

async function requestMediaPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version >= 33) {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        if (alreadyGranted) return true;

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        if (alreadyGranted) return true;

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }

  return true;
}


export async function saveImageToGallery(imageUrl: string): Promise<void> {
  try {
    // 1. Check if URL is valid
    if (!imageUrl) {
      Alert.alert('Error', 'No image URL provided');
      return;
    }

    // 2. Handle permission requests
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please grant storage permissions in settings to save images',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    const isRemote = imageUrl.startsWith('http');
    let localPath = imageUrl;

    if (isRemote) {
      const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      localPath = `${RNFS.CachesDirectoryPath}/${filename}`;

      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: localPath,
      }).promise;

      if (downloadResult.statusCode !== 200) {
        throw new Error(`Download failed with status ${downloadResult.statusCode}`);
      }
    }

    if (Platform.OS === 'android' && Platform.Version >= 30) {
      await CameraRoll.saveToCameraRoll(localPath, 'photo');
    } else {
      await CameraRoll.save(localPath, { type: 'photo', album: 'YourAppImages' });
    }

    Alert.alert('Success', 'Image saved to gallery!');
  } catch (error: any) {
    console.error('Save image error:', error);
    Alert.alert(
      'Error',
      `Failed to save image: ${error.message || 'Unknown error'}`,
      [{ text: 'OK' }]
    );
  }
}