export type CartItem = {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string
};

export type CartStore = {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
};