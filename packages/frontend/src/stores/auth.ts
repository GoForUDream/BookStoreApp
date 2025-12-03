import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@bookstore/shared';
import { apolloClient } from '../lib/apollo';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'ADMIN',
        }),
      updateUser: (user) =>
        set({
          user,
          isAdmin: user.role === 'ADMIN',
        }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
        apolloClient.resetStore();
      },
    }),
    { name: 'auth-storage' }
  )
);
