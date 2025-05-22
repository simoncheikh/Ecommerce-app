import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      login: (token) => set({ isLoggedIn: true, token }),
      logout: () => set({ isLoggedIn: false, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);