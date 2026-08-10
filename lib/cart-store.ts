import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  slug: string;
  name: string;
  price: number; // amount in KSh
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  totalItems: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.slug === item.slug,
          );

          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.slug === item.slug
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + 1,
                    }
                  : cartItem,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: 1,
              },
            ],
          };
        }),

      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter(
            (cartItem) => cartItem.slug !== slug,
          ),
        })),

      setQuantity: (slug, quantity) =>
        set((state) => ({
          items: state.items
            .map((cartItem) =>
              cartItem.slug === slug
                ? {
                    ...cartItem,
                    quantity,
                  }
                : cartItem,
            )
            .filter((cartItem) => cartItem.quantity > 0),
        })),

      clear: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce(
          (total, cartItem) =>
            total + cartItem.price * cartItem.quantity,
          0,
        ),

      totalItems: () =>
        get().items.reduce(
          (total, cartItem) => total + cartItem.quantity,
          0,
        ),
    }),
    {
      name: "ecovolt-cart",
    },
  ),
);