import React, { createContext, useState, useEffect, useContext, useRef, useMemo } from 'react';
import type { CartItem } from '../types/Cart';
import { 
  getCart, 
  saveCart, 
  getProducts, 
  saveProducts,
  clearCartStorage
} from '../services/LocalStorage';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  total: number;
  subtotal: number;
  itemCount: number;
  addToCart: (productId: number, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => { success: boolean; message: string };
  clearCart: () => void;
  confirmPurchase: () => Promise<{ success: boolean; message: string }>;
  hasBirthdayDiscount: boolean;
  discountAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const isFirstRender = useRef(true);
  const { user, isAuthenticated, checkBirthday } = useAuth();

  // Cargar carrito de forma síncrona al inicializar el estado
  useEffect(() => {
    const savedCart = getCart();
    setItems(savedCart);
  }, []);

  // Guardar carrito omitiendo la inicialización en el primer renderizado
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveCart(items);
  }, [items]);

  // Verificar beneficio de cumpleaños
  const hasBirthdayDiscount = user ? checkBirthday(user.birthDate) : false;

  // Cálculos matemáticos inmutables en cada render
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Descuento por cumpleaños (10%)
  const discountAmount = hasBirthdayDiscount ? Math.round(subtotal * 0.1) : 0;
  const totalWithDiscount = subtotal - discountAmount;

  const addToCart = (productId: number, quantity: number = 1) => {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return { success: false, message: 'Producto no encontrado' };
    if (product.stock === 0) return { success: false, message: 'Producto sin existencias disponibles' };

    let success = true;
    let message = 'Producto añadido al carrito';

    setItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > product.stock) {
          success = false;
          message = `Cupo excedido. Solo hay ${product.stock} unidades disponibles.`;
          return prev;
        }
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.offerPrice && product.offerPrice < product.price ? product.offerPrice : product.price,
        quantity: quantity,
        image: product.image,
        maxStock: product.stock
      }];
    });

    return { success, message };
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true, message: 'Producto eliminado del carrito' };
    }

    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product && quantity > product.stock) {
      return { success: false, message: `Límite de stock alcanzado. Disponible: ${product.stock}` };
    }

    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );

    return { success: true, message: 'Cantidad actualizada correctamente' };
  };

  const clearCart = () => {
    setItems([]);
    clearCartStorage();
  };

  const confirmPurchase = async (): Promise<{ success: boolean; message: string }> => {
    if (!isAuthenticated) {
      return { success: false, message: 'Debes iniciar sesión para procesar la compra' };
    }

    if (items.length === 0) {
      return { success: false, message: 'El carrito de compras se encuentra vacío' };
    }

    const products = getProducts();
    
    // Transacción atómica en memoria: Validar stock global primero
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return { success: false, message: `Error de catálogo: "${item.name}" ya no existe.` };
      }
      if (product.stock < item.quantity) {
        return { success: false, message: `Stock insuficiente para "${product.name}". Máximo disponible: ${product.stock}` };
      }
    }

    // Mutar el stock de forma segura
    const updatedProducts = products.map(product => {
      const cartItem = items.find(item => item.productId === product.id);
      return cartItem ? { ...product, stock: product.stock - cartItem.quantity } : product;
    });

    saveProducts(updatedProducts);

    const formattedTotal = totalWithDiscount.toLocaleString('es-CL');
    const message = hasBirthdayDiscount
      ? `🎉 ¡Feliz cumpleaños! Aplicamos un 10% de descuento. Total final pagado: $${formattedTotal}`
      : `✅ ¡Compra exitosa realizada con éxito! Total: $${subtotal.toLocaleString('es-CL')}`;

    clearCart();

    return { 
      success: true, 
      message 
    };
  };

  // ✅ USAR useMemo para evitar renders innecesarios
  const value = useMemo(() => ({
    items,
    total: totalWithDiscount,
    subtotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    confirmPurchase,
    hasBirthdayDiscount,
    discountAmount
  }), [items, totalWithDiscount, subtotal, itemCount, hasBirthdayDiscount, discountAmount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};