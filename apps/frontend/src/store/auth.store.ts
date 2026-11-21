import { create } from 'zustand';
import type { User } from '@/types';
import {
  authApi,
  getStoredAccessToken,
  setStoredTokens,
  clearStoredTokens,
} from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (payload: { email: string; password: string; role?: 'FREE' | 'PRO' }) => Promise<{ message: string; email: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!getStoredAccessToken(),
  isLoading: !!getStoredAccessToken(),
  isSubmitting: false,

  login: async ({ email, password }) => {
    set({ isSubmitting: true });
    try {
      const data = await authApi.login({ email, password });
      setStoredTokens(data.accessToken, data.refreshToken);
      set({ user: data.user, isAuthenticated: true, isSubmitting: false });
      return data.user;
    } catch (err) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isSubmitting: true });
    try {
      const data = await authApi.register(payload);
      set({ isSubmitting: false });
      return data;
    } catch (err) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      clearStoredTokens();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    const token = getStoredAccessToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authApi.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      clearStoredTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
