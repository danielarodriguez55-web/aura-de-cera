import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/cart.css';

const Cart: React.FC = () => {
  const { 
    items, 
    total, 
    itemCount, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    confirmPurchase,
    hasBirthdayDiscount,
    discountAmount
  } = useCart();
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [checkoutStatus, setCheckoutStatus] = useState<'success' | 'error' | ''>('');
  
  const { isAuthenticated } = useAuth();

  const handleConfirmPurchase = async () => {
    const result = await confirmPurchase();
    setCheckoutMessage(result.message);
    setCheckoutStatus(result.success ? 'success' : 'error');
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('es-CL');
  };

  // Cálculo del subtotal base real
  const subtotalBase = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Vista de Carrito Vacío
  if (items.length === 0) {
    return (
      // ✅ CORREGIDO: Usar aria-live en lugar de role="status"
      <div className="cart-empty" aria-live="polite">
        <span role="img" aria-hidden="true" className="empty-icon">🛒</span>
        <h2>Tu carrito está vacío</h2>
        <p>Explora nuestro catálogo de velas artesanales y agrega tus productos favoritos.</p>
        <Link to="/catalogo" className="continue-shopping">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <header className="cart-header">
          <h1>
            <span role="img" aria-hidden="true">🛒</span> Carrito de Compras
          </h1>
          <p className="cart-subtitle">
            Tienes {itemCount} producto{itemCount !== 1 ? 's' : ''} en tu carrito
          </p>
        </header>

        {!isAuthenticated && (
          <div className="cart-warning" role="alert">
            <span role="img" aria-label="Advertencia">⚠️</span> Por favor,{' '}
            <Link to="/login">inicia sesión</Link> para completar tu orden de compra de forma segura.
          </div>
        )}

        {checkoutMessage && (
          <div className={`checkout-message ${checkoutStatus}`} role="status" aria-live="polite">
            {checkoutStatus === 'success' ? '✅' : '⚠️'} {checkoutMessage}
          </div>
        )}

        <div className="cart-content">
          {/* Listado Semántico de Productos mediante Tabla */}
          <section className="cart-items-section" aria-label="Productos en el carrito">
            <table className="cart-table">
              <thead className="visually-hidden">
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.productId} className="cart-item-row">
                    <td className="cell-image">
                      <img 
                        src={item.image} 
                        alt="" 
                        className="cart-item-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                        }}
                      />
                    </td>
                    <td className="cell-info">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-unit-price">${formatPrice(item.price)} c/u</p>
                    </td>
                    <td className="cell-quantity">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="qty-btn"
                          disabled={item.quantity <= 1}
                          aria-label={`Disminuir cantidad de ${item.name}`}
                          type="button"
                        >
                          −
                        </button>
                        <span className="qty-value" aria-live="polite" aria-label={`${item.quantity} unidades`}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="qty-btn"
                          disabled={item.quantity >= item.maxStock}
                          aria-label={`Aumentar cantidad de ${item.name}`}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="cell-total">
                      <span className="item-total-price" aria-live="polite">
                        ${formatPrice(item.price * item.quantity)}
                      </span>
                    </td>
                    <td className="cell-remove">
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="remove-btn"
                        title="Eliminar producto"
                        aria-label={`Eliminar ${item.name} del carrito`}
                        type="button"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Bloque del Resumen de la Orden */}
          <aside className="cart-summary" aria-label="Resumen de facturación">
            <h3>Resumen de compra</h3>
            
            <div className="summary-details" aria-live="polite">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${formatPrice(subtotalBase)}</span>
              </div>

              {hasBirthdayDiscount && (
                <div className="summary-row discount">
                  <span>🎉 Descuento cumpleaños (10%)</span>
                  <span>-${formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="summary-row total-row">
                <span>Total</span>
                <span className="final-total">${formatPrice(total)}</span>
              </div>
            </div>

            {hasBirthdayDiscount && (
              // ✅ CORREGIDO: Usar aria-live en lugar de role="status"
              <div className="birthday-message" aria-live="polite">
                <span role="img" aria-hidden="true">🎂</span> ¡Feliz cumpleaños! Hemos aplicado un 10% de descuento automático a tu orden.
              </div>
            )}

            <div className="cart-actions">
              <button 
                onClick={handleConfirmPurchase}
                className="checkout-btn"
                disabled={!isAuthenticated}
                type="button"
              >
                {isAuthenticated ? '✅ Confirmar compra' : '🔒 Inicia sesión para comprar'}
              </button>

              <button 
                onClick={clearCart}
                className="clear-cart-btn"
                type="button"
              >
                Vaciar carrito
              </button>

              <Link to="/catalogo" className="continue-shopping-link">
                ← Seguir explorando el catálogo
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;