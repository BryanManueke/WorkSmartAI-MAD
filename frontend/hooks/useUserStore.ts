import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  user: User | null;
  setUser: (userData: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),
}));
