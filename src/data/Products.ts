
import type { Product } from '../types/Product';

export const productData: Product[] = [
  {
    id: 1,
    name: 'Vela Lavanda y Miel',
    category: 'Aromáticas',
    description: 'Vela artesanal con cera de soja y aromas de lavanda orgánica combinada con miel de la región. Perfecta para relajación y sueño profundo.',
    price: 15990,
    offerPrice: 13490,
    stock: 15,
    image: '/images/vela-lavanda-miel.jpg',
    scent: 'Lavanda y Miel',
    weight: '250g',
    burningTime: '35 horas',
    featured: true
  },
  {
    id: 2,
    name: 'Vela Canela y Naranja',
    category: 'Aromáticas',
    description: 'Cálida combinación de canela y naranja para crear un ambiente acogedor y energizante. Ideal para tardes de otoño.',
    price: 14990,
    stock: 20,
    image: '/images/vela-canela-naranja.jpg',
    scent: 'Canela y Naranja',
    weight: '200g',
    burningTime: '30 horas',
    featured: true
  },
  {
    id: 3,
    name: 'Vela Rosa y Patchouli',
    category: 'Florales',
    description: 'Vela elegante con notas de rosa damascena y patchouli de la India. Un equilibrio perfecto entre lo dulce y lo terroso.',
    price: 18990,
    offerPrice: 15990,
    stock: 10,
    image: '/images/vela-rosa-patchouli.jpg',
    scent: 'Rosa y Patchouli',
    weight: '280g',
    burningTime: '40 horas',
    featured: true
  },
  {
    id: 4,
    name: 'Vela Menta y Eucalipto',
    category: 'Refrescantes',
    description: 'Revitalizante mezcla de menta y eucalipto que limpia el ambiente y refresca el espacio. Perfecta para momentos de concentración.',
    price: 13990,
    stock: 25,
    image: '/images/vela-menta-eucalipto.jpg',
    scent: 'Menta y Eucalipto',
    weight: '200g',
    burningTime: '28 horas',
    featured: false
  },
  {
    id: 5,
    name: 'Vela Vainilla y Ámbar',
    category: 'Gourmet',
    description: 'Delicada vela con aroma a vainilla bourbon y ámbar gris. Crea un ambiente cálido y sofisticado, ideal para cenas románticas.',
    price: 21990,
    offerPrice: 18990,
    stock: 8,
    image: '/images/vela-vainilla-ambar.jpg',
    scent: 'Vainilla y Ámbar',
    weight: '300g',
    burningTime: '45 horas',
    featured: false
  },
  {
    id: 6,
    name: 'Vela Coco y Limón',
    category: 'Gourmet',
    description: 'Exótica combinación de coco cremoso y limón fresco. Transporta a las playas tropicales con cada aroma.',
    price: 16990,
    stock: 12,
    image: '/images/vela-coco-limon.jpg',
    scent: 'Coco y Limón',
    weight: '220g',
    burningTime: '32 horas',
    featured: false
  },
  {
    id: 7,
    name: 'Vela Jazmín y Sándalo',
    category: 'Florales',
    description: 'Aroma floral y amaderado con jazmín de la india y sándalo australiano. Para momentos de meditación y conexión espiritual.',
    price: 19990,
    stock: 5,
    image: '/images/vela-jazmin-sandolo.jpg',
    scent: 'Jazmín y Sándalo',
    weight: '260g',
    burningTime: '38 horas',
    featured: false
  },
  {
    id: 8,
    name: 'Vela Manzana y Canela',
    category: 'Aromáticas',
    description: 'Clásico aroma a manzana asada con canela. Evoca la calidez del hogar y las tradiciones navideñas.',
    price: 15990,
    stock: 18,
    image: '/images/vela-manzana-canela.jpg',
    scent: 'Manzana y Canela',
    weight: '230g',
    burningTime: '33 horas',
    featured: false
  }
];

// ============================================
// FUNCIONES AUXILIARES
// ============================================

export const getFeaturedProducts = (): Product[] => {
  return productData.filter(p => p.featured === true);
};

export const getCategories = (): string[] => {
  const categories = productData.map(p => p.category);
  return ['Todas', ...new Set(categories)];
};

export const searchProducts = (searchTerm: string, category: string = 'Todas'): Product[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  return productData.filter(p => {
    const matchesCategory = category === 'Todas' || p.category === category;
    if (!matchesCategory) return false;
    if (!normalizedSearch) return true;
    return (
      p.name.toLowerCase().includes(normalizedSearch) ||
      p.scent.toLowerCase().includes(normalizedSearch) ||
      p.category.toLowerCase().includes(normalizedSearch)
    );
  });
};

export const getProductById = (id: number): Product | undefined => {
  return productData.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'Todas') return productData;
  return productData.filter(p => p.category === category);
};

export const getProductsOnSale = (): Product[] => {
  return productData.filter(p => p.offerPrice !== undefined);
};

export const getProductsInStock = (): Product[] => {
  return productData.filter(p => p.stock > 0);
};