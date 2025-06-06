import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

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

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
