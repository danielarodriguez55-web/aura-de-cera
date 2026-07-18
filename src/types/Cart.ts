import type { Product } from '../types/Product';

export interface CartItem extends Pick<Product, 'name' | 'price' | 'image'> {
  productId: Product['id'];
  quantity: number;
  maxStock: Product['stock'];
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  lastUpdated: string; 
}

export interface CartSummary {
  subtotal: number;
  discount: number;           // Ej: Descuento por cumpleaños (10%)
  total: number;
  hasBirthdayDiscount: boolean;
}

export type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: Product['id'] } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: Product['id']; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };