// src/types/cart.ts

export interface AddToCartRequest {
    productId: string;
    quantity: number;
}

export interface CartItemResponse {
    cartItemId: string;
    productId: string;
    productTitle: string;
    thumbnailUrl: string;
    price: number;
    quantity: number;
}

export interface CartResponse {
    cartId: string;
    items: CartItemResponse[];
    totalPrice: number;
}