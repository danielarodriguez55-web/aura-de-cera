import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/LocalStorage';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/Product';
import '../styles/detail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Cargar producto al iniciar
  useEffect(() => {
    if (id) {
      // ✅ CORREGIDO: parseInt con base 10
      const productId = parseInt(id, 10);
      const found = getProductById(productId);
      if (found) {
        setProduct(found);
      } else {
        navigate('/404');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ✅ CORREGIDO: parseInt con base 10
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('es-CL');
  };

  // ✅ CORREGIDO: Extraer texto del botón a función
  const getButtonText = (): string => {
    if (isAdded) return '✅ ¡Agregado!';
    if (product?.stock === 0) return 'Sin stock';
    return 'Agregar al carrito';
  };

  // ✅ CORREGIDO: Extraer clase del botón a función
  const getButtonClass = (): string => {
    const baseClass = 'add-to-cart-detail';
    const addedClass = isAdded ? ' added' : '';
    return baseClass + addedClass;
  };

  if (loading) {
    return (
      // ✅ CORREGIDO: role="status" → aria-live="polite"
      <div className="detail-loading" aria-live="polite">
        <span className="loading-icon" aria-hidden="true">🕯️</span>
        <p>Cargando detalles del aroma...</p>
      </div>
    );
  }

  if (!product) {
    return (
      // ✅ CORREGIDO: role="status" → aria-live="polite"
      <div className="detail-not-found" aria-live="polite">
        <h2>Producto no encontrado</h2>
        <Link to="/catalogo" className="back-link">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <main className="detail-container">
        {/* Breadcrumb Semántico */}
        <nav className="detail-breadcrumb" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">›</span>
          <Link to="/catalogo">Catálogo</Link>
          <span aria-hidden="true">›</span>
          <span className="current" aria-current="page">{product.name}</span>
        </nav>

        {/* Contenido principal del producto */}
        <article className="detail-content">
          {/* Contenedor Multimedia */}
          <div className="detail-image-container">
            <img 
              src={product.image} 
              alt={`Vela artesanal ${product.name}`} 
              className="detail-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
              }}
            />
            {product.offerPrice && (
              // ✅ CORREGIDO: role="status" → aria-live="polite"
              <span className="detail-offer-badge" aria-live="polite">Oferta</span>
            )}
            {product.stock === 0 && (
              // ✅ CORREGIDO: role="status" → aria-live="polite"
              <span className="detail-out-of-stock" aria-live="polite">Agotado</span>
            )}
          </div>

          {/* Ficha Técnica e Información */}
          <div className="detail-info">
            <header className="detail-header">
              <h1 className="detail-name">{product.name}</h1>
              <p className="detail-category">{product.category}</p>
              <p className="detail-scent">
                <span role="img" aria-hidden="true">🌸</span> <strong>Aroma:</strong> {product.scent}
              </p>
            </header>

            {/* Precios */}
            <div className="detail-prices" aria-label="Información de precio">
              {product.offerPrice ? (
                <>
                  <span className="detail-price-old" aria-label="Precio original anterior">
                    ${formatPrice(product.price)}
                  </span>
                  <span className="detail-price-offer" aria-label="Precio actual de oferta">
                    ${formatPrice(product.offerPrice)}
                  </span>
                  <span className="detail-savings" aria-live="polite">
                    Ahorras ${formatPrice(product.price - product.offerPrice)}
                  </span>
                </>
              ) : (
                <span className="detail-price" aria-label="Precio actual">
                  ${formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Especificaciones Técnicas */}
            <section className="detail-specs" aria-label="Especificaciones del producto">
              <div className="spec-item">
                <span className="spec-label" id="weight-label">📦 Peso:</span>
                <span className="spec-value" aria-labelledby="weight-label">{product.weight}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label" id="duration-label">⏱️ Duración:</span>
                <span className="spec-value" aria-labelledby="duration-label">{product.burningTime}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label" id="stock-label">📊 Stock:</span>
                <span 
                  className={`spec-value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}
                  aria-labelledby="stock-label"
                  aria-live="polite"
                >
                  {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado temporalmente'}
                </span>
              </div>
            </section>

            {/* Descripción Detallada */}
            <section className="detail-description" aria-labelledby="desc-heading">
              <h2 id="desc-heading">Descripción</h2>
              <p>{product.description}</p>
            </section>

            {/* Bloque de Compra / Acciones */}
            <div className="detail-actions">
              <div className="quantity-selector">
                <label htmlFor="detail-qty-input">Cantidad:</label>
                <div className="quantity-control">
                  <button 
                    onClick={decrementQuantity} 
                    disabled={quantity <= 1 || product.stock === 0}
                    className="qty-btn"
                    aria-label="Disminuir cantidad en 1"
                    type="button"
                  >
                    −
                  </button>
                  <input
                    id="detail-qty-input"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stock}
                    disabled={product.stock === 0}
                    className="qty-input"
                  />
                  <button 
                    onClick={incrementQuantity} 
                    disabled={quantity >= product.stock || product.stock === 0}
                    className="qty-btn"
                    aria-label="Aumentar cantidad en 1"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={getButtonClass()}
                disabled={product.stock === 0}
                aria-live="assertive"
                type="button"
              >
                {getButtonText()}
              </button>

              <Link to="/catalogo" className="back-to-catalog">
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ProductDetail;