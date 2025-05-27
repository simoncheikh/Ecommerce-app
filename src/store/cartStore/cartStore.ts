import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
import { CartStore } from './cartStore.type';



export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (item) => {
                const existing = get().items.find(i => i.id === item.id);
                if (existing) {
                    set({
                        items: get().items.map(i =>
                            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    });
                } else {
                    set({ items: [...get().items, item] });
                }
            },

            removeFromCart: (id) => set({ items: get().items.filter(i => i.id !== id) }),
            updateQuantity: (id, quantity) =>
                set({
                    items: get().items.map(i =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                }),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage',
            getStorage: () => AsyncStorage,
        }
    )
);
