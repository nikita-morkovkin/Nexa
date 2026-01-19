import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthStore } from './auth.types';

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      isAuth: false,
      setIsAuth: (value: boolean) => set({ isAuth: value }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
