declare module 'react-native-config' {
  export interface NativeConfig {
    REACT_APP_API_URL?: string;
    ONESIGNAL_API_ID?: string;
    ONESIGNAL_API_URL?: string;
    ONESIGNAL_REST_API?: string
  }

  export const Config: NativeConfig
  export default Config
}