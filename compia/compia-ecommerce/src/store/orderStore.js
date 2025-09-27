import { create } from 'zustand';

export const useOrderStore = create((set) => ({
  orders: [],
  addOrder: (order) => set((state) => ({
    orders: [...state.orders, order],
  })),
}));