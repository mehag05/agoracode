import { IProduct } from '../schema/Product'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware'

export type CartItem = {
  product: IProduct
}

type CartState = {
  items: CartItem[]
  addItem: (product: IProduct, userId: string) => void // Accept userId as a parameter
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, userId) =>
        set((state) => {
          // Check if the product belongs to the user
          if (product.user === userId) {
            window.alert('You cannot add your own product to your cart.');
            return state; // Do nothing if the product belongs to the user
          }

          const existingItem = state.items.find(item => item.product._id === product._id);
          if (!existingItem) {
            return { items: [...state.items, { product }] }; // Add new item if it doesn't exist
          }
          // Show error if item already exists
          window.alert('This item is already in your cart. You cannot add more than one of the same item.');
          return state; // Do nothing if item already exists
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.product._id !== id // Ensure using the correct property to match the ID
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)