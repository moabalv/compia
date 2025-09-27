// src/store/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  
  login: (username, password) => {
    if (username === 'admin' && password === '123456') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => set({ isAuthenticated: false }),
}));