import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cart: null,
  setCart: (cartData) => set({ cart: cartData }),
  clearCart: () => set({ cart: null }),
}));

export default useCartStore;
