import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],

  addToCart: (product) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);

    if (existingItem) {
      // Se o item já existe, atualiza a quantidade
      return {
        items: state.items.map((item) =>
          item.id === product.id
            ? { ...product, quantity: item.quantity + 1 } 
            : item
        ),
      };
    }

    // Se é um item novo, adiciona com quantidade 1
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),


  // Ação para remover um item do carrinho
  removeFromCart: (productId) => set((state) => ({
    items: state.items.filter((item) => item.id !== productId),
  })),
  
  // Ação para limpar o carrinho inteiro
  clearCart: () => set({ items: [] }),
}));