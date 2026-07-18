import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import '../styles/productCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación al detalle
    
    if (product.stock === 0) return;

    addToCart(product.id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL');
  };

  // ✅ Extraer la lógica del botón a una función para mejor legibilidad
  const getButtonText = (): string => {
    if (isAdded) return '✅ ¡Agregado!';
    if (product.stock === 0) return 'Sin stock';
    return 'Agregar al carrito';
  };

  // ✅ Extraer la clase del botón para mejor legibilidad
  const getButtonClass = (): string => {
    const baseClass = 'add-to-cart-btn';
    const addedClass = isAdded ? ' added' : '';
    return baseClass + addedClass;
  };

  return (
    <div className="product-card">
      {/* Enlace a detalle del producto */}
      <Link to={`/producto/${product.id}`} className="product-image-link">
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
            }}
          />
          {product.offerPrice && (
            <span className="product-offer-badge">Oferta</span>
          )}
          {product.stock === 0 && (
            <span className="product-out-of-stock">Sin stock</span>
          )}
        </div>
      </Link>

      {/* Información del producto */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-scent">🌸 {product.scent}</p>

        <div className="product-prices">
          {product.offerPrice ? (
            <>
              <span className="product-price-old">
                ${formatPrice(product.price)}
              </span>
              <span className="product-price-offer">
                ${formatPrice(product.offerPrice)}
              </span>
            </>
          ) : (
            <span className="product-price">
              ${formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="product-stock-info">
          <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `✅ Stock: ${product.stock} unidades` : '❌ Agotado'}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={getButtonClass()}
          disabled={product.stock === 0}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;