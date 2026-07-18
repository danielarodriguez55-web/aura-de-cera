import type { Product } from '../types/Product';
import type { User } from '../types/User';
import type { CartItem } from '../types/Cart';
import { productData } from '../data/Products';

// ============================================
// CONSTANTES DE CLAVES
// ============================================

const STORAGE_KEYS = {
  USERS: 'aura_users',
  PRODUCTS: 'aura_products',
  CART: 'aura_cart',
  CURRENT_USER: 'aura_current_user',
  LOGIN_ATTEMPTS: 'aura_login_attempts',
  INITIALIZED: 'aura_initialized'
} as const;

// ============================================
// INICIALIZACIÓN DE DATOS (solo la primera vez)
// ============================================

export const initializeLocalStorage = (): void => {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!initialized) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productData));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    
    console.log('🕯️ Aura de Cera: Datos inicializados en LocalStorage');
  }
};

// ============================================
// PRODUCTOS
// ============================================

export const getProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (data) {
      return JSON.parse(data);
    }
    initializeLocalStorage();
    return productData;
  } catch (error) {
    console.error('Error al leer productos:', error);
    return productData;
  }
};

export const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (error) {
    console.error('Error al guardar productos:', error);
  }
};

export const getProductById = (id: number): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

export const updateProductStock = (productId: number, newStock: number): boolean => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) return false;
  
  products[productIndex] = { ...products[productIndex], stock: newStock };
  saveProducts(products);
  return true;
};

// ============================================
// USUARIOS
// ============================================

export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al leer usuarios:', error);
    return [];
  }
};

export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
  }
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

export const addUser = (user: User): boolean => {
  const users = getUsers();
  
  if (users.some(u => u.email === user.email)) {
    return false;
  }
  
  users.push(user);
  saveUsers(users);
  return true;
};

// ============================================
// SESIÓN (Usuario Actual)
// ============================================

export const getCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error al leer usuario actual:', error);
    return null;
  }
};

export const saveCurrentUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error al guardar usuario actual:', error);
  }
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return user !== null && !user.isBlocked;
};

// ============================================
// CARRITO
// ============================================

export const getCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al leer carrito:', error);
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (error) {
    console.error('Error al guardar carrito:', error);
  }
};

export const clearCartStorage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CART);
};

// ============================================
// INTENTOS DE LOGIN (CORREGIDO - SIN IMPORTACIÓN CIRCULAR)
// ============================================

export const getLoginAttempts = (email: string): number => {
  try {
    if (!email) return 0;
    
  
    const key = `${STORAGE_KEYS.LOGIN_ATTEMPTS}_${email.trim().toLowerCase()}`;
    const data = localStorage.getItem(key);
    return data ? Number.parseInt(data, 10) : 0;
  } catch (error) {
    console.error('Error al leer intentos de login:', error);
    return 0;
  }
};

export const saveLoginAttempts = (email: string, attempts: number): void => {
  try {
    const key = `${STORAGE_KEYS.LOGIN_ATTEMPTS}_${email.trim().toLowerCase()}`;
    localStorage.setItem(key, String(attempts));
  } catch (error) {
    console.error('Error al guardar intentos de login:', error);
  }
};

export const resetLoginAttempts = (email: string): void => {
  try {
    const key = `${STORAGE_KEYS.LOGIN_ATTEMPTS}_${email.trim().toLowerCase()}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error al resetear intentos de login:', error);
  }
};

// ============================================
// FUNCIÓN DE LIMPIEZA (para pruebas)
// ============================================

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  initializeLocalStorage();
  console.log('🧹 Datos limpiados y reinicializados');
};