import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isInitialized: boolean;
  setAccessToken: (token: string | null) => void;
  setInitialized: (value: boolean) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  isInitialized: false,
  setAccessToken: token => set({ accessToken: token }),
  setInitialized: value => set({ isInitialized: value }),

  clearAuth: () => set({ accessToken: null, isInitialized: true }),
}));
