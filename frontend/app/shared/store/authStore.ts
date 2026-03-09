import { create } from 'zustand';

import type { AuthState } from '@/app/shared/types/auth';

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  isInitialized: false,
  setAccessToken: token => set({ accessToken: token }),
  setInitialized: value => set({ isInitialized: value }),

  clearAuth: () => set({ accessToken: null, isInitialized: true }),
}));
