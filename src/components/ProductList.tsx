import React from 'react';
import type { Product } from '../types/Product';
import ProductCard from './ProductCard';
import '../styles/productList.css';

interface ProductListProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  columns?: 2 | 3 | 4;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  title,
  subtitle,
  emptyMessage = 'No hay productos disponibles',
  columns = 3
}) => {
  // Estado vacío: Si no hay productos, mostrar mensaje con semántica de alerta pasiva
  if (products.length === 0) {
    return (
      <div className="product-list-empty" role="status" aria-live="polite">
        <span role="img" aria-hidden="true" className="empty-icon">🔍</span>
        <h3>{emptyMessage}</h3>
        <p>Intenta con otros filtros o términos de búsqueda</p>
      </div>
    );
  }

  return (
    <section className="product-list-section" aria-labelledby={title ? 'product-list-main-title' : undefined}>
      {/* Título y subtítulo opcionales */}
      {(title || subtitle) && (
        <div className="product-list-header">
          {title && <h2 id="product-list-main-title" className="product-list-title">{title}</h2>}
          {subtitle && <p className="product-list-subtitle">{subtitle}</p>}
        </div>
      )}

      {/* Grid de productos estructurado como lista semántica */}
      <ul 
        className={`product-list-grid columns-${columns}`}
        aria-label={title || 'Listado de productos'}
      >
        {products.map(product => (
          <li key={product.id} className="product-list-item">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductList;