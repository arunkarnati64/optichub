'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  updateProfile: (data: { name?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        const { data } = await api.post('/auth/login', { email, password });
        set({ user: data.user, isLoading: false });
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        await api.post('/auth/register', { name, email, password });
        // auto-login after register
        const { data } = await api.post('/auth/login', { email, password });
        set({ user: data.user, isLoading: false });
      },

      logout: async () => {
        await api.post('/auth/logout');
        set({ user: null });
      },

      updateProfile: async (data) => {
        const { data: res } = await api.patch('/auth/profile', data);
        set({ user: res.user });
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user });
        } catch {
          set({ user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
