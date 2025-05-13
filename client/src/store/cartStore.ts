import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItemType {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

interface CartState {
  id: number | null;
  items: CartItemType[];
  clearCart: () => void;
  setCart: (cart: { id: number; items: CartItemType[] }) => void;
  isCartTransferred: boolean;
  setCartTransferred: (status: boolean) => void;
}
const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      id: null,
      items: [],
      isCartTransferred: false,
      clearCart: () => set({ id: null, items: [], isCartTransferred: false }),
      setCart: (cart) => set({ id: cart.id, items: cart.items }),
      setCartTransferred: (status) => set({ isCartTransferred: status }),
    }),
    {
      name: "cart-store",
    }
  )
);

export default useCartStore;
