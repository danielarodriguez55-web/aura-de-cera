export type ProductCategory = 
  | 'Aromáticas'
  | 'Florales'
  | 'Refrescantes'
  | 'Gourmet';

export type ProductCategoryFilter = ProductCategory | 'Todas';

// ============================================
// INTERFAZ PRINCIPAL DEL PRODUCTO
// ============================================

export interface Product {
  /** ID único del producto */
  id: number;
  
  /** Nombre del producto */
  name: string;
  
  /** Categoría del producto tipada estrictamente */
  category: ProductCategory;
  
  /** Descripción detallada del producto */
  description: string;
  
  /** Precio normal en pesos chilenos */
  price: number;
  
  /** Precio de oferta (opcional) */
  offerPrice?: number;
  
  /** Cantidad disponible en stock */
  stock: number;
  
  /** Ruta de la imagen del producto */
  image: string;
  
  /** Aroma de la vela */
  scent: string;
  
  /** Peso del producto en gramos (ej: "250g") */
  weight: string;
  
  /** Tiempo de combustión estimado (ej: "35 horas") */
  burningTime: string;
  
  /** Indica si el producto es destacado en la home */
  featured?: boolean;
}

// ============================================
// INTERFAZ PARA FILTROS
// ============================================

export interface ProductFilters {
  category: ProductCategoryFilter;
  searchTerm: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  inStock?: boolean;
}

// ============================================
// INTERFAZ PARA ORDENAMIENTO
// ============================================

export type SortOption = 
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'stock-asc'
  | 'stock-desc';

export interface ProductSort {
  field: 'name' | 'price' | 'stock';
  direction: 'asc' | 'desc';
}

// ============================================
// INTERFAZ PARA RESPUESTA DE PRODUCTOS
// ============================================

export interface ProductResponse {
  products: Product[];
  total: number;
  filtered: number;
  categories: ProductCategoryFilter[];
}

// ============================================
// INTERFAZ PARA CREAR/ACTUALIZAR PRODUCTO (DTOs)
// ============================================

export interface CreateProductDTO {
  name: string;
  category: ProductCategory; // Tipado estricto heredado
  description: string;
  price: number;
  offerPrice?: number;
  stock: number;
  image: string;
  scent: string;
  weight: string;
  burningTime: string;
  featured?: boolean;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: number;
}