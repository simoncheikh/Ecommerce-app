import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

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

const secureStorage: StateStorage = {
  setItem: async (key, value) =>
    await RNSecureStorage.setItem(key, value, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED,
    }),
  getItem: async (key) => {
    const value = await RNSecureStorage.getItem(key);
    return value ?? null;
  },
  removeItem: async (key) => {
    await RNSecureStorage.removeItem(key);
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
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
