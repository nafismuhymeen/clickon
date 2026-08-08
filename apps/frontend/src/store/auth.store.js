import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: { id: 1, email: 'nafis@clickon.io', role: 'PRO' },
    isAuthenticated: true,
    isLoading: false,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
