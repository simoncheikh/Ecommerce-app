import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

type TokenData = {
  accessToken: string;
  refreshToken: string;
};

type AuthState = {
  isLoggedIn: boolean;
  token: { success: boolean; data: TokenData } | null;
  login: (token: { success: boolean; data: TokenData }) => void;
  logout: () => void;
};

const zustandAsyncStorage: PersistStorage<AuthState> = {
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      login: (token) => set({ token, isLoggedIn: true }),
      logout: () => set({ token: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: zustandAsyncStorage, 
    }
  )
);
