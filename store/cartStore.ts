import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
    cartCount: number;
    setField: (field: keyof Omit<CartState, 'setField' | 'incrementCount'>, value: any) => void;
    incrementCount: () => void;
    decrementCount: () => void;
    resetCount: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cartCount: 0,
            
            setField: (field, value) => set((state) => ({ ...state, [field]: value })),
            incrementCount: () => set((state) => ({ cartCount: state.cartCount + 1 })),
            decrementCount: () => set((state) => ({ cartCount: state.cartCount - 1 })),
            resetCount: () => set({ cartCount: 0 }),
        }),
        {
            name: "cart-storage",
        }
    )
);